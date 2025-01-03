<template>
  <div class="video-gallery-page">
    <!-- 筛选栏 -->
    <div class="filter-bar">
      <!-- 主筛选项 -->
      <div class="filter-group">
        <button
          v-for="(filter, index) in filterOptions"
          :key="index"
          :class="{ active: selectedFilter === filter }"
          @click="selectFilter(filter)"
        >
          {{ filter }}
          <div
            v-if="filter === '更多筛选'"
            class="arrow"
            :class="{ up: isExpanded }"
          ></div>
        </button>
      </div>

      <!-- 更多筛选展开内容 -->
      <div
        v-if="isExpanded"
        class="extra-filters"
      >
        <button
          v-for="(category, index) in categories"
          :key="index"
          :class="{ active: selectedCategory === category }"
          @click="selectCategory(category)"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- 视频列表 -->
    <div class="video-grid">
      <div
        v-for="(video, index) in videos"
        :key="index"
        class="video-card"
      >
        <div class="thumbnail">
          <img
            :src="video.thumbnail"
            alt="视频封面"
          />
          <div class="duration">{{ video.duration }}</div>
        </div>
        <div class="info">
          <div class="title">{{ video.title }}</div>
          <div class="meta">
            <span>{{ video.views }} 次观看</span>
            <span> · </span>
            <span>{{ video.date }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 主筛选选项
const filterOptions = ['最新发布', '最多播放', '最多收藏', '更多筛选'];
const selectedFilter = ref('最新发布');

// 分类选项（作为“更多筛选”的内容）
const categories = ['全部类型 55', '网游 4', '音乐 1', '手游 1', '知识 49'];
const selectedCategory = ref('全部类型 55');

// 视频数据
const videos = ref([
  {
    thumbnail: 'https://via.placeholder.com/320x180?text=视频封面1',
    title: 'BillDesk支持文件传输！提速提质，赶快体验！',
    views: '151',
    date: '2024-12-30',
    duration: '23:14',
  },
  {
    thumbnail: 'https://via.placeholder.com/320x180?text=视频封面2',
    title: '直播新增移除绿幕功能！你也能轻松做到！',
    views: '148',
    date: '2024-12-17',
    duration: '44:54',
  },
  {
    thumbnail: 'https://via.placeholder.com/320x180?text=视频封面3',
    title: '直播新增移除绿幕功能！你也能轻松做到！',
    views: '148',
    date: '2024-12-17',
    duration: '44:54',
  },
  {
    thumbnail: 'https://via.placeholder.com/320x180?text=视频封面4',
    title: '直播新增移除绿幕功能！你也能轻松做到！',
    views: '148',
    date: '2024-12-17',
    duration: '44:54',
  },
  {
    thumbnail: 'https://via.placeholder.com/320x180?text=视频封面5',
    title: '直播新增移除绿幕功能！你也能轻松做到！',
    views: '148',
    date: '2024-12-17',
    duration: '44:54',
  },
  {
    thumbnail: 'https://via.placeholder.com/320x180?text=视频封面6',
    title: '直播新增移除绿幕功能！你也能轻松做到！',
    views: '148',
    date: '2024-12-17',
    duration: '44:54',
  },
  {
    thumbnail: 'https://via.placeholder.com/320x180?text=视频封面7',
    title: '直播新增移除绿幕功能！你也能轻松做到！',
    views: '148',
    date: '2024-12-17',
    duration: '44:54',
  },
  {
    thumbnail: 'https://via.placeholder.com/320x180?text=视频封面8',
    title: '直播新增移除绿幕功能！你也能轻松做到！',
    views: '148',
    date: '2024-12-17',
    duration: '44:54',
  },
  {
    thumbnail: 'https://via.placeholder.com/320x180?text=视频封面9',
    title: '直播新增移除绿幕功能！你也能轻松做到！',
    views: '148',
    date: '2024-12-17',
    duration: '44:54',
  },
]);

// 是否展开更多筛选
const isExpanded = ref(false);

// 切换展开和收起
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

// 切换主筛选选项
const selectFilter = (filter: string) => {
  if (filter === '更多筛选') {
    toggleExpand();
  } else {
    selectedFilter.value = filter;
  }
};

// 切换分类选项
const selectCategory = (category: string) => {
  selectedCategory.value = category;
};
</script>

<style lang="scss" scoped>
.video-gallery-page {
  /* 筛选栏样式 */
  .filter-bar {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;

    .filter-group {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 10px;

      button {
        padding: 6px 12px;
        font-size: 14px;
        border: 1px solid #dcdcdc;
        border-radius: 4px;
        background-color: #fff;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;

        .arrow {
          width: 12px;
          height: 12px;
          margin-left: 5px;
          @include setBackground('@/assets/img/downArrow.png');
          /* 默认箭头向下 */

          &.up {
            @include setBackground('@/assets/img/upArrow.png');
            /* 展开时箭头向上 */
            transition: transform 0.3s;
          }
        }

        &.active {
          background-color: #ffd700;
          color: #fff;
          border-color: #ffd700;
        }

        &:hover {
          border-color: #ffd700;
        }
      }
    }

    /* 更多筛选内容 */
    .extra-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 10px;

      button {
        padding: 6px 12px;
        font-size: 14px;
        border: 1px solid #dcdcdc;
        border-radius: 4px;
        background-color: #fff;
        cursor: pointer;
        transition: all 0.2s;

        &.active {
          background-color: #ffd700;
          color: #fff;
          border-color: #ffd700;
        }

        &:hover {
          border-color: #ffd700;
        }
      }
    }
  }

  /* 视频网格样式 */
  .video-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;

    .video-card {
      width: 200px;
      background-color: #fff;
      border: 1px solid #e3e8ec;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      .thumbnail {
        position: relative;

        img {
          width: 100%;
          height: auto;
          display: block;
        }

        .duration {
          position: absolute;
          bottom: 5px;
          right: 5px;
          background: rgba(0, 0, 0, 0.7);
          color: #fff;
          padding: 2px 6px;
          font-size: 12px;
          border-radius: 4px;
        }
      }

      .info {
        padding: 10px;

        .title {
          font-size: 14px;
          font-weight: bold;
          color: #333;
          margin-bottom: 6px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .meta {
          font-size: 12px;
          color: #666;

          span {
            margin-right: 5px;
          }
        }
      }
    }
  }
}
</style>
