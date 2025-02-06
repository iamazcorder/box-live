<template>
  <div class="carousel-container">
    <!-- 轮播图组件 -->
    <n-carousel
      ref="carouselRef"
      :loop="true"
      :interval="500"
      :show-arrow="false"
      :show-indicator="true"
      :indicator-position="'bottom'"
      class="carousel"
    >
      <!-- 每个轮播项 -->
      <n-carousel-item
        v-for="(live, index) in topLivePreviews"
        :key="live.id"
      >
        <div class="carousel-item-content">
          <img
            :src="live.coverImage"
            alt="Live Preview"
            class="carousel-image"
          />
          <div class="username">{{ live.username }}</div>
          <div class="start-time">{{ formatDate(live.startTime) }}</div>
          <div class="preview-btn">立即预约</div>
        </div>
      </n-carousel-item>
    </n-carousel>
    <!-- 自定义左右箭头 -->
    <div
      class="custom-arrow left"
      @click="prevSlide"
    >
      ‹
    </div>
    <div
      class="custom-arrow right"
      @click="nextSlide"
    >
      ›
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NCarousel, NCarouselItem } from 'naive-ui';
import { ref } from 'vue';

interface LivePreview {
  id: number;
  title: string;
  username: string;
  startTime: string;
  coverImage: string;
}

// 模拟前三个直播预告
const topLivePreviews = ref<LivePreview[]>([
  {
    id: 1,
    title: '王者荣耀冠军赛直播',
    username: '游戏王',
    startTime: '2025-02-20T20:00:00',
    coverImage:
      'https://i1.hdslb.com/bfs/live/a246f0890988e29475a5f4779029024141f1e22f.jpg@1e_1c.webp',
  },
  {
    id: 2,
    title: '英雄联盟全球总决赛预告',
    username: '电竞达人',
    startTime: '2025-02-15T18:00:00',
    coverImage:
      'https://i1.hdslb.com/bfs/live/903683e4f2b2fd3226b73ea4fceec915c8578669.jpg@1e_1c_100q.webp',
  },
  // {
  //     id: 3,
  //     title: "唱歌娱乐夜",
  //     username: "明星主播",
  //     startTime: "2025-02-18T21:00:00",
  //     coverImage: "https://i0.hdslb.com/bfs/live/cover3.jpg",
  // }
]);

// 格式化日期
function formatDate(date: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  const liveDate = new Date(date);
  return liveDate.toLocaleString('zh-CN', options);
}

// 引用 Carousel 实例
const carouselRef = ref<InstanceType<typeof NCarousel> | null>(null);

// 切换到上一张
function prevSlide() {
  carouselRef.value?.prev();
}

// 切换到下一张
function nextSlide() {
  carouselRef.value?.next();
}
</script>

<style scoped lang="scss">
.carousel-container {
  width: 420px;
  height: 250px;
  margin-left: 10px;
  position: relative;
  /* max-width: 1200px; */
  /* margin: 0 auto; */
  /* padding: 20px; */
}

.carousel {
  border-radius: 4px;
  overflow: hidden;
}

.carousel-item-content {
  position: relative;
  height: 100%;
}

.carousel-image {
  width: 100%;
  height: 100%;
  /* object-fit: cover; */
  border-radius: 4px;
  background-repeat: no-repeat;
  background-size: auto;
}

.carousel-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 10px;
  border-radius: 6px;
}

.username {
  position: absolute;
  top: 10px;
  left: 15px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 8px;
  border-radius: 6px;
  font-size: 18px;
  /* font-weight: bold; */
}

.start-time {
  position: absolute;
  bottom: 10px;
  left: 15px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
}

.preview-btn {
  position: absolute;
  bottom: 10px;
  right: 15px;
  background-color: #f69;
  color: white;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.custom-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24px;
  color: white;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.6);
  width: 30px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.custom-arrow.left {
  left: 0;
  border-radius: 0 8px 8px 0;
}

.custom-arrow.right {
  right: 0;
  border-radius: 8px 0 0 8px;
}

.custom-arrow:hover {
  /* background-color: rgba(0, 0, 0, 0.8); */
  color: #f69;
}
</style>
