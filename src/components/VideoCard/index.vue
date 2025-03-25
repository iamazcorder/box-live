<template>
  <div
    class="video-card"
    @mouseenter="playVideo"
    @mouseleave="stopVideo"
    @click="handleGoVideo()"
  >
    <!-- 视频封面 -->
    <div class="cover">
      <img
        :src="video.cover"
        alt="视频封面"
      />
      <div class="duration">{{ formatDuration(video.duration) }}</div>
      <!-- 视频播放进度 -->
      <div class="progress">
        {{ formatTime(currentTime) }} / {{ formatTime(totalDuration) }}
      </div>
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

    <div class="info">
      <div class="top">
        <div class="title">{{ video.title }}</div>
        <Dropdown
          class="operate"
          v-if="userStore.userInfo?.id === video.user_id && isEdit"
        >
          <template #btn>
            <div class="ico operate"></div>
          </template>
          <template #list>
            <div class="list">
              <a
                class="item"
                @click="openUploadDialog(video)"
              >
                编辑视频
              </a>
              <a
                class="item"
                @click="deleteVideo(video.id)"
              >
                删除视频
              </a>
            </div>
          </template>
        </Dropdown>
      </div>
      <div class="meta">
        <span v-if="!isMy">{{ video.user.username }}</span>
        <span>{{ video.views_count }} 次观看</span>
        <span v-if="isMy">{{ formatDateTime(video.created_at) }}</span>
      </div>
    </div>

    <!-- 投稿弹窗 -->
    <el-dialog
      v-model="showUploadDialog"
      title="发布直播片段"
      width="500px"
      center
      @click.stop.prevent=""
    >
      <div class="dialog-content">
        <!-- 直播标题 -->
        <div class="form-group">
          <label for="liveTitle">稿件标题</label>
          <input
            id="liveTitle"
            type="text"
            v-model="currentVideo.title"
            placeholder="请输入稿件标题"
            style="width: 300px"
          />
        </div>

        <!-- 直播描述 -->
        <div class="form-group">
          <label for="liveTitle">稿件描述</label>
          <input
            id="liveTitle"
            type="text"
            v-model="currentVideo.desc"
            placeholder="请输入稿件描述"
            style="width: 300px"
          />
        </div>

        <!-- 分区-->
        <div class="form-group">
          <label for="liveTitle">稿件分区</label>
          <div
            class="category-text"
            @click="showCategoryModal = true"
          >
            {{ selectedCategory }}
          </div>
        </div>

        <!-- 封面上传 -->
        <div class="form-group">
          <label>稿件封面</label>
          <div class="cover-upload">
            <img
              :src="currentVideo.cover"
              alt="封面预览"
            />
          </div>
          <div
            type="button"
            @click.stop.prevent="triggerCoverUpload"
            class="btn"
          >
            更换封面
          </div>
        </div>
      </div>
      <template #footer>
        <div
          class="btn confirm-btn"
          @click="editVideo(video.id)"
        >
          确认
        </div>
      </template>
    </el-dialog>
    <!-- 控制弹窗的显示 -->
    <CategoryBox
      :isVisible="showCategoryModal"
      @update:isVisible="handleCategorySelect"
    />
    <!-- 隐藏文件选择框 -->
    <input
      type="file"
      ref="fileInput"
      class="file-input"
      @change="handleFileChange"
    />
  </div>
</template>
<script lang="ts" setup>
import { deleteUserVideo, updateUserVideo } from '@/api/liveRoom';
import router, { routerName } from '@/router';
import { useUserStore } from '@/store/user';
import { formatDateTime, formatDuration } from '@/utils';
import { openToTarget } from 'billd-utils';
import { computed, ref } from 'vue';

const userStore = useUserStore();
const props = withDefaults(
  defineProps<{ video: any; isEdit: boolean; isMy: boolean }>(),
  { video: {}, isEdit: true, isMy: true }
);
const emits = defineEmits(['delete', 'update']);

const videoElement = ref<HTMLVideoElement | null>(null);
const currentTime = ref(0);
const totalDuration = ref(0);

// 控制投稿弹窗
const showUploadDialog = ref(false);
const currentVideo = ref<any>(null);
// 文件输入框的引用
const fileInput = ref<HTMLInputElement | null>(null);
// 控制弹窗显示的状态
const showCategoryModal = ref(false);

// 显示的分区文字
const selectedCategory = computed(() => {
  if (
    currentVideo.value?.parentCategory.name &&
    currentVideo.value?.childCategory.name
  ) {
    return `${currentVideo.value?.parentCategory.name}·${currentVideo.value?.childCategory.name}`;
  }
  return '';
});

// 选择分区
const handleCategorySelect = ($event) => {
  showCategoryModal.value = $event.showModal;
  currentVideo.value.parentCategory = $event.curParentCategory;
  currentVideo.value.childCategory = $event.curChildCategory;
};

// 打开投稿弹窗
const openUploadDialog = (video: any) => {
  currentVideo.value = video;
  showUploadDialog.value = true;
};

// 处理封面上传
const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    // 将选择的文件转化为图片URL
    currentVideo.value.cover = URL.createObjectURL(file);
    currentVideo.value.coverFile = file;
  }
};

// 触发封面上传
const triggerCoverUpload = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

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

const deleteVideo = async (id: number) => {
  if (!id) {
    window.$message.warning('id不能为空');
    return;
  }
  const res = await deleteUserVideo({ id });
  if (res.code === 200) {
    window.$message.success('删除成功');
    emits('delete');
  }
};

const editVideo = async (id: number) => {
  if (!id) {
    window.$message.warning('id不能为空');
    return;
  }
  const res = await updateUserVideo(id, {
    title: currentVideo.value.title,
    cover: currentVideo.value.coverFile,
    url: currentVideo.value.url,
    desc: currentVideo.value.desc,
    parent_category_id: currentVideo.value.parentCategory?.id,
    child_category_id: currentVideo.value.childCategory?.id,
  });
  if (res.code === 200) {
    window.$message.success('编辑成功');
    showUploadDialog.value = false;
    emits('update');
  }
};
const handleGoVideo = () => {
  const url = router.resolve({
    name: routerName.video,
    params: { id: props.video.id },
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
}

.file-input {
  display: none;
}

.video-card {
  width: 200px;
  background-color: #fff;
  border: 1px solid #e3e8ec;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  position: relative;

  .cover {
    position: relative;
    cursor: pointer;

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

    /* 视频进度条 */
    .progress {
      position: absolute;
      bottom: 5px;
      right: 5px;
      /* background: rgba(0, 0, 0, 0.7); */
      color: #fff;
      padding: 3px 6px;
      font-size: 12px;
      border-radius: 4px;
      opacity: 0;
      z-index: 10;
    }
  }

  /* 叠加视频 */
  .video-player {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    pointer-events: none;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
  }

  /* 当 hover 时，显示视频 */
  &:hover .video-player {
    opacity: 1;
  }

  /* 当 hover 时，显示视频进度 */
  &:hover .progress {
    opacity: 1;
  }

  .info {
    padding: 10px;

    .top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
      position: relative;
      height: 38px;
    }

    .title {
      font-size: 14px;
      font-weight: bold;
      color: #333;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .operate .list {
      width: 98px;
      padding: 10px 0;
      display: flex;
      flex-direction: column;

      .item {
        padding: 10px 20px;
        color: #61666d;
        cursor: pointer;
        box-sizing: border-box;

        &:hover {
          background-color: #e3e8ec;
        }
      }
    }

    .meta {
      font-size: 12px;
      color: #666;
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        margin-right: 5px;
      }
    }
  }
}

/* 弹窗样式 */
.dialog-content {
  text-align: center;

  .dialog-video {
    width: 100%;
    border-radius: 8px;
    margin-bottom: 10px;
  }

  p {
    margin: 5px 0;
    color: #333;
  }
}

.btn {
  width: 80px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  background-color: #ffd700;
  margin-left: 10px;
}

.confirm-btn {
  width: 80px;
  height: 35px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  align-items: center;

  label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: #555;
    margin-right: 10px;
  }

  input,
  select {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;

    &:focus {
      border-color: #ffd700;
      outline: none;
    }
  }

  .cover-upload {
    display: flex;
    align-items: center;
    gap: 10px;

    img {
      width: 200px;
      height: 120px;
      border: 1px solid #ddd;
      border-radius: 4px;
      object-fit: cover;
    }

    button {
      padding: 8px 20px;
      background: #ffd700;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background: #fbde3c;
      }
    }
  }

  .radio-group {
    display: flex;
    gap: 10px;

    label {
      display: flex;
      align-items: center;
      gap: 5px;

      input {
        margin: 0;
      }
    }
  }
}

.category-text {
  display: inline-block;
  padding: 7px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
  font-size: 14px;
  cursor: pointer;
  color: #999;
}

.category-select {
  padding: 5px 10px;
  background-color: #ffd700;
  /* font-weight: 500; */
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}
</style>
