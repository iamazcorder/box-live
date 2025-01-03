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
      <div class="ico search"></div>
    </div>

    <!-- 关注列表 -->
    <div class="follow-list">
      <div
        v-for="(user, index) in filteredUsers"
        :key="index"
        class="follow-item"
      >
        <img
          :src="user.avatar"
          alt="用户头像"
          class="avatar"
        />
        <div>
          <div class="info">
            <div class="name">{{ user.name }}</div>
            <div class="description">{{ user.description }}</div>
          </div>
          <Dropdown class="follow-status">
            <template #btn>
              <button class="btn">
                <div class="icon-menu"></div>
                已关注
              </button>
            </template>
            <template #list>
              <div class="list">
                <a class="item"> 取消关注 </a>
              </div>
            </template>
          </Dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

// 筛选选项
const filterOptions = ['最近关注', '最常访问'];
const selectedFilter = ref('最近关注');

// 搜索内容
const searchQuery = ref('');

// 用户数据
const users = ref([
  {
    name: '付金权的全栈课堂',
    description: '随缘更',
    avatar: 'https://via.placeholder.com/80',
  },
  {
    name: '英语兔',
    description: 'www.YingYuTu.com',
    avatar: 'https://via.placeholder.com/80',
  },
  {
    name: '陈善福儿',
    description: '原创不易！借鉴请珍惜！',
    avatar: 'https://via.placeholder.com/80',
  },
  {
    name: '盖里老哥',
    description: '工作室联系 wxb5emoney',
    avatar: 'https://via.placeholder.com/80',
  },
  {
    name: '三更草堂',
    description: '关注后会自动回复群号',
    avatar: 'https://via.placeholder.com/80',
  },
  {
    name: '高斯Goh',
    description: '小潮Eam桌游区的扛把子！',
    avatar: 'https://via.placeholder.com/80',
  },
]);

// 选择筛选项
const selectFilter = (option: string) => {
  selectedFilter.value = option;
};

// 过滤用户
const filteredUsers = computed(() => {
  return users.value.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// 搜索功能
const performSearch = () => {
  console.log('搜索内容：', searchQuery.value);
};
</script>

<style lang="scss" scoped>
.follow-page {
  font-family: Arial, sans-serif;

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
      }

      .info {
        flex: 1;
        margin-bottom: 5px;

        .name {
          font-size: 16px;
          font-weight: bold;
          color: #333;

          &:hover {
            color: #ffd700;
          }
        }

        .description {
          font-size: 12px;
          color: #61666d;
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
          width: 100px;
          padding: 15px 5px;

          .item {
            padding: 10px 20px;

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
