<template>
  <div class="live-notification">
    <div class="notification-title">
      预约直播通知
      <div
        class="focus-all"
        @click="handleFocusAll"
      >
        查看全部&gt;
      </div>
    </div>
    <div
      v-if="liveNotifications.length === 0"
      class="empty-message"
    >
      暂无直播中的主播～
    </div>
    <div
      v-else
      class="notification-list"
    >
      <div
        v-for="live in liveNotifications"
        :key="live.id"
        class="notification-item"
      >
        <div class="live-info">
          <img
            :src="live.user?.avatar"
            alt="Live Cover"
            class="live-cover"
          />
          <div class="live-details">
            <span class="live-title">{{ live.live_room?.name }} </span>
            <div class="live-username">{{ live.user?.username }}</div>
          </div>
        </div>
        <div class="live-time">
          <span class="live-status">
            <img
              width="12"
              height="12"
              src="https://s1.hdslb.com/bfs/static/jinkela/long/images/live.gif"
            /><span class="bili-live-card__info--living__text">直播中</span>
          </span>
        </div>
        <!-- <button class="enter-btn" @click="enterLiveRoom(live.id)">
                    进入直播间
                </button> -->
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { fetchLiveList } from '@/api/live';
import { fetchLiveRoomAppointmentList } from '@/api/liveRoom';
import router, { routerName } from '@/router';
import { useUserStore } from '@/store/user';
import { computed, onMounted, ref, watch } from 'vue';

interface LivePreview {
  id: number;
  title: string;
  username: string;
  startTime: string;
  coverImage: string;
  isLive?: boolean;
  message?: string;
}

const userStore = useUserStore();

watch(
  () => userStore?.userInfo?.id,
  () => {
    getAppointments();
  }
);

onMounted(() => {
  getAppointments();
  getLiveRoomList();
});

// 模拟预约的直播数据
const reservedLives = ref<LivePreview[]>([
  {
    id: 1,
    title: '英雄联盟全球总决赛',
    username: '电竞达人',
    startTime: '2025-01-22T15:00:00',
    coverImage:
      'https://i1.hdslb.com/bfs/face/44ca2be4d17a8c7cd545fdc933808811151e20eb.jpg@96w_96h_1e_1c_100q.webp',
  },
  {
    id: 2,
    title: '唱歌娱乐夜',
    username: '明星主播',
    startTime: '2025-01-22T15:24:00',
    coverImage:
      '	https://i2.hdslb.com/bfs/face/3ec9f9ca742b47b03e64fc7905f6d3f9f14286d9.jpg@96w_96h_1e_1c_100q.webp',
  },
  {
    id: 3,
    title: '王者荣耀冠军赛',
    username: '游戏王',
    startTime: '2025-01-22T15:44:00',
    coverImage:
      'https://i1.hdslb.com/bfs/face/eda015c1a7794c35879f7685c1c7a6ff5ebb3ff7.jpg@80w_80h_1e_1c_100q.webp',
  },
]);

const liveNotifications = ref<any[]>([]);

const appointmentList = ref<any>([]);
const liveRoomList = ref<any[]>([]);

// 筛选即将开始和正在直播的记录
const filteredLives = computed(() => {
  const now = new Date().getTime();
  return reservedLives.value
    .map((live) => {
      const startTime = new Date(live.startTime).getTime();
      const diff = Math.floor((startTime - now) / 1000); // 秒数差
      if (diff <= 0) {
        live.isLive = true;
        live.message = '直播正在进行中';
      } else if (diff > 0 && diff <= 300) {
        live.isLive = false;
        live.message = `直播将在 ${Math.ceil(diff / 60)} 分钟后开始`;
      }
      return diff <= 300 ? live : null;
    })
    .filter((live) => live !== null) as LivePreview[];
});

// 每分钟更新
function updateNotifications() {
  setInterval(() => {
    console.log('更新通知');
  }, 60000);
}

// 进入直播间
function enterLiveRoom(liveId: number) {
  alert(`进入直播间：直播ID为 ${liveId}`);
}

// 初始化
onMounted(() => {
  updateNotifications();
});

function handleFocusAll() {
  router.push({
    name: routerName.liveNotification,
  });
}

// 获取预约列表
const getAppointments = async () => {
  if (userStore?.userInfo?.id) {
    const res = await fetchLiveRoomAppointmentList({
      userId: userStore?.userInfo?.id,
    });
    if (res.code === 200) {
      appointmentList.value = res?.data?.rows;
      updateLiveNotifications(); // 每次获取预约列表后更新 liveNotifications
    }
  }
};

// 获取当前直播列表
async function getLiveRoomList() {
  try {
    const res = await fetchLiveList({});
    if (res.code === 200) {
      liveRoomList.value = res.data.rows;
      updateLiveNotifications(); // 每次获取直播列表后更新 liveNotifications
    }
  } catch (error) {
    console.log(error);
  }
}

// 更新 liveNotifications 列表
function updateLiveNotifications() {
  // 根据预约列表和当前直播列表进行过滤
  const list = appointmentList.value
    .filter((appointment) => {
      // 获取预约的主播
      const appointmentHost = appointment.user_id;
      const appointmentTime = new Date(
        appointment.preview?.preview_date
      ).getTime();

      // 查找当前正在直播的主播
      // const liveStream = liveRoomList.value.find(
      //   (live) =>
      //     live.user_id === appointmentHost && new Date(live.created_at).getTime() >= appointmentTime
      // );
      const liveStream = liveRoomList.value.find(
        (live) => live.user_id === appointmentHost
      );

      // 如果找到了正在直播且符合预约时间的主播
      return liveStream !== undefined;
    })
    .map((appointment) => {
      // 找到匹配的直播信息，并填充到 liveNotifications 中
      const liveStream = liveRoomList.value.find(
        (live) => live.user_id === appointment.user_id
      );
      return liveStream; // 返回当前直播或预约直播
    });
  liveNotifications.value = list;
  console.log(list, '???');
}
</script>
<style scoped lang="scss">
.live-notification {
  box-sizing: border-box;
  width: 350px;
  height: 250px;
  /* overflow-y: scroll; */
  background-color: #fff;
  border-radius: 4px;
  /* box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); */
  padding: 15px 20px 0;
  display: flex;
  flex-direction: column;
}

.notification-title {
  font-size: 16px;
  font-weight: 700;
  color: #18191c;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;

  .focus-all {
    font-size: 12px;
    color: #9499a0;
    padding-top: 3px;
    cursor: pointer;
    font-weight: 400;
  }
}

.empty-message {
  font-size: 14px;
  color: #888;
  text-align: center;
  margin-top: 70px;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* border-bottom: 1px solid #eee; */
  padding-bottom: 8px;
  cursor: pointer;
  position: relative;

  &:last-child {
    border: none;
  }
}

.live-info {
  display: flex;
  align-items: center;
}

.live-cover {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  margin-right: 10px;
  object-fit: cover;
  border-radius: 50%;
}

.live-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.live-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0;
  width: 180px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.live-username {
  font-size: 14px;
  color: #666;
}

.live-time {
  font-size: 12px;
  color: #999;
  position: absolute;
  top: 3px;
  right: 0;
}

.live-status {
  display: -webkit-flex;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  display: -webkit-inline-flex;
  display: inline-flex;
  margin-right: 4px;
  padding-right: 4px;
  height: 18px;
  font-size: 12px;
  cursor: pointer;
  line-height: 16px;
  font-weight: 400;
  color: #ff6699;
  border: 1px solid #ff6699;
  border-radius: 4px;
  box-sizing: border-box;
  user-select: none;
  transform: translateY(1px);

  img {
    margin-left: 4px;
    margin-right: 3px;
    transform: translateZ(0);
  }

  span {
    display: inline-block;
    line-height: 16px;
    vertical-align: middle;
  }
}

.live-icon {
  font-size: 14px;
}

.enter-btn {
  padding: 6px 12px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.enter-btn:hover {
  background-color: #45a049;
}
</style>
