<template>
  <div class="rank-container">
    <!-- 折叠状态 -->
    <div
      v-if="!expanded"
      class="collapsed-rank"
    >
      <div class="top3-list">
        <div
          v-for="(item, index) in fakeRankList.slice(0, 3)"
          :key="item.value?.user_id"
          class="rank-item"
        >
          <img
            :src="item.value.user_avatar"
            class="avatar"
          />
          <div class="right">
            <div class="rank-badge">榜{{ index + 1 }}</div>
            <div class="username">{{ item.value.user_username }}</div>
          </div>
        </div>
      </div>
      <div
        class="toggle-btn"
        @click="toggleExpanded"
      >
        <div class="ico downArrow"></div>
      </div>
    </div>

    <!-- 展开状态 -->
    <div
      v-else
      class="expanded-rank"
    >
      <!-- Tab 头部 -->
      <div class="tab-header">
        <span
          v-for="tab in tabs"
          :key="tab.value"
          :class="['tab-item', { active: currentTab === tab.value }]"
          @click="changeTab(tab.value)"
        >
          {{ tab.label }}
        </span>
      </div>

      <!-- 🔥 不同Tab的 "operate" 内容 -->
      <div class="operate">
        <div class="tip-desc">
          {{ currentOperate.tipText }}
          <div
            class="ico tip"
            @click="toggleModal"
          ></div>
        </div>
        <div class="switch">
          {{ currentOperate.switchText }}
          <div class="ico switch"></div>
        </div>
      </div>

      <!-- 排行榜列表 -->
      <div class="rank-list">
        <div
          v-for="(item, index) in fakeRankList"
          :key="item.value?.user_id"
          class="rank-list-item"
        >
          <div class="rank-list-item-info">
            <span class="rank-number">
              <span
                v-if="index < 3"
                class="rank-number-top3"
                >{{ `榜${index + 1}` }}</span
              >
              <span v-else>{{ index + 1 }}</span>
            </span>
            <img
              :src="item.value?.user_avatar"
              class="avatar"
            />
            <span class="username">{{ item.value?.user_username }}</span>
          </div>
          <span class="contribution">{{ item.value?.score }}</span>
        </div>
      </div>

      <!-- 当前用户信息 -->
      <div class="current-user">
        <div class="rank-number">-</div>
        <img
          :src="currentUser.value?.user_avatar"
          class="avatar"
        />
        <div class="contribution">
          <div style="margin-left: -5px; margin-bottom: 3px">
            贡献值：{{ currentUser.value?.score }}
          </div>
          <div>快来投喂吧～</div>
        </div>
      </div>

      <!-- 折叠按钮 -->
      <div
        class="toggle-btn"
        @click="toggleExpanded"
      >
        <div class="ico upArrow"></div>
      </div>

      <!-- 🔥 弹窗（不同 Tab 下内容不同） -->
      <div
        v-if="showModal"
        class="modal-overlay"
      >
        <div class="modal">
          <div class="modal-header">
            <span>{{ currentOperate.modalTitle }}</span>
            <button
              class="close-btn"
              @click="toggleModal"
            >
              ×
            </button>
          </div>
          <div class="modal-content">
            <div
              v-for="(section, index) in currentOperate.modalContent"
              :key="index"
            >
              <div class="title">{{ section.title }}</div>
              <div
                v-for="text in section.texts"
                :key="text"
                class="text"
              >
                {{ text }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';

const expanded = ref(false);
const showModal = ref(false);
const currentTab = ref('online');

// Tab 配置
const tabs = [
  { label: '在线榜', value: 'online' },
  { label: '日榜', value: 'daily' },
  { label: '周榜', value: 'weekly' },
  { label: '月榜', value: 'monthly' },
];

const fakeRankList = [
  {
    created_at: 1741276642463,
    client_ip: '',
    value: {
      live_room_id: 14,
      live_room_name: '',
      user_id: 11,
      user_username: '杰克小兔',
      user_avatar:
        'https://i1.hdslb.com/bfs/face/72fafe063819f7ebc77d37353c8aa12e085e488b.jpg',
      score: '32',
    },
  },
  {
    created_at: 1741276642463,
    client_ip: '',
    value: {
      live_room_id: 21,
      live_room_name: '',
      user_id: 18,
      user_username: '福气小柴',
      user_avatar:
        'https://i0.hdslb.com/bfs/face/292443231d7adfdcffdede646b9f6ede0bdb16ac.jpg',
      score: '20',
    },
  },
  {
    created_at: 1741276642463,
    client_ip: '',
    value: {
      live_room_id: 19,
      live_room_name: '',
      user_id: 18,
      user_username: 'zxyy',
      user_avatar: 'http://localhost:8080/img/avatar4.webp',
      score: '12',
    },
  },
  {
    created_at: 1741276642463,
    client_ip: '',
    value: {
      live_room_id: 14,
      live_room_name: '',
      user_id: 18,
      user_username: 'zxj',
      user_avatar: 'http://localhost:8080/img/cover1.jpg',
      score: '5',
    },
  },
];
const currentUser = {
  created_at: 1741276642463,
  client_ip: '',
  value: {
    live_room_id: 14,
    live_room_name: '',
    user_id: 18,
    user_username: 'zxj',
    user_avatar: 'http://localhost:8080/img/cover1.jpg',
    score: '3',
  },
};

// **动态操作内容（不同 Tab 显示不同文案）**
const operateContents = {
  online: {
    tipText: '投喂、发弹幕均可获得贡献值',
    switchText: '贡献值',
    modalTitle: '在线榜单说明',
    modalContent: [
      {
        title: '一、排序规则',
        texts: [
          '1、根据主播本场直播在线用户的贡献值由高至低排序。',
          '2观众点赞30次/发弹幕10条/观看15分/送出1电池礼物，均有机会获得1点榜单贡献值。',
        ],
      },
      {
        title: '二、特别提醒',
        texts: [
          '此列表仅展示当前在直播间内用户互动情况，若离开直播间或退出重进后，列表信息会发生变化请点击打开在线观众列表了解当前排名。',
        ],
      },
    ],
  },
  daily: {
    tipText: '每日榜单基于用户贡献',
    switchText: '昨日贡献值',
    modalTitle: '贡献榜说明',
    modalContent: [
      {
        title: '一、榜单规则',
        texts: ['1、统计昨日 00:00 - 23:59 贡献值', '2、榜单次日00:00刷新'],
      },
      { title: '二、奖励规则', texts: ['每日榜前3名将获得特殊称号'] },
    ],
  },
  weekly: {
    tipText: '每周榜单统计整周贡献值',
    switchText: '本周贡献值',
    modalTitle: '周榜说明',
    modalContent: [
      {
        title: '一、榜单规则',
        texts: ['1、统计本周一 00:00 至当前贡献值', '2、榜单每周一00:00刷新'],
      },
      { title: '二、奖励规则', texts: ['周榜前5名将获得特别奖励'] },
    ],
  },
  monthly: {
    tipText: '每月榜单统计整月贡献值',
    switchText: '本月贡献值',
    modalTitle: '月榜说明',
    modalContent: [
      {
        title: '一、榜单规则',
        texts: ['1、统计本月1号 00:00 至当前贡献值', '2、榜单每月1号00:00刷新'],
      },
      { title: '二、奖励规则', texts: ['月榜前10名可获得专属特效'] },
    ],
  },
};

// **根据当前 Tab 获取不同内容**
const currentOperate = computed(() => operateContents[currentTab.value]);

// 切换 Tab
const changeTab = (tab: string) => {
  currentTab.value = tab;
};

// 切换弹窗
const toggleModal = () => {
  showModal.value = !showModal.value;
};

// 展开/折叠排行榜
const toggleExpanded = () => {
  expanded.value = !expanded.value;
};
</script>
<style lang="scss" scoped>
.ico {
  width: 15px;
  height: 15px;
  opacity: 0.9;

  &.upArrow {
    @include setBackground('@/assets/img/upArrow.png');
  }

  &.downArrow {
    @include setBackground('@/assets/img/downArrow.png');
  }

  &.tip {
    width: 14px;
    height: 14px;
    cursor: pointer;
    margin-left: 3px;
    @include setBackground('@/assets/img/tip.png');
  }

  &.switch {
    width: 14px;
    height: 14px;
    cursor: pointer;
    margin-left: 3px;
    @include setBackground('@/assets/img/switch-nowrap.png');
  }
}

.rank-container {
  width: 100%;
  /* max-width: 245px; */
  box-sizing: border-box;
  text-align: center;
  background: #fff;
  padding: 5px 0 10px 0;
  /* border-radius: 10px; */
  /* box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); */
  position: absolute;
  z-index: 99999;
  left: 0;
  /* border: 1px solid red; */
  border-bottom: 1px solid #e3e5e7;
}

/* 折叠状态 */
.collapsed-rank {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .top3-list {
    display: flex;
    width: 100%;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 15px;
  }
}

.rank-item {
  display: flex;
  align-items: center;

  .right {
    display: flex;
    flex-direction: column;
  }
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
  /* margin-top: 3px; */
}

.rank-badge {
  background: #ff7b7b;
  color: white;
  padding: 1px 5px;
  border-radius: 10px;
  font-size: 10px;
  margin-top: 5px;
  width: 25px;
}

.username {
  font-size: 12px;
  /* margin-top: 5px; */
  color: #2f3238;
  margin-left: -2px;
}

/* 展开状态 */
.expanded-rank {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Tab 样式 */
.tab-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 5px 10px;
  box-sizing: border-box;
}

.operate {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #61666d;
  margin: 10px 0;
  padding: 0 10px;
  box-sizing: border-box;

  .tip-desc {
    display: flex;
    align-items: center;
  }

  .switch {
    display: flex;
    align-items: center;
  }
}

.tab-item {
  cursor: pointer;
  padding: 3px 18px;
  color: #61666d;
  border-radius: 34px;
  background-color: #dde2e6;
  font-size: 12px;
  opacity: 0.8;
}

.tab-item.active {
  color: #f69;
  font-weight: 600;
  opacity: 1;
  background-color: #fedee8;
}

/* 排行榜列表 */
.rank-list {
  height: 150px;
  overflow-y: auto;
  width: 100%;
  padding: 0 8px 0 5px;
  box-sizing: border-box;
}

/* 设置滚动条宽度 */
::-webkit-scrollbar {
  width: 6px;
  /* 纵向滚动条的宽度 */
}

/* 滚动条的滑块 */
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  /* 设置滚动条颜色 */
  border-radius: 4px;
  /* 圆角 */
}

.rank-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;

  &-info {
    display: flex;
    align-items: center;
  }
}

.rank-number {
  width: 44px;
  /* height: 16px; */
  line-height: 24px;
  text-align: center;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  font-size: 12px;
  font-weight: 700;
}

.rank-number-top3 {
  background: #ff7b7b;
  color: white;
  padding: 1px 5px;
  border-radius: 10px;
  font-size: 10px;
  margin-top: 5px;
}

.contribution {
  font-size: 12px;
  color: #61666d;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* 当前用户信息 */
.current-user {
  width: 100%;
  text-align: center;
  height: 50px;
  color: #2f3238;
  border-top: 1px solid #e3e5e7;
  display: flex;
  align-items: center;
  padding-left: 5px;
  box-sizing: border-box;
  padding-top: 5px;
}

.current-user p {
  font-size: 12px;
  color: gray;
}

/* 按钮 */
.toggle-btn {
  border-radius: 16px;
  background: #eceff2;
  /* opacity: .2; */
  width: 44px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  cursor: pointer;
}

/* 🔥 🔥 🔥 居中弹窗的样式 🔥 🔥 🔥 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  /* 半透明遮罩 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  /* 确保弹窗在最上层 */
}

.modal {
  background: white;
  width: 320px;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
}

/* 弹窗头部 */
.modal-header {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #000000;
}

.close-btn {
  border: none;
  background: none;
  font-size: 20px;
  cursor: pointer;
}

/* 弹窗内容 */
.modal-content {
  font-size: 14px;
  color: #333;

  .title {
    color: #000000;
    font-size: 16px;
  }

  .text {
    color: #7e8c8d;
    font-size: 16px;
    margin: 10px 0;
  }

  div {
    text-align: left;
  }
}
</style>
