<template>
  <div class="follow-page">
    <!-- 页面标题 -->
    <div class="header">
      <div class="title">全部粉丝</div>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="输入关键词"
        @keyup.enter="performSearch"
      />
      <div
        class="ico search"
        @click="performSearch"
      ></div>
    </div>

    <!-- 关注列表 -->
    <div
      class="follow-list"
      v-if="followers.length !== 0"
    >
      <div
        v-for="(user, index) in followers"
        :key="index"
        class="follow-item"
        @click="handleJump(user?.id)"
      >
        <img
          :src="user.avatar"
          alt="用户头像"
          class="avatar"
        />
        <div>
          <div class="info">
            <div class="name">{{ user.username }}</div>
            <div class="description">{{ user.desc }}</div>
          </div>
          <Dropdown class="follow-status">
            <template #btn>
              <button
                :class="`btn ${!isMutualFollow(user) ? 'backfollow' : ''}`"
                @click.stop.prevent="handleFollow(user)"
              >
                <div
                  class="icon-menu"
                  v-if="isMutualFollow(user)"
                ></div>
                <!-- 判断是否已互粉 -->
                {{ isMutualFollow(user) ? '已互粉' : '回关' }}
              </button>
            </template>
            <template
              #list
              v-if="isMutualFollow(user)"
            >
              <div class="list">
                <a
                  class="item"
                  @click="handleUnfollow(user.id)"
                >
                  取消关注
                </a>
              </div>
            </template>
          </Dropdown>
        </div>
      </div>
    </div>
    <div
      v-else
      class="empty"
    >
      暂无粉丝数据～
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  fetchUserFollow,
  fetchUserFollowersList,
  fetchUserFollowingList,
  fetchUserUnfollow,
  searchUserFollowers,
} from '@/api/user';
import router, { routerName } from '@/router';
import { useUserStore } from '@/store/user';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const emit = defineEmits();
const userStore = useUserStore();
const route = useRoute();

// 搜索内容
const searchQuery = ref('');
const followers = ref<any[]>([]);
const followings = ref<any[]>([]);

// 搜索功能
const performSearch = async () => {
  console.log('搜索内容：', searchQuery.value);
  if (route.params.id && searchQuery.value.trim()) {
    const res = await searchUserFollowers({
      userId: route.params.id,
      keyword: searchQuery.value.trim(),
    });
    if (res.code === 200) {
      followers.value = res.data; // 更新粉丝列表为搜索结果
    } else {
      // 处理搜索失败的情况
      followers.value = [];
      window.$message.error('搜索失败，请重试');
    }
  } else {
    // 如果搜索框为空，重新加载全部粉丝列表
    requestFollowersList(route.params.id);
  }
};

onMounted(() => {
  if (route.params.id) {
    requestFollowingList(route.params.id);
    requestFollowersList(route.params.id);
  }
});

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

// 判断是否已互粉
const isMutualFollow = (follower: any) => {
  console.log(follower, followings.value, '??????');
  return followings.value.some(
    (following: any) => following.id === follower.id
  );
};

// 关注用户
const handleFollow = async (following: any) => {
  if (isMutualFollow(following)) {
    return;
  }
  const res = await fetchUserFollow({
    followingId: following?.id,
    followerId: route.params.id,
  });
  if (res.code === 200) {
    window.$message.success('关注成功');
    emit('updateFollowingList');
    if (route.params.id) {
      requestFollowingList(route.params.id);
      requestFollowersList(route.params.id);
    }
  }
};

// 取消关注
const handleUnfollow = async (followingId) => {
  const res = await fetchUserUnfollow({
    followingId,
    followerId: route.params.id,
  });
  if (res.code === 200) {
    window.$message.success('取消关注成功');
    emit('updateFollowingList');
    if (route.params.id) {
      requestFollowingList(route.params.id);
      requestFollowersList(route.params.id);
    }
  }
};
const handleJump = (id) => {
  router.push({
    name: routerName.user,
    params: { id },
  });
};
</script>

<style lang="scss" scoped>
.follow-page {
  font-family: Arial, sans-serif;

  .empty {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    height: 80px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .title {
      font-size: 24px;
      font-weight: bold;
    }
  }

  .search-bar {
    position: relative;
    display: flex;
    align-items: center;
    width: 200px;
    height: 30px;
    border: 1px solid #dcdcdc;
    border-radius: 4px;
    padding: 0 10px;
    margin-bottom: 20px;

    &:focus-within {
      border-color: #ffd700;
    }

    input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 14px;
    }

    .ico.search {
      width: 16px;
      height: 16px;
      background: url('@/assets/img/search.png') no-repeat center center;
      background-size: contain;
      cursor: pointer;
    }
  }

  .follow-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;

    .follow-item {
      display: flex;
      align-items: center;
      background-color: #fff;
      border: 1px solid #e3e8ec;
      border-radius: 8px;
      padding: 20px;
      cursor: pointer;
      /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */

      .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin-right: 10px;
        object-fit: cover;
      }

      .info {
        flex: 1;
        margin-bottom: 5px;

        .name {
          font-size: 16px;
          font-weight: bold;
          color: #333;
          margin-bottom: 5px;

          &:hover {
            color: #ffd700;
          }
        }

        .description {
          font-size: 12px;
          color: #61666d;
          margin-bottom: 5px;
        }
      }

      .follow-status {
        margin-top: 5px;

        .btn {
          background-color: #f5f6f9;
          border: none;
          padding: 8px 18px;
          font-size: 14px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          cursor: pointer;
          color: #9499a0;
          font-size: 12px;
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
          width: 100px;
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
  }
}
</style>
