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
          v-for="(item, index) in historyList"
          :key="index"
          class="history-card"
        >
          <div class="thumbnail">
            <img
              :src="item.thumbnail"
              alt="缩略图"
            />
          </div>
          <div class="info">
            <div class="title">
              <span>{{ item.title }}</span>
              <span
                v-if="item.tag"
                class="tag"
                >{{ item.tag }}</span
              >
            </div>
            <div class="subtitle">{{ item.subtitle }}</div>
            <div class="creator">👤 {{ item.creator }}</div>
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
    thumbnail: 'https://via.placeholder.com/200x100?text=缩略图2',
    title: '【影之诗】今天能赢吗？',
    subtitle: '影之诗',
    creator: 'yokidou',
    tag: '直播中',
  },
  {
    thumbnail: 'https://via.placeholder.com/200x100?text=缩略图2',
    title: '【重播】双城之夜',
    subtitle: '游戏赛事',
    creator: '哔哩哔哩英雄联盟赛事',
    tag: '重播',
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

    /* 单个历史卡片 */
    .history-card {
      display: flex;
      flex-direction: column;
      width: 200px;
      background-color: #fff;
      border: 1px solid #e3e8ec;
      border-radius: 8px;
      overflow: hidden;

      .thumbnail {
        img {
          width: 100%;
          height: auto;
          object-fit: cover;
        }
      }

      .info {
        padding: 10px;

        .title {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 8px;

          .tag {
            font-size: 12px;
            color: #fff;
            background-color: #f56c6c;
            padding: 2px 8px;
            border-radius: 12px;
          }
        }

        .subtitle {
          font-size: 12px;
          color: #666;
          margin-bottom: 6px;
        }

        .creator {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
}
</style>
