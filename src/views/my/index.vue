<template>
  <div class="personal-space">
    <!-- Banner 图 -->
    <div class="banner">
      <img
        src="@/assets/img/bg.png"
        alt="Banner"
      />
      <div class="user-info">
        <Avatar
          :url="userStore.userInfo?.avatar"
          :name="userStore.userInfo?.username"
          :size="80"
        ></Avatar>
        <div class="details">
          <h2>{{ userStore.userInfo?.username }}</h2>
          <div class="edit-btn">编辑个性签名</div>
        </div>
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
          <span class="num">{{ user.following }}</span>
        </div>
        <div
          class="stat-item"
          @click="router.push({ name: 'fans' })"
        >
          <span class="title">粉丝数</span>
          <span class="num">{{ user.fans }}</span>
        </div>
      </div>
    </div>

    <div class="tab-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const tabs = ref([{ label: '直播回放', routeName: 'playback' }]);

const searchQuery = ref('');

const user = ref({
  following: 210,
  fans: 50,
});

const performSearch = () => {
  console.log('搜索内容：', searchQuery.value);
};

// 判断当前选中的 Tab
const isTabActive = (routeName: string) => route.name === routeName;

// 跳转到选中 Tab 对应的路由
const selectTab = (routeName: string) => {
  router.push({ name: routeName });
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
}

.personal-space {
  font-family: Arial, sans-serif;

  .banner {
    position: relative;
    width: 100%;
    height: 200px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .user-info {
      position: absolute;
      bottom: 20px;
      left: 60px;
      display: flex;
      align-items: center;

      .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.4);
        margin-right: 15px;
      }

      .details {
        margin-left: 10px;

        h2 {
          font-size: 20px;
          margin: 0;
          color: #fff;
        }

        .edit-btn {
          margin-top: 10px;
          font-size: 12px;
          color: #fff;
          cursor: pointer;
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
