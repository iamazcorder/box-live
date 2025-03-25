<template>
  <div
    class="video-card-wrapper"
    @click.stop.prevent="goLiveRoom"
  >
    <div
      class="video-card"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <!-- 视频封面 -->
      <div class="cover">
        <img
          :src="liveRoomData?.cover_img"
          alt="视频封面"
          :style="`height: ${coverHeight}px;`"
        />
        <div
          class="live-status"
          :class="liveRoomData?.is_live ? 'live-status-active' : ''"
        >
          {{ liveRoomData?.is_live ? '直播中' : '未开播' }}
        </div>
        <div class="duration">
          <div class="duration_txt">
            {{ liveRoomData?.childCategory?.name }}
          </div>
        </div>
      </div>

      <div class="details">
        <Avatar
          :size="40"
          :url="liveRoomData.users?.[0]?.avatar"
          class="avatar"
          @click.stop.prevent="goUser"
        />
        <div
          class="right"
          style="width: calc(100% - 55px)"
        >
          <div class="title">{{ liveRoomData.name }}</div>
          <div class="right-bottom">
            <div class="name">{{ liveRoomData.users?.[0]?.username }}</div>
            <div class="views">
              <div
                class="ico eye"
                v-if="!isHovered"
              ></div>
              <span v-if="!isHovered">{{ liveRoomData.views_count }}</span>
              <button
                v-if="isHovered && !isFollowing"
                class="follow-btn"
                @click.stop.prevent="handleFollow"
              >
                关注
              </button>
              <button
                v-if="isHovered && isFollowing"
                class="unfollow-btn"
                @click.stop.prevent="handleUnfollow"
              >
                取消关注
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { fetchUserFollow, fetchUserUnfollow } from '@/api/user';
import Avatar from '@/components/Avatar/index.vue';
import router, { routerName } from '@/router';
import { useUserStore } from '@/store/user';
import { openToTarget } from 'billd-utils';
import { ref } from 'vue';

const userStore = useUserStore();

const props = withDefaults(
  defineProps<{ liveRoomData: any; isFollow: boolean; coverHeight: number }>(),
  {
    liveRoomData: {},
    isFollow: false,
    coverHeight: 111,
  }
);

const isHovered = ref(false);
const isFollowing = ref(props.isFollow);

function goLiveRoom() {
  const url = router.resolve({
    name: routerName.pull,
    params: { roomId: props.liveRoomData?.id },
  });
  openToTarget(url.href);
}

function goUser() {
  const url = router.resolve({
    name: routerName.user,
    params: { id: props.liveRoomData?.users?.[0]?.id },
  });
  openToTarget(url.href);
}

// 关注用户
const handleFollow = async () => {
  // if (isMutualFollow) {
  //   return;
  // }
  const followingId = props.liveRoomData.users?.[0]?.id;
  if (userStore?.userInfo?.id === followingId) {
    window.$message.warning('自己不能关注自己喔～');
    return;
  }
  const res = await fetchUserFollow({
    followingId: followingId,
    followerId: userStore?.userInfo?.id,
  });
  if (res.code === 200) {
    window.$message.success('关注成功');
    isFollowing.value = true;
    // if (route.params.id) {
    //   requestFollowingList(route.params.id);
    //   requestFollowersList(route.params.id);
    // }
  }
};

// 取消关注
const handleUnfollow = async () => {
  const followingId = props.liveRoomData.users?.[0]?.id;
  const res = await fetchUserUnfollow({
    followingId,
    followerId: userStore?.userInfo?.id,
  });
  if (res.code === 200) {
    window.$message.success('取消关注成功');
    isFollowing.value = false;
    // if (route.params.id) {
    //   requestFollowingList(route.params.id);
    //   requestFollowersList(route.params.id);
    // }
  }
};
</script>

<style lang="scss" scoped>
.ico {
  width: 15px;
  height: 15px;
  opacity: 0.9;

  &.eye {
    margin-right: 5px;
    float: left;
    @include setBackground('@/assets/img/eye_black.png');
  }
}

.video-card-wrapper {
  position: relative;
  width: 200px;
  height: 170px;
  display: inline-block;
  margin: 15px 10px;
  box-sizing: border-box;
}

/* **核心：让放大效果不影响布局** */
.video-card {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 1px solid transparent;
  transition:
    transform 0.3s ease-in-out,
    border 0.3s ease-in-out;
  cursor: pointer;
  background: #fff;
  border-radius: 10px;
  padding: 10px;
  /* box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); */

  /* **鼠标悬停时，放大但不挤开其他元素** */
  &:hover {
    transform: scale(1.1);
    border: 1px solid #e7e4e4;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    z-index: 10;
  }

  &:hover .cover img {
    transform: scale(1.1);
  }

  &:hover .avatar {
    transform: scale(1.2);
  }
}

.cover {
  position: relative;
  overflow: hidden;
  border-radius: 4px;

  img {
    width: 100%;
    display: block;
    height: 111px;
    object-fit: cover;
    /* transition: transform 0.3s ease-in-out; */
  }

  .live-status {
    position: absolute;
    top: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.5);
    font-size: 13px;
    color: #fff;
    border-radius: 4px;
    padding: 1px 4px;
  }

  .live-status-active {
    background-color: #ff6699;
  }

  .duration {
    /* position: absolute;
            bottom: 5px;
            right: 5px;
            background: rgba(0, 0, 0, 0.7);
            color: #fff;
            padding: 2px 6px;
            font-size: 12px;
            border-radius: 4px; */

    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 2;
    font-size: 12px;
    box-sizing: border-box;
    padding: 20px 8px 6px;
    width: 100%;
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
    background-image: linear-gradient(180deg, #0000, #000c);
    color: #fff;
    opacity: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    pointer-events: none;

    &_txt {
      position: absolute;
      right: 8px;
      bottom: 6px;
    }
  }
}

.details {
  margin-top: 8px;
  display: flex;
  align-items: flex-start;

  .avatar {
    margin-top: 3px;
    margin-left: 10px;
    /* transition: transform 0.3s ease-in-out; */
  }

  .right {
    margin-left: 10px;

    .title {
      font-size: 16px;
      color: #2f3238;
      text-overflow: ellipsis;
      overflow: hidden;
      margin-bottom: 4px;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    &-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .name {
        font-size: 14px;
        color: #9499a0;
        margin-top: 1px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        flex: 1;
        padding-right: 8px;
        box-sizing: border-box;
      }

      .views {
        display: flex;
        align-items: center;
        text-align: right;
        color: #9499a0;
        font-size: 14px;
      }

      .follow-btn {
        padding: 4px 10px;
        background-color: #ff6699;
        color: #fff;
        border: none;
        font-size: 12px;
        border-radius: 4px;
        margin-left: 10px;
        cursor: pointer;
      }

      .unfollow-btn {
        padding: 4px 10px;
        background-color: #ccc;
        color: #fff;
        border: none;
        font-size: 12px;
        border-radius: 4px;
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }
}
</style>
