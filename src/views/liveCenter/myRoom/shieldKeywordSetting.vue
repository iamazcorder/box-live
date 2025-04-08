<template>
  <div class="block-words-page">
    <!-- 页面标题 -->
    <div class="page-title">屏蔽词设置</div>

    <VerifyCard
      :audit_info="userStore.auditInfo"
      v-if="userStore.auditInfo?.status !== 1"
    />

    <!-- 白底框 -->
    <div
      class="content-container"
      v-else
    >
      <!-- 输入框和提交按钮 -->
      <div class="input-group">
        <input
          v-model="inputValue"
          type="text"
          placeholder="请输入要屏蔽的内容"
          class="input"
        />
        <button
          :disabled="!inputValue"
          class="submit-btn"
          @click="handleSubmit"
        >
          提交
        </button>
      </div>
      <p class="description">
        包含屏蔽词的弹幕不会出现在直播中，屏蔽词不得超过15个字符
      </p>

      <!-- 屏蔽词列表 -->
      <div class="word-list">
        <p class="list-title">屏蔽列表 ({{ wordList.length }} / 1000)</p>
        <div
          class="word-item"
          v-for="(word, index) in wordList"
          :key="index"
        >
          <span>{{ word }}</span>
          <button
            class="delete-btn"
            @click="removeWord(index)"
          >
            ×
          </button>
        </div>
        <p
          v-if="wordList.length === 0"
          class="empty-message"
        >
          暂无屏蔽词
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user';
import { ref } from 'vue';

const userStore = useUserStore();

// 输入框的值
const inputValue = ref('');

// 屏蔽词列表
const wordList = ref<string[]>(['&amp;', '不要']);

// 添加屏蔽词
const handleSubmit = () => {
  if (inputValue.value.trim() && inputValue.value.length <= 15) {
    wordList.value.push(inputValue.value.trim());
    inputValue.value = '';
  }
};

// 移除屏蔽词
const removeWord = (index: number) => {
  wordList.value.splice(index, 1);
};
</script>

<style lang="scss" scoped>
.block-words-page {
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
    min-height: 580px;

    .input-group {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .input {
        width: 239px;
        height: 25px;
        padding: 2px 8px;
        font-size: 14px;
        border: 1px solid #e6e6e6;
        border-radius: 4px;
        outline: none;
        color: #333;

        &:focus {
          border-color: #ffd700;
        }
      }

      .submit-btn {
        min-width: 104px;
        height: 32px;
        margin-left: 10px;
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

        &:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      }
    }

    .description {
      font-size: 12px;
      color: #666;
      margin-bottom: 20px;
    }

    .word-list {
      .list-title {
        font-size: 14px;
        color: #333;
        margin-bottom: 10px;
      }

      .word-item {
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        /* background: #f5f6fa; */
        padding: 5px 5px 5px 10px;
        margin: 5px;
        border: 1px solid #e3e8ec;
        border-radius: 4px;
        font-size: 14px;
        color: #8d9aa4;

        span {
          margin-right: 8px;
        }

        .delete-btn {
          background: none;
          border: none;
          color: #8d9aa4;
          font-size: 16px;
          cursor: pointer;
          line-height: 1;

          &:hover {
            color: #6b7379;
          }
        }
      }

      .empty-message {
        margin-top: 10px;
        font-size: 14px;
        color: #999;
        text-align: center;
      }
    }
  }
}
</style>
