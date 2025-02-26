<template>
  <div class="start-live-page">
    <!-- 页面标题 -->
    <div class="page-title">开播设置</div>
    <div style="display: flex; gap: 20px">
      <!-- 直播标题 -->
      <div class="content-container">
        <div class="title">直播标题</div>
        <input
          id="liveTitle"
          type="text"
          v-model="title"
          placeholder="请输入直播标题"
          style="width: 300px"
        />
        <button
          type="submit"
          @click="handleSaveTitle"
        >
          保存
        </button>
      </div>
      <!-- 分区选择 -->
      <div class="content-container">
        <div class="title">直播分区</div>
        <div
          class="category-text"
          @click="showModal = true"
        >
          {{ selectedCategory }}
        </div>
        <!-- <div class="category-select" @click="showModal = true">{{ selectedCategory }}</div> -->
        <button
          type="submit"
          @click="handleSaveCategory"
        >
          保存
        </button>
      </div>
    </div>
    <!-- 直播公告 -->
    <div class="content-container">
      <div class="title">主播公告</div>
      <input
        id="liveTitle"
        v-model="announcement"
        placeholder="说说下次开播的时间和内容吧～"
        style="width: 100%"
        maxlength="60"
        clearable
      />
      <div class="tip">Tips：未填写内容时，主播公告将隐藏</div>
      <button
        type="submit"
        @click="handleSaveAnnouncement"
      >
        保存
      </button>
    </div>
    <div style="display: flex; gap: 20px">
      <!-- 直播封面 -->
      <div class="content-container">
        <div class="title">直播封面</div>
        <div class="cover-upload">
          <!-- <input type="file" id="coverInput" @change="handleCoverChange" hidden /> -->
          <img
            :src="cover || placeholderCover"
            alt="封面预览"
          />
          <button
            type="button"
            @click="triggerCoverUpload"
          >
            更换封面
          </button>
        </div>
      </div>
      <!-- 个人简介 -->
      <div class="content-container">
        <div class="title">个人简介</div>
        <div class="el-textarea">
          <textarea
            rows="2"
            v-model="introduction"
          ></textarea>
        </div>
        <button
          type="submit"
          @click="handleSaveIntroduction"
        >
          保存
        </button>
      </div>
    </div>

    <!-- 控制弹窗的显示 -->
    <CategoryBox
      :isVisible="showModal"
      @update:isVisible="handleCategorySelect"
    >
    </CategoryBox>
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
import { fetchUpdateMyLiveRoom, uploadCover } from '@/api/liveRoom';
import { fetchUserHasLiveRoom } from '@/api/userLiveRoom';
import CategoryBox from '@/components/CategoryBox/index.vue';
import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import { computed, onMounted, ref, watch } from 'vue';

const userStore = useUserStore();
const appStore = useAppStore();

// 直播标题
const title = ref('');
// 直播一级分区
const parentCategory = ref<any>({});
// 直播二级分区
const childCategory = ref<any>({});
// 直播公告
const announcement = ref('');
// 直播封面
const cover = ref('');
// 个人简介
const introduction = ref('');

const liveRoomInfo = ref<any>({});

// 控制弹窗显示的状态
const showModal = ref(false);
// 文件输入框的引用
const fileInput = ref<HTMLInputElement | null>(null);

// 占位封面
const placeholderCover = 'https://via.placeholder.com/200x120?text=直播封面';

watch(
  () => userStore.userInfo?.id,
  () => {
    if (userStore.userInfo?.id) {
      getLiveRoomInfo();
    }
  }
);

onMounted(() => {
  if (userStore.userInfo?.id) {
    getLiveRoomInfo();
  }
});

const getLiveRoomInfo = async () => {
  const res = await fetchUserHasLiveRoom(Number(userStore.userInfo?.id));
  if (res.code === 200) {
    liveRoomInfo.value = res.data.live_room;
    updateLiveRoomInfo(res.data.live_room);
  }
};

const updateLiveRoomInfo = (liveRoom) => {
  title.value = liveRoom?.name;
  announcement.value = liveRoom?.live_announcement;
  cover.value = liveRoom?.cover_img;
  introduction.value = liveRoom?.personal_intro;
  parentCategory.value = appStore.areaList.find(
    (item) => item.id === liveRoom?.parent_category_id
  );
  childCategory.value = parentCategory.value.children.find(
    (item) => item.id === liveRoom?.child_category_id
  );
};

const handleSaveTitle = async () => {
  const res = await fetchUpdateMyLiveRoom({ name: title.value });
  if (res.code === 200) {
    window.$message.success('保存成功');
  } else {
    window.$message.error('保存失败，请稍后重试');
  }
};

const handleSaveAnnouncement = async () => {
  const res = await fetchUpdateMyLiveRoom({
    live_announcement: announcement.value,
  });
  if (res.code === 200) {
    window.$message.success('保存成功');
  } else {
    window.$message.error('保存失败，请稍后重试');
  }
};

const handleSaveIntroduction = async () => {
  const res = await fetchUpdateMyLiveRoom({
    personal_intro: introduction.value,
  });
  if (res.code === 200) {
    window.$message.success('保存成功');
  } else {
    window.$message.error('保存失败，请稍后重试');
  }
};

const handleSaveCategory = async () => {
  if (parentCategory.value?.name && childCategory.value?.name) {
    const res = await fetchUpdateMyLiveRoom({
      parent_category_id: parentCategory.value.id,
      child_category_id: childCategory.value.id,
    });
    if (res.code === 200) {
      window.$message.success('保存成功');
    } else {
      window.$message.error('保存失败，请稍后重试');
    }
  } else {
    window.$message.warning('请先选择分区');
  }
};

// 显示的分区文字
const selectedCategory = computed(() => {
  if (parentCategory.value?.name && childCategory.value?.name) {
    return `${parentCategory.value.name}·${childCategory.value.name}`;
  }
  return '选择分区';
});

// 选择分区
const handleCategorySelect = ($event) => {
  showModal.value = $event.showModal;
  parentCategory.value = $event.curParentCategory;
  childCategory.value = $event.curChildCategory;
};

// 触发封面上传
const triggerCoverUpload = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// 处理封面上传
const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    // 将选择的文件转化为图片URL
    cover.value = URL.createObjectURL(file);
  }

  if (file) {
    try {
      const res = await uploadCover(file, liveRoomInfo.value?.id);
      if (res.code === 200) {
        window.$message.success('更换封面成功');
      } else {
        window.$message.success('更换封面失败');
      }
    } catch (error) {
      window.$message.success('更换封面失败');
    }
  }
};
</script>

<style lang="scss" scoped>
.start-live-page {
  background: #f5f6fa;

  .page-title {
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
  }

  .content-container {
    background: #fff;
    border: 1px solid #e3e8ec;
    border-radius: 12px;
    padding: 20px;
    flex: 1;
    margin-bottom: 20px;

    .title {
      font-size: 20px;
      font-weight: 500;
      margin-bottom: 10px;
    }
  }

  input,
  select {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    margin-right: 10px;

    &:focus {
      border-color: #ffd700;
      outline: none;
    }
  }

  .el-textarea {
    width: 100%;
    display: inline-block;
    vertical-align: bottom;
    margin-bottom: 20px;
  }

  textarea {
    resize: none;
    min-height: 201px;
    height: 201px;
    display: block;
    padding: 5px 7px;
    line-height: 1.5;
    width: 100%;
    color: #1f2d3d;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ddd;
    border-radius: 4px;
    transition: border-color 0.2scubic-bezier (0.645, 0.045, 0.355, 1);
    font-size: 14px;
    box-sizing: border-box;

    &:focus {
      border-color: #ffd700;
      outline: none;
    }
  }

  .cover-upload {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-top: 10px;
    height: 80%;

    img {
      width: 200px;
      height: 120px;
      border: 1px solid #ddd;
      border-radius: 4px;
      object-fit: cover;
    }

    button {
      padding: 8px 12px;
      background: #ffd700;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background: #d9b901;
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

  button {
    padding: 7px 20px;
    font-size: 14px;
    background: #ffd700;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background: #d9b901;
    }
  }

  .tip {
    margin: 16px 0 16px;
    font-size: 12px;
    color: #999;
    font-size: 12px;
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

  /* 隐藏文件选择框 */
  .file-input {
    display: none;
  }
}
</style>
