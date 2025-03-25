<template>
  <div
    class="pull-wrap"
    v-if="!liveRoomInfo"
  >
    暂无该直播间
  </div>
  <div
    v-else
    class="pull-wrap"
    :class="{ isPageFull: appStore.videoControlsValue.pageFullMode }"
  >
    <div class="bg-img-wrap">
      <video
        v-if="configVideo && configVideo !== ''"
        class="bg-video"
        :src="configVideo"
        muted
        autoplay
        loop
      ></video>
      <div
        v-if="configBg && configBg !== ''"
        :style="{
          backgroundImage: `url(${configBg})`,
        }"
      ></div>
    </div>
    <div class="left">
      <div
        ref="topRef"
        class="head"
      >
        <div class="info">
          <Avatar
            :url="anchorInfo?.avatar"
            :name="anchorInfo?.username"
            :size="55"
            @click="handleJump(anchorInfo?.id)"
          ></Avatar>
          <div class="detail">
            <div class="top">
              <div class="name">{{ anchorInfo?.username }}</div>
              <div class="follow">
                <div
                  class="unfollow"
                  v-if="!isMutualFollow"
                  @click.prevent="handleFollow(anchorInfo)"
                >
                  +关注
                </div>
                <div
                  class="followed"
                  v-else
                  @click.prevent="handleUnfollow(anchorInfo?.id)"
                >
                  取消关注
                </div>
                <!-- <div class="f-right">666</div> -->
              </div>
              <!-- <span v-if="NODE_ENV === 'development'">
                {{ liveRoomTypeEnumMap[liveRoomInfo?.type!] }}：{{ mySocketId }}
              </span> -->
              <div
                class="rtc-info"
                v-if="
                  [
                    LiveRoomTypeEnum.wertc_live,
                    LiveRoomTypeEnum.wertc_meeting_one,
                    LiveRoomTypeEnum.wertc_meeting_two,
                  ].includes(liveRoomInfo?.type!)
                "
              >
                <div class="item">延迟：{{ rtcRtt || '-' }}</div>
                <div class="item">丢包：{{ rtcLoss || '-' }}</div>
                <div class="item">帧率：{{ rtcFps || '-' }}</div>
                <div class="item">发送码率：{{ rtcBytesSent || '-' }}</div>
                <div class="item">接收码率：{{ rtcBytesReceived || '-' }}</div>
              </div>
            </div>
            <div class="bottom">
              <!-- <div class="desc" v-if="liveRoomInfo?.desc?.length">
                <FloatTip :txt="liveRoomInfo?.desc" :max-len="20"></FloatTip>
              </div> -->
              <span
                class="area"
                @click="
                  handleSecondArea(
                    liveRoomInfo.parent_category_id,
                    liveRoomInfo.child_category_id
                  )
                "
              >
                {{
                  selectedCategory(
                    liveRoomInfo.parent_category_id,
                    liveRoomInfo.child_category_id
                  )
                }}
              </span>
            </div>
          </div>
        </div>
        <div class="other">
          <div class="top">
            <div class="item">
              <div class="ico eye"></div>
              {{ liveRoomInfo.views_count }}人看过
            </div>
            <div class="item">
              <div class="ico like"></div>
              {{ dianzanNum }}点赞
            </div>
            <!-- <div class="item">当前在线:{{ liveUserList.length }}人</div> -->
          </div>
          <!-- <div class="bottom">
            <n-popover placement="bottom" trigger="hover">
              <template #trigger>
                <div class="tag">礼物成就</div>
              </template>
              <div class="popover-list">
                <template v-if="giftGroupList.length">
                  <div class="item" v-for="(item, index) in giftGroupList" :key="index">
                    <div class="ico" :style="{
                      backgroundImage: `url(${item.goods?.cover})`,
                    }"></div>
                    <div class="nums">x{{ item.nums }}</div>
                  </div>
                </template>
                <span v-else>{{ t('common.nonedata') }}</span>
              </div>
            </n-popover>
            <div class="tag">人气榜</div>
          </div> -->
        </div>
      </div>
      <div
        class="video-wrap"
        v-loading="videoLoading"
      >
        <div
          class="no-live"
          v-if="!roomLiving"
        >
          主播还没开播~
        </div>
        <div
          class="cover"
          :style="{
            backgroundImage: `url(${
              liveRoomInfo?.cover_img || anchorInfo?.avatar
            })`,
          }"
        ></div>
        <div
          class="remote-video"
          ref="remoteVideoRef"
        ></div>
        <div class="video-controls">
          <VideoControls
            v-if="roomLiving"
            :resolution="videoResolution"
            @refresh="handleRefresh"
            @full-screen="handleFullScreen"
            @picture-in-picture="hanldePictureInPicture"
            :control="appStore.videoControls"
            :liveRoom="liveRoomInfo"
          ></VideoControls>
        </div>
      </div>

      <div
        ref="bottomRef"
        v-loading="giftLoading"
        class="gift-list"
      >
        <div
          v-for="(item, index) in giftGoodsList"
          :key="index"
          class="item"
          @click="handlePay(item)"
        >
          <div
            class="ico"
            :style="{
              backgroundImage: `url(${item.cover})`,
            }"
          >
            <div
              v-if="item.badge"
              class="badge"
              :style="{ backgroundColor: item.badge_bg }"
            >
              <span class="txt">{{ item.badge }}</span>
            </div>
          </div>
          <div class="name">{{ item.name }}</div>
          <div class="price">￥{{ formatMoney(item.price!) }}</div>
        </div>
        <div class="vertical-separator"></div>
        <div
          class="item"
          @click="handleRecharge"
        >
          <div class="ico wallet"></div>
          <div
            class="name"
            style="color: #9499a0"
          >
            余额:{{ formatMoney(userStore.userInfo?.wallet?.balance!) }}元
          </div>
          <div
            class="price"
            style="color: #18191c"
          >
            立即充值 >
          </div>
        </div>
      </div>
      <div
        class="ad-wrap-b"
        v-if="appStore.useGoogleAd"
      >
        <!-- live-拉流页面广告位2 -->
        <ins
          class="adsbygoogle"
          style="display: block"
          data-ad-client="ca-pub-6064454674933772"
          data-ad-slot="2315064038"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </div>
    <div class="right">
      <div class="rank-wrap">
        <div class="tab">
          <span
            :class="`tab_item`"
            @click="handleTabChange('audience')"
            >房间观众({{ liveUserList.length || '' }})</span
          >
          <!-- <span> | </span> -->
          <!-- <span :class="`tab_item ${curTab === 'rank' ? 'tab_item_active' : ''}`"
            @click="handleTabChange('rank')">排行榜</span> -->
        </div>
        <div class="user-list">
          <!-- <div v-for="(item, index) in liveUserList" :key="index" class="item">
            <div class="info" @click="handleJump(item.value.user_id)">
              <Avatar :url="item.value.user_avatar" :name="item.value.user_username" :size="25"></Avatar>
              <div class="username">
                {{ item.value.user_username }}
              </div>
              <div class="score">{{ item.score }}</div>
            </div>
          </div> -->
          <LiveRoomRank :rankList="liveUserList" />
        </div>
      </div>
      <div class="gift-notifications">
        <div
          v-for="(item, index) in giftNotifications"
          :key="index"
        >
          <templateElement>
            <!-- 送礼通知动画 -->
            <div class="item">
              <transition-group
                name="gift-animation"
                tag="div"
              >
                <div class="gift-notification">
                  <div class="gift-notification-content">
                    <div class="gift-avatar">
                      <img
                        :src="item.avatar"
                        alt="User Avatar"
                      />
                    </div>
                    <div class="gift-info">
                      <div class="gift-user">
                        <span class="gift-username">{{ item.username }}</span>
                        投喂了
                      </div>
                      <div class="gift-name">{{ item.giftName }}</div>
                    </div>
                    <div class="gift-icon">
                      <img
                        :src="item.giftIcon"
                        alt="Gift Icon"
                      />
                    </div>
                  </div>
                </div>
              </transition-group>
            </div>
          </templateElement>
        </div>
      </div>
      <div
        ref="danmuListRef"
        class="danmu-list"
      >
        <div
          v-for="(item, index) in damuList"
          :key="index"
        >
          <template v-if="item.msg_type === DanmuMsgTypeEnum.reward">
            <div class="item">
              <!-- <span>[{{ formatTimeHour(item.send_msg_time!) }}]</span> -->
              <span class="name"> {{ item.user?.username }} 投喂了</span>
              <span style="color: rgb(251, 208, 91); margin-left: 5px">{{
                item.content
              }}</span>
              <div class="gift-icon">
                <img
                  :src="giftIconMap[item.content || '']"
                  alt="Gift Icon"
                />
              </div>
            </div>
          </template>
          <template v-if="item.msg_type === DanmuMsgTypeEnum.danmu">
            <div class="item">
              <span
                v-if="liveRoomInfo?.users?.[0].id === item.user_id"
                class="roomer"
                >主播</span
              >
              <span class="name">
                <Dropdown
                  trigger="hover"
                  positon="left"
                >
                  <template #btn>
                    <!-- <span class="time">
                      [{{ formatTimeHour(item.send_msg_time!) }}]
                    </span> -->
                    <span class="username">{{ item.username }}</span>
                    <!-- <span class="role">
                      [{{ item.user?.roles?.map((v) => v.role_name).join() }}]
                    </span> -->
                  </template>
                  <template #list>
                    <div class="list">
                      <div class="item">{{ item.username }}</div>
                      <div
                        class="item operator"
                        @click="handleDisableSpeakingUser()"
                      >
                        禁言
                      </div>
                      <div
                        class="item operator"
                        @click="handleCancelDisableSpeakingUser()"
                      >
                        解除禁言
                      </div>
                    </div>
                  </template>
                </Dropdown>
              </span>
              <span>：</span>
              <span
                class="msg"
                v-if="item.content_type === WsMessageContentTypeEnum.txt"
              >
                {{ item.content }}
              </span>
              <div
                class="msg img"
                v-else
              >
                <img
                  :src="item.content"
                  alt=""
                  @load="handleScrollTop"
                />
              </div>
            </div>
          </template>
          <template v-else-if="item.msg_type === DanmuMsgTypeEnum.otherJoin">
            <div class="item">
              <span class="name system">系统通知：</span>
              <span class="msg">{{ item.username }}进入直播！ </span>
            </div>
          </template>
          <template v-else-if="item.msg_type === DanmuMsgTypeEnum.userLeaved">
            <div class="item">
              <span class="name system">系统通知：</span>
              <span class="msg">{{ item.username }}离开直播！ </span>
            </div>
          </template>
          <template v-else-if="item.msg_type === DanmuMsgTypeEnum.dianzan">
            <div class="item">
              <span class="msg dianzan">{{ item.username }} 为主播点赞了</span>
              <div class="good"></div>
            </div>
          </template>
        </div>
      </div>
      <!-- 用户进入提示框 -->
      <!-- <div v-if="userEnterMessages.length" class="enter-notification-box">
        <transition-group name="enter-animation" tag="div">
          <div v-for="(message, index) in userEnterMessages" :key="message.id" class="enter-notification">
            <span>{{ message.username }} 进入直播间</span>
          </div>
        </transition-group>
      </div> -->

      <div
        class="send-msg"
        v-loading="msgLoading"
      >
        <div
          class="disableSpeaking"
          v-if="appStore.disableSpeaking.get(liveRoomInfo?.id!)"
        >
          <div class="bg"></div>
          <span class="txt">
            你被禁言了（{{ appStore.disableSpeaking.get(liveRoomInfo?.id!) }}）
          </span>
        </div>
        <div class="control">
          <div
            class="emoji-list"
            v-if="showEmoji"
          >
            <div
              class="item"
              v-for="(item, index) in emojiArray"
              :key="index"
              @click="handlePushStr(item)"
            >
              {{ item }}
            </div>
          </div>
          <!-- <div class="ico face" title="表情" @click="handleEmoji"></div>
          <div class="ico img" title="图片" @click="mockClick">
            <input ref="uploadRef" type="file" class="input-upload" accept=".webp,.png,.jpg,.jpeg,.gif"
              @change="uploadChange" />
          </div> -->
          <div
            class="ico emoji"
            title="表情"
            @click="handleEmoji"
          ></div>
          <div
            class="ico dianzan"
            title="点赞"
            @click="sendDanmuDianzan(roomId)"
          ></div>
        </div>
        <!-- <textarea ref="danmuIptRef" :placeholder="'发个弹幕吧~'" v-model="danmuStr" class="ipt"
          @keydown="(event) => keydownDanmu(event, danmuStr)"></textarea>
        <div class="btn" @click="handleSendDanmu">
          发送
        </div> -->
        <div class="input-control">
          <div class="input-chat">
            <textarea
              ref="danmuIptRef"
              :placeholder="'发个弹幕吧~'"
              v-model="danmuStr"
              @keydown="(event) => keydownDanmu(event, danmuStr)"
              type="text"
            />
            <div class="limit-size">{{ danmuStr.length }}/20</div>
          </div>
          <div
            class="btn"
            @click="handleSendDanmu"
          >
            发送
          </div>
        </div>
      </div>
    </div>

    <div
      class="ad-wrap-a"
      v-if="appStore.useGoogleAd"
    >
      <!-- live-拉流页面广告位1 -->
      <ins
        class="adsbygoogle"
        style="display: block"
        data-ad-client="ca-pub-6064454674933772"
        data-ad-slot="6397310081"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>

    <RechargeCpt
      :show="showRecharge"
      @close="(v) => (showRecharge = v)"
    ></RechargeCpt>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import {
  fetchLiveBilibiliPlayUrl,
  fetchLiveBilibiliRoomGetInfo,
} from '@/api/bilibili';
import {
  fetchGiftGroupList,
  fetchGiftRecordCreate,
  fetchGiftRecordList,
} from '@/api/giftRecord';
import { fetchGoodsList } from '@/api/goods';
import { fetchLiveRoomOnlineUser } from '@/api/live';
import {
  createUserLiveView,
  fetchFindLiveRoom,
  fetchLiveRoomBilibili,
} from '@/api/liveRoom';
import { fetchGetWsMessageList } from '@/api/wsMessage';
import { URL_QUERY } from '@/constant';
import { emojiArray } from '@/emoji';
import { loginTip } from '@/hooks/use-login';
import { useFullScreen, usePictureInPicture } from '@/hooks/use-play';
import { usePull } from '@/hooks/use-pull';
import { useUpload } from '@/hooks/use-upload';
import { useWebsocket } from '@/hooks/use-websocket';
import {
  DanmuMsgTypeEnum,
  GiftRecordStatusEnum,
  GoodsTypeEnum,
  IGiftRecord,
  IGoods,
  LiveLineEnum,
  LiveRenderEnum,
  WsMessageContentTypeEnum,
  WsMessageIsFileEnum,
  WsMessageIsShowEnum,
  WsMessageIsVerifyEnum,
} from '@/interface';
import router, { routerName } from '@/router';
import { QINIU_KODO } from '@/spec-config';
import { useAppStore } from '@/store/app';
import { useNetworkStore } from '@/store/network';
import { useUserStore } from '@/store/user';
import { ILiveRoom, LiveRoomTypeEnum } from '@/types/ILiveRoom';
import { IUser } from '@/types/IUser';
import { formatMoney } from '@/utils';
import { openToTarget } from 'billd-utils';

import { fetchLiveRoomUserRank } from '@/api/liveRoom';
import {
  fetchUserFollow,
  fetchUserFollowersList,
  fetchUserFollowingList,
  fetchUserUnfollow,
} from '@/api/user';
import LiveRoomRank from '@/components/LiveRoomRank/index.vue';
import RechargeCpt from './recharge/index.vue';

const route = useRoute();
const userStore = useUserStore();
const appStore = useAppStore();
const networkStore = useNetworkStore();
const { t } = useI18n();

const roomId = ref('');
const liveRoomInfo = ref<ILiveRoom>();
const anchorInfo = ref<IUser>();
const configBg = ref();
const configVideo = ref();
const giftGoodsList = ref<IGoods[]>([]);
const giftRecordList = ref<IGiftRecord[]>([]);
const giftGroupList = ref<Array<IGiftRecord & { nums: number }>>([]);
const height = ref(0);
const giftLoading = ref(false);
const showRecharge = ref(false);
const showEmoji = ref(false);
const msgLoading = ref(false);
const topRef = ref<HTMLDivElement>();
const bottomRef = ref<HTMLDivElement>();
const danmuListRef = ref<HTMLDivElement>();
const remoteVideoRef = ref<HTMLDivElement>();
const uploadRef = ref<HTMLInputElement>();
const danmuIptRef = ref<HTMLTextAreaElement>();
const loopGetLiveUserTimer = ref();
const isBilibili = ref(false);
const curTab = ref('audience');
const followers = ref<any[]>([]);
const followings = ref<any[]>([]);
const isMutualFollow = ref(false);
const giftIconMap = ref<any>({});
const isMyLiveRoom = ref(false);
const watchStartTime = ref<number | null>(null); // 记录进入时间（时间戳）
const watchDuration = ref<number>(0); // 记录观看时长（秒）
const rankList = ref<any>([]);

const {
  initWs,
  initRtcReceive,
  initPull,
  closeWs,
  closeRtc,
  keydownDanmu,
  handlePlay,
  videoWrapRef,
  msgIsFile,
  mySocketId,
  videoResolution,
  videoLoading,
  roomLiving,
  damuList,
  liveUserList,
  danmuStr,
} = usePull();

const {
  initRoomId,
  sendDanmuTxt,
  sendDanmuImg,
  sendDanmuReward,
  sendDanmuDianzan,
} = useWebsocket();
// 用户进入直播间，记录进入时间
onMounted(() => {
  watchStartTime.value = Date.now();
  window.addEventListener('beforeunload', handleLeaveRoom);
});

// 用户离开直播间，计算观看时长并提交观看记录
onUnmounted(() => {
  handleLeaveRoom();
  window.removeEventListener('beforeunload', handleLeaveRoom);
});

// 计算观看时长并提交记录
const handleLeaveRoom = async () => {
  if (
    watchStartTime.value &&
    userStore.userInfo?.id &&
    userStore.userInfo?.id !== anchorInfo.value?.id
  ) {
    watchDuration.value = Math.floor(
      (Date.now() - watchStartTime.value) / 1000
    ); // 计算秒数

    await createUserLiveView({
      user_id: userStore.userInfo.id,
      live_room_id: Number(roomId.value),
      watched_at: new Date().toISOString(),
      duration: watchDuration.value,
    });
  }
};

const dianzanNum = computed(() => {
  const dianzanList = damuList.value.filter(
    (item) => item.msg_type === DanmuMsgTypeEnum.dianzan
  );
  return dianzanList.length;
});

const selectedCategory = (parent_category_id, child_category_id) => {
  const parentCategory = appStore.areaList.find(
    (item) => item.id === parent_category_id
  );
  if (parentCategory && parentCategory.children) {
    const childCategory = parentCategory?.children.find(
      (item) => item.id === child_category_id
    );
    if (parentCategory && childCategory) {
      return `${parentCategory.name}·${childCategory.name}`;
    }
  }
  return '';
};

const rtcRtt = computed(() => {
  const arr: any[] = [];
  networkStore.rtcMap.forEach((rtc) => {
    arr.push(`${rtc.rtt}ms`);
  });
  return arr.join();
});

const rtcLoss = computed(() => {
  const arr: any[] = [];
  networkStore.rtcMap.forEach((rtc) => {
    arr.push(`${Number(rtc.loss.toFixed(2))}%`);
  });
  return arr.join();
});

const rtcFps = computed(() => {
  const arr: any[] = [];
  networkStore.rtcMap.forEach((rtc) => {
    arr.push(`${Number(rtc.inboundFps.toFixed(2))}`);
  });
  return arr.join();
});
const rtcBytesSent = computed(() => {
  const arr: any[] = [];
  networkStore.rtcMap.forEach((rtc) => {
    arr.push(`${Number(rtc.bytesSent.toFixed(0))}kb/s`);
  });
  return arr.join();
});
const rtcBytesReceived = computed(() => {
  const arr: any[] = [];
  networkStore.rtcMap.forEach((rtc) => {
    arr.push(`${Number(rtc.bytesReceived.toFixed(0))}kb/s`);
  });
  return arr.join();
});

// 初始化
onMounted(async () => {
  setTimeout(() => {
    scrollTo(0, 0);
  }, 100);
  roomId.value = route.params.roomId as string;
  initPull({ roomId: roomId.value, autolay: true });
  if (route.query[URL_QUERY.isBilibili] === '1') {
    isBilibili.value = true;
    const res = await fetchLiveRoomBilibili();
    roomId.value = `${res.data.id!}`;
  }
  initRoomId(roomId.value);
  await handleFindLiveRoomInfo();
  if (!liveRoomInfo.value) return;
  handleRefresh();
  appStore.videoControls.fps = true;
  appStore.videoControls.fullMode = true;
  appStore.videoControls.kbs = true;
  appStore.videoControls.line = true;
  appStore.videoControls.networkSpeed = true;
  appStore.videoControls.pageFullMode = true;
  appStore.videoControls.pipMode = true;
  appStore.videoControls.renderMode = LiveRenderEnum.video;
  appStore.videoControls.resolution = true;
  appStore.videoControls.speed = true;

  videoWrapRef.value = remoteVideoRef.value;

  handleHistoryMsg();
  getGoodsList();
  if (topRef.value && bottomRef.value && remoteVideoRef.value) {
    const res =
      bottomRef.value.getBoundingClientRect().top -
      (topRef.value.getBoundingClientRect().top +
        topRef.value.getBoundingClientRect().height);
    height.value = res;
  }
  if (isBilibili.value) {
    initWs({ roomId: roomId.value, isBilibili: true, isAnchor: false });
  } else {
    initWs({
      roomId: roomId.value,
      isBilibili: false,
      isAnchor: false,
    });
    initRtcReceive();
  }
  getGiftRecord();
  getGiftGroupList();
  handleSendGetLiveUser(Number(roomId.value));
});

// 判断是否是我的直播间
const updateIsMyLiveRoom = () => {
  if (userStore?.userInfo?.live_rooms?.[0]?.id === Number(roomId.value)) {
    isMyLiveRoom.value = true;
  } else {
    isMyLiveRoom.value = false;
  }
};

onMounted(async () => {
  if (userStore?.userInfo?.id) {
    requestFollowingList(userStore?.userInfo?.id);
    await requestFollowersList(userStore?.userInfo?.id);
    checkIsMutualFollow();
    updateIsMyLiveRoom();
  }
});

watch(
  () => userStore?.userInfo?.id,
  async () => {
    if (userStore?.userInfo?.id) {
      requestFollowingList(userStore?.userInfo?.id);
      await requestFollowersList(userStore?.userInfo?.id);
      checkIsMutualFollow();
      updateIsMyLiveRoom();
    }
  }
);

onUnmounted(() => {
  closeWs();
  closeRtc();
  clearInterval(loopGetLiveUserTimer.value);
});

// 请求关注列表
const requestFollowingList = async (id) => {
  const res = await fetchUserFollowingList({
    userId: id,
  });
  if (res.code === 200) {
    followings.value = res.data;
  }
};

// 请求粉丝列表
const requestFollowersList = async (id) => {
  const res = await fetchUserFollowersList({
    userId: id,
  });
  if (res.code === 200) {
    followers.value = res.data;
  }
};

// 判断是否关注
const checkIsMutualFollow = () => {
  isMutualFollow.value = followings.value.some(
    (following: any) => following.id === anchorInfo.value?.id
  );
};

// 关注用户
const handleFollow = async (following: any) => {
  // if (isMutualFollow) {
  //   return;
  // }
  if (isMyLiveRoom.value) {
    window.$message.warning('自己不能关注自己喔～');
    return;
  }
  const res = await fetchUserFollow({
    followingId: following?.id,
    followerId: userStore?.userInfo?.id,
  });
  if (res.code === 200) {
    window.$message.success('关注成功');
    isMutualFollow.value = true;
    // if (route.params.id) {
    //   requestFollowingList(route.params.id);
    //   requestFollowersList(route.params.id);
    // }
  }
};

// 取消关注
const handleUnfollow = async (followingId) => {
  const res = await fetchUserUnfollow({
    followingId,
    followerId: userStore?.userInfo?.id,
  });
  if (res.code === 200) {
    window.$message.success('取消关注成功');
    isMutualFollow.value = false;
    // if (route.params.id) {
    //   requestFollowingList(route.params.id);
    //   requestFollowersList(route.params.id);
    // }
  }
};

// 跳转到二级分区
function handleSecondArea(parentId, childId) {
  const url = router.resolve({
    name: routerName.area,
    query: { parentAreaId: parentId, areaId: childId },
  });
  openToTarget(url.href);
}

// 跳转到用户主页
const handleJump = (id) => {
  const url = router.resolve({
    name: routerName.user,
    params: { id },
  });
  openToTarget(url.href);
};

// 获取直播间信息
async function handleFindLiveRoomInfo() {
  try {
    const res = await fetchFindLiveRoom(Number(roomId.value));
    if (res.code === 200) {
      if (res.data) {
        liveRoomInfo.value = res.data;
        anchorInfo.value = res.data?.users?.[0];
        console.log(res.data.live, '~~~~~');
        if (res.data.live) {
          roomLiving.value = true;
        } else {
          roomLiving.value = false;
        }
        if (isBilibili.value) {
          handleBilibil();
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function handleBilibil() {
  const flv = await fetchLiveBilibiliPlayUrl({
    cid: route.params.roomId,
    platform: 'web',
  });
  const hls = await fetchLiveBilibiliPlayUrl({
    cid: route.params.roomId,
    platform: 'h5',
  });
  const roomInfo = await fetchLiveBilibiliRoomGetInfo({
    room_id: route.params.roomId,
  });
  console.log(flv?.data?.data?.durl?.[0].url, 'flv');
  console.log(hls?.data?.data?.durl?.[0].url, 'hls');
  // roomLiving.value = true;
  appStore.liveLine = LiveLineEnum.hls;
  anchorInfo.value = {
    avatar: roomInfo?.data?.data?.user_cover,
    username: roomInfo?.data?.data?.title,
  };
  liveRoomInfo.value = {
    type: LiveRoomTypeEnum.system,
    pull_flv_url: flv?.data?.data?.durl?.[0].url,
    pull_hls_url: hls?.data?.data?.durl?.[0].url,
    areas: [{ name: roomInfo?.data?.data?.area_name }],
    desc: roomInfo?.data?.data?.description,
  };
  handleRefresh();
}

// 获取直播间在线用户
function handleSendGetLiveUser(liveRoomId: number) {
  clearInterval(loopGetLiveUserTimer.value);
  async function main() {
    const res = await fetchLiveRoomOnlineUser({ live_room_id: liveRoomId });
    if (res.code === 200) {
      liveUserList.value = res.data;
    }
  }
  setTimeout(async () => {
    await getUserRank(route.params.roomId);
    await main();
    getOnLineRankList();
  }, 500);
  loopGetLiveUserTimer.value = setInterval(async () => {
    // await getUserRank(route.params.roomId)
    await main();
    // getOnLineRankList()
  }, 1000 * 4);
}

const getUserRank = async (id) => {
  const res = await fetchLiveRoomUserRank({ live_room_id: id });
  if (res.code === 200) {
    rankList.value = res.data?.rows;
  }
};

const getOnLineRankList = () => {
  if (liveUserList.value?.length > 0) {
    liveUserList.value.forEach((item) => {
      const rankItem = rankList.value.find(
        (ritem) => ritem.id === item.value.user_id
      );
      item.score = rankItem?.contribute_score;
    });
  }
};

// 发送弹幕
function handleSendDanmu() {
  sendDanmuTxt(danmuStr.value, roomId.value);
  danmuStr.value = '';
}

// 获取得到的礼物列表
async function getGiftGroupList() {
  const res = await fetchGiftGroupList({
    live_room_id: Number(roomId.value),
    status: GiftRecordStatusEnum.ok,
  });
  if (res.code === 200) {
    // @ts-ignore
    giftGroupList.value = res.data.rows.map((item) => {
      try {
        const json = JSON.parse(item.goods_snapshot!);
        item.goods = json;
      } catch (error) {
        console.log(error);
      }
      return item;
    });
  }
}

async function getGiftRecord() {
  const res = await fetchGiftRecordList({
    live_room_id: Number(roomId.value),
    status: GiftRecordStatusEnum.ok,
  });
  if (res.code === 200) {
    giftRecordList.value = res.data.rows;
  }
}

// 获取弹幕列表
async function handleHistoryMsg() {
  try {
    const res = await fetchGetWsMessageList({
      nowPage: 1,
      pageSize: liveRoomInfo.value?.history_msg_total || 50,
      orderName: 'created_at',
      orderBy: 'desc',
      live_room_id: Number(roomId.value),
      is_show: WsMessageIsShowEnum.yes,
      is_verify: WsMessageIsVerifyEnum.yes,
    });
    if (res.code === 200) {
      res.data.rows.forEach((v) => {
        damuList.value.unshift(v);
      });
      console.log('----', damuList);
      if (
        liveRoomInfo.value?.system_msg &&
        liveRoomInfo.value?.system_msg !== ''
      ) {
        damuList.value.push({
          send_msg_time: +new Date(),
          live_room_id: Number(roomId.value),
          id: -1,
          content: liveRoomInfo.value.system_msg,
          content_type: WsMessageContentTypeEnum.txt,
          msg_type: DanmuMsgTypeEnum.system,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
}

// 弹幕列表滚动到最下面
watch(
  () => damuList.value.length,
  () => {
    setTimeout(() => {
      handleScrollTop();
    }, 0);
  }
);

watch(
  () => liveRoomInfo.value,
  (newval) => {
    if (newval) {
      getBg();
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

/**
 * 禁言用户逻辑：
 * 主播开播了，可以禁言所有看自己直播的用户
 * 使用redis存储记录，key是主播直播间id，value是禁言用户id
 */
function handleDisableSpeakingUser() {
  console.log('handleDisableSpeakingUser');
}

function handleCancelDisableSpeakingUser() {
  console.log('handleCancelDisableSpeakingUser');
}

function getBg() {
  try {
    const reg = /.+\.mp4$/g;
    const url = liveRoomInfo.value?.bg_img;
    if (url) {
      if (reg.exec(url)) {
        configVideo.value = url;
      } else {
        configBg.value = url;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function handlePushStr(str) {
  danmuStr.value += str;
  showEmoji.value = false;
  danmuIptRef.value?.focus();
}

function handleEmoji() {
  showEmoji.value = !showEmoji.value;
}

function mockClick() {
  if (!loginTip()) {
    return;
  }
  // if (!commentAuthTip()) {
  //   return;
  // }
  uploadRef.value?.click();
}

async function uploadChange() {
  const fileList = uploadRef.value?.files;
  if (fileList?.length) {
    try {
      msgLoading.value = true;
      msgIsFile.value = WsMessageIsFileEnum.yes;
      const res = await useUpload({
        prefix: QINIU_KODO.hssblog.prefix['billd-live/msg-image/'],
        file: fileList[0],
      });
      if (res?.resultUrl) {
        sendDanmuImg(res.resultUrl || '错误图片');
      }
    } catch (error) {
      console.log(error);
    } finally {
      msgIsFile.value = WsMessageIsFileEnum.no;
      msgLoading.value = false;
      if (uploadRef.value) {
        uploadRef.value.value = '';
      }
    }
  }
}

// 全屏
function handleFullScreen() {
  const el = remoteVideoRef.value?.childNodes[0];
  if (el) {
    useFullScreen(el);
  }
}

// 画中画
async function hanldePictureInPicture() {
  if (appStore.videoControlsValue.pipMode) {
    document.exitPictureInPicture();
  } else {
    const el = remoteVideoRef.value?.childNodes[0];
    if (el && remoteVideoRef.value) {
      await usePictureInPicture(el, remoteVideoRef.value);
    }
  }
}

// 刷新
function handleRefresh() {
  if (liveRoomInfo.value) {
    handlePlay(liveRoomInfo.value);
  }
}

// 获取礼物列表
async function getGoodsList() {
  try {
    giftLoading.value = true;
    const res = await fetchGoodsList({
      type: GoodsTypeEnum.gift,
      orderName: 'created_at',
      orderBy: 'desc',
    });
    if (res.code === 200) {
      giftGoodsList.value = res.data.rows;
      res.data.rows.forEach((item) => {
        giftIconMap.value[item.name || ''] = item.cover;
      });
      console.log(giftIconMap.value, '?????');
    }
  } catch (error) {
    console.log(error);
  } finally {
    giftLoading.value = false;
  }
}

function handleRecharge() {
  if (!loginTip()) return;
  showRecharge.value = true;
}

function handleScrollTop() {
  if (danmuListRef.value) {
    danmuListRef.value.scrollTop = danmuListRef.value.scrollHeight + 10000;
  }
}

function handleTabChange(tab) {
  curTab.value = tab;
}

// 送礼通知
const giftNotifications = reactive<any>([
  // 示例数据，实际应用中将会动态更新
  // {
  //   id: 1,
  //   avatar: "https://i0.hdslb.com/bfs/live/new_room_cover/f200fd26754a07badc2f3d5e7dba951ef28d5e16.jpg",
  //   username: "用户1",
  //   giftName: "玫瑰花",
  //   giftIcon: 'https://resource.hsslive.cn/billd-live/image/c5258ebf3a79c7d67ef8ae95062c8fe4.webp',
  // },
]);

const commentText = ref('');

async function handlePay(item: IGoods) {
  if (!loginTip()) {
    return;
  }
  if (isMyLiveRoom.value) {
    window.$message.warning('自己不能为自己投喂礼物喔～');
    return;
  }
  try {
    const res = await fetchGiftRecordCreate({
      goodsId: item.id!,
      goodsNums: 1,
      liveRoomId: Number(roomId.value),
      isBilibili: false,
    });
    if (res.code === 200) {
      window.$message.success('投喂成功！');
      sendDanmuReward(item.name || '');
      const giftData = {
        id: Date.now(),
        avatar: userStore.userInfo?.avatar,
        username: userStore.userInfo?.username,
        giftName: item.name,
        giftIcon: item.cover,
      };
      giftNotifications.push(giftData);

      // 4秒后移除通知
      setTimeout(() => {
        const index = giftNotifications.findIndex(
          (notification) => notification.id === giftData.id
        );
        if (index !== -1) {
          giftNotifications.splice(index, 1);
        }
      }, 4000);
    }
    userStore.updateMyWallet();
    getGiftGroupList();
  } catch (error) {
    console.log(error);
  }
}
// 模拟用户进入数据
const userEnterMessages = reactive<{ id: number; username: string }[]>([]);

// 模拟用户进入直播间
const addUserToRoom = (username: string) => {
  const message = { id: Date.now(), username };
  userEnterMessages.push(message);

  // 每条消息展示2秒后删除
  setTimeout(() => {
    const index = userEnterMessages.findIndex((msg) => msg.id === message.id);
    if (index !== -1) {
      userEnterMessages.splice(index, 1);
    }
  }, 2000); // 2秒后删除
};

// 模拟实时添加用户进入
setInterval(() => {
  addUserToRoom('用户' + Math.floor(Math.random() * 100));
}, 3000); // 每3秒模拟一个用户进入
</script>

<style lang="scss" scoped>
.popover-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 140px;

  .item {
    margin-top: 10px;
    margin-right: 10px;
    text-align: center;

    &:nth-child(1),
    &:nth-child(2),
    &:nth-child(3) {
      margin-top: 5px;
    }

    &:nth-child(3n) {
      margin-right: 0px;
    }

    .ico {
      position: relative;
      width: 40px;
      height: 40px;
      background-position: center center;
      background-size: cover;
      background-repeat: no-repeat;
    }

    .nums {
      margin-top: 5px;
      color: #18191c;
    }
  }
}

.pull-wrap {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  /* margin: 15px auto 0; */
  width: 100%;
  background-image: url('@/assets/img/live_pull_bg.webp');
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  padding-top: 20px;
  padding-bottom: 30px;
  height: 100%;

  .bg-img-wrap {
    position: absolute;
    top: $layout-head-h;
    left: 50%;
    max-width: 1920px;
    max-height: 890px;
    width: 100%;
    /* height: 100%; */
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    transform: translateX(-50%);

    .bg-img {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
    }

    .bg-video {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
    }
  }

  .left {
    position: relative;
    display: inline-block;
    // overflow: hidden;
    box-sizing: border-box;
    width: $w-900;
    height: 730px;
    border-radius: 6px;
    background-color: #ffffff;
    color: #61666d;
    vertical-align: top;
    margin-right: 20px;

    .head {
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 10px 20px;
      height: 80px;
      color: #18191c;

      .info {
        display: flex;
        align-items: center;
        text-align: initial;

        .detail {
          margin-left: 15px;

          .top {
            display: flex;
            margin-bottom: 5px;

            .follow {
              margin-left: 10px;

              .unfollow {
                display: flex;
                align-items: center;
                padding: 5px 10px;
                box-sizing: border-box;
                color: #fff;
                height: 20px;
                border-radius: 12px;
                background-color: $theme-color-gold;
                font-size: 12px;
                cursor: pointer;
              }

              .followed {
                display: flex;
                align-items: center;
                padding: 5px 10px;
                box-sizing: border-box;
                background-color: #f5f6f9;
                color: #9499a0;
                height: 20px;
                border-radius: 12px;
                font-size: 12px;
                cursor: pointer;
              }

              .f-right {
                display: flex;
                align-items: center;
                padding: 0 10px;
                height: 100%;
                border-radius: 0 12px 12px 0;
                background-color: #e3e5e7;
              }
            }

            .rtc-info {
              display: flex;
              align-items: center;

              .item {
                margin-right: 10px;
                font-size: 14px;
              }
            }
          }

          .bottom {
            display: flex;
            font-size: 14px;

            .area {
              color: #9499a0;
              cursor: pointer;
            }
          }
        }
      }

      .other {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 12px;

        .top {
          display: flex;
          margin-top: 30px;

          .item {
            display: flex;
            align-items: center;
            margin-right: 10px;
            color: #9499a0;
          }
        }

        .bottom {
          font-size: 12px;

          .tag {
            display: inline-block;
            margin-right: 10px;
            padding: 4px 10px;
            border-radius: 10px;
            background-color: $theme-color-gold;
            color: white;
            text-align: center;
            line-height: 1;
            cursor: pointer;
          }
        }
      }
    }

    .video-wrap {
      position: relative;
      display: flex;
      overflow: hidden;
      align-items: center;
      justify-content: space-between;
      height: calc(100% - 80px - 100px);
      background-color: rgba($color: #000000, $alpha: 0.5);

      .remote-video {
        position: relative;
        width: 100%;
        height: 100%;

        :deep(video) {
          position: absolute;
          top: 50%;
          left: 50%;
          display: block;
          margin: 0 auto;
          height: calc(100% - 80px - 100px);
          transform: translate(-50%, -50%);
        }

        :deep(canvas) {
          position: absolute;
          top: 50%;
          left: 50%;
          display: block;
          margin: 0 auto;
          height: calc(100% - 80px - 100px);
          transform: translate(-50%, -50%);
        }
      }

      .video-controls {
        display: none;
      }

      &:hover {
        .video-controls {
          display: block;
        }
      }

      .cover {
        position: absolute;
        background-position: center center;
        background-size: cover;
        filter: blur(10px);

        inset: 0;
      }

      .no-live {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 20;
        color: #9f9c9c;
        font-size: 28px;
        transform: translate(-50%, -50%);
      }
    }

    .gift-list {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      box-sizing: border-box;
      padding: 5px 10px;
      height: 100px;

      /* > :last-child {
        position: absolute;
      } */

      .item {
        display: flex;
        align-items: center;
        flex-direction: column;
        box-sizing: border-box;
        width: 90px;
        height: 88px;
        text-align: center;
        cursor: pointer;
        border-radius: 4px;

        &:hover {
          background-color: #ebeae9;
        }

        .ico {
          position: relative;
          margin-top: 6px;
          margin-bottom: 2px;
          width: 40px;
          height: 40px;
          background-position: center center;
          background-size: cover;
          background-repeat: no-repeat;

          &.wallet {
            background-image: url('@/assets/img/live_wallet.png');
          }

          .badge {
            position: absolute;
            top: -8px;
            right: -10px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2px;
            border-radius: 2px;
            color: white;

            .txt {
              display: inline-block;
              line-height: 1;
              transform-origin: center !important;

              @include minFont(10);
            }
          }
        }

        .name {
          font-size: 12px;
          color: #18191c;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          font-family: PingFang SC;
        }

        .price {
          color: #9499a0;
          font-size: 12px;
          margin-top: 2px;
          font-family: PingFang SC;
        }
      }

      .vertical-separator {
        position: absolute;
        right: 97px;
        top: 50%;
        border-left: 1px solid #e3e5e7;
        width: 1px;
        height: 50px;
        transform: translateY(-50%);
      }
    }

    .ad-wrap-b {
      position: absolute;
      bottom: -10px;
      left: 0;
      z-index: 999;
      width: 100%;
      // height: 150px;
      border-radius: 10px;
      // background-color: red;
      transform: translateY(100%);

      ins {
        width: 100%;
        height: 100%;
      }
    }
  }

  .right {
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    width: 300px;
    height: 730px;
    border-radius: 6px;
    background-color: #ffffff;
    color: #9499a0;
    /* overflow: hidden; */

    .rank-wrap {
      border-bottom: 1px solid #e3e5e7;
      height: 106px;

      .tab {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 30px;
        font-size: 12px;
        width: 100%;
        margin-top: 5px;

        &_item {
          width: 50%;
          display: flex;
          justify-content: center;
          cursor: pointer;
          color: #000000;
          font-weight: 500;
        }
      }

      .user-list {
        /* overflow-y: scroll; */
        box-sizing: border-box;
        padding: 0 15px;

        @extend %customScrollbar;

        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 5px;
          font-size: 12px;

          .info {
            display: flex;
            align-items: center;
            cursor: pointer;

            .username {
              margin-left: 10px;
              color: black;
            }
          }
        }
      }
    }

    .danmu-list {
      overflow-y: scroll;
      box-sizing: border-box;
      padding-top: 4px;
      padding-left: 10px;
      height: calc(100% - 12px - 100px - 135px);
      background-color: #f6f7f8;
      text-align: initial;
      position: relative;

      @extend %customScrollbar;

      .item {
        box-sizing: border-box;
        margin-bottom: 4px;
        padding: 2px 0;
        white-space: normal;
        word-wrap: break-word;
        font-size: 13px;
        display: flex;
        align-items: center;

        .roomer {
          font-size: 10px;
          padding: 0 4px;
          border-radius: 8px;
          color: #ff6699;
          border: 1px solid #ff6699;
          background-color: transparent;
          margin-top: 2px;
        }

        .gift-icon {
          margin-left: 5px;

          img {
            width: 30px;
            height: 30px;
          }
        }

        .good {
          width: 30px;
          height: 30px;
          opacity: 0.9;

          @extend %containBg;

          @include setBackground('@/assets/img/gift_good.webp');
        }

        .reward {
          color: $theme-color-gold;
          font-weight: bold;
        }

        .name,
        .time {
          color: #9499a0;
          margin-left: 3px;

          &.system {
            color: red;
          }

          .dropdown-wrap {
            :deep(.container) {
              width: 120px;
            }
          }

          .list {
            .item {
              &:hover {
                &.operator {
                  color: $theme-color-gold;
                  cursor: pointer;
                }
              }
            }
          }
        }

        .msg {
          margin-top: 4px;
          color: #61666d;
          margin-left: 3px;

          &.dianzan {
            color: #9499a0;
            font-size: 12px;
          }

          &.img {
            img {
              width: 80%;
            }
          }
        }
      }

      /* .reward {
        display
      } */
    }

    .send-msg {
      position: absolute;
      bottom: 0;
      left: 0;
      box-sizing: border-box;
      padding: 2px 10px;
      width: 100%;
      height: 135px;
      background-color: #f6f7f8;

      .disableSpeaking {
        cursor: no-drop;

        .bg {
          position: absolute !important;

          @extend %maskBg;
        }

        .txt {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          text-align: center;
          font-size: 14px;
          transform: translate(-50%, -50%);
        }
      }

      .control {
        display: flex;
        margin: 4px 0;

        .emoji-list {
          position: absolute;
          top: 0;
          right: 0;
          left: 5px;
          overflow: scroll;
          box-sizing: border-box;
          padding: 3px;
          padding-right: 0;
          height: 160px;
          background-color: #fff;
          transform: translateY(-100%);
          background-color: #faf4d8;
          width: 230px;
          border: 1px solid #e2e2e2;
          border-radius: 4px;

          &::-webkit-scrollbar {
            width: 3px;
          }

          @extend %customScrollbar;

          .item {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            width: 14%;
            height: 18%;
            border: 1px solid #f8f8f8;
            font-size: 20px;
            cursor: pointer;
          }
        }

        .ico {
          margin-right: 6px;
          width: 24px;
          height: 24px;
          cursor: pointer;

          .input-upload {
            width: 0;
            height: 0;
            opacity: 0;
          }

          &.emoji {
            @include setBackground('@/assets/img/emoji.png');
          }

          &.dianzan {
            @include setBackground('@/assets/img/dianzan.png');
          }
        }
      }

      .input-control {
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        .input-chat {
          width: 100%;
          position: relative;
        }

        textarea {
          height: 56px;
          width: 100%;
          resize: none;
          outline: 0;
          border: 0;
          background-color: #fff;
          border-radius: 4px;
          padding: 8px 8px 10px 8px;
          color: #2f3238;
          overflow: hidden;
          font-size: 12px;
          line-height: 19px;
          box-sizing: border-box;
          margin-bottom: 2px;
        }

        .limit-size {
          position: absolute;
          right: 10px;
          bottom: 15px;
          font-size: 12px;
          line-height: 19px;
          color: #c1c1c1;
        }
      }

      .ipt {
        display: block;
        box-sizing: border-box;
        margin: 0 auto;
        padding: 10px;
        width: 100%;
        height: 60px;
        outline: none;
        border: 1px solid hsla(0, 0%, 60%, 0.2);
        border-radius: 4px;
        background-color: #fff;
        font-size: 14px;

        &::placeholder {
          font-size: 13px;
        }
      }

      .btn {
        box-sizing: border-box;
        margin-top: 4px;
        margin-left: auto;
        padding: 4px;
        width: 70px;
        height: 24px;
        border-radius: 4px;
        background-color: $theme-color-gold;
        color: white;
        text-align: center;
        font-size: 12px;
        cursor: pointer;
      }
    }
  }

  .ad-wrap-a {
    position: fixed;
    top: 300px;
    left: 10px;
    z-index: 999;
    width: 250px;
    // height: 150px;
    border-radius: 10px;

    // background-color: red;
    ins {
      width: 100%;
      height: 100%;
    }
  }

  &.isPageFull {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    justify-content: space-between;
    margin: 0;
    width: 100vw;
    height: 100vh;

    .left {
      width: calc(100vw - 300px);
      height: 100%;
      border-radius: 0;

      .head {
        display: none;
      }

      .video-wrap {
        height: calc(100% - 100px);

        .remote-video {
          :deep(video) {
            max-width: 100%;
          }

          :deep(canvas) {
            max-width: 100%;
          }
        }
      }

      .gift-list {
        background-color: #8ec5fc;
        background-image: linear-gradient(62deg, #8ec5fc 0%, #e0c3fc 100%);

        .item {
          .name {
            color: white;
          }

          .price {
            color: black;
          }
        }
      }
    }

    .right {
      width: 300px;
      height: 100%;
      border-radius: 0;

      .rank-wrap {
        background-color: #8ec5fc;
        background-image: linear-gradient(62deg, #8ec5fc 0%, #e0c3fc 100%);
      }

      .send-msg {
        background-color: #0093e9;
        background-image: linear-gradient(328deg, #0093e9 0%, #80d0c7 100%);
      }
    }
  }
}

.gift-notifications {
  position: absolute;
  top: 120px;
  left: 10px;
  z-index: 10;
}

.gift-notification {
  display: flex;
  align-items: center;
  padding: 5px;
  padding-bottom: 2px;
  /* margin-bottom: 10px; */
  /* background: linear-gradient(to right, #4f8dd3, transparent); */
  background: linear-gradient(to right, #f69, transparent);
  /* 背景渐变从左到右 */
  color: white;
  border-radius: 30px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  margin-bottom: 10px;

  animation: slide-in-out 4s forwards;
  position: relative;
  width: 180px;
}

.gift-notification-content {
  display: flex;
  align-items: center;
  /* width: 100%; */
}

.gift-avatar img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
  /* margin-top: 5px; */
}

.gift-info {
  /* flex-grow: 1; */
  margin-right: 10px;
}

.gift-user {
  font-size: 12px;
  font-weight: bold;
}

.gift-name {
  font-size: 12px;
  color: #ffd700;
}

.gift-icon img {
  width: 30px;
  height: 30px;
}

@keyframes slide-in-out {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }

  25% {
    transform: translateX(0);
    opacity: 1;
  }

  75% {
    transform: translateX(0);
    opacity: 1;
  }

  100% {
    transform: translateX(-100%);
    opacity: 0;
  }
}

.enter-notification-box {
  position: absolute;
  bottom: 135px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 300px;
  height: 30px;
  /* 固定高度 */
  background-color: #f6f7f8;
  color: white;
  font-size: 12px;
  overflow: hidden;
  color: #9499a0;
  /* 隐藏超出的部分 */
}

.enter-notification {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  /* justify-content: center; */
  padding: 5px;
  padding-left: 10px;
  animation: slideUp 0.5s ease-out forwards;
}

@keyframes slideUp {
  0% {
    transform: translateY(50px);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.enter-notification-box .enter-notification:nth-child(n + 2) {
  animation: slideUp 0.5s ease-out forwards;
}

.ico {
  width: 15px;
  height: 15px;
  opacity: 0.9;
  margin-right: 4px;

  @extend %containBg;

  &.eye {
    @include setBackground('@/assets/img/eye_black.png');
  }

  &.like {
    @include setBackground('@/assets/img/like.png');
  }
}

// 屏幕宽度大于1500的时候
@media screen and (min-width: $w-1500) {
  .pull-wrap {
    width: $w-1450;

    .left {
      width: $w-1100;

      :deep(video) {
        max-width: $w-1100;
      }

      :deep(canvas) {
        max-width: $w-1100;
      }
    }

    .right {
      width: $w-300;
    }
  }
}
</style>
