<template>
  <div class="start-live-page">
    <!-- 页面标题 -->
    <div class="page-title">直播片段</div>

    <div class="tip">
      直播片段仅保留
      <span style="color: red">14</span>
      天，请尽快操作。
    </div>

    <!-- Tab 切换 -->
    <div class="content-container">
      <div
        v-for="item in replayList"
        :key="item.id"
        :span="8"
      >
        <div class="video-card">
          <video
            class="video-player"
            controls
          >
            <source
              :src="item.url"
              type="video/mp4"
            />
            您的浏览器不支持 HTML5 视频。
          </video>
          <div class="video-info">
            <div class="title">{{ item.title }}</div>
            <div class="bottom">
              <div class="time">{{ formatDateTime(item.created_at) }}</div>
              <div style="display: flex; align-items: center; gap: 10px">
                <div class="ico download"></div>
                <div
                  class="upload-btn"
                  @click="openUploadDialog(item)"
                  v-if="!checkIsPublish(item.url)"
                >
                  发布
                </div>
                <div
                  class="upload-btn upload-btn_done"
                  v-else
                >
                  已投稿
                </div>
                <div
                  class="delete-btn"
                  @click="deleteVideo(item.id)"
                >
                  删除
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 投稿弹窗 -->
    <el-dialog
      v-model="showUploadDialog"
      title="发布直播片段"
      width="500px"
      center
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
          <div
            class="cover-upload"
            v-if="currentVideo.cover"
          >
            <img
              :src="currentVideo.cover"
              alt="封面预览"
            />
          </div>
          <div
            class="empty-wrap"
            v-else
          >
            <div class="ico empty-data"></div>
            这里还没有图片哟～
          </div>
          <div
            type="button"
            @click="triggerCoverUpload"
            class="btn"
          >
            更换封面
          </div>
        </div>
      </div>
      <template #footer>
        <div
          class="btn confirm-btn"
          @click="submitUpload"
        >
          确认投稿
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
import {
  createUserVideo,
  deleteLiveRoomRecording,
  fetchLiveRoomRecordings,
  fetchUserVideos,
} from '@/api/liveRoom';
import { fetchUserHasLiveRoom } from '@/api/userLiveRoom';
import { useUserStore } from '@/store/user';
import { computed, onMounted, ref, watch } from 'vue';

const userStore = useUserStore();

// 当前选中的 tab
const activeTab = ref('replayList');
const liveRoomInfo = ref<any>({});
const replayList = ref<any>([]);
const publishedClips = ref<any>([]);

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

// 提交投稿
const submitUpload = () => {
  showUploadDialog.value = false;
  uploadVideo();
};

const uploadVideo = async () => {
  if (!userStore.userInfo?.id) {
    window.$message.warning('用户id不能为空');
    return;
  }
  if (!currentVideo.value?.live_room_id) {
    window.$message.warning('直播间id不能为空');
    return;
  }
  if (
    !currentVideo.value?.parent_category_id ||
    !currentVideo.value?.child_category_id
  ) {
    window.$message.warning('分区不能为空');
    return;
  }
  if (!currentVideo.value?.title) {
    window.$message.warning('标题不能为空');
    return;
  }
  if (!currentVideo.value?.url) {
    window.$message.warning('视频不能为空');
    return;
  }
  if (!currentVideo.value.coverFile) {
    window.$message.warning('封面不能为空');
    return;
  }
  const res = await createUserVideo({
    user_id: userStore.userInfo?.id,
    live_room_id: currentVideo.value?.live_room_id,
    title: currentVideo.value?.title,
    parent_category_id: currentVideo.value?.parentCategory?.id,
    child_category_id: currentVideo.value?.childCategory?.id,
    coverFile: currentVideo.value.coverFile,
    url: currentVideo.value?.url,
    duration: currentVideo.value?.duration,
    desc: currentVideo.value?.desc,
  });
  if (res.code === 200) {
    window.$message.success('投稿成功，去主页看看吧～');
  }
};

const deleteVideo = async (id) => {
  if (!id) {
    window.$message.warning('视频id不能为空');
    return;
  }
  const res = await deleteLiveRoomRecording({ id });
  if (res.code === 200) {
    window.$message.success('删除成功');
    getRecordingList();
  }
};

const getPublishedClips = async () => {
  if (userStore.userInfo?.id) {
    const res = await fetchUserVideos({ user_id: userStore.userInfo?.id });
    if (res.code === 200) {
      publishedClips.value = res.data?.rows;
    }
  }
};

const checkIsPublish = (url) => {
  return publishedClips.value.find((item) => item.url === url);
};

watch(
  () => userStore.userInfo?.id,
  () => {
    getData();
  }
);

onMounted(() => {
  getData();
});

const getData = async () => {
  if (userStore.userInfo?.id) {
    await getLiveRoomInfo();
    getRecordingList();
    getPublishedClips();
  }
};

const getLiveRoomInfo = async () => {
  const res = await fetchUserHasLiveRoom(Number(userStore.userInfo?.id));
  if (res.code === 200) {
    liveRoomInfo.value = res.data.live_room;
  }
};

const getRecordingList = async () => {
  const res = await fetchLiveRoomRecordings({
    live_room_id: liveRoomInfo.value.id,
  });
  if (res.code === 200) {
    replayList.value = res.data?.rows;
  }
};

function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

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
</script>

<style lang="scss" scoped>
.start-live-page {
  background: #f5f6fa;

  .ico {
    width: 15px;
    height: 15px;
    opacity: 0.9;

    &.empty-data {
      width: 50px;
      height: 50px;
      margin-bottom: 10px;
      background-size: contain;
      background-repeat: no-repeat;
      background-image: url('@/assets/img/empty-data.png');
    }

    &.download {
      background-size: contain;
      background-repeat: no-repeat;
      background-image: url('@/assets/img/download.png');
    }
  }

  .empty-wrap {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #575555;
    background-color: #edecec;

    width: 200px;
    height: 120px;
    border-radius: 4px;
  }

  .page-title {
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
  }

  .tip {
    color: #919191;
    margin-bottom: 10px;
    font-size: 14px;
  }

  .content-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  .tab-content {
    font-size: 16px;
    color: #333;
  }
}

/* 视频卡片 */
.video-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 10px;
  padding: 15px;
  border: 1px solid #e9eaec;
  cursor: pointer;
  width: 250px;

  &:hover {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
}

/* 视频播放器 */
.video-player {
  width: 100%;
  border-radius: 8px;
}

/* 视频时长 */
.video-duration-overlay {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 12px;
  padding: 3px 6px;
  border-radius: 4px;
}

/* 视频信息 */
.video-info {
  text-align: left;
  margin-top: 10px;
  font-size: 14px;

  .title {
    font-size: 14px;
    color: #333;
    margin-bottom: 5px;
  }

  .bottom {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .time {
      color: #999;
      font-size: 12px;
    }

    .upload-btn {
      padding: 5px 10px;
      color: #fff;
      font-size: 12px;
      background-color: #ffd700;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: #f8e058;
      }

      &_done {
        background-color: #ccc;
        cursor: not-allowed;

        &:hover {
          background-color: #ccc;
        }
      }
    }

    .delete-btn {
      padding: 5px 10px;
      color: #fff;
      font-size: 12px;
      background-color: rgb(243, 94, 94);
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: rgb(243, 129, 129);
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

.file-input {
  display: none;
}

/* 自定义 el-tabs 选中状态 */
:deep(.el-tabs__item.is-active) {
  color: #ffd700 !important;
  font-weight: bold;
}

:deep(.el-tabs__active-bar) {
  background-color: #ffd700 !important;
  height: 2px !important;
}
</style>
