<template>
  <div class="start-live-page">
    <!-- 页面标题 -->
    <div class="page-title">预告设置</div>

    <!-- 白底框 -->
    <div class="content-container">
      <!-- 开播设置表单 -->
      <form
        class="setup-form"
        @submit.prevent="saveSettings"
      >
        <!-- 直播标题 -->
        <div class="form-group">
          <label for="liveTitle">直播标题</label>
          <input
            id="liveTitle"
            type="text"
            v-model="form.title"
            placeholder="请输入直播标题"
            style="width: 300px"
          />
        </div>

        <!-- 直播日期 -->
        <div class="form-group">
          <label for="date">直播日期：</label>
          <input
            id="date"
            type="date"
            v-model="form.date"
            class="input medium-input"
            style="width: 300px"
          />
        </div>

        <!-- 分区选择 -->
        <div class="form-group">
          <label for="category">直播分区</label>
          <select
            id="category"
            v-model="form.category"
            style="width: 300px"
          >
            <option
              v-for="category in categories"
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </select>
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
              :src="form.cover || placeholderCover"
              alt="封面预览"
            />
            <button
              type="button"
              @click="triggerCoverUpload"
            >
              上传封面
            </button>
          </div>
        </div>

        <!-- 直播权限 -->
        <!-- <div class="form-group">
                      <label>直播权限</label>
                      <div class="radio-group">
                          <label style="display: flex;">
                              <input type="radio" value="public" v-model="form.permission" />
                              公开
                          </label>
                          <label style="display: flex;">
                              <input type="radio" value="private" v-model="form.permission" />
                              私密
                          </label>
                      </div>
                  </div> -->

        <!-- 保存按钮 -->
        <div class="form-actions">
          <button type="submit">保存</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 表单数据
const form = ref({
  title: '',
  category: '',
  date: '',
  cover: '',
  permission: 'public',
});

// 分区选项
const categories = ['游戏', '音乐', '科技', '生活', '娱乐'];

// 占位封面
const placeholderCover = 'https://via.placeholder.com/200x120?text=直播封面';

// 保存设置
const saveSettings = () => {
  console.log('开播设置已保存：', form.value);
  alert('设置已保存！');
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
  const input = document.getElementById('coverInput') as HTMLInputElement;
  input?.click();
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

    .setup-form {
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
      }

      .form-actions {
        text-align: center;

        button {
          padding: 10px 20px;
          font-size: 16px;
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
    }
  }
}
</style>
