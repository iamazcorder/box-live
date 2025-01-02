<template>
  <div class="message-center">
    <!-- 消息区域 -->
    <div class="main-content">
      <!-- 左侧：消息列表 -->
      <div class="message-list">
        <div class="list-title">我的消息</div>
        <ul>
          <li
            v-for="(msg, index) in messages"
            :key="index"
            :class="{ selected: selectedMessage === index }"
            @click="selectMessage(index)"
          >
            <img
              :src="msg.avatar"
              alt="头像"
              class="avatar"
            />
            <div class="msg-details">
              <p class="msg-title">{{ msg.title }}</p>
              <p class="msg-preview">{{ msg.preview }}</p>
            </div>
          </li>
        </ul>
      </div>

      <!-- 右侧：消息详情 -->
      <div class="message-detail">
        <div class="detail-title">{{ selectedMessageData.title }}</div>
        <div class="detail-content">
          <!-- 循环展示每条消息 -->
          <div
            v-for="(content, index) in selectedMessageData.contents"
            :key="index"
            class="content-item"
            :class="{ 'is-sent': content.isSent }"
          >
            <p class="content-time">{{ content.time }}</p>
            <div class="content-wrapper">
              <img
                v-if="!content.isSent"
                :src="content.avatar"
                alt="头像"
                class="avatar"
              />
              <div class="content-body">
                <p
                  class="content-text"
                  v-html="content.text"
                ></p>
              </div>
            </div>
          </div>
        </div>

        <!-- 消息输入框 -->
        <div class="message-input">
          <!-- 左侧功能按钮 -->
          <div class="input-actions">
            <button class="action-btn">
              <img
                src="https://via.placeholder.com/20"
                alt="图片"
              />
            </button>
            <button class="action-btn">
              <img
                src="https://via.placeholder.com/20"
                alt="表情"
              />
            </button>
          </div>

          <!-- 输入框 -->
          <div class="input-area">
            <input
              type="text"
              v-model="inputMessage"
              placeholder="请输入消息..."
              maxlength="500"
            />
          </div>

          <!-- 右侧发送按钮 -->
          <div class="send-area">
            <span class="char-counter">{{ inputMessage.length }}/500</span>
            <button
              class="send-btn"
              @click="sendMessage"
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 消息列表数据
const messages = [
  {
    avatar: 'https://via.placeholder.com/40',
    title: '哔哩哔哩数字周边',
    preview: '收藏集免费开...',
  },
  {
    avatar: 'https://via.placeholder.com/40',
    title: '邹艾伦Alan',
    preview: '[图片]',
  },
  {
    avatar: 'https://via.placeholder.com/40',
    title: '烧鸭TV',
    preview: 'Hello大家好，我是Zoey...',
  },
];

const selectedMessage = ref(0);

// 消息详情数据
const selectedMessageData = ref({
  title: '烧鸭TV',
  contents: [
    {
      text: '这里，没有套路，只有学习干货！\n\n我们主要和大家分享雅思、四六级考试硬核干货/英语能力提升方法/中英文化差异。希望我们的分享能让你收获长知识。大家如果有其他英语学习方面的需要，也可以和我们说哦~\n\n如果您想联系到我们或者有课程需求，可以去公众号：烧鸭TV 找我们玩哦~',
      time: '2024年4月26日 20:00',
      avatar: 'https://via.placeholder.com/40',
      isSent: false,
    },
    {
      text: "Hello大家好，我是Zoey。很多同学期待的“四六级听读双门”真题解析课，终于上线啦！这次和B站联合推出的这门课，将由我手把手全程带着大家进行最新23.12月全三套真题听力和阅读部分的训练，依然“只讲干货，没有套路”！带你快速get考试核心内容，一次上岸！欢迎来试听~<br/><br/>四级课程地址：<a href='#'>网课链接</a><br/>六级课程地址：<a href='#'>网课链接</a>",
      time: '2024年4月26日 20:01',
      avatar: 'https://via.placeholder.com/40',
      isSent: false,
    },
    {
      text: "Hello大家好，我是Zoey。很多同学期待的“四六级听读双门”真题解析课，终于上线啦！这次和B站联合推出的这门课，将由我手把手全程带着大家进行最新23.12月全三套真题听力和阅读部分的训练，依然“只讲干货，没有套路”！带你快速get考试核心内容，一次上岸！欢迎来试听~<br/><br/>四级课程地址：<a href='#'>网课链接</a><br/>六级课程地址：<a href='#'>网课链接</a>",
      time: '2024年4月26日 20:01',
      avatar: 'https://via.placeholder.com/40',
      isSent: false,
    },
    {
      text: "Hello大家好，我是Zoey。很多同学期待的“四六级听读双门”真题解析课，终于上线啦！这次和B站联合推出的这门课，将由我手把手全程带着大家进行最新23.12月全三套真题听力和阅读部分的训练，依然“只讲干货，没有套路”！带你快速get考试核心内容，一次上岸！欢迎来试听~<br/><br/>四级课程地址：<a href='#'>网课链接</a><br/>六级课程地址：<a href='#'>网课链接</a>",
      time: '2024年4月26日 20:01',
      avatar: 'https://via.placeholder.com/40',
      isSent: false,
    },
  ],
});

const selectMessage = (index: number) => {
  selectedMessage.value = index;
  selectedMessageData.value = {
    title: messages[index].title,
    contents: [
      {
        text: '这里，没有套路，只有学习干货！\n\n我们主要和大家分享雅思、四六级考试硬核干货/英语能力提升方法/中英文化差异。希望我们的分享能让你收获长知识。大家如果有其他英语学习方面的需要，也可以和我们说哦~\n\n如果您想联系到我们或者有课程需求，可以去公众号：烧鸭TV 找我们玩哦~',
        time: '2024年4月26日 20:00',
        avatar: 'https://via.placeholder.com/40',
        isSent: false,
      },
      {
        text: "Hello大家好，我是Zoey。很多同学期待的“四六级听读双门”真题解析课，终于上线啦！这次和B站联合推出的这门课，将由我手把手全程带着大家进行最新23.12月全三套真题听力和阅读部分的训练，依然“只讲干货，没有套路”！带你快速get考试核心内容，一次上岸！欢迎来试听~<br/><br/>四级课程地址：<a href='#'>网课链接</a><br/>六级课程地址：<a href='#'>网课链接</a>",
        time: '2024年4月26日 20:01',
        avatar: 'https://via.placeholder.com/40',
        isSent: false,
      },
    ],
  };
};

// 消息输入框数据
const inputMessage = ref('');

const sendMessage = () => {
  if (!inputMessage.value.trim()) return;

  // 添加新消息到列表
  selectedMessageData.value.contents.push({
    text: inputMessage.value,
    time: new Date().toLocaleString(),
    avatar: '',
    isSent: true,
  });

  inputMessage.value = '';
};
</script>

<style lang="scss" scoped>
.message-center {
  display: flex;
  justify-content: center;
  /* align-items: center; */
  height: 92vh;
  background: #f5f6fa;
  font-family: Arial, sans-serif;

  /* 主内容区域 */
  .main-content {
    display: flex;
    width: 80%;
    background: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    .message-list {
      width: 300px;
      background: #fff;
      border-right: 1px solid #e9eaec;

      .list-title {
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        font-weight: bold;
        border-bottom: 1px solid #e9eaec;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          display: flex;
          align-items: center;
          padding: 10px 10px 10px 20px;
          cursor: pointer;
          transition: background 0.3s;

          &:hover {
            background: #f0f0f0;
          }

          &.selected {
            background: #f0f0f0;
          }

          .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
          }

          .msg-details {
            .msg-title {
              font-size: 14px;
              font-weight: bold;
              margin: 0;
            }

            .msg-preview {
              font-size: 12px;
              color: #666;
              margin: 0;
            }
          }
        }
      }
    }

    .message-detail {
      flex: 1;
      max-height: 92vh;
      display: flex;
      flex-direction: column;
      background: #fff;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 0;
      overflow: hidden;

      .detail-title {
        font-size: 16px;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
        border-bottom: 1px solid #e9eaec;
      }

      .detail-content {
        flex: 1;
        overflow-y: auto;
        background: #f4f5f7;
        padding-left: 20px;

        .content-item {
          margin-bottom: 20px;

          .content-time {
            text-align: center;
            font-size: 12px;
            color: #999;
            margin-bottom: 10px;
          }

          &.is-sent {
            display: flex;
            justify-content: flex-end;
          }

          .content-wrapper {
            display: flex;
            align-items: flex-start;
            max-width: 80%;

            .avatar {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              margin-right: 10px;
            }

            .content-body {
              background: #f9f9f9;
              border-radius: 8px;
              padding: 10px 15px;
              font-size: 14px;
              line-height: 1.5;

              &.is-sent {
                background: #d4f1f4;
              }

              .content-text {
                white-space: pre-wrap;
              }
            }
          }
        }
      }

      .message-input {
        background: #f9f9f9;
        border: 1px solid #e6e6e6;
        padding: 10px 15px;
        gap: 10px;

        .input-actions {
          display: flex;
          gap: 10px;

          .action-btn {
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #e6e6e6;
            border-radius: 6px;
            background: #fff;
            cursor: pointer;

            img {
              width: 20px;
              height: 20px;
            }

            &:hover {
              background: #f0f0f0;
            }
          }
        }

        .input-area {
          flex: 1;

          input {
            width: 100%;
            height: 40px;
            border: none;
            outline: none;
            font-size: 14px;
            background: transparent;
          }
        }

        .send-area {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 5px;

          .char-counter {
            font-size: 12px;
            color: #999;
          }

          .send-btn {
            background: #007bff;
            color: #fff;
            border: none;
            border-radius: 6px;
            padding: 5px 15px;
            font-size: 14px;
            cursor: pointer;

            &:hover {
              background: #0056b3;
            }

            &:disabled {
              background: #ccc;
              cursor: not-allowed;
            }
          }
        }
      }
    }
  }
}
</style>
