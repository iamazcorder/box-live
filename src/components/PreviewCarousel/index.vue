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
        v-for="(live, index) in livePreviews.slice(0, 3)"
        :key="live.id"
      >
        <div class="carousel-item-content">
          <img
            :src="live.cover_image"
            alt="Live Preview"
            class="carousel-image"
          />
          <div class="username">{{ live.user?.username }}</div>
          <div class="start-time">{{ formatDate(live.preview_date) }}</div>
          <div
            class="reserve-btn-done"
            v-if="isAppoint(live.id)"
            @click="cancelLive(live.id)"
          >
            取消预约
          </div>
          <div
            class="reserve-btn"
            @click="reserveLive(live.id)"
            v-else
          >
            预约直播
          </div>
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
import {
  createLiveRoomAppointments,
  deleteLiveRoomAppointment,
  fetchLiveRoomAppointmentList,
  fetchLiveRoomPreviewList,
} from '@/api/liveRoom';
import { useUserStore } from '@/store/user';
import { NCarousel, NCarouselItem } from 'naive-ui';
import { onMounted, ref, watch } from 'vue';

const userStore = useUserStore();

// 模拟前三个直播预告
const livePreviews = ref<any[]>([
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

const liveAppointments = ref<any>([]);

watch(
  () => userStore?.userInfo?.id,
  () => {
    if (userStore?.userInfo?.id) {
      getPreviewList();
      getAppointments();
    }
  }
);

onMounted(() => {
  if (userStore?.userInfo?.id) {
    getPreviewList();
    getAppointments();
  }
});

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

// 预约直播
const reserveLive = async (liveId: number) => {
  if (userStore?.userInfo?.id && liveId) {
    // 获取直播预告信息
    const live = livePreviews.value.find((item) => item.id === liveId);

    if (live && live.preview_date) {
      // 将 preview_date 转换为 Date 对象
      const previewDate = new Date(live.preview_date);

      // 计算 notification_time，提前五分钟
      const notificationTime = new Date(previewDate);
      notificationTime.setMinutes(previewDate.getMinutes() - 5); // 提前5分钟

      // 使用 notificationTime 来预约直播
      const res = await createLiveRoomAppointments({
        user_id: userStore?.userInfo?.id,
        preview_id: liveId,
        appointment_time: new Date().getTime(), // 当前时间
        notification_time: notificationTime.getTime(), // 计算出来的 notification_time
      });

      if (res.code === 200) {
        window.$message.success('预约直播成功');
        getPreviewList();
        getAppointments();
      } else {
        window.$message.error('预约直播失败');
      }
    }
  }
};

// 取消预约
const cancelLive = async (liveId: number) => {
  if (userStore?.userInfo?.id && liveId) {
    const res = await deleteLiveRoomAppointment({
      ids: [liveId],
      userId: userStore?.userInfo?.id,
    });
    if (res.code === 200) {
      window.$message.success('取消预约成功');
      getPreviewList();
      getAppointments();
    } else {
      window.$message.error('取消预约失败');
    }
  }
};

const isAppoint = (previewId: number) => {
  return liveAppointments.value.find((item) => item.preview_id === previewId);
};

// 获取预告列表
const getPreviewList = async () => {
  const res = await fetchLiveRoomPreviewList({});
  if (res.code === 200) {
    livePreviews.value = res.data?.rows;
  }
};

const getAppointments = async () => {
  const res = await fetchLiveRoomAppointmentList({
    userId: userStore?.userInfo?.id,
  });
  if (res.code === 200) {
    liveAppointments.value = res.data?.rows;
  }
};
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

  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  overflow-clip-margin: content-box;
  overflow: clip;
  object-fit: cover;

  /* width: 100%;
  height: 140px;
  border-radius: 8px;
  object-fit: cover;
  margin-bottom: 10px; */
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

.reserve-btn {
  position: absolute;
  bottom: 10px;
  right: 15px;
  background-color: #f69;
  color: white;
  padding: 6px 15px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgb(254, 127, 169);
  }
}

.reserve-btn-done {
  position: absolute;
  bottom: 10px;
  right: 15px;
  padding: 6px 15px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
  border: 1px solid rgb(225, 48, 48);
  color: rgb(225, 48, 48);

  &:hover {
    background-color: #f9d0d0;
  }
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
