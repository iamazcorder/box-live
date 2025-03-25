<template>
  <div class="follow-page">
    <!-- 页面标题 -->
    <div class="header">
      <div class="title">全部关注</div>
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
      v-if="followings.length !== 0"
    >
      <div
        v-for="(user, index) in followings"
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
                class="btn"
                @click.stop
              >
                <div class="icon-menu"></div>
                已关注
              </button>
            </template>
            <template #list>
              <div class="list">
                <a
                  class="item"
                  @click.stop="handleUnfollow(user.id)"
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
      class="empty-wrap"
      v-else
    >
      <div class="ico empty-data"></div>
      还没有关注的用户呀～
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  fetchUserFollowingList,
  fetchUserUnfollow,
  searchUserFollowing,
} from '@/api/user';
import router, { routerName } from '@/router';
import { useUserStore } from '@/store/user';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

// withDefaults(
//   defineProps<{
//     : string;
//   }>(),
//   {
//     url: '',
//   }
// );

const emit = defineEmits();
const userStore = useUserStore();
const route = useRoute();

// 搜索内容
const searchQuery = ref('');

// 用户数据
const followings = ref<any[]>([]);

// 获取关注列表
onMounted(() => {
  if (route.params.id) {
    requestFollowingList(route.params.id);
  }
});

const handleJump = (id) => {
  router.push({
    name: routerName.user,
    params: { id },
  });
};

// 请求用户关注列表
const requestFollowingList = async (id) => {
  const res = await fetchUserFollowingList({
    userId: id,
  });
  if (res.code === 200) {
    followings.value = res.data;
  }
};

// 搜索功能
const performSearch = async () => {
  console.log('搜索内容：', searchQuery.value);
  if (route.params.id && searchQuery.value.trim()) {
    const res = await searchUserFollowing({
      userId: route.params.id,
      keyword: searchQuery.value.trim(),
    });
    if (res.code === 200) {
      followings.value = res.data; // 更新关注列表为搜索结果
    } else {
      // 处理搜索失败的情况
      followings.value = [];
      window.$message.error('搜索失败，请重试');
    }
  } else {
    // 如果搜索框为空，重新加载全部关注列表
    requestFollowingList(route.params.id);
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
    }
  }
};
</script>

<style lang="scss" scoped>
.follow-page {
  font-family: Arial, sans-serif;

  .ico {
    width: 15px;
    height: 15px;
    opacity: 0.9;

    @extend %containBg;

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
        .btn {
          background-color: #f5f6f9;
          border: none;
          padding: 8px 14px;
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

        .list {
          width: 98px;
          padding: 15px 5px;

          .item {
            padding: 10px 20px;
            color: #61666d;
            cursor: pointer;

            &:hover {
              background-color: #e3e8ec;
            }
          }
        }
      }
    }
  }

  .empty {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    height: 80px;
  }
}
</style>
