<template>
  <div class="user-card-wrapper">
    <div
      class="user-card-item"
      @click="goUser"
    >
      <img
        :src="userData.avatar"
        alt="用户头像"
        class="avatar"
      />
      <div>
        <div class="info">
          <div class="name">{{ userData.username }}</div>
          <div class="description">
            {{
              `${userData.followers_count}粉丝 · ${userData.videos_count}个视频 ${userData.desc}`
            }}
          </div>
        </div>
        <Dropdown class="follow-status">
          <template #btn>
            <button
              :class="`btn follow-btn`"
              v-if="!isFollow"
              @click.stop.prevent="handleFollow()"
            >
              <!-- <div class="icon-menu"></div> -->
              + 关注
            </button>
            <button
              :class="`btn`"
              v-if="isFollow && !isFan"
              @click.stop.prevent="handleFollow()"
            >
              <div class="icon-menu"></div>
              已关注
            </button>
            <button
              :class="`btn`"
              v-if="isFollow && isFan"
              @click.stop.prevent="handleFollow()"
            >
              <div class="icon-menu"></div>
              已互粉
            </button>
          </template>
          <templates #list>
            <div class="list">
              <a
                class="item"
                @click="handleUnfollow()"
              >
                取消关注
              </a>
            </div>
          </templates>
        </Dropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { fetchUserFollow, fetchUserUnfollow } from '@/api/user';
import router, { routerName } from '@/router';
import { useUserStore } from '@/store/user';
import { openToTarget } from 'billd-utils';
import { onMounted, ref } from 'vue';

const userStore = useUserStore();

const props = withDefaults(
  defineProps<{ userData: any; followings: any; followers: any }>(),
  {
    userData: {},
    followings: [],
    followers: [],
  }
);

const isFollow = ref(false);
const isFan = ref(false);

onMounted(() => {
  updateRelation();
});

const updateRelation = () => {
  const userId = props.userData?.id;
  isFollow.value = props.followings?.some(
    (following: any) => following.id === userId
  );
  isFan.value = props.followers?.some(
    (following: any) => following.id === userId
  );
};

function goUser() {
  const url = router.resolve({
    name: routerName.user,
    params: { id: props.userData?.id },
  });
  openToTarget(url.href);
}

// 关注用户
const handleFollow = async () => {
  // if (isMutualFollow) {
  //   return;
  // }
  const followingId = props.userData?.id;
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
    isFollow.value = true;
    // isFollowing.value = true;
    // if (route.params.id) {
    //   requestFollowingList(route.params.id);
    //   requestFollowersList(route.params.id);
    // }
  }
};

// 取消关注
const handleUnfollow = async () => {
  const followingId = props.userData?.id;
  const res = await fetchUserUnfollow({
    followingId,
    followerId: userStore?.userInfo?.id,
  });
  if (res.code === 200) {
    window.$message.success('取消关注成功');
    isFollow.value = false;
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

.user-card-wrapper {
  /* position: relative;
    width: 200px;
    height: 170px;
    display: inline-block;
    margin: 15px 10px;
    box-sizing: border-box; */
}

.user-card-item {
  display: flex;
  align-items: center;
  background-color: #fff;
  /* border: 1px solid #e3e8ec; */
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */

  .avatar {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    margin-right: 10px;
    object-fit: cover;
    margin-right: 20px;
  }

  .info {
    flex: 1;
    margin-bottom: 5px;

    .name {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-bottom: 5px;

      &:hover {
        color: #ffd700;
      }
    }

    .description {
      font-size: 13px;
      color: #61666d;
      margin-bottom: 5px;
    }
  }

  .follow-status {
    margin-top: 5px;

    .btn {
      background-color: #f5f6f9;
      border: none;
      padding: 6px 30px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      cursor: pointer;
      color: #9499a0;
      font-size: 14px;
      font-weight: 500;

      .icon-menu {
        width: 14px;
        height: 14px;
        background: url('@/assets/img/more.png') no-repeat center center;
        background-size: contain;
        margin-right: 5px;
      }

      &:hover {
        background-color: #e3e8ec;
      }
    }

    .follow-btn {
      background-color: #ffd700;
      color: #fff;

      &:hover {
        background-color: #f7e169;
      }
    }

    .backfollow {
      background-color: #fff;
      color: #ffd700;
      border: 1px solid #ffd700;
      padding: 6px 25px;

      &:hover {
        background-color: #fdf6d1;
      }
    }

    .list {
      width: 98px;
      padding: 15px 5px;
      /* border: 1px solid #ccc;
          border-radius: 15px; */

      .item {
        padding: 10px 20px;
        cursor: pointer;
        color: #61666d;

        &:hover {
          background-color: #e3e8ec;
        }
      }
    }
  }
}
</style>
