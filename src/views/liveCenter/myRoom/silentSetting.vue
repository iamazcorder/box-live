<template>
  <div class="mute-setting-page">
    <!-- 页面标题 -->
    <div class="page-title">禁言设置</div>

    <!-- 白底框 -->
    <div class="tab-container">
      <!-- 选项卡 -->
      <div class="tabs">
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          :class="['tab', { active: selectedTab === index }]"
          @click="selectTab(index)"
        >
          {{ tab }}
        </div>
      </div>

      <!-- 当前选项卡内容 -->
      <div
        v-if="selectedTab === 0"
        class="tab-content"
      >
        <!-- 输入框和提交按钮 -->
        <div class="input-group">
          <input
            v-model="inputValue"
            type="text"
            placeholder="请输入 UID 或用户名"
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
        <p class="description">被禁言的用户永久无法在此直播间发言</p>

        <!-- 表格 -->
        <table class="mute-table">
          <thead>
            <tr>
              <th>被禁言用户</th>
              <th>操作者</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="muteList.length === 0">
              <td
                colspan="3"
                class="empty"
              >
                暂无被禁言用户
              </td>
            </tr>
            <tr
              v-for="(user, index) in muteList"
              :key="index"
            >
              <td>{{ user.username }}</td>
              <td>{{ user.operator }}</td>
              <td>
                <button
                  class="action-btn"
                  @click="removeUser(index)"
                >
                  解除禁言
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="selectedTab === 1"
        class="tab-content"
      >
        <p class="empty-message">全局禁言功能暂未实现</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 选项卡
const tabs = ref(['禁言名单管理', '全局禁言']);
const selectedTab = ref(0);

// 输入框的值
const inputValue = ref('');

// 禁言用户列表
const muteList = ref<{ username: string; operator: string }[]>([]);

// 选中选项卡
const selectTab = (index: number) => {
  selectedTab.value = index;
};

// 提交禁言用户
const handleSubmit = () => {
  if (inputValue.value.trim()) {
    muteList.value.push({
      username: inputValue.value,
      operator: '管理员', // 示例操作人
    });
    inputValue.value = '';
  }
};

// 移除禁言用户
const removeUser = (index: number) => {
  muteList.value.splice(index, 1);
};
</script>

<style lang="scss" scoped>
.mute-setting-page {
  background: #f5f6fa;

  .page-title {
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
  }

  .tab-container {
    background: #fff;
    border: 1px solid #e3e8ec;
    border-radius: 12px;

    .tabs {
      display: flex;
      margin-bottom: 20px;
      border-bottom: 1px solid #e3e8ec;
      padding: 10px 0 0 30px;

      .tab {
        padding: 10px 20px;
        font-size: 14px;
        cursor: pointer;
        color: #333;
        border-bottom: 2px solid transparent;
        transition: all 0.2s;

        &.active {
          color: #ffd700;
          font-weight: bold;
          border-bottom: 2px solid #ffd700;
        }
      }
    }

    .tab-content {
      padding: 0 30px 30px 30px;

      .input-group {
        display: flex;
        align-items: center;
        margin-bottom: 20px;

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

      .mute-table {
        width: 100%;
        border-collapse: collapse;

        th {
          background: #f5f6fa;
          padding: 12px;
          font-size: 14px;
          color: #666;
          text-align: left;
          border-bottom: 1px solid #e3e8ec;
        }

        td {
          padding: 12px;
          font-size: 14px;
          color: #333;
          border-bottom: 1px solid #e3e8ec;

          &.empty {
            text-align: center;
            color: #999;
          }
        }

        .action-btn {
          background: #f5f6fa;
          border: 1px solid #e6e6e6;
          padding: 5px 10px;
          font-size: 14px;
          color: #007bff;
          border-radius: 4px;
          cursor: pointer;

          &:hover {
            background: #e6f7ff;
          }
        }
      }

      .empty-message {
        text-align: center;
        color: #999;
        font-size: 14px;
      }
    }
  }
}
</style>
