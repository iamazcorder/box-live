<template>
  <div class="live-preview-container">
    <div class="page-title-wrapper">
      <div class="page-title">直播预告</div>
      <p class="sub-title">赶紧预约喜欢的直播吧，精彩不容错过！</p>
    </div>

    <!-- 直播预告top3列表 -->
    <div class="top3-list">
      <div
        v-for="live in currentPageData.slice(0, 3)"
        :key="live.id"
        class="live-preview-item"
      >
        <div class="live-preview-card">
          <div class="image-wrapper">
            <img
              :src="live.cover_image"
              alt="Live Preview"
              class="live-preview-image"
            />
            <!-- <div class="empty-cover">预告封面</div> -->
          </div>
          <div class="live-preview-info">
            <div class="live-title">{{ live.title }}</div>
            <div class="live-username">
              主播: <span>{{ live.user?.username }}</span>
              <!-- 主播: <span>{{ live.username }}</span> -->
            </div>
            <div class="live-time">
              开播时间: {{ formatDate(live.preview_date) }}
              <!-- 开播时间: {{ live.startTime }} -->
            </div>
            <button
              class="reserve-btn-done"
              v-if="isAppoint(live.id)"
              @click="cancelLive(live.id)"
            >
              取消预约
            </button>
            <button
              class="reserve-btn"
              @click="reserveLive(live.id)"
              v-else
            >
              预约直播
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="list">
      <div
        v-for="live in currentPageData.slice(3)"
        :key="live.id"
        class="live-preview-item"
      >
        <div class="live-preview-card">
          <div class="image-wrapper">
            <img
              :src="live.cover_image"
              alt="Live Preview"
              class="live-preview-image"
            />
            <!-- <div class="empty-cover">预告封面</div> -->
          </div>
          <div class="live-preview-info">
            <div class="live-title">{{ live.title }}</div>
            <p class="live-username">
              主播: <span>{{ live.user?.username }}</span>
              <!-- 主播: <span>{{ live.username }}</span> -->
            </p>
            <p class="live-time">
              开播时间: {{ formatDate(live.preview_date) }}
              <!-- 开播时间: {{ live.startTime }} -->
            </p>
            <button
              class="reserve-btn-done"
              v-if="isAppoint(live.id)"
            >
              取消预约
            </button>
            <button
              class="reserve-btn"
              @click="reserveLive(live.id)"
              v-else
            >
              预约直播
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <button
        class="pagination-btn"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        上一页
      </button>
      <span class="pagination-text">第 {{ currentPage }} 页</span>
      <button
        class="pagination-btn"
        :disabled="currentPage >= totalPages"
        @click="changePage(currentPage + 1)"
      >
        下一页
      </button>
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
import { formatDate } from '@/utils';
import { computed, onMounted, ref, watch } from 'vue';

const userStore = useUserStore();

const livePreviews = ref<any[]>([
  {
    id: 1,
    title: 'XXXXXX',
    username: 'XXXXXX',
    startTime: 'XXXXXX',
    coverImage:
      'https://i1.hdslb.com/bfs/live/903683e4f2b2fd3226b73ea4fceec915c8578669.jpg@1e_1c_100q.webp',
  },
  {
    id: 2,
    title: '唱歌娱乐夜',
    username: '明星主播',
    startTime: '2025-01-22T19:00:00',
    coverImage:
      'https://i1.hdslb.com/bfs/live/new_room_cover/fe7d877eefe6e461e508d247f19d2e2dd13b6f65.jpg@.webp',
  },
  {
    id: 3,
    title: '王者荣耀冠军赛',
    username: '游戏王',
    startTime: '2025-01-22T19:00:00',
    coverImage:
      'https://i1.hdslb.com/bfs/live/new_room_cover/96043be7a8b1489b8b00056ad8e13a79e5f5609e.jpg@.webp',
  },
  {
    id: 4,
    title: '王者荣耀冠军赛',
    username: '游戏王',
    startTime: '2025-02-20T20:00:00',
    coverImage:
      'https://i1.hdslb.com/bfs/live/new_room_cover/72bfe18e85339978d05952d6cf88c022594faa64.jpg@.webp',
  },
  {
    id: 5,
    title: '热门电影解说',
    username: '电影达人',
    startTime: '2025-02-19T17:00:00',
    coverImage:
      'https://i1.hdslb.com/bfs/live/new_room_cover/41c0c5b119554e75c832ba3e1f0126dc8596f54d.jpg@.webp',
  },
  {
    id: 4,
    title: '王者荣耀冠军赛',
    username: '游戏王',
    startTime: '2025-02-20T20:00:00',
    coverImage:
      'https://i1.hdslb.com/bfs/live/new_room_cover/72bfe18e85339978d05952d6cf88c022594faa64.jpg@.webp',
  },
  {
    id: 5,
    title: '热门电影解说',
    username: '电影达人',
    startTime: '2025-02-19T17:00:00',
    coverImage:
      'https://i1.hdslb.com/bfs/live/new_room_cover/41c0c5b119554e75c832ba3e1f0126dc8596f54d.jpg@.webp',
  },
  {
    id: 4,
    title: '王者荣耀冠军赛',
    username: '游戏王',
    startTime: '2025-02-20T20:00:00',
    coverImage:
      'https://i1.hdslb.com/bfs/live/new_room_cover/72bfe18e85339978d05952d6cf88c022594faa64.jpg@.webp',
  },
  {
    id: 5,
    title: '热门电影解说',
    username: '电影达人',
    startTime: '2025-02-19T17:00:00',
    coverImage:
      'https://i1.hdslb.com/bfs/live/new_room_cover/41c0c5b119554e75c832ba3e1f0126dc8596f54d.jpg@.webp',
  },
  {
    id: 4,
    title: '王者荣耀冠军赛',
    username: '游戏王',
    startTime: '2025-02-20T20:00:00',
    coverImage:
      'https://i1.hdslb.com/bfs/live/new_room_cover/72bfe18e85339978d05952d6cf88c022594faa64.jpg@.webp',
  },
  {
    id: 5,
    title: '热门电影解说',
    username: '电影达人',
    startTime: '2025-02-19T17:00:00',
    coverImage:
      'https://i1.hdslb.com/bfs/live/new_room_cover/41c0c5b119554e75c832ba3e1f0126dc8596f54d.jpg@.webp',
  },
  {
    id: 4,
    title: '王者荣耀冠军赛',
    username: '游戏王',
    startTime: '2025-02-20T20:00:00',
    coverImage:
      'https://i1.hdslb.com/bfs/live/new_room_cover/72bfe18e85339978d05952d6cf88c022594faa64.jpg@.webp',
  },
  {
    id: 5,
    title: '热门电影解说',
    username: '电影达人',
    startTime: '2025-02-19T17:00:00',
    coverImage:
      'https://i1.hdslb.com/bfs/live/new_room_cover/41c0c5b119554e75c832ba3e1f0126dc8596f54d.jpg@.webp',
  },
  {
    id: 4,
    title: '王者荣耀冠军赛',
    username: '游戏王',
    startTime: '2025-02-20T20:00:00',
    coverImage:
      'https://i1.hdslb.com/bfs/live/new_room_cover/72bfe18e85339978d05952d6cf88c022594faa64.jpg@.webp',
  },
  {
    id: 5,
    title: '热门电影解说',
    username: '电影达人',
    startTime: '2025-02-19T17:00:00',
    coverImage:
      'https://i1.hdslb.com/bfs/live/new_room_cover/41c0c5b119554e75c832ba3e1f0126dc8596f54d.jpg@.webp',
  },
]);

const liveAppointments = ref<any>([]);

const currentPage = ref(1);
const itemsPerPage = 10;

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

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(livePreviews.value.length / itemsPerPage);
});

// 获取当前页的数据
const currentPageData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  // return livePreviews.value.slice(start, end);
  return livePreviews.value.slice(start, end);
});

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

// 更改页码
function changePage(page: number): void {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
}

// 获取预告列表
const getPreviewList = async () => {
  const res = await fetchLiveRoomPreviewList({ page: currentPage.value });
  if (res.code === 200) {
    livePreviews.value = res.data?.rows;
  }
};

const getAppointments = async () => {
  const res = await fetchLiveRoomAppointmentList({
    userId: userStore?.userInfo?.id,
    page: currentPage.value,
  });
  if (res.code === 200) {
    liveAppointments.value = res.data?.rows;
  }
};

const isAppoint = (previewId: number) => {
  return liveAppointments.value.find((item) => item.preview_id === previewId);
};
</script>

<style scoped lang="scss">
.live-preview-container {
  padding: 40px;
  background-color: #f4f4f4;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-title-wrapper {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.sub-title {
  font-size: 18px;
  color: #777;
}

.top3-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 30px;
}

.list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  width: 100%;
  max-width: 1200px;
}

.live-preview-item {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.live-preview-item:hover {
  transform: translateY(-10px);
}

.live-preview-card {
  display: flex;
  flex-direction: column;
}

.image-wrapper {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 180px;
  .empty-cover {
    background-color: #d4d3d3;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    color: #3b3b3b;
  }
}

.live-preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-bottom: 2px solid #ddd;
}

.live-preview-info {
  padding: 20px;
  text-align: center;
}

.live-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.live-username {
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
}

.live-username span {
  color: #333;
}

.live-time {
  font-size: 14px;
  color: #999;
  margin-bottom: 16px;
}

.reserve-btn {
  padding: 8px 20px;
  background-color: #ffd700;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &-done {
    padding: 8px 20px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
    border: 1px solid rgb(225, 48, 48);
    color: rgb(225, 48, 48);

    &:hover {
      background-color: #f9d0d0;
    }
  }
}

.reserve-btn:hover {
  background-color: #fbde3c;
}

.pagination-container {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination-btn {
  padding: 10px 20px;
  margin: 0 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.pagination-btn:hover {
  background-color: #45a049;
}

.pagination-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination-text {
  font-size: 16px;
  color: #333;
}
</style>
