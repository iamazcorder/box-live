<template>
  <div class="live-notification-page">
    <div class="header">
      <div class="title">直播通知</div>
      <div
        class="live-count"
        v-if="liveNotifications.length > 0"
      >
        {{ liveNotifications.length }}
      </div>
      <div
        class="live-person"
        v-if="liveNotifications.length > 0"
      >
        人正在直播中
      </div>
    </div>

    <div class="content-box">
      <div
        class="notification-grid"
        v-if="liveNotifications.length > 0"
      >
        <div
          v-for="(notification, index) in liveNotifications"
          :key="notification.id"
          class="notification-item"
        >
          <img
            :src="notification.live_room?.cover_img"
            alt="直播封面"
            class="cover-image"
          />
          <div class="info">
            <div class="title">
              {{ notification.live_room?.name }}
              <span class="live-status">
                <img
                  width="12"
                  height="12"
                  src="https://s1.hdslb.com/bfs/static/jinkela/long/images/live.gif"
                /><span class="bili-live-card__info--living__text">直播中</span>
              </span>
            </div>
            <div class="details">
              <span class="time"
                >开播时间: {{ formatDate(notification.created_at) }}</span
              >
              <span class="host">
                <div class="ico imy"></div>
                {{ notification.user?.username }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        class="empty-wrap"
        v-else
      >
        <div class="ico empty-data"></div>
        暂时还没有直播通知哟～
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { fetchLiveList } from '@/api/live';
import { fetchLiveRoomAppointmentList } from '@/api/liveRoom';
import { useUserStore } from '@/store/user';
import { onMounted, ref, watch } from 'vue';
const userStore = useUserStore();

// 模拟直播通知数据
const liveNotifications = ref<any[]>([]);

const appointmentList = ref<any>([]);
const liveRoomList = ref<any[]>([]);

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

<style lang="scss" scoped>
.live-notification-page {
  background-color: #f5f6f9;
  /* min-height: 100vh; */

  .header {
    display: flex;
    align-items: flex-end;
    margin-bottom: 20px;

    .title {
      font-size: 24px;
      color: #333;
      margin-right: 20px;
    }

    .live-count {
      font-family: Microsoft YaHei;
      font-size: 16px;
      font-weight: 400;
      color: #f69;
    }

    .live-person {
      color: #61666d;
    }
  }

  .content-box {
    display: flex;
    justify-content: center;

    .notification-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      width: 100%;
      max-width: 1200px;
    }

    .notification-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #fff;
      border-radius: 10px;
      padding: 15px;
      border: 1px solid #e9eaec;
      cursor: pointer;

      &:hover {
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .cover-image {
        width: 100%;
        height: 140px;
        border-radius: 8px;
        object-fit: cover;
        margin-bottom: 10px;
      }

      .info {
        width: 100%;

        .title {
          font-size: 16px;
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
          display: flex;
          align-items: center;

          .live-status {
            margin-left: 10px;
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
        }

        .details {
          font-size: 14px;
          color: #666;
          /* margin-bottom: 10px; */

          .time {
            display: block;
            margin-bottom: 10px;
          }

          .host {
            color: #999;
            font-size: 14px;
            display: flex;
            align-items: center;
          }
        }

        .view-btn {
          background-color: #409eff;
          color: #fff;
          border: none;
          padding: 8px 12px;
          font-size: 14px;
          border-radius: 5px;
          cursor: pointer;
          text-align: center;
          transition: background-color 0.3s;

          &:hover {
            background-color: #337ab7;
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

    &.empty-data {
      width: 80px;
      height: 80px;
      margin-bottom: 20px;
      background-size: contain;
      background-repeat: no-repeat;
      background-image: url('@/assets/img/empty-data.png');
    }
  }

  .empty-wrap {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 100px;
    color: #575555;
  }
}
</style>
