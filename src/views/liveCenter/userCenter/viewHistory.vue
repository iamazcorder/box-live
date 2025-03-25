<template>
  <div class="view-history-page">
    <!-- 页面标题 -->
    <div class="title">观看历史</div>

    <!-- 白色框 -->
    <div class="content-box">
      <div class="head">
        <div class="tabs">
          <div
            class="tabs_item"
            :class="curTab === 'live' ? 'tabs_item-active' : ''"
            @click="curTab = 'live'"
          >
            直播
          </div>
          <div
            class="tabs_item"
            :class="curTab === 'video' ? 'tabs_item-active' : ''"
            @click="curTab = 'video'"
          >
            视频
          </div>
        </div>
        <!-- 清除历史按钮 -->
        <div class="action-bar">
          <button
            class="clear-history"
            @click="clearHistory"
          >
            清除历史
          </button>
        </div>
      </div>

      <!-- 直播历史记录 -->
      <div
        class="history-list"
        v-if="curTab === 'live'"
      >
        <HistoryLiveCard
          v-for="item in historyLiveList"
          :historyData="item"
          :key="item.id"
          :isLive="checkIsLive(item.live_room_id)"
        />
      </div>

      <!-- 视频历史记录 -->
      <div
        class="history-list"
        v-if="curTab === 'video'"
      >
        <HistoryVideoCard
          v-for="item in historyVideoList"
          :historyData="item"
          :key="item.id"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { fetchLiveList } from '@/api/live';
import { fetchLiveViews, fetchVideoViews } from '@/api/liveRoom';
import HistoryLiveCard from '@/components/HistoryLiveCard/index.vue';
import HistoryVideoCard from '@/components/HistoryVideoCard/index.vue';
import { useUserStore } from '@/store/user';
import { onMounted, ref, watch } from 'vue';

const userStore = useUserStore();
const curTab = ref('live');

// 假数据
const historyList = ref([
  {
    cover:
      'https://i0.hdslb.com/bfs/live/aa9d857cddc000f040424f7a8bb14b06dea9cc07.jpg',
    title: '【预告】21号17点 EDG vs TT',
    area: '游戏赛事',
    name: '英雄联盟赛事',
    isLive: true,
  },
  {
    cover:
      'https://i0.hdslb.com/bfs/live/user_cover/a0b032bd1da021a7ae69c68045cc682378e8385a.jpg',
    title: '看看麻油',
    area: '生活杂谈',
    name: 'Armeria_雨リヤ',
    isLive: false,
  },
]);

const historyVideoList = ref<any>([]);
const historyLiveList = ref<any>([]);
const liveRoomList = ref<any>([]);

onMounted(() => {
  getLiveViews();
  getVideoViews();
  getLiveRoomList();
});

watch(
  () => userStore.userInfo?.id,
  () => {
    getLiveViews();
    getVideoViews();
  }
);

// 清除历史
const clearHistory = () => {
  historyList.value = [];
  alert('历史记录已清除！');
};

const getVideoViews = async () => {
  if (userStore.userInfo?.id) {
    const res = await fetchVideoViews({ user_id: userStore.userInfo?.id });
    if (res.code === 200) {
      historyVideoList.value = res.data?.rows;
    }
  }
};

const getLiveViews = async () => {
  if (userStore.userInfo?.id) {
    const res = await fetchLiveViews({ user_id: userStore.userInfo?.id });
    if (res.code === 200) {
      historyLiveList.value = res.data?.rows;
    }
  }
};

async function getLiveRoomList() {
  try {
    const res = await fetchLiveList({});
    if (res.code === 200) {
      liveRoomList.value = res.data.rows;
    }
  } catch (error) {
    console.log(error);
  }
}

const checkIsLive = (live_room_id) => {
  if (!live_room_id) {
    return false;
  }
  return liveRoomList.value.find((item) => item?.live_room_id === live_room_id);
};
</script>

<style lang="scss" scoped>
.view-history-page {
  background-color: #f5f6f9;

  /* 页面标题 */
  .title {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
  }

  /* 白色内容框 */
  .content-box {
    background-color: #fff;
    border: 1px solid #e3e8ec;
    border-radius: 12px;
    min-height: 620px;

    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e3e8ec;
      padding: 10px 0 0 30px;

      .tabs {
        display: flex;
        align-items: center;
        gap: 20px;

        &_item {
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          color: #333;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;

          &-active {
            color: #ffd700;
            font-weight: bold;
            border-bottom: 2px solid #ffd700;
          }
        }
      }
    }

    /* 清除历史按钮 */
    .action-bar {
      display: flex;
      justify-content: flex-end;
      margin-right: 10px;
      margin-top: -5px;

      .clear-history {
        padding: 6px 16px;
        font-size: 14px;
        border: 1px solid #ffd700;
        color: #ffd700;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
        background-color: #fff;

        &:hover {
          background-color: #ffd700;
          color: #fff;
        }
      }
    }

    /* 历史记录列表 */
    .history-list {
      display: flex;
      flex-wrap: wrap;
      padding: 0 10px 10px;
    }

    .history-card {
      display: inline-block;
      margin: 15px 5px 0;
      padding: 8px;
      width: 198px;
      height: 188px;
      border-radius: 4px;
      background-color: #fff;
      font-size: 12px;
      color: #999;

      .f-left {
        float: left;
      }

      .f-right {
        float: right;
      }

      .cover-img {
        width: 100%;
        height: 111px;
        border-radius: 4px;
        overflow: hidden;
        cursor: pointer;
        background: url(//s1.hdslb.com/bfs/static/blive/blfe-link-center/static/img/no-cover.1ebe4d5.jpg)
          50% no-repeat;
        background-size: cover;

        & > a {
          display: block;
          width: 100%;
          height: 100%;
        }

        img {
          width: 100%;
          height: 100%;
        }
      }

      .room-info {
        margin: 10px 0;
        width: 100%;
        height: 24px;
        line-height: 24px;
        color: #999;

        .room-title {
          width: 130px;
          color: #333;
          font-size: 14px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          float: left;
        }

        .room-area {
          font-size: 14px;
          padding: 0;
          float: right;
        }
      }

      .up-info {
        width: 100%;
        height: 24px;

        .up-name {
          span {
            width: 100px;
            color: #999;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        }

        .room-status {
          height: 32px;
          font-size: 10px;

          & > span {
            padding: 0 3px;
            height: 16px;
            text-align: center;
            line-height: 16px;
            color: #999;
            border: 1px solid #999;
            border-radius: 2px;
          }

          .on-live {
            color: #f69;
            border: 1px solid #f69;
          }
        }
      }
    }
  }

  .ico {
    width: 15px;
    height: 15px;
    opacity: 0.9;

    &.imy {
      margin-right: 5px;
      float: left;
      @include setBackground('@/assets/img/my.png');
    }
  }
}
</style>
