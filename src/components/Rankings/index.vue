<template>
  <div class="ranking-board">
    <div class="header">
      <div class="title">人气榜</div>
      <div
        class="refresh"
        @click="refreshData"
      >
        <div class="ico refresh"></div>
        刷新
      </div>
    </div>

    <div class="ranking-list">
      <div
        v-for="(item, index) in rankingData"
        :key="item.id"
        class="ranking-item"
      >
        <div class="rank-badge">
          <div
            class="ico one"
            v-if="index === 0"
          ></div>
          <div
            class="ico two"
            v-if="index === 1"
          ></div>
          <div
            class="ico three"
            v-if="index === 2"
          ></div>
          <span v-if="index >= 3">{{ index + 1 }}</span>
        </div>
        <div class="avatar">
          <img
            :src="item.avatar"
            alt="Avatar"
          />
        </div>
        <div class="info">
          <div class="name">{{ item.name }}</div>
          <div class="title">{{ item.title }}</div>
        </div>
        <div class="data">
          <div class="views">
            <div class="ico eye"></div>
            {{ item.views }}
          </div>
          <div class="living-icon p-relative">
            <div class="living-icon-col"></div>
            <div class="living-icon-col"></div>
            <div class="living-icon-col"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

interface RankingItem {
  id: number;
  name: string;
  avatar: string;
  title: string;
  views: number;
}

const activeTab = ref('popularity');
const rankingData = ref<RankingItem[]>([
  {
    id: 1,
    name: '圆子超会唱',
    avatar:
      'https://i1.hdslb.com/bfs/face/a84fa10f90f7060d0336384954ee1cde7a8e9bc6.jpg@80w_80h_1e_1c_100q.webp',
    title: '海绵宝宝温馨休息室',
    views: 6649,
  },
  {
    id: 2,
    name: '云柯Yunkes',
    avatar:
      'https://i1.hdslb.com/bfs/face/1aaa7a19bcbcf748cf82b6a71e2c9ba184e82a91.jpg@80w_80h_1e_1c_100q.webp',
    title: '日常直播',
    views: 2377,
  },
  {
    id: 3,
    name: '章鱼阁下-喜当妈',
    avatar:
      'https://i1.hdslb.com/bfs/face/bdf4b65b49fe0d2683e88a14cc5e1b8da56d518d.jpg@96w_96h_1e_1c_100q.webp',
    title: '【吉他弹唱】忙忙碌碌寻宝藏！',
    views: 2105,
  },
  {
    id: 4,
    name: 'Cattleb小星火炯',
    avatar:
      'https://i2.hdslb.com/bfs/face/e666dc287f78bab4aadd95c5579db966a1ecf824.jpg@96w_96h_1e_1c_100q.webp',
    title: 'b站官方推荐唱见',
    views: 1821,
  },
]);

function refreshData() {
  console.log('数据已刷新');
  // 模拟刷新数据操作
}
</script>
<style scoped lang="scss">
.ranking-board {
  width: 340px;
  background-color: #fff;
  border-radius: 4px;
  /* box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); */
  padding: 10px 0;
  box-sizing: border-box;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;

  .title {
    font-size: 16px;
    font-weight: 700;
    color: #18191c;
  }
}

.refresh {
  font-size: 12px;
  color: #797f87;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.icon-refresh {
  margin-right: 5px;
}

.ranking-list {
  overflow: scroll;
  margin-top: 5px;
  height: 190px;
  box-sizing: border-box;
  padding: 0 20px;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  cursor: pointer;
}

.rank-badge {
  width: 30px;
  text-align: center;
  font-weight: bold;
  color: #797f87;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-left: 10px;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info {
  flex: 1;
  margin-left: 10px;
}

.name {
  font-size: 14px;
  color: #333;
}

.title {
  font-size: 12px;
  color: #888;
  margin-top: 5px;
  width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.views {
  color: #797f87;
  display: flex;
  font-size: 12px;
  align-items: center;
}

.ico {
  /* margin: 0 auto; */
  width: 30px;
  height: 30px;
  opacity: 0.9;

  @extend %containBg;

  &.one {
    @include setBackground('@/assets/img/no1.png');
  }

  &.two {
    @include setBackground('@/assets/img/no2.png');
  }

  &.three {
    @include setBackground('@/assets/img/no3.png');
  }

  &.eye {
    width: 15px;
    height: 15px;
    margin-right: 3px;
    @include setBackground('@/assets/img/eye_black.png');
  }

  &.refresh {
    width: 10px;
    height: 10px;
    margin-right: 3px;
    @include setBackground('@/assets/img/refresh.png');
  }
}

@keyframes living-icon-ani-44c8c6a7 {
  0% {
    transform: scaleY(0.5);
  }

  50% {
    transform: scaleY(1);
  }

  100% {
    transform: scaleY(0.5);
  }
}

.living-icon {
  margin-top: 11px;
  width: 10px;
  height: 10px;
  bottom: 8px;
  width: 13px;
  float: right;
  position: relative;

  .living-icon-col {
    width: 2px;
    margin: 0 1px;
    background-color: #fb7299;
    border-radius: 2px;
    animation: linear 0.6s infinite living-icon-ani-44c8c6a7;
    transform-origin: bottom;
    display: inline-block;
    height: 100%;

    &:first-child {
      animation-delay: -0.2s;
      margin-left: 0;
    }

    :last-child {
      animation-delay: 0.2s;
      margin-right: 0;
    }
  }
}
</style>
