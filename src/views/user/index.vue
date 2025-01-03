<!-- <template>
  <div
    class="profile-wrap"
    v-loading="getUserLoading"
  >
    <div class="uid">用户id：{{ userInfo?.id }}</div>
    <div class="avatar">
      <span class="txt">用户头像：</span>
      <Avatar
        :url="userInfo?.avatar"
        :name="userInfo?.username"
        :size="30"
      ></Avatar>
    </div>
    <div>用户昵称：{{ userInfo?.username }}</div>
    <div>
      用户角色：{{ userInfo?.roles?.map((item) => item.role_name).join(',') }}
    </div>
    <div>注册时间：{{ userInfo?.created_at }}</div>
    <br />
    <div class="pull-url">
      <span
        v-if="
          !userInfo?.live_rooms?.length &&
          userStore.userInfo?.id === userInfo?.id
        "
        class="link"
        @click="openLiveRoom"
      >
        未开通
      </span>
      <span v-else-if="!userInfo?.live_rooms?.length">
        该用户未开通直播间
      </span>
      <div v-else>
        <div>
          直播间地址：
          <a
            :href="getLiveRoomPageUrl(userInfo?.live_rooms?.[0]?.id!)"
            class="link"
            target="_blank"
          >
            {{ getLiveRoomPageUrl(userInfo?.live_rooms?.[0]?.id!) }}
          </a>
        </div>
        <div>直播间名称：{{ userInfo?.live_rooms?.[0]?.name }}</div>
        <div>
          直播间简介：{{ userInfo?.live_rooms?.[0]?.desc || '暂无简介' }}
        </div>
        <div>
          直播间分区：{{
            userInfo.live_rooms[0]?.areas?.[0]?.name || '暂无分区'
          }}
        </div>
        <div>开通时间：{{ userInfo?.live_rooms?.[0]?.created_at }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';
import { ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { fetchFindUser } from '@/api/user';
import { URL_QUERY } from '@/constant';
import { loginTip } from '@/hooks/use-login';
import { routerName } from '@/router';
import { useUserStore } from '@/store/user';
import { LiveRoomTypeEnum } from '@/types/ILiveRoom';
import { IUser } from '@/types/IUser';
import { getLiveRoomPageUrl } from '@/utils';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const userId = ref(-1);
const userInfo = ref<IUser>();
const getUserLoading = ref(false);

watchEffect(() => {
  if (route.params.id) {
    userId.value = Number(route.params.id as string);
    handleUserInfo();
  }
});

async function handleUserInfo() {
  try {
    getUserLoading.value = true;
    const res = await fetchFindUser(userId.value);
    if (res.code === 200) {
      userInfo.value = res.data;
    }
  } catch (error) {
    console.error(error);
  } finally {
    getUserLoading.value = false;
  }
}

function openLiveRoom() {
  if (!loginTip()) {
    return;
  }
  const url = router.resolve({
    name: routerName.push,
    query: { [URL_QUERY.liveType]: LiveRoomTypeEnum.srs },
  });
  openToTarget(url.href);
}
</script>

<style lang="scss" scoped>
.profile-wrap {
  position: relative;
  padding: 10px;
  .link {
    color: $theme-color-gold;
    text-decoration: none;
    cursor: pointer;
  }
  .avatar {
    display: flex;
    align-items: center;
    .txt {
      margin-right: 10px;
    }
  }
  .url-wrap {
    position: relative;
    margin-top: 10px;
    .cdn {
      margin-bottom: 10px;
    }
  }
}
</style> -->

<template>
  <div class="personal-space">
    <!-- Banner 图 -->
    <div class="banner">
      <img
        src="@/assets/img/bg.png"
        alt="Banner"
      />
      <!-- 个人信息展示在 Banner 图上 -->
      <div class="user-info">
        <Avatar
          :url="userInfo?.avatar"
          :name="userInfo?.username"
          :size="80"
        ></Avatar>
        <div class="details">
          <h2>
            {{ userInfo?.username }}
          </h2>
          <div class="edit-btn">编辑个性签名</div>
        </div>
      </div>
      <div class="operation">
        <button class="follow">+ 关注</button>
        <button class="chat">发消息</button>
      </div>
    </div>

    <!-- Tab、搜索框和统计信息 -->
    <div class="header-row">
      <!-- 左侧：Tab 和搜索框 -->
      <div class="left-section">
        <div class="tabs">
          <button
            v-for="(tab, index) in tabs"
            :key="index"
            :class="{ active: selectedTab === index }"
            @click="selectTab(index)"
          >
            {{ tab }}
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

      <!-- 右侧：关注数和粉丝数 -->
      <div class="right-section">
        <div
          class="stat-item"
          @click="
            router.push({
              name: 'follow',
            })
          "
        >
          <span class="title">关注数</span>
          <span class="num">{{ user.following }}</span>
        </div>
        <div
          class="stat-item"
          @click="
            router.push({
              name: 'fans',
            })
          "
        >
          <span class="title">粉丝数</span>
          <span class="num">{{ user.fans }}</span>
        </div>
      </div>
    </div>

    <!-- Tab 内容 -->
    <div class="tab-content">
      <!-- <div class="live-replays">
        <h3>直播回放</h3>
        <div class="videos">
          <div class="video-item" v-for="(video, index) in filteredReplays" :key="index">
            <img :src="video.thumbnail" alt="缩略图" />
            <p>{{ video.title }}</p>
          </div>
        </div>
      </div> -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';
import { computed, ref } from 'vue';

import { watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { fetchFindUser } from '@/api/user';
import { URL_QUERY } from '@/constant';
import { loginTip } from '@/hooks/use-login';
import { routerName } from '@/router';
import { useUserStore } from '@/store/user';
import { LiveRoomTypeEnum } from '@/types/ILiveRoom';
import { IUser } from '@/types/IUser';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const userId = ref(-1);
const userInfo = ref<IUser>();
const getUserLoading = ref(false);

watchEffect(() => {
  if (route.params.id) {
    userId.value = Number(route.params.id as string);
    handleUserInfo();
  }
});

async function handleUserInfo() {
  try {
    getUserLoading.value = true;
    const res = await fetchFindUser(userId.value);
    if (res.code === 200) {
      userInfo.value = res.data;
    }
  } catch (error) {
    console.error(error);
  } finally {
    getUserLoading.value = false;
  }
}

function openLiveRoom() {
  if (!loginTip()) {
    return;
  }
  const url = router.resolve({
    name: routerName.push,
    query: { [URL_QUERY.liveType]: LiveRoomTypeEnum.srs },
  });
  openToTarget(url.href);
}

interface User {
  avatar: string;
  banner: string;
  name: string;
  level: number;
  following: number;
  fans: number;
}

const user: User = {
  avatar: 'https://via.placeholder.com/150',
  banner: 'https://via.placeholder.com/1200x300',
  name: 'Tim_zh',
  level: 5,
  following: 0,
  fans: 0,
};

const searchQuery = ref<string>('');
const performSearch = () => {
  console.log('搜索内容：', searchQuery.value);
  // 搜索逻辑或 API 调用可以在这里实现
};
const replays = ref([
  { thumbnail: 'https://via.placeholder.com/150', title: '直播回放1' },
  { thumbnail: 'https://via.placeholder.com/150', title: '直播回放2' },
]);

const tabs = ref(['直播回放']);
const selectedTab = ref(0);

const selectTab = (index: number) => {
  selectedTab.value = index;
};

const filteredReplays = computed(() =>
  replays.value.filter((replay) =>
    replay.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);
</script>

<style lang="scss" scoped>
.ico {
  /* margin: 0 auto; */
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
}

.personal-space {
  font-family: Arial, sans-serif;

  /* Banner 样式 */
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

    .operation {
      position: absolute;
      bottom: 20px;
      right: 60px;
      display: flex;
      align-items: center;

      .follow {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 150px;
        height: 34px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
        color: #fff;
        background-color: #ffd700;
        transition: background-color 0.3s;
        border: none;
      }

      .chat {
        margin-left: 20px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 150px;
        height: 34px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 700;
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background-color: rgba(255, 255, 255, 0.14);
        transition: all 0.3s;
      }
    }
  }

  /* Header 样式：Tab、搜索框和统计信息 */
  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border-bottom: 1px solid #eee;
    padding: 10px 60px 0;

    .left-section {
      height: 100%;
      display: flex;
      align-items: center;

      .tabs {
        display: flex;

        button {
          margin-right: 20px;
          /* padding: 10px 20px; */
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

      /* 搜索框样式 */
      .search-bar {
        display: flex;
        align-items: center;
        position: relative;
        width: 170px;
        height: 30px;
        border: 1px solid #e3e8ec;
        border-radius: 6px;
        padding: 0 5px;

        /* 当搜索框或其中的输入框获得焦点时，改变边框颜色 */
        &:focus-within {
          border-color: #ffd700;
          /* 设置选中时的边框颜色 */
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

    .right-section {
      display: flex;
      align-items: center;
      padding-bottom: 5px;

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
  }

  /* Tab 内容样式 */
  .tab-content {
    padding: 20px 60px;

    .live-replays {
      h3 {
        font-size: 18px;
        margin-bottom: 10px;
      }

      .videos {
        display: flex;
        flex-wrap: wrap;

        .video-item {
          width: calc(50% - 10px);
          margin-right: 10px;
          margin-bottom: 10px;

          img {
            width: 100%;
            border-radius: 10px;
          }

          p {
            font-size: 14px;
            margin-top: 5px;
          }
        }
      }
    }
  }
}
</style>
