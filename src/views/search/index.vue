<template>
  <div class="app">
    <Search
      class="search"
      :inHead="false"
      @search="handleSearch"
    />
    <!-- 顶部导航栏 -->
    <div class="tabs">
      <button
        v-for="(tab, index) in tabs"
        :key="tab.key"
        :class="{ active: selectedTab === tab.key }"
        @click="selectTab(tab.key)"
      >
        <span>{{ tab.label }}</span>
        <span class="tabs-num">{{ tab.num }}</span>
      </button>
    </div>

    <!-- 内容展示区 -->
    <div class="content">
      <div class="filter-content">
        <div
          v-for="filter in filerMap[selectedTab]"
          :key="filter.key"
          :class="[
            'filter-content-item',
            { 'filter-content-item-active': selectedFilter === filter.key },
          ]"
          @click="selectFilter(filter.key)"
        >
          {{ filter.name }}
        </div>
      </div>

      <!-- Tab 内容区域 -->
      <div class="tab-content">
        <div v-if="selectedTab === 'live'">
          <div
            class="video-list"
            v-if="liveRoomList.length > 0"
          >
            <LiveRoomCard
              v-for="(liveRoom, index) in liveRoomList"
              :key="index"
              :liveRoomData="liveRoom"
              class="live_room_card"
              :coverHeight="130"
            />
          </div>
          <div
            class="empty-wrap"
            v-else
          >
            <div class="ico empty-data"></div>
            这里没有数据呀～
          </div>
        </div>
        <div v-if="selectedTab === 'video'">
          <div
            class="video-list"
            v-if="videoList.length > 0"
          >
            <VideoCard
              v-for="(video, index) in videoList"
              :key="index"
              :video="video"
              :isEdit="false"
              class="video-card"
              :isMy="false"
            />
          </div>
          <div
            class="empty-wrap"
            v-else
          >
            <div class="ico empty-data"></div>
            这里没有数据呀～
          </div>
        </div>
        <div v-if="selectedTab === 'user'">
          <div
            class="user-list"
            v-if="userList.length > 0"
          >
            <UserCard
              v-for="(user, index) in userList"
              :key="index"
              :userData="user"
              :followings="followings"
              :followers="followers"
              class="user-card"
            />
          </div>
          <div
            class="empty-wrap"
            v-else
          >
            <div class="ico empty-data"></div>
            这里没有数据呀～
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { fetchAllLiveRooms, fetchUserVideos } from '@/api/liveRoom';
import {
  fetchUserFollowersList,
  fetchUserFollowingList,
  fetchUserList,
} from '@/api/user';
import LiveRoomCard from '@/components/LiveRoomCard/index.vue';
import Search from '@/components/Search/index.vue';
import UserCard from '@/components/UserCard/index.vue';
import VideoCard from '@/components/VideoCard/index.vue';
import { useUserStore } from '@/store/user';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const userStore = useUserStore();

const tabs = ref<any>([
  { label: '直播', key: 'live' },
  { label: '视频', key: 'video' },
  { label: '用户', key: 'user' },
]);

const filerMap = ref<any>({
  live: [
    {
      name: '综合排序',
      key: 'default',
    },
    {
      name: '最新开播',
      key: 'newLive',
    },
  ],
  video: [
    {
      name: '综合排序',
      key: 'default',
    },
    {
      name: '最多播放',
      key: 'mostPlay',
    },
    {
      name: '最新发布',
      key: 'newPublish',
    },
  ],
  user: [
    {
      name: '综合排序',
      key: 'default',
    },
    {
      name: '粉丝数由高到低',
      key: 'highToLow',
    },
    {
      name: '粉丝数由低到高',
      key: 'lowToHigh',
    },
  ],
});

// 当前选中的 Tab 和筛选项
const selectedTab = ref('live');
const selectedFilter = ref('default');

const userList = ref<any>([]);
const videoList = ref<any>([]);
const liveRoomList = ref<any>([]);
const followers = ref<any[]>([]);
const followings = ref<any[]>([]);

const keyword = ref<any>();

// 切换 Tab
const selectTab = (tab: string) => {
  selectedTab.value = tab;
  selectedFilter.value = 'default'; // 切换 Tab 时重置筛选项为 "综合排序
};
// 切换筛选项
const selectFilter = (filterKey: string) => {
  selectedFilter.value = filterKey;
  if (selectedTab.value === 'live') {
    getLiveRoomList(keyword.value, filterKey);
  }
  if (selectedTab.value === 'video') {
    getVideoList(keyword.value, filterKey);
  }
  if (selectedTab.value === 'user') {
    getUserList(keyword.value, filterKey);
  }
  // fetchData();
};

onMounted(() => {
  keyword.value = route.params.keyword;
  getLiveRoomList(route.params.keyword);
  getVideoList(route.params.keyword);
  getUserList(route.params.keyword);
  if (userStore.userInfo?.id) {
    requestFollowingList();
    requestFollowersList();
  }
});

watch(
  () => userStore.userInfo?.id,
  () => {
    if (userStore.userInfo?.id) {
      requestFollowingList();
      requestFollowersList();
    }
  }
);

const handleSearch = (keyWord) => {
  keyword.value = keyWord;
};

watch(
  () => keyword.value,
  () => {
    selectedFilter.value = 'default';
    getLiveRoomList(keyword.value);
    getVideoList(keyword.value);
    getUserList(keyword.value);
  }
);

const getUserList = async (keyWord, filterKey = 'default') => {
  const res = await fetchUserList({ keyWord, orderBy: filterKey });
  if (res.code === 200) {
    userList.value = res.data?.rows;
    tabs.value[2].num = res.data?.rows.length;
  }
};
const getLiveRoomList = async (keyWord, filterKey = 'default') => {
  const res = await fetchAllLiveRooms({ keyWord, orderBy: filterKey });
  if (res.code === 200) {
    liveRoomList.value = res.data?.rows;
    tabs.value[0].num = res.data?.rows.length;
  }
};
const getVideoList = async (keyWord, filterKey = 'default') => {
  const res = await fetchUserVideos({ keyWord, orderBy: filterKey });
  if (res.code === 200) {
    videoList.value = res.data?.rows;
    tabs.value[1].num = res.data?.rows.length;
  }
};
// 请求关注列表
const requestFollowingList = async () => {
  const res = await fetchUserFollowingList({
    userId: userStore.userInfo?.id,
  });
  if (res.code === 200) {
    followings.value = res.data;
  }
};

// 请求粉丝列表
const requestFollowersList = async () => {
  const res = await fetchUserFollowersList({
    userId: userStore.userInfo?.id,
  });
  if (res.code === 200) {
    followers.value = res.data;
  }
};
</script>

<style lang="scss" scoped>
.app {
  width: 100%;
}

.ico {
  width: 15px;
  height: 15px;
  opacity: 0.9;
  margin-right: 4px;

  @extend %containBg;

  &.eye {
    @include setBackground('@/assets/img/eye.png');
  }

  &.comment {
    @include setBackground('@/assets/img/comment.png');
  }

  &.empty-data {
    width: 80px;
    height: 80px;
    margin-bottom: 20px;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url('@/assets/img/empty-data.png');
  }
}

.empty-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 70px;
  color: #575555;
}

.search {
  margin-top: 30px;
}

.tabs {
  display: flex;
  padding: 10px 60px 0;
  border-bottom: 1px solid #eee;

  button {
    margin-right: 20px;
    background: none;
    border: none;
    font-size: 16px;
    color: #61666d;
    font-weight: 500;
    cursor: pointer;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;

    &.active {
      font-weight: bold;
      color: #ffd700;
      border-bottom: 2px solid #ffd700;
    }

    &:hover {
      color: #ffd700;
    }
  }

  .tabs-num {
    padding: 1px 6px;
    border-radius: 6px;
    font-size: 12px;
    color: #61666d;
    background: #f1f2f3;
    font-weight: 400;
    margin-left: 10px;
  }
}

.content {
  margin-top: 20px;
}

.filter-content {
  display: flex;
  padding: 0 60px;

  &-item {
    color: #61666d;
    background-color: #fff;
    border: none;
    display: inline-block;
    padding: 6px 25px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition-duration: 0.2s;

    &:hover {
      color: #ffd700;
    }

    &-active {
      color: #ffd700;
      font-weight: 500;
      background-color: #fff8d1;
    }
  }
}

.filter-btn {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.filter-btn:hover {
  background-color: #0056b3;
}

.tab-content {
  padding: 0 60px;
}

.video-list {
  display: flex;
  flex-wrap: wrap;
  /* gap: 20px; */

  /* justify-content: space-between; */
  .live_room_card {
    width: 230px;
    height: 190px;
  }

  .video-card {
    margin: 20px 10px;
  }
}

.video-card {
  width: calc(20% - 16px);
  /* 5个视频占据100%的宽度，减去间隔 */
  /* border: 1px solid #ccc; */
  /* border-radius: 10px; */
  overflow: hidden;
  background-color: #fff;
  cursor: pointer;
}

.video-thumbnail {
  position: relative;

  img {
    width: 100%;
    height: 135px;
    object-fit: cover;
    border-radius: 8px;
  }

  .video-data {
    color: #fff;
    font-size: 12px;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    position: absolute;
    bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &-left {
      display: flex;
      align-items: center;

      .view-count {
        display: flex;
        align-items: center;
      }

      .like-count {
        display: flex;
        align-items: center;
      }
    }
  }
}

.video-info {
  padding: 10px 2px;
}

.video-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.bili-live-card__info--living {
  display: -webkit-flex;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  display: -webkit-inline-flex;
  display: inline-flex;
  margin-right: 4px;
  padding-right: 4px;
  height: 18px;
  font-size: 12px;
  cursor: pointer;
  line-height: 16px;
  font-weight: 400;
  color: #ff6699;
  border: 1px solid #ff6699;
  border-radius: 4px;
  box-sizing: border-box;
  user-select: none;
  transform: translateY(1px);

  img {
    margin-left: 4px;
    margin-right: 3px;
    transform: translateZ(0);
  }

  span {
    display: inline-block;
    line-height: 16px;
    vertical-align: middle;
  }
}

.bili-live-card__stats--icon {
  margin-right: 2px;
  width: 16px;
  height: 16px;
  color: #fff;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.video-details {
  font-size: 13px;
  color: #888;
  margin-bottom: 10px;
  display: flex;
  align-items: center;

  .split-dot {
    margin: 0 5px;
  }
}

.view-count,
.like-count {
  margin-right: 10px;
}

.user-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
}

.user-card {
  width: calc(50% - 10px);
  /* 每行2个用户 */
  display: flex;
  background-color: #fff;
  /* border: 1px solid #ccc; */
  /* border-radius: 10px; */
  overflow: hidden;
  /* box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); */
}

.user-avatar {
  margin-top: 10px;
  margin-right: 10px;
}

.user-info {
  flex: 1;
  padding: 10px;
}

.user-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.user-stats {
  font-size: 14px;
  color: #61666d;
  margin-bottom: 10px;

  .split-dot {
    margin: 0 5px;
  }
}

.user-description {
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
}

.follow-btn {
  background-color: #ffd700;
  color: #fff;
  border: none;
  padding: 6px 25px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.follow-btn:hover {
  background-color: #d8c247;
}
</style>
