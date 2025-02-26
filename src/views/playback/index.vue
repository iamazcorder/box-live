<template>
  <div class="video-gallery-page">
    <div class="left">
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
    <div class="right">
      <div class="live-room">
        <div class="head">直播间</div>
        <div class="content">
          <template v-if="isMe && !isLive">
            <div class="live-tip">欢迎回来！期待你的分享时刻，快来直播吧～</div>
            <div class="live-link">前往我的直播间&gt</div>
          </template>
          <template v-if="isOther && !isLive">
            <div class="live-tip">主播不在，开播的时候会在动态通知你哦~</div>
            <div class="live-link">前往TA的直播间&gt</div>
          </template>
          <template v-if="isLive">
            <div class="live-cover">
              <div class="live-cover-img">
                <img
                  src="https://i0.hdslb.com/bfs/live/new_room_cover/484ae1f5696f9d8221f477f773e6b506535d8089.jpg@.avif"
                  class="b-img__inner"
                  alt="living cover"
                />
              </div>
              <div class="live-cover-tag">
                <div class="live-cover-tag_img">
                  <img
                    src="https://i0.hdslb.com/bfs/static/jinkela/space/asserts/live.gif@48w_48h_1c.avif"
                  />
                </div>
                直播中
              </div>
            </div>
            <div class="live-title">{{ liveRoom?.name }}</div>
          </template>
        </div>
      </div>
      <div class="user-info">
        <div class="head">
          个人资料
          <div
            class="edit"
            v-if="userStore.userInfo?.id === Number(route.params.id)"
            @click="router.push({ name: routerName.myInfo })"
          >
            编辑 &gt
          </div>
        </div>
        <div class="content">
          <div class="item">
            <div class="ico id"></div>
            <div class="uid">{{ userInfo?.id }}</div>
          </div>
          <div class="item">
            <div class="ico birthday"></div>
            <div class="uid">{{ formatDateToMMDD(userInfo?.birth_date) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { fetchLiveList } from '@/api/live';
import { fetchFindUser } from '@/api/user';
import { ILive } from '@/interface';
import router, { routerName } from '@/router';
import { useUserStore } from '@/store/user';
import { IUser } from '@/types/IUser';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const userStore = useUserStore();

// 主筛选选项
const filterOptions = ['最新发布', '最多播放', '最多收藏', '更多筛选'];
const selectedFilter = ref('最新发布');

// 分类选项（作为“更多筛选”的内容）
const categories = ['全部类型 55', '网游 4', '音乐 1', '手游 1', '知识 49'];
const selectedCategory = ref('全部类型 55');
const getUserLoading = ref(false);
const userInfo = ref<IUser>();
const liveRoomList = ref<ILive[]>([]);

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

watch(
  () => route.params.id,
  () => {
    if (route.params.id) {
      handleUserInfo(route.params.id);
    }
  }
);

onMounted(() => {
  if (route.params.id) {
    handleUserInfo(route.params.id);
  }
  getLiveRoomList();
});

const isLive = computed(() => {
  return liveRoomList.value.some(
    (liveRoom) => liveRoom.user_id === Number(route.params.id)
  );
});

const liveRoom = computed(() => {
  if (isLive) {
    const liveRoom = liveRoomList.value.find(
      (liveRoom) => liveRoom.user_id === Number(route.params.id)
    );
    return liveRoom?.live_room;
  }
  return {};
});

const isMe = computed(() => {
  return userStore?.userInfo?.id === Number(route.params.id);
});

const isOther = computed(() => {
  return userStore?.userInfo?.id !== Number(route.params.id);
});

async function handleUserInfo(id) {
  try {
    getUserLoading.value = true;
    const res = await fetchFindUser(Number(id));
    if (res.code === 200) {
      userInfo.value = res.data;
    }
  } catch (error) {
    console.error(error);
  } finally {
    getUserLoading.value = false;
  }
}

function formatDateToMMDD(dateStr) {
  // 创建一个日期对象
  const date = new Date(dateStr);

  // 获取月份和日期，注意月份是从0开始的，所以要加1
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  // 返回格式化后的日期
  return `${month}-${day}`;
}

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

async function getLiveRoomList() {
  try {
    const res = await fetchLiveList({
      // orderName: 'created_at',
      // orderBy: 'desc',
      // childOrderName: 'priority,name',
      // childOrderBy: 'desc,asc',
      // status: 0,
      // is_show: 0,
      // cdn: 0,
      // is_fake: 0,
      // live_room_id: 1,
    });
    if (res.code === 200) {
      liveRoomList.value = res.data.rows;
    }
  } catch (error) {
    console.log(error);
  }
}

const goLiveRoom = () => {
  if (isLive.value) {
    console.log('go live room');
  }
};
</script>

<style lang="scss" scoped>
.video-gallery-page {
  display: flex;

  .ico {
    width: 15px;
    height: 15px;
    opacity: 0.9;

    @extend %containBg;

    &.id {
      @include setBackground('@/assets/img/id.png');
    }

    &.birthday {
      @include setBackground('@/assets/img/birthday.png');
      width: 20px;
      height: 20px;
    }
  }

  .left {
    width: 84%;
  }

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

  .right {
    width: 200px;

    .live-room {
      padding: 20px 16px 24px;
      background-color: #f6f7f8;
      border-radius: 6px;
      width: 100%;
      margin-bottom: 10px;

      .head {
        position: relative;
        padding-bottom: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .edit {
          display: flex;
          align-items: center;
          color: #61666d;
          font-size: 12px;
          cursor: pointer;
        }
      }

      .content {
        box-sizing: border-box;
        cursor: pointer;

        .live-cover {
          position: relative;
          border-radius: 6px;
          overflow: hidden;

          &-img {
            background-color: #f1f2f3;
            height: 100%;
            position: relative;

            img {
              width: 100%;
              height: 100%;
              display: inline-block;
              vertical-align: middle;
            }
          }

          &-tag {
            position: absolute;
            top: 8px;
            right: 8px;
            display: flex;
            align-items: center;
            gap: 2px;
            width: fit-content;
            padding: 0 6px;
            color: #fff;
            height: 24px;
            font-size: 12px;
            background-color: #ff6699;
            border-radius: 6px;

            &_img {
              position: relative;
              margin-bottom: 3px;
              flex: none;
              width: 12px;
              height: 12px;
              background-color: transparent;

              img {
                width: 100%;
                height: 100%;
                display: inline-block;
                vertical-align: middle;
              }
            }
          }
        }

        .live-tip {
          font-size: 14px;
          line-height: 20px;
          color: #61666d;
        }

        .live-title {
          margin-top: 8px;
          font-size: 14px;
          color: #18191c;
        }

        .live-link {
          margin-top: 8px;
          width: fit-content;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          line-height: 20px;
          color: #00aeec;
        }
      }
    }

    .user-info {
      padding: 20px 16px 16px;
      background-color: #f6f7f8;
      border-radius: 6px;
      width: 100%;

      .head {
        position: relative;
        padding-bottom: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .edit {
          display: flex;
          align-items: center;
          color: #61666d;
          font-size: 12px;
          cursor: pointer;
        }
      }

      .content {
        box-sizing: border-box;

        .item {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin-bottom: 10px;

          .uid {
            color: #303135;
            font-size: 14px;
            margin-left: 10px;
          }
        }

        .live-cover {
          position: relative;
          border-radius: 6px;
          overflow: hidden;

          &-img {
            background-color: #f1f2f3;
            height: 100%;
            position: relative;

            img {
              width: 100%;
              height: 100%;
              display: inline-block;
              vertical-align: middle;
            }
          }

          &-tag {
            position: absolute;
            top: 8px;
            right: 8px;
            display: flex;
            align-items: center;
            gap: 2px;
            width: fit-content;
            padding: 0 6px;
            color: #fff;
            height: 24px;
            font-size: 12px;
            background-color: #ff6699;
            border-radius: 6px;

            &_img {
              position: relative;
              margin-bottom: 3px;
              flex: none;
              width: 12px;
              height: 12px;
              background-color: transparent;

              img {
                width: 100%;
                height: 100%;
                display: inline-block;
                vertical-align: middle;
              }
            }
          }
        }

        .live-tip {
          font-size: 14px;
          line-height: 20px;
          color: #61666d;
        }

        .live-title {
          margin-top: 8px;
          font-size: 14px;
          color: #18191c;
        }

        .live-link {
          margin-top: 8px;
          width: fit-content;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          line-height: 20px;
          color: #00aeec;
        }
      }
    }
  }
}
</style>
