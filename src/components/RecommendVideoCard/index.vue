<template>
  <div
    class="video-card"
    @mouseenter="playVideo"
    @mouseleave="stopVideo"
    @click="handleGoVideo(video.id)"
  >
    <!-- 视频封面 -->
    <div class="cover">
      <img
        :src="video.cover"
        alt="视频封面"
      />
      <div class="duration">{{ formatDuration(video.duration) }}</div>
    </div>

    <!-- 叠加的视频 -->
    <video
      ref="videoElement"
      class="video-player"
      :src="video.url"
      muted
      loop
      playsinline
      @timeupdate="updateTime"
      @loadedmetadata="setDuration"
    ></video>

    <!-- 视频播放进度 -->
    <div class="progress">
      {{ formatTime(currentTime) }} / {{ formatTime(totalDuration) }}
    </div>

    <div class="info">
      <div class="title">{{ video.title }}</div>
      <div class="user">
        <div class="ico my"></div>
        <div class="name">{{ video.user.username }}</div>
      </div>
      <div class="views">
        <div class="ico playNum"></div>
        <div class="count">{{ video.views_count }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import router, { routerName } from '@/router';
import { formatDuration } from '@/utils';
import { openToTarget } from 'billd-utils';
import { ref } from 'vue';

const props = defineProps<{ video: any }>();
const emits = defineEmits(['delete', 'update']);

const videoElement = ref<HTMLVideoElement | null>(null);
const currentTime = ref(0);
const totalDuration = ref(0);

// 控制投稿弹窗
const showUploadDialog = ref(false);
const currentVideo = ref<any>(null);

// 鼠标悬停：显示视频 & 自动播放
const playVideo = () => {
  setTimeout(() => {
    videoElement.value?.play();
  }, 100);
};

// 鼠标移开：隐藏视频 & 停止播放
const stopVideo = () => {
  videoElement.value?.pause();
  videoElement.value!.currentTime = 0; // 让视频回到起始位置
};

// 更新当前播放时间
const updateTime = () => {
  if (videoElement.value) {
    currentTime.value = videoElement.value.currentTime;
  }
};

// 获取视频总时长
const setDuration = () => {
  if (videoElement.value) {
    totalDuration.value = videoElement.value.duration;
  }
};

// 格式化时间 (00:00 或 00:00:00)
const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return '00:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return h > 0
    ? `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s
        .toString()
        .padStart(2, '0')}`
    : `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const handleGoVideo = (id) => {
  const url = router.resolve({
    name: routerName.video,
    params: { id },
  });
  openToTarget(url.href);
};
</script>
<style lang="scss" scoped>
.ico {
  /* margin: 0 auto; */
  width: 15px;
  height: 15px;
  opacity: 0.9;

  @extend %containBg;

  &.operate {
    @include setBackground('@/assets/img/operate.png');
  }

  &.playNum {
    @include setBackground('@/assets/img/playNum.png');
  }

  &.my {
    @include setBackground('@/assets/img/my.png');
  }
}

.video-card {
  border-radius: 8px;
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
  cursor: pointer;
  position: relative;
  display: flex;

  .cover {
    position: relative;
    cursor: pointer;

    img {
      width: 100%;
      height: auto;
      display: block;
      width: 145px;
      height: 90px;
      border-radius: 6px;
    }

    .empty {
      width: 100%;
      height: auto;
      display: block;
      width: 145px;
      height: 90px;
      border-radius: 6px;
      background-color: #eaeaea;
      font-size: 14px;
      color: #666;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .duration {
      position: absolute;
      font-size: 13px;
      color: #ffffff;
      z-index: 5;
      background-color: rgba(0, 0, 0, 0.4);
      padding: 3px 4px;
      border-radius: 2px;
      bottom: 5px;
      left: 95px;
    }
  }

  /* 叠加视频 */
  .video-player {
    position: absolute;
    top: 0;
    left: 0;
    width: 145px;
    height: 90px;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    pointer-events: none;
    border-radius: 8px;
  }

  /* 当 hover 时，显示视频 */
  &:hover .video-player {
    opacity: 1;
  }

  /* 视频进度条 */
  .progress {
    position: absolute;
    top: 88px;
    right: 5px;
    /* background: rgba(0, 0, 0, 0.7); */
    color: #fff;
    padding: 3px 6px;
    font-size: 12px;
    border-radius: 4px;
    opacity: 0;
  }

  /* 当 hover 时，显示视频进度 */
  &:hover .progress {
    opacity: 1;
  }

  .info {
    padding-left: 10px;

    .title {
      font-size: 15px;
      font-weight: 500;
      color: #18191c;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      line-break: anywhere;
    }

    .user {
      display: flex;
      align-items: center;
      margin: 5px 0;

      .name {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        line-break: anywhere;
        color: #9499a0;
        font-size: 14px;
        margin-left: 5px;
      }
    }

    .views {
      display: flex;
      align-items: center;

      .count {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        line-break: anywhere;
        color: #9499a0;
        font-size: 14px;
        margin-left: 5px;
      }
    }
  }
}
</style>
