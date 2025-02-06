<template>
  <div class="view-history-page">
    <!-- 页面标题 -->
    <div class="title">观看历史</div>

    <!-- 白色框 -->
    <div class="content-box">
      <!-- 清除历史按钮 -->
      <div class="action-bar">
        <button
          class="clear-history"
          @click="clearHistory"
        >
          清除历史
        </button>
      </div>

      <!-- 历史记录 -->
      <div class="history-list">
        <div
          class="history-card"
          v-for="(item, index) in historyList"
          :key="index"
        >
          <div class="cover-img">
            <a
              href="//live.bilibili.com/7734200"
              target="_blank"
            >
              <img
                :title="item.name"
                alt="Anchor Avatar"
                role="image"
                :src="item.cover"
              />
            </a>
          </div>
          <div class="room-info clear-float">
            <div
              :title="item.title"
              class="room-title f-left"
            >
              {{ item.title }}
            </div>
            <div class="room-area f-right">{{ item.area }}</div>
          </div>
          <div class="up-info clear-float">
            <div class="up-uname f-left clear-float">
              <div class="ico imy"></div>
              <span class="f-left">{{ item.name }}</span>
            </div>
            <div class="room-status f-right">
              <span
                class="on-live"
                v-if="item.isLive"
                >直播中</span
              >
              <span v-if="!item.isLive">未开播</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

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

// 清除历史
const clearHistory = () => {
  historyList.value = [];
  alert('历史记录已清除！');
};
</script>

<style lang="scss" scoped>
.view-history-page {
  background-color: #f5f6f9;
  min-height: 100vh;

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
    padding: 20px;

    /* 清除历史按钮 */
    .action-bar {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20px;

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
      gap: 20px;
    }

    .history-card {
      display: inline-block;
      margin: 15px 10px 0;
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
