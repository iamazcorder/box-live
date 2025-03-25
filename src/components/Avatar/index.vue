<template>
  <div
    class="avatar-wrap"
    :style="{ '--width': size + 'px' }"
  >
    <div class="cycle-wrap">
      <!-- 如果有 URL，则使用该 URL 作为背景图片 -->
      <div
        v-if="url && url !== ''"
        class="avatar"
        :style="{ backgroundImage: `url(${url})` }"
        @click="enableAvatarChange && changeAvatar()"
      >
        <div
          v-if="enableAvatarChange"
          class="overlay"
        >
          <span class="change-avatar-text">更换头像</span>
        </div>
      </div>
      <!-- 如果没有 URL，则使用默认头像 -->
      <div
        v-else
        class="avatar default"
        @click="enableAvatarChange && changeAvatar()"
      >
        <div
          v-if="enableAvatarChange"
          class="overlay"
        >
          <span class="change-avatar-text">更换头像</span>
        </div>
      </div>
      <template v-if="living && !disableLiving">
        <div class="cycle cycle-1"></div>
        <div class="cycle cycle-2"></div>
        <div class="cycle cycle-3"></div>
      </template>
    </div>

    <div
      class="live-ani"
      v-if="isLive"
    >
      <div class="a-cycle a-cycle-1"></div>
      <div class="a-cycle a-cycle-2"></div>
      <div class="a-cycle a-cycle-3"></div>
      <div class="living-tips">
        <div class="b-img">
          <img
            src="https://i0.hdslb.com/bfs/static/jinkela/space/asserts/live.gif@48h.avif"
            class="b-img__inner"
          />
        </div>
        <div class="living-text">直播中</div>
      </div>
    </div>
    <!-- 隐藏文件选择框 -->
    <input
      type="file"
      ref="fileInput"
      class="file-input"
      @change="handleFileChange"
    />

    <!-- <div class="border"></div> -->
  </div>
</template>

<script lang="ts" setup>
import { uploadAvatar } from '@/api/user';
import { useUserStore } from '@/store/user';
import { ref } from 'vue';

const userStore = useUserStore();

// 通过 defineEmits 定义一个事件发送到父组件
const emit = defineEmits<{
  (event: 'avatarUpdated', avatarUrl: string): void;
}>();

withDefaults(
  defineProps<{
    url?: string;
    name?: string;
    size: number;
    living?: boolean;
    disableLiving?: boolean;
    enableAvatarChange?: boolean; // 新增的属性
    isLive?: boolean;
  }>(),
  {
    url: '',
    name: '',
    size: 100,
    living: false,
    disableLiving: false,
    enableAvatarChange: false, // 默认为禁用
    isLive: false,
  }
);

// 文件输入框的引用
const fileInput = ref<HTMLInputElement | null>(null);

// 头像更换方法
const changeAvatar = () => {
  if (fileInput.value) {
    console.log(fileInput.value);
    fileInput.value.click();
  }
};

// 处理文件选择后的逻辑
const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (file) {
    try {
      const res = await uploadAvatar(file, userStore.userInfo?.id);
      if (res.code === 200) {
        const avatarUrl = res.data.avatarUrl;
        console.log('头像更新成功:', res.data.avatarUrl);
        // 通知父组件更新头像
        emit('avatarUpdated', avatarUrl);
      } else {
        console.error('上传头像失败');
      }
    } catch (error) {
      console.error('上传头像时发生错误', error);
    }
  }
};
</script>
<style lang="scss" scoped>
.avatar-wrap {
  position: relative;

  .cycle-wrap {
    position: relative;
    width: var(--width);
    height: var(--width);

    .avatar {
      display: inline-block;
      box-sizing: border-box;
      margin: 0 auto;
      width: var(--width);
      height: var(--width);
      border-radius: 50%;
      cursor: pointer;
      position: relative;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      transition: all 0.3s ease-in-out;

      @extend %coverBg;

      &.default {
        background-color: white;
        border: 1px solid $theme-color-gold;
        background-image: url('@/assets/img/default-avatar.png');
        background-size: 70% !important;
        background-position: center;
        background-repeat: no-repeat;
      }

      /* 更换头像的透明灰色覆盖层 */
      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
        /* 灰色透明层 */
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
        z-index: 1;
        /* 保证透明层在头像层之下 */
      }

      /* 鼠标悬停时显示更换头像文字 */
      &:hover .overlay {
        opacity: 1;
      }

      .change-avatar-text {
        color: white;
        /* 字体始终保持为白色，不受透明层影响 */
        font-size: 14px;
        z-index: 2;
        /* 确保文字显示在透明层的上面 */
      }
    }

    .cycle {
      position: absolute;
      top: 0;
      left: 0;
      width: var(--width);
      height: var(--width);
      border: 1px solid $theme-color-gold;
      border-radius: 50%;
      animation: scaleCycle 1.5s linear infinite;

      &.cycle-1 {
        animation-delay: 0;
      }

      &.cycle-2 {
        animation-delay: 0.5s;
      }

      &.cycle-3 {
        animation-delay: 1s;
      }
    }
  }

  .live-ani {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  .a-cycle {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    border: 1px solid #ff6699;
    border-radius: 50%;
    opacity: 0;
    animation: scaleUpCircle-a4ffffab 1.5s linear;
    animation-iteration-count: infinite;
  }

  .a-cycle-1 {
    animation-delay: 0;
  }

  .a-cycle-2 {
    animation-delay: 0.5s;
  }

  .a-cycle-3 {
    animation-delay: 1s;
  }

  .living-tips {
    position: absolute;
    z-index: 1;
    bottom: 0;
    left: 50%;
    transform: translate(-50%);
    display: flex;
    align-items: center;
    padding: 0 2px 0 4px;
    color: #ffffff;
    height: 18px;
    font-size: 12px;
    white-space: nowrap;
    background-color: #ff6699;
    border-radius: 21px;
    border: 1px solid #ffffff;
  }

  .b-img {
    margin-right: -1px;
    margin-top: -3px;
    flex: none;
    width: 12px;
    height: 12px;
    background-color: transparent;

    img {
      vertical-align: top;
      overflow-clip-margin: content-box;
      overflow: clip;
    }

    .b-img__inner {
      width: 100%;
      height: 100%;
      display: inline-block;
      vertical-align: middle;
    }
  }

  .living-text {
    transform: scale(0.8333);
  }

  @keyframes scaleUpCircle-a4ffffab {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }

    100% {
      transform: translate(-50%, -50%) scale(1.5);
      opacity: 0;
    }
  }

  /* 隐藏文件选择框 */
  .file-input {
    display: none;
  }
}
</style>
