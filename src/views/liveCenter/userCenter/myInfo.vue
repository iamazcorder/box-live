<template>
  <div class="personal-info-page">
    <!-- 页面标题 -->
    <div class="page-title">个人信息</div>

    <!-- 表单 -->
    <form
      class="info-form"
      @submit.prevent="handleSave"
    >
      <!-- 头像 -->
      <div class="form-group">
        <label for="username">头像：</label>
        <Avatar
          :url="avatar"
          :size="80"
          :enableAvatarChange="true"
        >
        </Avatar>
      </div>
      <!-- 用户名 -->
      <div class="form-group">
        <label for="username">用户名：</label>
        <input
          id="username"
          type="text"
          v-model="username"
          class="input short-input"
          placeholder="请输入用户名"
        />
      </div>

      <!-- 签名 -->
      <div class="form-group">
        <label for="desc">我的签名：</label>
        <textarea
          id="desc"
          v-model="desc"
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
            :class="[
              'gender-btn',
              { 'gender-active': gender === option.value },
            ]"
            @click.prevent="gender = option.value"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <!-- 出生日期 -->
      <div class="form-group">
        <label for="birth_date">出生日期：</label>
        <!-- <input id="birth_date" type="date" v-model="birth_date" class="input medium-input" /> -->
        <el-date-picker
          v-model="birth_date"
          type="date"
          placeholder="请选择出生日期"
          :clearable="true"
          format="YYYY-MM-DD"
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
import { updateUserInfo } from '@/api/user';
import { useUserStore } from '@/store/user';
import { ElDatePicker } from 'element-plus';
import { onMounted, ref, watch } from 'vue';

const userStore = useUserStore();

// 表单数据，默认从 userStore 中获取数据
const username = ref();
const desc = ref();
const gender = ref();
const birth_date = ref();
const avatar = ref();

watch(
  () => userStore.userInfo?.id,
  () => {
    handleUserInfo();
  }
);

onMounted(() => {
  handleUserInfo();
});

const handleUserInfo = () => {
  avatar.value = userStore.userInfo?.avatar || '';
  username.value = userStore.userInfo?.username || '';
  desc.value = userStore.userInfo?.desc || '';
  gender.value = userStore.userInfo?.gender || 'other';
  console.log(userStore.userInfo?.gender, '???');
  birth_date.value =
    userStore.userInfo?.birth_date && new Date(userStore.userInfo?.birth_date);
};

// 性别选项
const genderOptions: { value: 'male' | 'female' | 'other'; label: string }[] = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' },
  { value: 'other', label: '保密' },
];

// 提交表单并调用接口保存更新的数据
const handleSave = async () => {
  const updatedUserInfo = {
    id: userStore.userInfo?.id,
    username: username.value,
    desc: desc.value,
    gender: gender.value,
    birth_date: birth_date.value,
  };

  try {
    const res = await updateUserInfo(updatedUserInfo);
    if (res.code === 200) {
      window.$message.success('保存成功！');
      // 更新 store 中的用户信息
      userStore.setUserInfo(updatedUserInfo);
    } else {
      window.$message.error('保存失败，请重试');
    }
  } catch (error) {
    console.error('保存用户信息时发生错误:', error);
    window.$message.error('保存失败，请重试');
  }
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
    min-height: 580px;

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
      }

      .gender-active {
        background-color: #ffd700;
        color: #fff;
        border: none;
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

        &:focus {
          border-color: #ffd700;
          outline: none;
        }
      }

      .textarea {
        height: 80px;
        resize: none;
        /* padding: 12px; */
      }

      .long-textarea {
        width: 400px;
        padding: 12px;
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
