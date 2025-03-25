<template>
  <div class="live-notification-page">
    <div class="header">
      <div class="title">直播预约</div>
      <!-- <div class="live-count">{{ liveNowCount }}</div> -->
      <!-- <div class="live-person">人正在直播中</div> -->
    </div>

    <div class="content-box">
      <div
        class="notification-grid"
        v-if="appointmentList.length > 0"
      >
        <div
          v-for="(appointment, index) in appointmentList"
          :key="appointment.id"
          class="notification-item"
        >
          <img
            :src="appointment.preview?.cover_image"
            alt="直播封面"
            class="cover-image"
          />
          <div class="info">
            <div class="title">
              {{ appointment.preview?.title }}
              <!-- <span v-if="appointment.isLive" class="live-status">
                                <img width="12" height="12"
                                    src="https://s1.hdslb.com/bfs/static/jinkela/long/images/live.gif" /><span
                                    class="bili-live-card__info--living__text">直播中</span>
                            </span> -->
            </div>
            <div class="details">
              <span class="time"
                >开播时间:
                {{ formatDate(appointment.preview?.preview_date) }}</span
              >
              <span class="host">
                <div>
                  <div class="ico imy"></div>
                  {{ appointment.preview?.user?.username }}
                </div>
                <div
                  class="cancel"
                  @click="cancelAppoint(appointment?.preview_id)"
                >
                  取消预约
                </div>
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
        你还没有预约直播哟～
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  deleteLiveRoomAppointment,
  fetchLiveRoomAppointmentList,
} from '@/api/liveRoom';
import { useUserStore } from '@/store/user';
import { onMounted, ref, watch } from 'vue';

const userStore = useUserStore();

const appointmentList = ref<any>([]);

watch(
  () => userStore?.userInfo?.id,
  () => {
    getAppointments();
  }
);

onMounted(() => {
  getAppointments();
});

// 模拟直播通知数据
const liveNotifications = ref([
  {
    id: 1,
    title: '英雄联盟全球总决赛',
    username: '电竞达人',
    startTime: '2025-01-22T19:00:00',
    coverImage:
      'https://i1.hdslb.com/bfs/live/903683e4f2b2fd3226b73ea4fceec915c8578669.jpg@1e_1c_100q.webp',
    isLive: true,
  },
  {
    id: 2,
    title: '唱歌娱乐夜',
    username: '明星主播',
    startTime: '2025-01-22T19:00:00',
    coverImage:
      'https://i1.hdslb.com/bfs/live/new_room_cover/fe7d877eefe6e461e508d247f19d2e2dd13b6f65.jpg@.webp',
    isLive: true,
  },
  {
    id: 3,
    title: '王者荣耀冠军赛',
    username: '游戏王',
    startTime: '2025-01-22T19:00:00',
    coverImage:
      'https://i1.hdslb.com/bfs/live/new_room_cover/96043be7a8b1489b8b00056ad8e13a79e5f5609e.jpg@.webp',
    isLive: true,
  },
  {
    id: 4,
    title: '王者荣耀冠军赛',
    username: '游戏王',
    startTime: '2025-02-20T20:00:00',
    coverImage:
      'https://i1.hdslb.com/bfs/live/new_room_cover/72bfe18e85339978d05952d6cf88c022594faa64.jpg@.webp',
    isLive: false,
  },
  {
    id: 5,
    title: '热门电影解说',
    username: '电影达人',
    startTime: '2025-02-19T17:00:00',
    coverImage:
      'https://i1.hdslb.com/bfs/live/new_room_cover/41c0c5b119554e75c832ba3e1f0126dc8596f54d.jpg@.webp',
    isLive: false,
  },
]);

// 统计正在直播人数
const liveNowCount = ref(
  liveNotifications.value.filter((n) => n.isLive).length
);

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

// 跳转到直播间
function goToLiveRoom(liveId: number) {
  alert(`跳转到直播间，直播 ID: ${liveId}`);
}

const getAppointments = async () => {
  if (userStore?.userInfo?.id) {
    const res = await fetchLiveRoomAppointmentList({
      userId: userStore?.userInfo?.id,
    });
    if (res.code === 200) {
      appointmentList.value = res?.data?.rows;
    }
  }
};

const cancelAppoint = async (liveId: number) => {
  if (userStore?.userInfo?.id && liveId) {
    const res = await deleteLiveRoomAppointment({
      ids: [liveId],
      userId: userStore?.userInfo?.id,
    });
    if (res.code === 200) {
      window.$message.success('取消预约成功');
      getAppointments();
    } else {
      window.$message.error('取消预约失败');
    }
  }
};
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
            justify-content: space-between;

            .cancel {
              padding: 5px 10px;
              border: 1px solid rgb(225, 48, 48);
              color: rgb(225, 48, 48);
              border-radius: 4px;

              &:hover {
                background-color: #f9d0d0;
              }
            }
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

    &.operate {
      margin-right: 5px;
      float: left;
      @include setBackground('@/assets/img/operate.png');
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
