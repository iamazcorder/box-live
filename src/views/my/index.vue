<template>
  <div class="personal-space">
    <!-- Banner 图 -->
    <div class="banner">
      <img
        :src="user.banner"
        alt="Banner"
      />
      <!-- 个人信息展示在 Banner 图上 -->
      <div class="user-info">
        <img
          :src="user.avatar"
          alt="头像"
          class="avatar"
        />
        <div class="details">
          <h2>
            {{ user.name }}
          </h2>
          <div class="edit-btn">编辑个性签名</div>
        </div>
      </div>
    </div>

    <!-- Tab、搜索框和统计信息 -->
    <div class="header-row">
      <!-- 左侧：Tab 和搜索框 -->
      <div class="left-section">
        <div class="tabs">
          <button
            v-for="(tab, index) in tabs"
            :key="index"
            :class="{ active: selectedTab === index }"
            @click="selectTab(index)"
          >
            {{ tab }}
          </button>
        </div>
        <div class="search-bar">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="搜索直播回放"
            @keyup.enter="performSearch"
          />
          <div class="ico search"></div>
        </div>
      </div>

      <!-- 右侧：关注数和粉丝数 -->
      <div class="right-section">
        <div
          class="stat-item"
          @click="
            router.push({
              name: 'follow',
            })
          "
        >
          <span class="title">关注数</span>
          <span class="num">{{ user.following }}</span>
        </div>
        <div
          class="stat-item"
          @click="
            router.push({
              name: 'fans',
            })
          "
        >
          <span class="title">粉丝数</span>
          <span class="num">{{ user.fans }}</span>
        </div>
      </div>
    </div>

    <!-- Tab 内容 -->
    <div class="tab-content">
      <!-- <div class="live-replays">
        <h3>直播回放</h3>
        <div class="videos">
          <div class="video-item" v-for="(video, index) in filteredReplays" :key="index">
            <img :src="video.thumbnail" alt="缩略图" />
            <p>{{ video.title }}</p>
          </div>
        </div>
      </div> -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

interface User {
  avatar: string;
  banner: string;
  name: string;
  level: number;
  following: number;
  fans: number;
}

const user: User = {
  avatar: 'https://via.placeholder.com/150',
  banner: 'https://via.placeholder.com/1200x300',
  name: 'Tim_zh',
  level: 5,
  following: 210,
  fans: 50,
};

const searchQuery = ref<string>('');
const performSearch = () => {
  console.log('搜索内容：', searchQuery.value);
  // 搜索逻辑或 API 调用可以在这里实现
};
const replays = ref([
  { thumbnail: 'https://via.placeholder.com/150', title: '直播回放1' },
  { thumbnail: 'https://via.placeholder.com/150', title: '直播回放2' },
]);

const tabs = ref(['直播回放']);
const selectedTab = ref(0);

const selectTab = (index: number) => {
  selectedTab.value = index;
};

const filteredReplays = computed(() =>
  replays.value.filter((replay) =>
    replay.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);
</script>

<style lang="scss" scoped>
.ico {
  /* margin: 0 auto; */
  width: 20px;
  height: 20px;
  opacity: 0.9;
  margin-right: 8px;

  @extend %containBg;

  &.search {
    @include setBackground('@/assets/img/search.png');

    &:hover {
      cursor: pointer;
    }
  }
}

.personal-space {
  font-family: Arial, sans-serif;

  /* Banner 样式 */
  .banner {
    position: relative;
    width: 100%;
    height: 200px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .user-info {
      position: absolute;
      bottom: 20px;
      left: 60px;
      display: flex;
      align-items: center;

      .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.4);
        margin-right: 15px;
      }

      .details {
        h2 {
          font-size: 20px;
          margin: 0;
          color: #fff;
        }

        .edit-btn {
          margin-top: 10px;
          font-size: 12px;
          color: #fff;
          cursor: pointer;
        }
      }
    }
  }

  /* Header 样式：Tab、搜索框和统计信息 */
  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border-bottom: 1px solid #eee;
    padding: 10px 60px 0;

    .left-section {
      height: 100%;
      display: flex;
      align-items: center;

      .tabs {
        display: flex;

        button {
          margin-right: 20px;
          /* padding: 10px 20px; */
          background: none;
          border: none;
          font-size: 14px;
          color: #333;
          cursor: pointer;
          height: 64px;
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
      }

      /* 搜索框样式 */
      .search-bar {
        display: flex;
        align-items: center;
        position: relative;
        width: 170px;
        height: 30px;
        border: 1px solid #e3e8ec;
        border-radius: 6px;
        padding: 0 5px;

        /* 当搜索框或其中的输入框获得焦点时，改变边框颜色 */
        &:focus-within {
          border-color: #ffd700;
          /* 设置选中时的边框颜色 */
        }

        input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 12px;
          padding: 0 10px;
          height: 100%;
        }
      }
    }

    .right-section {
      display: flex;
      align-items: center;
      padding-bottom: 5px;

      .stat-item {
        margin-right: 20px;
        text-align: center;
        display: flex;
        flex-direction: column;
        font-size: 14px;

        &:hover {
          cursor: pointer;
        }

        .title {
          color: #61666d;
          margin-bottom: 5px;
        }

        .num {
          color: #18191c;
          font-weight: 500;
        }
      }
    }
  }

  /* Tab 内容样式 */
  .tab-content {
    padding: 20px 60px;

    .live-replays {
      h3 {
        font-size: 18px;
        margin-bottom: 10px;
      }

      .videos {
        display: flex;
        flex-wrap: wrap;

        .video-item {
          width: calc(50% - 10px);
          margin-right: 10px;
          margin-bottom: 10px;

          img {
            width: 100%;
            border-radius: 10px;
          }

          p {
            font-size: 14px;
            margin-top: 5px;
          }
        }
      }
    }
  }
}
</style>
<!-- <template>
  <div class="my-wrap">
    <div class="id">用户id：{{ userStore.userInfo?.id }}</div>
    <div class="avatar">
      <span class="txt">用户头像：</span>
      <Avatar
        :url="userStore.userInfo?.avatar"
        :name="userStore.userInfo?.username"
        :size="30"
      ></Avatar>
    </div>
    <div>用户昵称：{{ userStore.userInfo?.username }}</div>
    <div>
      用户角色：{{
        userStore.userInfo?.roles?.map((item) => item.role_name).join(',')
      }}
    </div>
    <div>注册时间：{{ userStore.userInfo?.created_at }}</div>

    <br />
    <div class="pull-url">
      <span
        v-if="!userStore.userInfo?.live_rooms?.length"
        class="link"
        @click="openLiveRoom"
      >
        未开通
      </span>
      <div v-else>
        <div>
          直播间地址：
          <a
            :href="getLiveRoomPageUrl(userStore.userInfo?.live_rooms?.[0]?.id!)"
            class="link"
            target="_blank"
          >
            {{ getLiveRoomPageUrl(userStore.userInfo?.live_rooms?.[0]?.id!) }}
          </a>
        </div>
        <div>直播间名称：{{ userStore.userInfo?.live_rooms?.[0]?.name }}</div>
        <div>
          直播间简介：{{
            userStore.userInfo?.live_rooms?.[0]?.desc || '暂无简介'
          }}
        </div>
        <div>
          直播间分区：{{
            userStore.userInfo?.live_rooms?.[0]?.areas?.[0]?.name || '暂无分区'
          }}
        </div>
        <div>
          开通时间：{{ userStore.userInfo?.live_rooms?.[0]?.created_at }}
        </div>

        <div
          v-if="
            userStore.userInfo?.auths?.find(
              (v) => v.auth_value === DEFAULT_AUTH_INFO.LIVE_PUSH.auth_value
            )
          "
          class="url-wrap"
          v-loading="updateKeyLoading"
        >
          <div
            class="link"
            @click="handleUpdateKey"
          >
            更新地址
          </div>

          <div class="srs">
            <div>
              <span>
                RTMP推流地址：{{
                  userStore.userInfo?.live_rooms?.[0]?.push_rtmp_url!
                }}，
              </span>
              <span
                class="link"
                @click="
                  handleCopy(
                    userStore.userInfo?.live_rooms?.[0]?.push_rtmp_url!
                  )
                "
              >
                复制
              </span>
            </div>
            <div>
              <span
                >OBS服务器：{{
                  userStore.userInfo?.live_rooms?.[0]?.push_obs_server!
                }}，</span
              >
              <span
                class="link"
                @click="
                  handleCopy(
                    userStore.userInfo?.live_rooms?.[0]?.push_obs_server!
                  )
                "
              >
                复制
              </span>
            </div>
            <div>
              <span
                >OBS推流码：{{
                  userStore.userInfo?.live_rooms?.[0]?.push_obs_stream_key!
                }}，</span
              >
              <span
                class="link"
                @click="
                  handleCopy(
                    userStore.userInfo?.live_rooms?.[0]?.push_obs_stream_key!
                  )
                "
              >
                复制
              </span>
            </div>
          </div>

          <br />

          <div>
            CDN直播：
            <div
              class="cdn"
              v-if="
                userStore.userInfo?.auths?.find(
                  (v) =>
                    v.auth_value === DEFAULT_AUTH_INFO.LIVE_PULL_SVIP.auth_value
                )
              "
            >
              <div>
                <span>
                  RTMP推流地址（CDN）：{{
                    userStore.userInfo?.live_rooms?.[0]?.push_cdn_rtmp_url!
                  }}，
                </span>
                <span
                  class="link"
                  @click="
                    handleCopy(
                      userStore.userInfo?.live_rooms?.[0]?.push_cdn_rtmp_url!
                    )
                  "
                >
                  复制
                </span>
              </div>
              <div>
                <span>
                  OBS服务器（CDN）：{{
                    userStore.userInfo?.live_rooms?.[0]?.push_cdn_obs_server!
                  }}，
                </span>
                <span
                  class="link"
                  @click="
                    handleCopy(
                      userStore.userInfo?.live_rooms?.[0]?.push_cdn_obs_server!
                    )
                  "
                >
                  复制
                </span>
              </div>
              <div>
                <span>
                  OBS推流码（CDN）：{{
                    userStore.userInfo?.live_rooms?.[0]
                      ?.push_cdn_obs_stream_key!
                  }}，
                </span>
                <span
                  class="link"
                  @click="
                    handleCopy(
                      userStore.userInfo?.live_rooms?.[0]
                        ?.push_cdn_obs_stream_key!
                    )
                  "
                >
                  复制
                </span>
              </div>
            </div>
            <div
              v-else
              class="link"
              @click="router.push({ name: routerName.author })"
            >
              请联系作者开通~
            </div>
          </div>

          <div>
            转推b站：
            <div
              class="cdn"
              v-if="
                userStore.userInfo?.auths?.find(
                  (v) =>
                    v.auth_value ===
                    DEFAULT_AUTH_INFO.LIVE_PUSH_FORWARD_BILIBILI.auth_value
                )
              "
            >
              <n-input-group>
                <n-input
                  style="width: 500px"
                  v-model:value="liveRoomInfo!.forward_bilibili_url"
                  type="text"
                  placeholder="请输入转推b站url"
                />

                <n-button
                  type="primary"
                  ghost
                  @click="handleUpdateMyLiveRoom()"
                >
                  更新
                </n-button>
              </n-input-group>
            </div>
            <div
              v-else
              class="link"
              @click="router.push({ name: routerName.author })"
            >
              请联系作者开通~
            </div>
          </div>

          <div>
            转推虎牙：
            <div
              class="cdn"
              v-if="
                userStore.userInfo?.auths?.find(
                  (v) =>
                    v.auth_value ===
                    DEFAULT_AUTH_INFO.LIVE_PUSH_FORWARD_HUYA.auth_value
                )
              "
            >
              <n-input-group>
                <n-input
                  style="width: 500px"
                  v-model:value="liveRoomInfo!.forward_huya_url"
                  type="text"
                  placeholder="请输入转推虎牙url"
                />

                <n-button
                  type="primary"
                  ghost
                  @click="handleUpdateMyLiveRoom()"
                >
                  更新
                </n-button>
              </n-input-group>
            </div>
            <div
              v-else
              class="link"
              @click="router.push({ name: routerName.author })"
            >
              请联系作者开通~
            </div>
          </div>

          <div>
            转推抖音：
            <div
              class="cdn"
              v-if="
                userStore.userInfo?.auths?.find(
                  (v) =>
                    v.auth_value ===
                    DEFAULT_AUTH_INFO.LIVE_PUSH_FORWARD_DOUYIN.auth_value
                )
              "
            >
              <n-input-group>
                <n-input
                  style="width: 500px"
                  v-model:value="liveRoomInfo!.forward_douyin_url"
                  type="text"
                  placeholder="请输入转推抖音url"
                />

                <n-button
                  type="primary"
                  ghost
                  @click="handleUpdateMyLiveRoom()"
                >
                  更新
                </n-button>
              </n-input-group>
            </div>
            <div
              v-else
              class="link"
              @click="router.push({ name: routerName.author })"
            >
              请联系作者开通~
            </div>
          </div>

          <div>
            转推斗鱼：
            <div
              class="cdn"
              v-if="
                userStore.userInfo?.auths?.find(
                  (v) =>
                    v.auth_value ===
                    DEFAULT_AUTH_INFO.LIVE_PUSH_FORWARD_DOUYU.auth_value
                )
              "
            >
              <n-input-group>
                <n-input
                  style="width: 500px"
                  v-model:value="liveRoomInfo!.forward_douyu_url"
                  type="text"
                  placeholder="请输入转推斗鱼url"
                />

                <n-button
                  type="primary"
                  ghost
                  @click="handleUpdateMyLiveRoom()"
                >
                  更新
                </n-button>
              </n-input-group>
            </div>
            <div
              v-else
              class="link"
              @click="router.push({ name: routerName.author })"
            >
              请联系作者开通~
            </div>
          </div>

          <div>
            转推小红书：
            <div
              class="cdn"
              v-if="
                userStore.userInfo?.auths?.find(
                  (v) =>
                    v.auth_value ===
                    DEFAULT_AUTH_INFO.LIVE_PUSH_FORWARD_XIAOHONGSHU.auth_value
                )
              "
            >
              <n-input-group>
                <n-input
                  style="width: 500px"
                  v-model:value="liveRoomInfo!.forward_xiaohongshu_url"
                  type="text"
                  placeholder="请输入转推小红书url"
                />

                <n-button
                  type="primary"
                  ghost
                  @click="handleUpdateMyLiveRoom()"
                >
                  更新
                </n-button>
              </n-input-group>
            </div>
            <div
              v-else
              class="link"
              @click="router.push({ name: routerName.author })"
            >
              请联系作者开通~
            </div>
          </div>

          <div>
            转推快手：
            <div
              class="cdn"
              v-if="
                userStore.userInfo?.auths?.find(
                  (v) =>
                    v.auth_value ===
                    DEFAULT_AUTH_INFO.LIVE_PUSH_FORWARD_KUAISHOU.auth_value
                )
              "
            >
              <n-input-group>
                <n-input
                  style="width: 500px"
                  v-model:value="liveRoomInfo!.forward_kuaishou_url"
                  type="text"
                  placeholder="请输入转推快手url"
                />

                <n-button
                  type="primary"
                  ghost
                  @click="handleUpdateMyLiveRoom()"
                >
                  更新
                </n-button>
              </n-input-group>
            </div>
            <div
              v-else
              class="link"
              @click="router.push({ name: routerName.author })"
            >
              请联系作者开通~
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { copyToClipBoard, openToTarget } from 'billd-utils';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { fetchUpdateLiveRoomKey, fetchUpdateMyLiveRoom } from '@/api/liveRoom';
import { DEFAULT_AUTH_INFO, URL_QUERY } from '@/constant';
import { loginTip } from '@/hooks/use-login';
import { routerName } from '@/router';
import { useUserStore } from '@/store/user';
import { ILiveRoom, LiveRoomTypeEnum } from '@/types/ILiveRoom';
import { getLiveRoomPageUrl } from '@/utils';

const userStore = useUserStore();
const router = useRouter();
const liveRoomInfo = ref<ILiveRoom>();

const updateKeyLoading = ref(false);

function handleCopy(url: string) {
  copyToClipBoard(url);
  window.$message.success('复制成功！');
}

watch(
  () => userStore.userInfo,
  (newval) => {
    if (newval?.live_rooms?.[0]) {
      liveRoomInfo.value = newval?.live_rooms[0];
    }
  },
  {
    immediate: true,
  }
);

async function handleUpdateMyLiveRoom() {
  const res = await fetchUpdateMyLiveRoom(liveRoomInfo.value!);
  if (res.code === 200) {
    window.$message.success('修改成功！');
  }
}

function openLiveRoom() {
  if (!loginTip()) {
    return;
  }
  const url = router.resolve({
    name: routerName.push,
    query: { [URL_QUERY.liveType]: LiveRoomTypeEnum.srs },
  });
  openToTarget(url.href);
}

async function handleUpdateKey() {
  try {
    updateKeyLoading.value = true;
    const res = await fetchUpdateLiveRoomKey();
    if (res.code === 200 && userStore.userInfo?.live_rooms?.[0]) {
      userStore.userInfo.live_rooms[0].push_obs_server =
        res.data.srsPushRes.obs_server;
      userStore.userInfo.live_rooms[0].push_obs_stream_key =
        res.data.srsPushRes.obs_stream_key;
      userStore.userInfo.live_rooms[0].push_rtmp_url =
        res.data.srsPushRes.rtmp_url;
      userStore.userInfo.live_rooms[0].push_srt_url =
        res.data.srsPushRes.srt_url;
      userStore.userInfo.live_rooms[0].push_webrtc_url =
        res.data.srsPushRes.webrtc_url;
      userStore.userInfo.live_rooms[0].push_cdn_obs_server =
        res.data.cdnPushRes.obs_server;
      userStore.userInfo.live_rooms[0].push_cdn_obs_stream_key =
        res.data.cdnPushRes.obs_stream_key;
      userStore.userInfo.live_rooms[0].push_cdn_rtmp_url =
        res.data.cdnPushRes.rtmp_url;
      userStore.userInfo.live_rooms[0].push_cdn_srt_url =
        res.data.cdnPushRes.srt_url;
      userStore.userInfo.live_rooms[0].push_cdn_webrtc_url =
        res.data.cdnPushRes.webrtc_url;
    }
  } catch (error) {
    console.error(error);
  } finally {
    updateKeyLoading.value = false;
  }
}
</script>

<style lang="scss" scoped>
.my-wrap {
  position: relative;
  padding: 10px;
  .link {
    display: inline-block;
    color: $theme-color-gold;
    text-decoration: none;
    cursor: pointer;

    user-select: none;
  }
  .avatar {
    display: flex;
    align-items: center;
    .txt {
      margin-right: 10px;
    }
  }
  .url-wrap {
    position: relative;
    margin-top: 10px;
    .cdn {
      margin-bottom: 10px;
    }
  }
}
</style> -->
