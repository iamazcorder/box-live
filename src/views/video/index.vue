<template>
  <div class="video-page">
    <!-- 左侧：视频播放器 -->
    <div class="video-container">
      <!-- 视频信息 -->
      <div class="video-info">
        <div class="video-title">{{ videoData.title }}</div>
        <div class="video-stats">
          <div
            class="video-stats-item video-stats-area"
            @click="handleSecondArea()"
          >
            <div class="ico area"></div>
            {{ selectedCategory }}
          </div>
          <div class="video-stats-item">
            <div class="ico playNum"></div>
            {{ videoData.views_count }}
          </div>
          <div>{{ formatDateTime(videoData.created_at) }}</div>
        </div>
      </div>
      <video
        ref="videoPlayer"
        class="video-player"
        controls
        autoplay
      >
        <source
          :src="videoData.url"
          type="video/mp4"
        />
        您的浏览器不支持 HTML5 视频。
      </video>
      <!-- 视频描述 -->
      <div class="video-desc">{{ videoData.desc }}</div>
    </div>

    <!-- 右侧：UP 主信息 & 推荐列表 -->
    <div class="sidebar">
      <div class="up-info">
        <img
          :src="userData.avatar"
          class="avatar"
          @click="handleJumpUser(userData.id)"
        />
        <div class="up-details">
          <div
            class="up-name"
            @click="handleJumpUser(userData.id)"
          >
            {{ userData.username }}
          </div>
          <div class="up-desc">{{ userData.desc }}</div>
          <div
            class="unfollow"
            v-if="!isMutualFollow"
            @click.prevent="handleFollow(userData?.id)"
          >
            + 关注
          </div>
          <div
            class="followed"
            v-else
            @click.prevent="handleUnfollow(userData?.id)"
          >
            取消关注
          </div>
        </div>
      </div>

      <!-- 推荐视频 -->
      <div class="recommend-list">
        <div class="title">相关推荐</div>
        <RecommendVideoCard
          v-for="(item, index) in categoryVideos"
          :key="index"
          :video="item"
          class="video-card"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  createUserVideoView,
  fetchUserVideos,
  fetchVideoInfo,
} from '@/api/liveRoom';
import {
  fetchUserFollow,
  fetchUserFollowersList,
  fetchUserFollowingList,
  fetchUserUnfollow,
} from '@/api/user';
import RecommendVideoCard from '@/components/RecommendVideoCard/index.vue';
import router, { routerName } from '@/router';
import { useUserStore } from '@/store/user';
import { formatDateTime } from '@/utils';
import { openToTarget } from 'billd-utils';
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const userStore = useUserStore();

const videoPlayer = ref<HTMLVideoElement | null>(null);
const videoData = ref<any>({});
const userData = ref<any>({});
const isMutualFollow = ref(false);
const isMyLiveVideo = ref(false);
const followers = ref<any[]>([]);
const followings = ref<any[]>([]);
const watchDuration = ref(0); // 用户观看时长（秒）
const isFinished = ref(false); // 是否看完
const videoId = ref();
const viewNum = ref(0);
const categoryVideos = ref<any>([]);

const recommendedVideos = ref([
  {
    title: '2千多的邮轮普通房间，你们觉得值不值？',
    views: '25.8万',
    thumbnail: 'https://example.com/thumb1.jpg',
  },
  {
    title: '亚洲最大邮轮，海洋光谱号豪华大巡航',
    views: '395.0万',
    thumbnail: 'https://example.com/thumb2.jpg',
  },
  {
    title: '海洋光谱号六天五夜体验，值不值？',
    views: '3.7万',
    thumbnail: 'https://example.com/thumb3.jpg',
  },
]);

onMounted(async () => {
  videoId.value = route.params.id;
  await getVideoInfo();
  getCategoryVideos();
  if (userStore.userInfo?.id) {
    updateIsMyVideo();
    requestFollowingList(userStore?.userInfo?.id);
    await requestFollowersList(userStore?.userInfo?.id);
    checkIsMutualFollow();
  }
  if (videoPlayer.value) {
    videoPlayer.value.addEventListener('timeupdate', updateWatchDuration);
    videoPlayer.value.addEventListener('ended', markVideoFinished);
  }
  // 监听页面关闭或刷新
  window.addEventListener('beforeunload', handleBeforeUnload);
});

// 监听页面离开
const handleBeforeUnload = () => {
  if (userStore.userInfo?.id && videoId.value) {
    submitWatchRecord();
  }
};

onBeforeUnmount(() => {
  if (videoPlayer.value) {
    videoPlayer.value.removeEventListener('timeupdate', updateWatchDuration);
    videoPlayer.value.removeEventListener('ended', markVideoFinished);
  }

  // 移除 beforeunload 监听
  window.removeEventListener('beforeunload', handleBeforeUnload);

  if (userStore.userInfo?.id && videoId.value) {
    submitWatchRecord();
  }
});

/** 监听播放进度，记录观看时长 */
const updateWatchDuration = () => {
  if (videoPlayer.value) {
    watchDuration.value = Math.floor(videoPlayer.value.currentTime);
  }
};

/** 视频播放完毕，标记 `isFinished = true` */
const markVideoFinished = () => {
  isFinished.value = true;
  submitWatchRecord();
};

/** 提交用户观看记录 */
const submitWatchRecord = async () => {
  await createUserVideoView({
    user_id: userStore.userInfo?.id,
    video_id: Number(videoId.value),
    watched_at: new Date().toISOString(),
    duration: watchDuration.value,
    is_finished: isFinished.value ? 1 : 0,
  });
};

const getCategoryVideos = async () => {
  const res = await fetchUserVideos({
    child_category_id: videoData.value?.child_category_id,
  });
  if (res.code === 200) {
    categoryVideos.value = res.data?.rows?.filter(
      (item) => item.id !== videoData.value?.id
    );
  }
};

watch(
  () => userStore.userInfo?.id,
  async () => {
    if (userStore.userInfo?.id) {
      updateIsMyVideo();
      requestFollowingList(userStore?.userInfo?.id);
      await requestFollowersList(userStore?.userInfo?.id);
      checkIsMutualFollow();
    }
  }
);

// 显示的分区文字
const selectedCategory = computed(() => {
  if (
    videoData.value?.parentCategory?.name &&
    videoData.value?.childCategory?.name
  ) {
    return `${videoData.value?.parentCategory.name}·${videoData.value?.childCategory.name}`;
  }
  return '';
});

const getVideoInfo = async () => {
  if (route.params.id) {
    const res = await fetchVideoInfo(Number(route.params.id));
    if (res.code === 200) {
      videoData.value = res.data;
      userData.value = res.data?.user;

      // **确保 DOM 更新后调用 `load()` 让 `video` 重新加载**
      await nextTick();
      if (videoPlayer.value) {
        videoPlayer.value.load(); // 重新加载视频
        videoPlayer.value
          .play()
          .catch((error) => console.warn('自动播放被阻止:', error));
      }
    }
  }
};

const playRecommendedVideo = (video) => {
  // videoData.value = { ...video, url: "https://example.com/new-video.mp4" };
};

const handleJumpUser = (id) => {
  const url = router.resolve({
    name: routerName.user,
    params: { id },
  });
  openToTarget(url.href);
};

function handleSecondArea() {
  const url = router.resolve({
    name: routerName.area,
    query: {
      parentAreaId: videoData.value.parent_category_id,
      areaId: videoData.value.child_category_id,
    }, // `childId` 作为 `query`
  });
  openToTarget(url.href);
}

// 请求关注列表
const requestFollowingList = async (id) => {
  const res = await fetchUserFollowingList({
    userId: id,
  });
  if (res.code === 200) {
    followings.value = res.data;
  }
};

// 请求粉丝列表
const requestFollowersList = async (id) => {
  const res = await fetchUserFollowersList({
    userId: id,
  });
  if (res.code === 200) {
    followers.value = res.data;
  }
};

const updateIsMyVideo = () => {
  if (userStore?.userInfo?.id === userData.value?.id) {
    isMyLiveVideo.value = true;
  } else {
    isMyLiveVideo.value = false;
  }
};

const checkIsMutualFollow = () => {
  isMutualFollow.value = followings.value.some(
    (following: any) => following.id === userData.value?.id
  );
};

// 关注用户
const handleFollow = async (followingId: any) => {
  // if (isMutualFollow) {
  //   return;
  // }
  if (isMyLiveVideo.value) {
    window.$message.warning('自己不能关注自己喔～');
    return;
  }
  const res = await fetchUserFollow({
    followingId: followingId,
    followerId: userStore?.userInfo?.id,
  });
  if (res.code === 200) {
    window.$message.success('关注成功');
    isMutualFollow.value = true;
    // if (route.params.id) {
    //   requestFollowingList(route.params.id);
    //   requestFollowersList(route.params.id);
    // }
  }
};

// 取消关注
const handleUnfollow = async (followingId) => {
  const res = await fetchUserUnfollow({
    followingId,
    followerId: userStore?.userInfo?.id,
  });
  if (res.code === 200) {
    window.$message.success('取消关注成功');
    isMutualFollow.value = false;
    // if (route.params.id) {
    //   requestFollowingList(route.params.id);
    //   requestFollowersList(route.params.id);
    // }
  }
};
</script>

<style lang="scss" scoped>
.ico {
  /* margin: 0 auto; */
  width: 15px;
  height: 15px;
  opacity: 0.9;
  margin-right: 5px;
  @extend %containBg;

  &.area {
    @include setBackground('@/assets/img/area.png');
  }

  &.playNum {
    @include setBackground('@/assets/img/playNum.png');
  }

  &.my {
    @include setBackground('@/assets/img/my.png');
  }
}

.video-page {
  display: flex;
  gap: 20px;
  max-width: 1200px;
  margin: auto;
  margin-top: 15px;
}

.video-container {
  flex: 3;
}

.video-player {
  width: 100%;
  border-radius: 8px;
}

.video-info {
  margin-top: 5px;
  margin-bottom: 20px;
}

.video-title {
  font-size: 20px;
  font-weight: 500;
  color: #18191c;
  overflow: hidden;
  margin-bottom: 5px;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-family:
    PingFang SC,
    HarmonyOS_Regular,
    Helvetica Neue,
    Microsoft YaHei,
    sans-serif !important;
}

.video-stats {
  font-size: 14px;
  color: #9499a0;
  display: flex;
  align-items: center;

  &-item {
    display: flex;
    align-items: center;
    margin-right: 20px;
  }

  &-area {
    cursor: pointer;

    &:hover {
      color: #fb7299;
    }
  }
}

.video-actions {
  margin-top: 10px;
}

.action-btn {
  margin-right: 10px;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #ddd;
}

.video-desc {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}

/* 右侧 */
.sidebar {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.up-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
}

.up-details {
  margin-left: 20px;
}

.up-name {
  font-size: 16px;
  color: #fb7299;
  font-weight: 500;
  cursor: pointer;
}

.up-desc {
  margin-top: 5px;
  font-size: 13px;
  line-height: 16px;
  height: 16px;
  color: #9499a0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.unfollow {
  margin-top: 5px;
  padding: 4px 30px;
  background-color: #ffd700;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  font-size: 14px;
  display: flex;
  justify-content: center;
}

.followed {
  margin-top: 5px;
  padding: 4px 30px;
  background-color: #ccc;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  font-size: 14px;
}

.recommend-list {
  font-size: 18px;
  margin-bottom: 10px;
  margin-left: 10px;

  .title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 10px;
  }

  .video-card {
    margin-bottom: 20px;
  }
}

.recommend-item {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  position: relative;
}

.recommend-img {
  width: 141px;
  height: 80px;
  border-radius: 6px;
}

.recommend-duration {
  position: absolute;
  font-size: 13px;
  color: #ffffff;
  z-index: 5;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 3px 4px;
  border-radius: 2px;
  bottom: 5px;
  left: 90px;
}

.recommend-title {
  font-size: 14px;
  font-weight: bold;
}

.recommend-meta {
  font-size: 12px;
  color: gray;

  &_user {
    display: flex;
    align-items: center;
    margin: 5px 0;
  }

  &_views {
    display: flex;
    align-items: center;
  }
}
</style>
