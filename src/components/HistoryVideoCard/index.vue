<template>
  <div class="video-card">
    <!-- 视频封面 -->
    <div
      class="cover"
      @click.stop.prevent="handleGoVideo"
    >
      <img
        :src="historyData?.video?.cover"
        alt="视频封面"
      />
      <div class="duration">
        <div class="duration_txt">
          {{ formatDuration(historyData?.duration) }}/{{
            formatDuration(historyData?.video?.duration)
          }}
        </div>
      </div>
      <progress
        class="progress-bar"
        :value="historyData?.duration"
        :max="historyData?.video?.duration"
      ></progress>
    </div>

    <div class="details">
      <div
        class="title"
        @click.stop.prevent="handleGoVideo"
      >
        <span class="room-title">{{ historyData?.video?.title }}</span>
        <div
          class="ico delete"
          @click.stop.prevent="deleteHistory"
        ></div>
      </div>
      <div class="subtitle">
        <div classs="meta-name">
          <div class="ico my"></div>
          {{ historyData?.video?.user?.username }}
        </div>
        <div class="meta-time">
          <div class="ico watchAt"></div>
          {{ formatHistoryTime(historyData?.watched_at) }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { deleteUserVideoView } from '@/api/liveRoom';
import router, { routerName } from '@/router';
import { useUserStore } from '@/store/user';
import { formatDuration, formatHistoryTime } from '@/utils';
import { openToTarget } from 'billd-utils';

const userStore = useUserStore();
const props = defineProps<{ historyData: any }>();
const emits = defineEmits(['delete']);

const deleteHistory = async () => {
  if (!userStore.userInfo?.id || !props.historyData?.video_id) {
    window.$message.warning('用户id或者视频id不能为空');
    return;
  }

  const res = await deleteUserVideoView({
    user_id: userStore.userInfo?.id,
    video_id: props.historyData?.video_id,
  });
  if (res.code === 200) {
    window.$message.success('删除成功');
    emits('delete');
  }
};

const handleGoVideo = () => {
  const url = router.resolve({
    name: routerName.video,
    params: { id: props.historyData?.video?.id },
  });
  openToTarget(url.href);
};
</script>
<style lang="scss" scoped>
.progress-bar {
  width: 100%;
  height: 3px;
  background-color: rgba(0, 0, 0, 0.5);
  appearance: none;
  -webkit-appearance: none;
  border: none;
  position: absolute;
  z-index: 9999;
  bottom: 0;
  left: 0;
}

.progress-bar::-webkit-progress-bar {
  background-color: rgba(0, 0, 0, 0.5);
  /* border-radius: 3px; */
}

.progress-bar::-webkit-progress-value {
  background-color: #ff6699;
  /* 进度条颜色 */
  /* border-radius: 3px; */
}

.progress-bar::-moz-progress-bar {
  background-color: #ff6699;
  border-radius: 3px;
}

.ico {
  width: 15px;
  height: 15px;
  opacity: 0.9;

  &.my {
    margin-right: 5px;
    float: left;
    @include setBackground('@/assets/img/my.png');
  }

  &.watchAt {
    margin-right: 5px;
    float: left;
    margin-top: 3px;
    @include setBackground('@/assets/img/watchAt.png');
  }

  &.delete {
    position: absolute;
    right: 0;
    top: 0;
    width: 20px;
    height: 20px;
    @include setBackground('@/assets/img/delete.png');
  }
}

.file-input {
  display: none;
}

.video-card {
  width: 200px;
  position: relative;
  margin: 15px 6px 0;
  padding: 8px;
  width: 198px;
  height: 188px;

  .cover {
    position: relative;
    cursor: pointer;
    overflow: hidden;
    border-radius: 4px;
    object-fit: cover;

    img {
      width: 100%;
      display: block;
      height: 111px;
      overflow: hidden;
    }

    .duration {
      /* position: absolute;
            bottom: 5px;
            right: 5px;
            background: rgba(0, 0, 0, 0.7);
            color: #fff;
            padding: 2px 6px;
            font-size: 12px;
            border-radius: 4px; */

      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 2;
      font-size: 12px;
      box-sizing: border-box;
      padding: 20px 8px 6px;
      width: 100%;
      border-bottom-right-radius: 6px;
      border-bottom-left-radius: 6px;
      background-image: linear-gradient(180deg, #0000, #000c);
      color: #fff;
      opacity: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      pointer-events: none;

      &_txt {
        position: absolute;
        right: 8px;
        bottom: 6px;
      }
    }
  }

  .details {
    margin-top: 10px;
    display: flex;
    flex-direction: column;

    .title {
      position: relative;
      padding-right: 30px;
      color: #18191c;
      font-size: 15px;
      line-height: 22px;
      height: 44px;
      display: -webkit-box;
      overflow: hidden;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      word-break: break-all;
      -webkit-line-clamp: 2;
      font-weight: 500;
      cursor: pointer;

      .room-area {
        font-size: 14px;
        padding: 0;
        float: right;
      }
    }

    .subtitle {
      width: 100%;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #999;
      font-size: 13px;

      .meta-name {
        width: 100px;
        color: #999;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        cursor: pointer;
      }

      .meta-time {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
