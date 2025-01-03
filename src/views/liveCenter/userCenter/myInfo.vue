<template>
  <div class="personal-info-page">
    <!-- 页面标题 -->
    <div class="page-title">个人信息</div>

    <!-- 表单 -->
    <form
      class="info-form"
      @submit.prevent="handleSave"
    >
      <!-- 头像信息 -->
      <div class="form-group avatar-group">
        <label>头像：</label>
        <div
          class="avatar-container"
          @mouseover="hover = true"
          @mouseleave="hover = false"
        >
          <Avatar
            :url="userStore.userInfo?.avatar"
            :name="userStore.userInfo?.username"
            :size="80"
          ></Avatar>
          <div
            class="hover-overlay"
            v-if="hover"
          >
            <span>更换头像</span>
            <input
              type="file"
              accept="image/*"
              class="file-input"
              @change="handleAvatarChange"
            />
          </div>
        </div>
      </div>

      <!-- 昵称 -->
      <div class="form-group">
        <label for="nickname">昵称：</label>
        <input
          id="nickname"
          type="text"
          v-model="nickname"
          class="input short-input"
          placeholder="请输入昵称"
        />
      </div>

      <!-- 用户名 -->
      <div class="form-group">
        <label for="username">用户id：</label>
        <span class="text-display">{{ username }}</span>
      </div>

      <!-- 签名 -->
      <div class="form-group">
        <label for="signature">我的签名：</label>
        <textarea
          id="signature"
          v-model="signature"
          class="textarea long-textarea"
          placeholder="设置您的签名~"
        ></textarea>
      </div>

      <!-- 性别 -->
      <div class="form-group">
        <label>性别：</label>
        <div class="gender-group">
          <button
            v-for="option in genderOptions"
            :key="option.value"
            class="gender-item"
            :class="['gender-btn', { active: gender === option.value }]"
            @click.prevent="gender = option.value"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <!-- 出生日期 -->
      <div class="form-group">
        <label for="birthday">出生日期：</label>
        <input
          id="birthday"
          type="date"
          v-model="birthday"
          class="input medium-input"
        />
      </div>

      <!-- 保存按钮 -->
      <div class="form-actions">
        <button
          type="submit"
          class="save-btn"
        >
          保存
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user';
import { ref } from 'vue';

const userStore = useUserStore();
// 表单数据
const avatar = ref('https://via.placeholder.com/80'); // 默认头像
const nickname = ref('zxj');
const username = ref('80986528243');
const signature = ref('');
const gender = ref('female');
const birthday = ref('2003-04-24');

// 性别选项
const genderOptions = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' },
];

// 是否悬停在头像上
const hover = ref(false);

// 处理头像更换
const handleAvatarChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      avatar.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

// 保存表单
const handleSave = () => {
  alert('保存成功！');
};
</script>

<style lang="scss" scoped>
.personal-info-page {
  background: #f5f6fa;

  .page-title {
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
  }

  .info-form {
    background: #fff;
    border: 1px solid #e3e8ec;
    border-radius: 12px;
    padding: 20px 10px;

    .form-group {
      margin-bottom: 20px;
      display: flex;
      align-items: center;

      label {
        width: 100px;
        font-size: 14px;
        color: #606266;
        text-align: right;
        margin-right: 10px;
      }

      .avatar-group {
        .avatar-container {
          position: relative;
          display: inline-block;
          width: 80px;
          height: 80px;
          border-radius: 50%;

          .avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            border: 1px solid #e6e6e6;
          }

          .hover-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            border-radius: 50%;
            cursor: pointer;
          }

          .file-input {
            position: absolute;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
          }
        }
      }

      .gender-item {
        margin-right: 20px;
        padding: 5px 8px;
        border: 1px solid #bfcbd9;
        border-radius: 5px !important;
        background: #f4f4f4;
        color: #717171;
        cursor: pointer;

        &:hover {
          background: #b6b5b5;
        }
      }

      .input,
      .textarea {
        height: 30px;
        padding: 0 12px;
        font-size: 14px;
        border: 1px solid #e6e6e6;
        border-radius: 4px;
        outline: none;
        color: #333;

        &:focus {
          border-color: #ffd700;
        }
      }

      .short-input {
        width: 200px;
      }

      .medium-input {
        width: 300px;
      }

      .textarea {
        height: 80px;
        resize: none;
      }

      .long-textarea {
        width: 400px;
      }

      .text-display {
        color: #333;
        font-size: 14px;
        line-height: 38px;
      }

      .note {
        font-size: 12px;
        color: #999;
        margin-left: 10px;
      }
    }

    .form-actions {
      text-align: center;

      .save-btn {
        padding: 10px 20px;
        font-size: 14px;
        background: #ffd700;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;

        &:hover {
          background: #d9b901;
        }
      }
    }
  }
}
</style>
