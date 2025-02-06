<template>
  <div class="app">
    <!-- 顶部导航栏 -->
    <div class="tabs">
      <button
        v-for="(tab, index) in tabs"
        :key="tab.key"
        :class="{ active: selectedTab === tab.label }"
        @click="selectTab(tab.label)"
      >
        <span>{{ tab.label }}</span>
        <span class="tabs-num">99+</span>
      </button>
    </div>

    <!-- 内容展示区 -->
    <div class="content">
      <!-- 动态显示每个 Tab 对应的内容 -->
      <div class="content-header">
        <button class="filter-btn">更多筛选</button>
      </div>

      <!-- Tab 内容区域 -->
      <div class="tab-content">
        <div v-if="selectedTab === '直播'">
          <div class="video-list">
            <div
              class="video-card"
              v-for="(video, index) in videos"
              :key="index"
            >
              <div class="video-thumbnail">
                <img
                  :src="video.thumbnail"
                  alt="视频缩略图"
                />
                <div class="video-data">
                  <div class="video-data-left">
                    <div class="view-count">
                      <div class="ico eye"></div>
                      <span>{{ video.viewCount }}</span>
                    </div>
                    <div class="like-count">
                      <div class="ico comment"></div>
                      <span>{{ video.commentCount }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="video-info">
                <div class="video-title">
                  <div class="bili-live-card__info--living">
                    <img
                      width="12"
                      height="12"
                      src="https://s1.hdslb.com/bfs/static/jinkela/long/images/live.gif"
                    /><span class="bili-live-card__info--living__text"
                      >直播中</span
                    >
                  </div>
                  {{ video.title }}
                </div>
                <div class="video-details">
                  <span>{{ video.author }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="selectedTab === '回放'">
          <div class="video-list">
            <div
              class="video-card"
              v-for="(video, index) in videos"
              :key="index"
            >
              <div class="video-thumbnail">
                <img
                  :src="video.thumbnail"
                  alt="视频缩略图"
                />
                <div class="video-data">
                  <div class="video-data-left">
                    <div class="view-count">
                      <div class="ico eye"></div>
                      <span>{{ video.viewCount }}</span>
                    </div>
                    <div class="like-count">
                      <div class="ico comment"></div>
                      <span>{{ video.commentCount }}</span>
                    </div>
                  </div>
                  <div>{{ video.duration }}</div>
                </div>
              </div>
              <div class="video-info">
                <div class="video-title">{{ video.title }}</div>
                <div class="video-details">
                  <span>{{ video.author }}</span>
                  <span class="split-dot"> · </span>
                  <span>{{ video.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="selectedTab === '用户'">
          <div class="user-list">
            <div
              class="user-card"
              v-for="(user, index) in users"
              :key="index"
            >
              <!-- <div class="user-avatar">
                                <img src="@/assets/img/userCenter.png" alt="用户头像" />
                            </div> -->
              <Avatar
                :size="90"
                class="user-avatar"
              />
              <div class="user-info">
                <div class="user-name">{{ user.name }}</div>
                <div class="user-stats">
                  <span>{{ user.followers }}粉丝</span>
                  <span class="split-dot"> · </span>
                  <span>{{ user.description }}</span>
                </div>
                <button class="follow-btn">+ 关注</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const tabs = ref([
  { label: '直播', key: 'live' },
  { label: '回放', key: 'playback' },
  { label: '用户', key: 'user' },
]);

// 当前选中的 Tab
const selectedTab = ref('直播');

const videos = ref([
  {
    thumbnail: 'https://via.placeholder.com/320x180?text=视频封面1',
    title: '[AS] Ppomo 刮耳膜',
    viewCount: '5.5万',
    commentCount: 12,
    duration: '54:46',
    author: 'author',
    time: '2021-8-31',
  },
  {
    thumbnail: 'https://via.placeholder.com/320x180?text=视频封面1',
    title: '[AS] Zunbird 超级耐脉王',
    viewCount: '3.7万',
    commentCount: 0,
    duration: '2:59:30',
    author: 'author',
    time: '2021-8-31',
  },
  {
    thumbnail: 'https://via.placeholder.com/320x180?text=视频封面1',
    title: '秒懂单词: 顿悟 [AS]',
    viewCount: '6.1万',
    commentCount: 17,
    duration: '14:14',
    author: 'author',
    time: '2021-8-31',
  },
  {
    thumbnail: 'https://via.placeholder.com/320x180?text=视频封面1',
    title: 'Kevin AS助眠 舒服的触发',
    viewCount: '2.7万',
    commentCount: 3,
    duration: '20:12',
    author: 'author',
    time: '2021-8-31',
  },
  {
    thumbnail: 'https://via.placeholder.com/320x180?text=视频封面1',
    title: 'Lumine AS 快节奏升天',
    viewCount: '1.2万',
    commentCount: 8,
    duration: '17:31',
    author: 'author',
    time: '2021-8-31',
  },
  {
    thumbnail: 'https://via.placeholder.com/320x180?text=视频封面1',
    title: '[AS] 夜深人静的安静时光',
    viewCount: '3.4万',
    commentCount: 15,
    duration: '12:25',
    author: 'author',
    time: '2021-8-31',
  },
  {
    thumbnail: 'https://via.placeholder.com/320x180?text=视频封面1',
    title: '探索声音的极限 [AS]',
    viewCount: '8.3万',
    commentCount: 45,
    duration: '10:55',
    author: 'author',
    time: '2021-8-31',
  },
  {
    thumbnail: 'https://via.placeholder.com/320x180?text=视频封面1',
    title: '日常放松时光',
    viewCount: '5.2万',
    commentCount: 30,
    duration: '7:30',
    author: 'author',
    time: '2021-8-31',
  },
  {
    thumbnail: 'https://via.placeholder.com/320x180?text=视频封面1',
    title: '舒适的触发感受 [AS]',
    viewCount: '2.1万',
    commentCount: 10,
    duration: '15:00',
    author: 'author',
    time: '2021-8-31',
  },
  {
    thumbnail: 'https://via.placeholder.com/320x180?text=视频封面1',
    title: '甜蜜的耳边声音',
    viewCount: '1.5万',
    commentCount: 12,
    duration: '8:45',
    author: 'author',
    time: '2021-8-31',
  },
  {
    thumbnail: 'https://via.placeholder.com/320x180?text=视频封面1',
    title: '甜蜜的耳边声音',
    viewCount: '1.5万',
    commentCount: 12,
    duration: '8:45',
    author: 'author',
    time: '2021-8-31',
  },
  {
    thumbnail: 'https://via.placeholder.com/320x180?text=视频封面1',
    title: '甜蜜的耳边声音',
    viewCount: '1.5万',
    commentCount: 12,
    duration: '8:45',
    author: 'author',
    time: '2021-8-31',
  },
]);

// 用户数据
const users = ref([
  {
    avatar: '@/assets/img/userCenter.png',
    name: 'AS',
    level: 'LV5',
    followers: '327',
    videos: '3个视频',
    description: '小说，游戏，动漫',
  },
  {
    avatar: 'https://via.placeholder.com/320x180?text=视频封面1',
    name: 'AS玩家乐',
    level: 'LV6',
    followers: '5.5万',
    videos: '1926个视频',
    description: '优质游戏监控员',
  },
  {
    avatar: 'https://via.placeholder.com/320x180?text=视频封面1',
    name: '刘书程AS',
    level: 'LV6',
    followers: '5.1万',
    videos: '379个视频',
    description: '球员发展，技术教练 CBA外援',
  },
  {
    avatar: 'https://via.placeholder.com/320x180?text=视频封面1',
    name: 'As童话',
    level: 'LV6',
    followers: '2.8万',
    videos: '393个视频',
    description: '童话故事创作者',
  },
  {
    avatar: 'https://via.placeholder.com/320x180?text=视频封面1',
    name: 'AS极客',
    level: 'LV6',
    followers: '84.8万',
    videos: '476个视频',
    description: '科技术UP主',
  },
  {
    avatar: 'https://via.placeholder.com/320x180?text=视频封面1',
    name: '小雪AS声控助眠',
    level: 'LV6',
    followers: '9.5万',
    videos: '190个视频',
    description: 'b站唯一一吹号哎 原创 禁止搬运',
  },
  {
    avatar: 'https://via.placeholder.com/320x180?text=视频封面1',
    name: 'AS天使工房',
    level: 'LV4',
    followers: '2.4万',
    videos: '149个视频',
    description: '天使工房B站官方账号',
  },
]);

// 切换 Tab
const selectTab = (tab: string) => {
  selectedTab.value = tab;
};
</script>

<style lang="scss" scoped>
.app {
  width: 100%;
}

.ico {
  width: 15px;
  height: 15px;
  opacity: 0.9;
  margin-right: 4px;

  @extend %containBg;

  &.eye {
    @include setBackground('@/assets/img/eye.png');
  }

  &.comment {
    @include setBackground('@/assets/img/comment.png');
  }
}

.tabs {
  display: flex;
  padding: 10px 60px 0;
  border-bottom: 1px solid #eee;

  button {
    margin-right: 20px;
    background: none;
    border: none;
    font-size: 16px;
    color: #61666d;
    font-weight: 500;
    cursor: pointer;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;

    &.active {
      font-weight: bold;
      color: #ffd700;
      border-bottom: 2px solid #ffd700;
    }

    &:hover {
      color: #ffd700;
    }
  }

  .tabs-num {
    padding: 1px 6px;
    border-radius: 6px;
    font-size: 12px;
    color: #61666d;
    background: #f1f2f3;
    font-weight: 400;
    margin-left: 10px;
  }
}

.content {
  margin-top: 20px;
}

.content-header {
  display: flex;
  justify-content: flex-end;
}

.filter-btn {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.filter-btn:hover {
  background-color: #0056b3;
}

.tab-content {
  padding: 0 60px;
}

.video-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  /* justify-content: space-between; */
}

.video-card {
  width: calc(20% - 16px);
  /* 5个视频占据100%的宽度，减去间隔 */
  /* border: 1px solid #ccc; */
  /* border-radius: 10px; */
  overflow: hidden;
  background-color: #fff;
  cursor: pointer;
}

.video-thumbnail {
  position: relative;

  img {
    width: 100%;
    height: 135px;
    object-fit: cover;
    border-radius: 8px;
  }

  .video-data {
    color: #fff;
    font-size: 12px;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    position: absolute;
    bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &-left {
      display: flex;
      align-items: center;

      .view-count {
        display: flex;
        align-items: center;
      }

      .like-count {
        display: flex;
        align-items: center;
      }
    }
  }
}

.video-info {
  padding: 10px 2px;
}

.video-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.bili-live-card__info--living {
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
  cursor: pointer;
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

.bili-live-card__stats--icon {
  margin-right: 2px;
  width: 16px;
  height: 16px;
  color: #fff;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.video-details {
  font-size: 13px;
  color: #888;
  margin-bottom: 10px;
  display: flex;
  align-items: center;

  .split-dot {
    margin: 0 5px;
  }
}

.view-count,
.like-count {
  margin-right: 10px;
}

.user-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
}

.user-card {
  width: calc(50% - 10px);
  /* 每行2个用户 */
  display: flex;
  background-color: #fff;
  /* border: 1px solid #ccc; */
  /* border-radius: 10px; */
  overflow: hidden;
  /* box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); */
}

.user-avatar {
  margin-top: 10px;
  margin-right: 10px;
}

.user-info {
  flex: 1;
  padding: 10px;
}

.user-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.user-stats {
  font-size: 14px;
  color: #61666d;
  margin-bottom: 10px;

  .split-dot {
    margin: 0 5px;
  }
}

.user-description {
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
}

.follow-btn {
  background-color: #ffd700;
  color: #fff;
  border: none;
  padding: 6px 25px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.follow-btn:hover {
  background-color: #d8c247;
}
</style>
