<template>
  <div class="start-live-page">
    <!-- 页面标题 -->
    <div class="page-title">预告设置</div>
    <!-- 白底框 -->
    <div class="content-container">
      <!-- 开播设置表单 -->
      <!-- 直播标题 -->
      <div class="form-group">
        <label for="liveTitle">预告标题</label>
        <input
          id="liveTitle"
          type="text"
          v-model="form.title"
          placeholder="请输入预告标题"
          style="width: 300px"
        />
      </div>

      <!-- 直播日期 -->
      <div class="form-group">
        <label for="date">直播时间</label>
        <el-date-picker
          v-model="form.date"
          type="datetime"
          placeholder="请选择直播日期"
          :clearable="true"
          format="YYYY-MM-DD HH:mm"
          class="input medium-input"
          style="height: 38px"
          @change="handleDateChange"
        />
      </div>

      <!-- 封面上传 -->
      <div class="form-group">
        <label>预告封面</label>
        <div class="cover-upload">
          <input
            type="file"
            id="coverInput"
            @change="handleCoverChange"
            hidden
          />
          <img
            :src="form.cover"
            alt="封面预览"
            v-if="form.cover"
          />
          <div
            class="empty-cover"
            v-else
          >
            <div class="ico empty"></div>
            这里还没有图片啦～
          </div>
          <button
            type="button"
            @click="triggerCoverUpload"
          >
            上传封面
          </button>
        </div>
      </div>

      <!-- 保存按钮 -->
      <div class="form-actions">
        <button @click="handleSave">发布</button>
      </div>
    </div>

    <div class="content-container">
      <div
        style="
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        "
      >
        <div class="title">我的预告</div>
        <div
          class="multi-operate"
          @click="handleShowMultiDelete"
        >
          {{ showMultiDelete ? '返回' : '批量操作' }}
        </div>
      </div>
      <div class="operate">
        <div
          v-if="showMultiDelete"
          class="check-box"
        >
          <!-- 自定义全选复选框 -->
          <div
            class="custom-checkbox"
            @click="handleSelectAll"
          >
            <span :class="{ checked: selectAll }">
              <div
                class="ico selected"
                v-if="selectAll"
              ></div>
            </span>
            <span>全选</span>
            <div class="selected-num">
              已选择
              <div>{{ selectedPreviews?.length }}</div>
              个预告
            </div>
          </div>
        </div>

        <!-- 批量删除按钮 -->
        <div
          class="batch-delete-container"
          v-if="showMultiDelete"
        >
          <button
            :disabled="selectedPreviews.length === 0"
            @click="handleBatchDelete"
          >
            批量删除
          </button>
        </div>
      </div>

      <div class="content-box">
        <div
          class="notification-grid"
          v-if="livePreviews.length"
        >
          <div
            v-for="(preview, index) in livePreviews"
            :key="preview.id"
            class="notification-item-wrap"
          >
            <!-- 自定义复选框 -->
            <div
              class="custom-checkbox"
              @click="togglePreviewSelection(preview.id)"
              v-if="showMultiDelete"
            >
              <span :class="{ checked: selectedPreviews.includes(preview.id) }">
                <div
                  class="ico selected"
                  v-if="selectedPreviews.includes(preview.id)"
                ></div>
              </span>
            </div>

            <div class="notification-item">
              <img
                :src="preview.cover_image"
                alt="直播封面"
                class="cover-image"
              />
              <div class="info">
                <div class="title">{{ preview.title }}</div>
                <div class="details">
                  <span class="time"
                    >开播时间: {{ formatDate(preview.preview_date) }}</span
                  >
                  <div
                    :class="`ico ${
                      curEnterPreview === index ? 'delete_active' : 'delete'
                    }`"
                    v-if="!showMultiDelete"
                    @mouseenter="handleMouseEnter(index)"
                    @mouseleave="handleMouseLeave"
                    @click="handleDelete(preview)"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="empty-box"
          v-else
        >
          <div class="ico empty"></div>
          你还没有发布预告哟～
        </div>
      </div>
    </div>

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
  createLiveRoomPreview,
  deleteLiveRoomPreview,
  fetchLiveRoomPreviewList,
} from '@/api/liveRoom';
import { useUserStore } from '@/store/user';
import { formatDate } from '@/utils/index';
import { ElMessageBox } from 'element-plus';
import { onMounted, ref, watch } from 'vue';

const userStore = useUserStore();

// 表单数据
const form = ref({
  title: '',
  date: '',
  cover: '',
});
const coverFile = ref();
const fileInput = ref<HTMLInputElement | null>(null);
const livePreviews = ref<any>([]);
const selectedPreviews = ref<number[]>([]); // 用于存储选中的预告 ID
const selectAll = ref(false); // 控制全选复选框
const curEnterPreview = ref(-1);
const showMultiDelete = ref(false);

// 占位封面
const placeholderCover = 'https://via.placeholder.com/200x120?text=直播封面';

watch(
  () => userStore?.userInfo?.id,
  () => {
    if (userStore?.userInfo?.id) {
      getPreviewList();
    }
  }
);

onMounted(() => {
  if (userStore?.userInfo?.id) {
    getPreviewList();
  }
});

// 处理直播时间选择变化
const handleDateChange = (newDate: Date) => {
  const currentTime = new Date();
  const twelveHoursLater = new Date(
    currentTime.getTime() + 12 * 60 * 60 * 1000
  ); // 当前时间的12小时后

  if (newDate < twelveHoursLater) {
    window.$message.error('直播时间必须设置在当前时间的12小时之后');
    form.value.date = ''; // 清空选择的时间
  }
};

const handleShowMultiDelete = () => {
  showMultiDelete.value = !showMultiDelete.value;
};

// 处理鼠标进入和离开效果
const handleMouseEnter = (index) => {
  curEnterPreview.value = index;
};

const handleMouseLeave = () => {
  curEnterPreview.value = -1;
};

const handleDelete = (preview) => {
  ElMessageBox.confirm('确定删除该条预告？', '提示', {
    title: '提示',
    showCancelButton: true,
    confirmButtonText: '确定',
    customClass: 'custom-message-box',
  })
    .then(async () => {
      console.log('OK');
      const res = await deleteLiveRoomPreview({ ids: [preview?.id] });
      if (res.code === 200) {
        window.$message.success('删除成功');
        if (userStore?.userInfo?.id) {
          getPreviewList();
        }
      } else {
        window.$message.success('删除失败');
      }
    })
    .catch(() => {
      console.log('cancel');
    });
};

// 批量删除函数
const handleBatchDelete = async () => {
  if (selectedPreviews.value.length === 0) {
    window.$message.error('请选择要删除的预告！');
    return;
  }

  ElMessageBox.alert('确定删除选中的预告？', '提示', {
    title: '提示',
    showCancelButton: true,
    confirmButtonText: '确定',
    customClass: 'custom-message-box',
    callback: async () => {
      const res = await deleteLiveRoomPreview({ ids: selectedPreviews.value });
      if (res.code === 200) {
        window.$message.success('删除成功');
        selectedPreviews.value = []; // 清空选中的项
        if (userStore?.userInfo?.id) {
          getPreviewList(); // 重新获取预告列表
        }
      } else {
        window.$message.error('删除失败');
      }
    },
  });
};

// 选择全选/取消全选
const handleSelectAll = () => {
  selectAll.value = !selectAll.value;
  if (selectAll.value) {
    selectedPreviews.value = livePreviews.value.map((preview) => preview.id); // 全选
  } else {
    selectedPreviews.value = []; // 取消全选
  }
};

// 切换预告的选中状态
const togglePreviewSelection = (previewId: number) => {
  // 切换选中状态
  if (selectedPreviews.value.includes(previewId)) {
    selectedPreviews.value = selectedPreviews.value.filter(
      (id) => id !== previewId
    ); // 取消选中
  } else {
    selectedPreviews.value.push(previewId); // 选中
  }

  // 检查是否所有项都被选中，更新全选状态
  if (selectedPreviews.value.length === livePreviews.value.length) {
    selectAll.value = true; // 所有项都选中了，设置全选为选中
  } else {
    selectAll.value = false; // 否则设置全选为未选中
  }
};

// 获取预告列表
const getPreviewList = async () => {
  const res = await fetchLiveRoomPreviewList({
    userId: userStore?.userInfo?.id,
  });
  if (res.code === 200) {
    livePreviews.value = res.data?.rows;
  }
};

// 处理封面上传
const handleCoverChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    form.value.cover = URL.createObjectURL(file);
  }
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
    form.value.cover = URL.createObjectURL(file);
    coverFile.value = file;
  }
};

// 保存预告
const handleSave = async () => {
  if (
    userStore.userInfo?.id &&
    form.value.title &&
    form.value.date &&
    coverFile.value
  ) {
    const res = await createLiveRoomPreview({
      user_id: userStore.userInfo?.id,
      title: form.value.title,
      preview_date: form.value.date,
      cover_image: coverFile.value,
    });
    if (res.code === 200) {
      window.$message.success('预告设置成功');
      if (userStore?.userInfo?.id) {
        getPreviewList();
      }
    } else {
      window.$message.error('预告设置失败');
    }
  } else {
    window.$message.error('请填写完整预告信息');
  }
};
</script>
<style lang="scss" scoped>
/* 自定义复选框样式 */
.custom-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #18191c;

  /* 容器样式 */
  span:first-child {
    width: 15px;
    height: 15px;
    border: 1px solid #e3e5e7;
    border-radius: 4px;
    margin-right: 10px;
    display: inline-block;
    position: relative;
    transition: all 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;

    &:hover {
      border: 1px solid #ffd700;
    }
  }

  /* 打勾的样式 */
  .checked {
    background-color: #ffd700;
    border-color: #ffd700;
    border: none;
  }

  .selected-num {
    display: flex;
    align-items: center;
    margin-left: 10px;

    div {
      color: #ffd700;
      margin: 0 5px;
    }
  }
}

.empty-cover {
  width: 200px;
  height: 120px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #eaeaea;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #666;
}

.empty-box {
  width: 200px;
  height: 120px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #666;
}

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
    margin-bottom: 20px;

    .operate {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;

      .check-box {
        display: flex;
        align-items: center;

        span {
          font-size: 14px;
        }
      }

      .batch-delete-container {
        display: flex;
        justify-content: center;

        button {
          padding: 8px 15px;
          background: #de450d;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;

          &:hover {
            background: #e63946;
          }

          &:disabled {
            background: #ddd;
            cursor: not-allowed;
          }
        }
      }
    }

    .title {
      font-size: 20px;
    }

    .multi-operate {
      padding: 8px 15px;
      background-color: #ffd700;
      border-radius: 4px;
      font-size: 12px;
      color: #fff;
      box-sizing: border-box;
      cursor: pointer;

      &:hover {
        background: #fbde3c;
      }
    }

    .form-group {
      margin-bottom: 20px;

      label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        color: #555;
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

    .form-actions {
      text-align: center;

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

    .notification-item-wrap {
      display: flex;
      align-items: center;
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
      width: 250px;

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
          display: flex;
          justify-content: space-between;
          align-items: center;

          .time {
            display: block;
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
    width: 18px;
    height: 18px;
    opacity: 0.9;
    background-size: contain;
    background-repeat: no-repeat;

    &.delete {
      background-image: url('@/assets/img/delete.png');
    }

    &.delete_active {
      background-image: url('@/assets/img/delete_active.png');
    }

    &.selected {
      width: 13px;
      height: 13px;
      background-image: url('@/assets/img/selected.png');
    }

    &.empty {
      width: 50px;
      height: 50px;
      margin-bottom: 5px;
      background-image: url('@/assets/img/empty-data.png');
    }
  }

  .file-input {
    display: none;
  }
}
</style>
