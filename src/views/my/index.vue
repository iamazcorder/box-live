<template>
  <div class="personal-space">
    <!-- Banner 图 -->
    <div class="banner">
      <!-- 新增的阴影层 -->
      <!-- <div class="banner-shadow"></div> -->
      <div class="header-upinfo-bg-shadow">
        <div class="top"></div>
        <div class="bottom"></div>
      </div>

      <img
        :src="userStore.userInfo?.background_image"
        alt="Banner"
      />
      <div class="user-info">
        <Avatar
          :url="userInfo?.avatar"
          :name="userStore.userInfo?.username"
          :size="80"
          :enableAvatarChange="
            userStore?.userInfo?.id === Number(route.params.id)
          "
          :isLive="isLive"
          @avatarUpdated="handleAvatarUpdate"
          @click="() => isLive && joinRoom()"
        >
        </Avatar>
        <div class="details">
          <div class="top">
            <div class="name">{{ userInfo?.username }}</div>
            <div
              :class="`ico ${userInfo?.gender === 'female' ? 'female' : ''} ${
                userInfo?.gender === 'male' ? 'male' : ''
              }`"
            ></div>
          </div>
          <div class="edit-btn">{{ userInfo?.desc }}</div>
        </div>
      </div>
      <div
        class="control"
        v-if="userStore.userInfo?.id !== Number(route.params.id)"
      >
        <!-- 关注状态按钮 -->
        <div
          class="btn gray"
          v-if="isMutualFollow"
          @mouseenter="showPopup"
          @mouseleave="hidePopup"
        >
          已互粉
          <div
            class="popup"
            :class="{ show: isCancelPopupVisible }"
            @mouseenter="stayPopup"
            @mouseleave="hidePopup"
          >
            <button @click="handleUnfollow(route.params.id)">取消关注</button>
          </div>
        </div>
        <div
          class="btn gray"
          v-if="!isMutualFollow && isFollowed"
          @mouseenter="showPopup"
          @mouseleave="hidePopup"
        >
          已关注
          <div
            class="popup"
            :class="{ show: isCancelPopupVisible }"
            @mouseenter="stayPopup"
            @mouseleave="hidePopup"
          >
            <button @click="handleUnfollow(route.params.id)">取消关注</button>
          </div>
        </div>
        <div
          class="btn"
          :class="buttonClass"
          @click="handleFollow(route.params.id)"
          v-if="!isFollowed"
        >
          +关注
        </div>
        <!-- <div class="btn gray">发消息</div> -->
      </div>
    </div>

    <!-- Tab、搜索框和统计信息 -->
    <div class="header-row">
      <div class="left-section">
        <div class="tabs">
          <button
            v-for="(tab, index) in tabs"
            :key="index"
            :class="{ active: isTabActive(tab.routeName) }"
            @click="selectTab(tab.routeName)"
          >
            <div class="ico playback"></div>
            {{ tab.label }}
          </button>
        </div>
        <div class="search-bar">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="搜索直播回放"
            @keyup.enter="performSearch"
          />
          <div class="ico search"></div>
        </div>
      </div>

      <div class="right-section">
        <div
          class="stat-item"
          @click="router.push({ name: 'follow' })"
        >
          <span class="title">关注数</span>
          <span class="num">{{ followings?.length }}</span>
        </div>
        <div
          class="stat-item"
          @click="router.push({ name: 'fans' })"
        >
          <span class="title">粉丝数</span>
          <span class="num">{{ followers?.length }}</span>
        </div>
      </div>
    </div>

    <div class="tab-content">
      <router-view @updateFollowingList="refreshFollowingList"></router-view>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { fetchLiveList } from '@/api/live';
import {
  fetchFindUser,
  fetchUserFollow,
  fetchUserFollowersList,
  fetchUserFollowingList,
  fetchUserUnfollow,
} from '@/api/user';
import { fetchUserHasLiveRoom } from '@/api/userLiveRoom';
import { ILive } from '@/interface';
import { routerName } from '@/router';
import { useUserStore } from '@/store/user';
import { IUser } from '@/types/IUser';
import { openToTarget } from 'billd-utils';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const emit = defineEmits();
const tabs = ref([{ label: '直播片段', routeName: 'playback' }]);

const searchQuery = ref('');
const followings = ref<any[]>([]);
const followers = ref<any[]>([]);
const userInfo = ref<IUser>();
const getUserLoading = ref(false);
const isCancelPopupVisible = ref(false);
const liveRoomList = ref<ILive[]>([]);
const liveRoomInfo = ref<any>();

// 判断当前选中的 Tab
const isTabActive = (routeName: string) => route.name === routeName;

// 跳转到选中 Tab 对应的路由
const selectTab = (routeName: string) => {
  router.push({ name: routeName });
};

onMounted(async () => {
  if (route.params.id) {
    getData();
    getLiveRoomInfo();
  }
  await getLiveRoomList();
});

watch(
  () => route.params.id,
  () => {
    if (route.params.id) {
      getData();
      getLiveRoomInfo();
    }
  }
);

watch(
  () => liveRoomList,
  () => {
    console.log(liveRoomList, '[[[[]]]]');
  }
);

const getData = () => {
  handleUserInfo(route.params.id);
  requestFollowingList(route.params.id);
  requestFollowersList(route.params.id);
};

async function handleUserInfo(id) {
  try {
    getUserLoading.value = true;
    const res = await fetchFindUser(Number(id));
    if (res.code === 200) {
      userInfo.value = res.data;
    }
  } catch (error) {
    console.error(error);
  } finally {
    getUserLoading.value = false;
  }
}

const requestFollowingList = async (id) => {
  const res = await fetchUserFollowingList({ userId: id });
  if (res.code === 200) {
    followings.value = res.data;
  }
};

const requestFollowersList = async (id) => {
  const res = await fetchUserFollowersList({ userId: id });
  if (res.code === 200) {
    followers.value = res.data;
  }
};

const refreshFollowingList = () => {
  if (route.params.id) {
    handleUserInfo(route.params.id);
    requestFollowingList(route.params.id);
    requestFollowersList(route.params.id);
  }
};

// 计算属性：判断当前用户是否关注目标用户
const isFollowing = computed(() => {
  return followings.value.some(
    (following) => following.id === Number(route.params.id)
  );
});

// 计算属性：判断目标用户是否关注当前用户
const isFollowed = computed(() => {
  return followers.value.some(
    (follower) => follower.id === userStore.userInfo?.id
  );
});

// 计算属性：判断是否是互粉
const isMutualFollow = computed(() => {
  return isFollowing.value && isFollowed.value;
});

const isLive = computed(() => {
  return (
    liveRoomList.value.some(
      (liveRoom) => liveRoom.user_id === Number(route.params.id)
    ) && userStore?.userInfo?.id !== Number(route.params.id)
  );
});

// 按钮样式：根据关注状态动态修改
const buttonClass = computed(() => {
  if (isMutualFollow.value) return 'gray'; // 互粉时为灰色按钮
  if (isFollowing.value) return 'gray'; // 已关注时为灰色按钮
  return ''; // 默认样式
});

const showPopup = () => {
  isCancelPopupVisible.value = true;
};

// 隐藏取消关注弹窗
const hidePopup = () => {
  isCancelPopupVisible.value = false;
};

// 保持 popup 显示状态
const stayPopup = () => {
  isCancelPopupVisible.value = true;
};

// 关注用户
const handleFollow = async (followingId) => {
  const res = await fetchUserFollow({
    followingId: followingId,
    followerId: userStore.userInfo?.id,
  });
  if (res.code === 200) {
    window.$message.success('关注成功');
    // emit('updateFollowingList');
    if (route.params.id) {
      handleUserInfo(route.params.id);
      requestFollowingList(route.params.id);
      requestFollowersList(route.params.id);
    }
  }
};

// 处理取消关注
const handleUnfollow = async (followingId) => {
  const res = await fetchUserUnfollow({
    followingId,
    followerId: userStore.userInfo?.id,
  });
  if (res.code === 200) {
    window.$message.success('取消关注成功');
    // emit('updateFollowingList');
    if (route.params.id) {
      handleUserInfo(route.params.id);
      requestFollowingList(route.params.id);
      requestFollowersList(route.params.id);
    }
  }
};

const getLiveRoomInfo = async () => {
  const res = await fetchUserHasLiveRoom(Number(route.params.id));
  if (res.code === 200) {
    liveRoomInfo.value = res.data.live_room;
  }
};

function joinRoom() {
  const url = router.resolve({
    name: routerName.pull,
    params: { roomId: liveRoomInfo.value?.id },
    // query: { [URL_QUERY.isBilibili]: isBilibili },
  });
  openToTarget(url.href);
}

async function getLiveRoomList() {
  try {
    const res = await fetchLiveList({
      // orderName: 'created_at',
      // orderBy: 'desc',
      // childOrderName: 'priority,name',
      // childOrderBy: 'desc,asc',
      // status: 0,
      // is_show: 0,
      // cdn: 0,
      // is_fake: 0,
      // live_room_id: 1,
    });
    if (res.code === 200) {
      liveRoomList.value = res.data.rows;
    }
  } catch (error) {
    console.log(error);
  }
}

const goLiveRoom = () => {
  if (isLive.value) {
    console.log('go live room');
  }
};

const handleAvatarUpdate = () => {
  handleUserInfo(route.params.id);
};
</script>
<style lang="scss" scoped>
.ico {
  width: 20px;
  height: 20px;
  opacity: 0.9;
  margin-right: 8px;

  @extend %containBg;

  &.search {
    @include setBackground('@/assets/img/search.png');

    &:hover {
      cursor: pointer;
    }
  }

  &.playback {
    @include setBackground('@/assets/img/playback.png');
  }

  &.female {
    @include setBackground('@/assets/img/female.png');
  }

  &.male {
    @include setBackground('@/assets/img/male.png');
  }
}

.personal-space {
  font-family: Arial, sans-serif;

  .banner {
    position: relative;
    width: 100%;
    height: 200px;

    .header-upinfo-bg-shadow {
      pointer-events: none;
      z-index: 2;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;

      .top {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        height: 106px;
        background: linear-gradient(
          180deg,
          rgba(0, 0, 0, 0.7) 0%,
          rgba(0, 0, 0, 0) 100%
        );
      }

      .bottom {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 117px;
        background: linear-gradient(
          180deg,
          rgba(0, 0, 0, 0.0001) 0%,
          rgba(0, 0, 0, 0.5) 100%
        );
      }
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: -1;
      /* 让图片位于阴影层之上 */
    }

    .user-info {
      position: absolute;
      bottom: 20px;
      left: 60px;
      display: flex;
      align-items: center;
      z-index: 3;
      /* 确保用户信息位于图片和阴影之上 */

      .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.4);
        margin-right: 15px;
      }

      .details {
        margin-left: 10px;

        .top {
          display: flex;
          align-items: center;
        }

        .name {
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
          margin-right: 8px;
          text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.4);
        }

        .edit-btn {
          margin-top: 10px;
          font-size: 12px;
          color: #fff;
          cursor: pointer;
        }
      }
    }

    .control {
      position: absolute;
      right: 80px;
      bottom: 20px;
      z-index: 3;
      display: flex;
      gap: 10px;

      .btn {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 150px;
        height: 34px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
        background-color: #ffd700;
        transition: background-color 0.3s;

        &:hover {
          background-color: #fce45d;
        }
      }

      .gray {
        border: 1px solid rgba(255, 255, 255, 0.2);
        background-color: rgba(255, 255, 255, 0.14);
        transition: all 0.3s;

        &:hover {
          background-color: rgba(255, 255, 255, 0.476);
        }
      }

      .popup {
        position: absolute;
        z-index: 10;
        top: 40px;
        left: 0;
        width: 120px;
        background-color: #ffff;
        border-radius: 6px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        padding: 8px;
        text-align: center;
        font-size: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        visibility: hidden;
        transition:
          opacity 0.3s,
          visibility 0.3s;

        button {
          width: 100%;
          padding: 8px;
          font-size: 14px;
          color: #61666d;
          background-color: transparent;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s;

          &:hover {
            background-color: #efeded;
          }
        }

        &.show {
          opacity: 1;
          visibility: visible;
        }
      }
    }
  }

  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border-bottom: 1px solid #eee;
    padding: 10px 60px 0;

    .tabs {
      display: flex;

      button {
        margin-right: 20px;
        background: none;
        border: none;
        font-size: 14px;
        color: #333;
        cursor: pointer;
        height: 64px;
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
    }

    .search-bar {
      display: flex;
      align-items: center;
      position: relative;
      width: 170px;
      height: 30px;
      border: 1px solid #e3e8ec;
      border-radius: 6px;
      padding: 0 5px;

      &:focus-within {
        border-color: #ffd700;
      }

      input {
        flex: 1;
        border: none;
        outline: none;
        background: transparent;
        font-size: 12px;
        padding: 0 10px;
        height: 100%;
      }
    }
  }

  .left-section {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .right-section {
    display: flex;
    align-items: center;

    .stat-item {
      margin-right: 20px;
      text-align: center;
      display: flex;
      flex-direction: column;
      font-size: 14px;

      &:hover {
        cursor: pointer;
      }

      .title {
        color: #61666d;
        margin-bottom: 5px;
      }

      .num {
        color: #18191c;
        font-weight: 500;
      }
    }
  }

  .tab-content {
    padding: 20px 60px;
  }
}
</style>
