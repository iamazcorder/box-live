<template>
  <div
    class="home-wrap"
    ref="docRef"
  >
    <div class="play-container">
      <div
        v-if="configBg && configBg !== ''"
        class="bg-img"
      ></div>
      <video
        v-if="configVideo && configVideo !== ''"
        class="bg-video"
        :src="configVideo"
        muted
        autoplay
        loop
      ></video>
      <!-- <div class="slider-wrap">
        <div
          v-for="(item, index) in interactionList"
          :key="index"
        >
          <Slider
            v-if="item.length"
            :list="item"
            :width="docW"
            :speed="60"
            :direction="index % 2 === 0 ? 'l-r' : 'r-l'"
            :customStyle="{ margin: '0 auto' }"
          ></Slider>
        </div>
      </div> -->

      <div class="container">
        <div
          v-loading="videoLoading"
          class="left"
          ref="videoWrapTmpRef"
          @click="showJoinBtn = !showJoinBtn"
        >
          <div
            v-if="currentLive?.live_room?.cdn === SwitchEnum.yes"
            class="cdn-ico"
          >
            <div class="txt">CDN</div>
          </div>
          <div class="logo-watermark">Box直播</div>
          <div class="cover"></div>
          <div
            v-if="currentLive?.live_room"
            ref="remoteVideoRef"
            class="remote-video"
          ></div>
          <template v-if="currentLive?.live_room">
            <div class="video-controls">
              <VideoControls
                :resolution="videoResolution"
                @refresh="handleRefresh"
                :control="{
                  line: true,
                }"
                :liveRoom="currentLive?.live_room"
                :liveLineList="[LiveLineEnum.flv, LiveLineEnum.hls]"
              >
              </VideoControls>
            </div>

            <div
              class="join-btn"
              :class="{
                show: showJoinBtn,
              }"
            >
              <div
                class="btn"
                @click="joinRoom(currentLive?.live_room, 2)"
              >
                进入直播
              </div>
            </div>
          </template>
        </div>
        <div class="right">
          <div
            v-if="topLiveRoomList.length"
            class="list"
          >
            <div
              v-for="(item, index) in topLiveRoomList"
              :key="index"
              :class="{
                item: 1,
                active: item.live_room?.id === currentLive?.live_room?.id,
              }"
              :style="{
                backgroundImage: `url(${
                  item.live_room?.cover_img || item.user?.avatar
                })`,
              }"
              @click="changeLive(item)"
            >
              <div class="hidden">
                <div
                  class="cdn-ico"
                  v-if="item?.live_room?.cdn === SwitchEnum.yes"
                >
                  <div class="txt">CDN</div>
                </div>
              </div>
              <div
                class="border"
                :style="{
                  opacity:
                    item.live_room?.id === currentLive?.live_room?.id ? 1 : 0,
                }"
              ></div>
              <div
                v-if="item.live_room?.id === currentLive?.live_room?.id"
                class="triangle"
              ></div>
              <div class="txt">{{ item.live_room?.name }}</div>
            </div>
          </div>
          <div
            v-else
            class="none"
          >
            {{ t('home.noliveRoomTip') }}
          </div>
        </div>
      </div>
    </div>
    <div class="detail-container">
      <div class="focus-area-ctnr">
        <div class="focus-title-item">
          <div class="focus-left-ctnr">
            <div class="focus-titile">我的关注</div>
            <div
              class="focus-online-ctnr p-relative"
              v-if="liveUsers?.length !== 0"
            >
              <span class="text">{{ liveUsers?.length || 0 }}人正在直播中</span>
            </div>
          </div>
          <div
            class="focus-all"
            @click="handleFocusAll"
          >
            查看全部&gt;
          </div>
        </div>
        <div
          :class="`${
            liveUsers?.length > 2
              ? 'focus-content-ctnr-wrap'
              : 'focus-content-ctnr'
          } `"
        >
          <template v-if="liveUsers?.length === 1 || liveUsers?.length === 2">
            <div
              class="focus-item"
              v-for="item in liveUsers"
            >
              <div class="focus-image-ctnr p-relative online-focus">
                <div class="living-icon p-absolute">
                  <div class="living-icon-col dp-i-block h-100"></div>
                  <div class="living-icon-col dp-i-block h-100"></div>
                  <div class="living-icon-col dp-i-block h-100"></div>
                </div>
                <a
                  ><img
                    class="focus-image"
                    :src="item.avatar"
                /></a>
              </div>
              <div class="focus-name-fanse">
                <div class="focus-name left">{{ item.username }}</div>
                <div
                  class="focus-fanse"
                  data-watched="21.9万"
                  data-switch="false"
                  data-online="219013"
                >
                  21.9万人看过
                </div>
              </div>
            </div>
            <div
              class="focus-item"
              v-if="liveUsers?.length === 1"
            >
              <div class="focus-image-empty"></div>
              <div class="focus-empty-text">没有更多主播了～</div>
            </div>
          </template>
          <template v-if="liveUsers?.length > 2">
            <div
              class="focus-content-item"
              v-for="item in liveUsers.slice(0, 6)"
            >
              <div class="focus-image-ctnr p-relative online-focus">
                <div class="living-icon p-absolute">
                  <div class="living-icon-col dp-i-block h-100"></div>
                  <div class="living-icon-col dp-i-block h-100"></div>
                  <div class="living-icon-col dp-i-block h-100"></div>
                </div>
                <a
                  ><img
                    class="focus-image"
                    :src="item.avatar"
                /></a>
              </div>
              <div class="focus-name-fanse">
                <div class="focus-name-wrap">{{ item.username }}</div>
              </div>
            </div>
          </template>
          <div
            v-if="liveUsers?.length === 0"
            class="empty-online"
          >
            暂无直播中的主播～
          </div>
        </div>
      </div>
      <div class="highlight-areas-ctnr v-top t-center no-select">
        <div class="hight-title">分区推荐</div>
        <div
          class="highlight-area-item dp-i-block t-left p-relative focus-highlight-area-item focus-highlight-area-item-first"
          @mouseenter="hoveredIndex = index"
          @mouseleave="hoveredIndex = -1"
          v-for="(item, index) in appStore.areaList.slice(0, 7)"
          @click.prevent="changeArea(item.id)"
        >
          <div :class="`area-icon area-icon-${item.id}`"></div>
          <div class="area-detail">
            <div :class="`area-name area-name-${item.id}`">
              {{ item.name }}
            </div>
            <div class="area-desc">{{ item.desc }}</div>
            <!-- 使用 CSS 过渡控制 hover-box 显示隐藏 -->
            <div
              class="hover-box"
              :class="`${
                hoveredIndex === index ? 'hover-visible' : ''
              } hover-box-${item.id}`"
              @click.stop.prevent=""
            >
              <div class="top">{{ item.desc }}</div>
              <div class="content">
                <div
                  v-for="childItem in appStore.areaTagsMap[
                    item.id || -1
                  ]?.slice(0, 6)"
                  class="content-item"
                  @click.stop.prevent="handleSecondArea(item.id, childItem.id)"
                >
                  {{ childItem.name }}
                </div>
              </div>
              <div
                class="bottom"
                @click.stop.prevent="handleAreaAll(item.id)"
              >
                查看全部&gt;
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content-container">
      <PreviewCarousel style="margin-right: 20px" />
      <ReservationNotification style="margin-right: 20px" />
      <Rankings />
    </div>
    <div class="area-container">
      <!-- <div class="area-item">
        <div class="title">{{ t('home.recommendLive') }}</div>
        <div class="live-room-list">
          <div v-for="(item, indey) in otherLiveRoomList" :key="indey" class="live-room"
            @click="joinRoom(item.live_room, 2)">
            <div class="cover" v-lazy:background-image="item?.live_room?.cover_img || item?.user?.avatar
              ">
              <div v-if="item?.live_room?.cdn === SwitchEnum.yes" class="cdn-ico">
                <div class="txt">CDN</div>
              </div>
              <div class="txt">{{ item?.live_room?.users?.[0].username }}</div>
            </div>
            <div class="desc">{{ item?.live_room?.name }}</div>
          </div>
          <div v-if="!otherLiveRoomList.length" class="null">
            {{ t('common.nonedata') }}
          </div>
        </div>
      </div> -->

      <div class="area-item">
        <div class="title">{{ t('home.recommendLive') }}</div>
        <div class="live-room-list">
          <div
            v-for="(iten, indey) in bilibiliLiveRoomList"
            :key="indey"
            class="live-room"
            @click="joinRoom(iten.live_room, 1)"
          >
            <div
              class="cover"
              v-lazy:background-image="iten?.live_room?.cover_img"
            >
              <div
                v-if="iten?.live_room?.cdn === SwitchEnum.yes"
                class="cdn-ico"
              >
                <div class="txt">CDN</div>
              </div>
              <div class="txt">{{ iten?.live_room?.area_name }}</div>
            </div>
            <div class="desc">
              <div class="avatar">
                <div
                  class="avatar-wrap"
                  style="--width: 40px"
                >
                  <div class="cycle-wrap">
                    <img :src="iten?.user?.avatar" />
                  </div>
                  <div class="border"></div>
                </div>
              </div>
              <div class="info">
                <div class="top">
                  <div class="txt">{{ iten?.live_room?.name }}</div>
                  <div class="bottom">
                    <div class="username">{{ iten?.user?.username }}</div>
                    <div class="view"></div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="bilibiliLoading"
              class="null"
            >
              {{ t('common.loading') }}
            </div>
            <div
              v-else-if="!bilibiliLiveRoomList.length"
              class="null"
            >
              {{ t('common.nonedata') }}
            </div>
          </div>
        </div>
      </div>

      <!-- <div
      style="position: fixed; bottom: 200px; right: 0; background-color: red"
    >
      {{ isBottom }}
    </div>
     -->
      <div ref="loadMoreRef"></div>
      <div class="foot">*{{ t('home.copyrightTip') }}~</div>
    </div>
    <div
      class="ad-wrap-a"
      v-if="appStore.useGoogleAd"
    >
      <!-- live-首页广告位1 -->
      <ins
        class="adsbygoogle"
        style="display: block"
        data-ad-client="ca-pub-6064454674933772"
        data-ad-slot="3325489849"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';
import { onMounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { fetchLiveBilibiliGetUserRecommend } from '@/api/bilibili';
import { fetchLiveList } from '@/api/live';
import PreviewCarousel from '@/components/PreviewCarousel/index.vue';
import Rankings from '@/components/Rankings/index.vue';
import ReservationNotification from '@/components/ReservationNotification/index.vue';

import { getFollowedUsersWithLiveRecords } from '@/api/user';
import { sliderList, URL_QUERY } from '@/constant';
import { usePull } from '@/hooks/use-pull';
import { useWebsocket } from '@/hooks/use-websocket';
import { ILive, LiveLineEnum, SwitchEnum } from '@/interface';
import { routerName } from '@/router';
import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';

const router = useRouter();
const userStore = useUserStore();
const appStore = useAppStore();
const canvasRef = ref<Element>();
const bilibiliLoading = ref(false);
const showJoinBtn = ref(false);
const topNums = ref(6);
const configBg = ref('');
const configVideo = ref();
// const configVideo = ref(
//   'https://www.xdyun.com/resldmnqcom/ldq_website/all_ldy/cloudphone_xdyun_ldy_mobile/mobile/assets/xd-video-6c9bcd.mp4'
// );
const currentLive = ref<ILive>();
const topLiveRoomList = ref<ILive[]>([]);
const otherLiveRoomList = ref<ILive[]>([]);
const bilibiliLiveRoomList = ref<ILive[]>([]);
const interactionList = ref<any[]>([]);
const videoWrapTmpRef = ref<HTMLDivElement>();
const remoteVideoRef = ref<HTMLDivElement>();
const docRef = ref<HTMLElement | null>();
const loadMoreRef = ref<HTMLElement | null>();
const hoveredIndex = ref(-1);

const pageParams = reactive({ page: 0, page_size: 30, platform: 'web' });
const { t } = useI18n();
// const {
//   videoWrapRef,
//   videoLoading,
//   videoResolution,
//   handleStopDrawing,
//   handlePlay,
// } = usePull();

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
  handleStopDrawing,
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

const isBottom = ref(false);
const rootMargin = {
  bottom: 600,
  top: 0,
  left: 0,
  right: 0,
};
const liveUsers = ref<any[]>([]);
const roomId = ref('');

onMounted(async () => {
  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((item) => {
        if (item.isIntersecting) {
          isBottom.value = true;
        } else {
          isBottom.value = false;
        }
      });
    },
    {
      // root: '',
      rootMargin: `${rootMargin.top}px ${rootMargin.right}px ${rootMargin.bottom}px ${rootMargin.left}px`,
    }
  );
  intersectionObserver.observe(loadMoreRef.value!);
  handleSlideList();
  await getLiveRoomList();
  init(topLiveRoomList.value?.[0]?.live_room_id);
  // videoWrapRef.value = videoWrapTmpRef.value;
  if (userStore?.userInfo?.id) {
    getRecordList();
  }
});

const init = async (live_room_id) => {
  roomId.value = String(live_room_id);
  initPull({ roomId: roomId.value, autolay: true });
  initRoomId(roomId.value);
  handleRefresh();
  videoWrapRef.value = remoteVideoRef.value;
  videoWrapTmpRef.value = remoteVideoRef.value;
  initWs({
    roomId: roomId.value,
    isBilibili: false,
    isAnchor: false,
  });
  initRtcReceive();
};

// 初始化
onMounted(async () => {
  // roomId.value = route.params.roomId as string;
  // initPull({ roomId: roomId.value, autolay: true });
  // if (route.query[URL_QUERY.isBilibili] === '1') {
  //   isBilibili.value = true;
  //   const res = await fetchLiveRoomBilibili();
  //   roomId.value = `${res.data.id!}`;
  // }
  // initRoomId(roomId.value);
  // await handleFindLiveRoomInfo();
  // if (!liveRoomInfo.value) return;
  // // handleRefresh();
  // appStore.videoControls.fps = true;
  // appStore.videoControls.fullMode = true;
  // appStore.videoControls.kbs = true;
  // appStore.videoControls.line = true;
  // appStore.videoControls.networkSpeed = true;
  // appStore.videoControls.pageFullMode = true;
  // appStore.videoControls.pipMode = true;
  // appStore.videoControls.renderMode = LiveRenderEnum.video;
  // appStore.videoControls.resolution = true;
  // appStore.videoControls.speed = true;
  // videoWrapRef.value = remoteVideoRef.value;
  // handleHistoryMsg();
  // getGoodsList();
  // if (topRef.value && bottomRef.value && remoteVideoRef.value) {
  //   const res =
  //     bottomRef.value.getBoundingClientRect().top -
  //     (topRef.value.getBoundingClientRect().top +
  //       topRef.value.getBoundingClientRect().height);
  //   height.value = res;
  // }
  // if (isBilibili.value) {
  //   initWs({ roomId: roomId.value, isBilibili: true, isAnchor: false });
  // } else {
  //   initWs({
  //     roomId: roomId.value,
  //     isBilibili: false,
  //     isAnchor: false,
  //   });
  //   initRtcReceive();
  // }
  // getGiftRecord();
  // getGiftGroupList();
  // handleSendGetLiveUser(Number(roomId.value));
});

watch(
  () => userStore?.userInfo?.id,
  () => {
    if (userStore?.userInfo?.id) {
      getRecordList();
    }
  }
);

watch(
  () => isBottom.value,
  async (newval) => {
    if (newval) {
      const arr = await handleBilibilData();
      bilibiliLiveRoomList.value.push(...arr);
    }
  },
  {
    immediate: true,
  }
);

function changeArea(id) {
  router.push({ name: routerName.area, query: { parentAreaId: id } });
}

async function handleBilibilData() {
  if (bilibiliLoading.value) return [];
  bilibiliLoading.value = true;
  let arr: any = [];
  try {
    pageParams.page += 1;
    const res = await fetchLiveBilibiliGetUserRecommend(pageParams);
    // const list = res.data?.list;
    const list = res?.data?.data?.list;
    if (list) {
      arr = list.map((item) => {
        return {
          id: item.roomid,
          user: { username: item.uname, avatar: item.face },
          live_room: {
            id: item.roomid,
            name: item.title,
            cover_img: item.cover,
            area_name: item.area_name,
          },
        };
      });
    }
  } catch (error) {
    pageParams.page -= 1;
    console.log(error);
  }
  bilibiliLoading.value = false;
  return arr;
}

function handleSlideList() {
  const row = 2;
  const res: any[] = [];
  const count = Math.ceil(sliderList.length / row);
  for (let i = 0, len = sliderList.length; i < len; i += count) {
    const item = sliderList.slice(i, i + count);
    res.push([...item]);
  }
  interactionList.value = res;
}

function handleRefresh() {
  if (currentLive.value) {
    playLive(currentLive.value);
  }
}

function playLive(item: ILive) {
  handleStopDrawing();
  canvasRef.value?.childNodes?.forEach((item) => {
    item.remove();
  });
  currentLive.value = item;
  handlePlay(item.live_room!);
}

function changeLive(item: ILive) {
  if (item.id === currentLive.value?.id) return;
  init(item?.live_room_id);
  // if (
  //   ![
  //     LiveRoomTypeEnum.wertc_live,
  //     LiveRoomTypeEnum.wertc_meeting_one,
  //     LiveRoomTypeEnum.wertc_meeting_two,
  //   ].includes(item.live_room!.type!)
  // ) {
  //   appStore.liveLine = LiveLineEnum.hls;
  // }
  playLive(item);
}

async function getLiveRoomList() {
  try {
    const res = await fetchLiveList({
      // orderName: 'created_at',
      // orderBy: 'desc',
      childOrderName: 'priority,name',
      childOrderBy: 'desc,asc',
      // status: 0,
      // is_show: 0,
      // cdn: 0,
      // is_fake: 0,
      // live_room_id: 1,
    });
    if (res.code === 200) {
      topLiveRoomList.value = res.data.rows.slice(0, topNums.value);
      otherLiveRoomList.value = res.data.rows.slice(topNums.value);
      if (res.data.total) {
        changeLive(topLiveRoomList.value[0]);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function joinRoom(data, isBilibili) {
  const url = router.resolve({
    name: routerName.pull,
    params: { roomId: data.id },
    query: { [URL_QUERY.isBilibili]: isBilibili },
  });
  openToTarget(url.href);
}

function handleFocusAll() {
  router.push({
    name: routerName.liveFollow,
  });
}

function handleSecondArea(parentId, childId) {
  router.push({
    name: routerName.area,
    query: { parentAreaId: parentId, areaId: childId }, // `childId` 作为 `query`
  });
}

function handleAreaAll(parentId) {
  router.push({ name: routerName.area, query: { parentAreaId: parentId } });
}

const getRecordList = async () => {
  const res = await getFollowedUsersWithLiveRecords({
    userId: userStore?.userInfo?.id,
  });
  if (res?.code === 200) {
    liveUsers.value = res?.data?.liveUsers;
  }
};
</script>

<style lang="scss" scoped>
.home-wrap {
  background-color: #f7f7f7;

  a {
    text-decoration: none;
  }

  // overflow: scroll;
  // height: 100vh;
  // height: calc(100vh - $header-height);
  .play-container {
    position: relative;
    z-index: 1;
    padding-bottom: 30px;
    background: url(@/assets/img/homeBg.jpg) no-repeat;
    background-size: cover;
    margin-bottom: 30px;

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

    .slider-wrap {
      padding: 4px 0;
    }

    .container {
      display: flex;
      justify-content: center;
      box-sizing: border-box;
      margin: 0 auto;
      padding-top: 20px;
      height: calc($w-1000 / $video-ratio);

      .left {
        position: relative;
        display: inline-block;
        overflow: hidden;
        flex-shrink: 0;
        box-sizing: border-box;
        margin-right: 20px;
        width: $w-900;
        height: 100%;
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.4);
        /* background-color: rgba($color: #000000, $alpha: 0.3); */

        @extend %coverBg;

        .cdn-ico {
          position: absolute;
          top: -9px;
          right: -10px;
          z-index: 2;
          width: 70px;
          height: 32px;
          background-color: #f87c48;
          color: white;
          transform: rotate(45deg);
          transform-origin: bottom;

          .txt {
            margin-top: 11px;
            margin-left: 20px;
            background-image: initial !important;
            font-size: 14px;
          }
        }

        .logo-watermark {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 2;
          color: rgba($color: #fff, $alpha: 0.5);
          font-weight: bold;
          font-size: 30px;
          line-height: 1;
        }

        .cover {
          position: absolute;
          background-position: center center;
          background-size: cover;
          filter: blur(5px);
          inset: 0;
        }

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

        :deep(canvas) {
          position: absolute;
          top: 50%;
          left: 50%;
          // min-width: 100%;
          // min-height: 100%;
          max-width: $w-1100;
          max-height: calc($w-1100 / $video-ratio);
          transform: translate(-50%, -50%);

          user-select: none;
        }

        :deep(video) {
          position: absolute;
          top: 50%;
          left: 50%;
          // min-width: 100%;
          // min-height: 100%;
          max-width: $w-1100;
          max-height: calc($w-1100 / $video-ratio);
          transform: translate(-50%, -50%);

          user-select: none;
        }

        .join-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 20;
          display: none;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          // width: 80%;
          transform: translate(-50%, -50%);

          &.show {
            display: inline-flex !important;
          }

          .btn {
            padding: 14px 26px;
            border: 2px solid rgba($color: $theme-color-gold, $alpha: 0.5);
            border-radius: 6px;
            background-color: rgba(0, 0, 0, 0.3);
            color: $theme-color-gold;
            font-size: 16px;
            cursor: pointer;

            &:hover {
              background-color: $theme-color-gold;
              color: white;
            }
          }
        }

        .video-controls {
          display: none;
        }

        &:hover {
          .join-btn {
            display: block;
          }

          .video-controls {
            display: block;
          }
        }
      }

      .right {
        display: inline-block;
        overflow: scroll;
        flex-shrink: 0;
        box-sizing: border-box;
        padding: 12px 10px;
        height: 100%;
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.4);
        /* background-color: rgba($color: #000000, $alpha: 0.3); */

        @extend %hideScrollbar;

        .list {
          .item {
            position: relative;
            box-sizing: border-box;
            margin-bottom: 10px;
            width: 200px;
            height: 110px;
            border-radius: 4px;
            background-color: rgba($color: #000000, $alpha: 0.3);
            cursor: pointer;

            @extend %coverBg;

            &:last-child {
              margin-bottom: 0;
            }

            .hidden {
              position: relative;
              overflow: hidden;
              width: 200px;
              height: 110px;

              .cdn-ico {
                position: absolute;
                top: -9px;
                right: -9px;
                z-index: 2;
                width: 60px;
                height: 28px;
                background-color: #f87c48;
                color: white;
                transform: rotate(45deg);
                transform-origin: bottom;

                .txt {
                  margin-left: 10px;
                  background-image: initial !important;
                  font-size: 12px;
                  line-height: 0.8;
                }
              }
            }

            .border {
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              z-index: 3;
              border: 2px solid $theme-color-gold;
              border-radius: 4px;
            }

            .triangle {
              position: absolute;
              top: 50%;
              left: 0;
              display: inline-block;
              border: 5px solid transparent;
              border-right-color: $theme-color-gold;
              transform: translate(-100%, -50%);
            }

            &.active {
              &::before {
                background-color: transparent;
              }
            }

            &:hover {
              &::before {
                background-color: transparent;
              }
            }

            &::before {
              position: absolute;
              display: block;
              width: 100%;
              height: 100%;
              border-radius: 4px;
              background-color: rgba(0, 0, 0, 0.4);
              content: '';
              transition: all cubic-bezier(0.22, 0.58, 0.12, 0.98) 0.4s;
            }

            .txt {
              position: absolute;
              bottom: 0;
              left: 0;
              box-sizing: border-box;
              padding: 4px 8px;
              width: 100%;
              border-radius: 0 0 4px 4px;
              background-image: linear-gradient(
                -180deg,
                rgba(0, 0, 0, 0),
                rgba(0, 0, 0, 0.6)
              );
              color: white;
              text-align: initial;
              font-size: 13px;

              @extend %singleEllipsis;
            }
          }
        }

        .none {
          width: 200px;
          color: white;
          text-align: center;
          font-size: 14px;
        }
      }
    }
  }

  .detail-container {
    width: 1140px;
    margin: 0 auto 40px;
    display: flex;

    .focus-area-ctnr {
      margin-left: 10px;
      width: 436px;

      .focus-title-item {
        display: flex;
        justify-content: space-between;
      }

      .focus-left-ctnr {
        display: flex;
        align-items: center;
        align-items: center;
        margin-bottom: 10px;

        .focus-titile {
          font-size: 16px;
          font-weight: 700;
          margin-right: 8px;
          color: #18191c;
        }

        .focus-online-ctnr {
          background: #f69;
          padding: 2px 4px;
          color: #fff;
          border-radius: 9px;
          display: flex;
          align-items: center;
          position: relative;
          font-size: 12px;
        }
      }

      .focus-all {
        font-size: 12px;
        color: #9499a0;
        padding-top: 3px;
        cursor: pointer;
      }

      .focus-content-ctnr {
        padding: 37px 0;
        display: flex;
        width: 436px;
        height: 126px;
        justify-content: space-between;

        background: #ffffff;
        border-radius: 4px;
        box-sizing: border-box;
        overflow: hidden;
      }

      .focus-content-ctnr-wrap {
        width: 436px;
        height: 126px;
        padding: 29px 16px 24px 30px;
        background: #fff;
        border-radius: 4px;
        box-sizing: border-box;
        overflow: hidden;
      }

      .focus-item {
        width: 218px !important;
        margin-right: 0;
        box-sizing: border-box;
        padding-left: 32px;
        color: #18191c;
        float: left;
        padding-right: 4px !important;
        align-self: center;
        display: flex;
      }

      .focus-content-item {
        box-sizing: border-box;
        color: #18191c;
        float: left;
        width: 65px !important;
        padding-right: 4px !important;
      }

      .focus-image-ctnr {
        border: 1px solid #f69;
        margin-right: 12px;
        margin-bottom: 2px;
        display: inline-block;
        float: left;
        width: 48px;
        height: 48px;
        border-radius: 100px;
        position: relative;
        cursor: pointer;

        .living-icon {
          z-index: 1;
          top: 0;
          right: -6px;
          position: absolute;
          width: 12px;
          height: 7px;
          bottom: 5px;
          margin-right: 4px;
          display: block;

          &:before {
            content: '';
            position: absolute;
            width: 14px;
            height: 14px;
            border-radius: 100px;
            background: #f69;
            left: -3px;
            top: 1px;
          }

          @keyframes living-icon-ani-24215b20 {
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

          .living-icon-col {
            width: 1px;
            margin: 0 1px;
            background-color: #fff;
            border-radius: 2px;
            animation: linear 0.6s infinite living-icon-ani-24215b20;
            transform-origin: bottom;
            display: inline-block;
            height: 100%;
            position: absolute;
            top: 5px;
            left: 3px;

            &:first-child {
              animation-delay: -0.2s;
              margin-left: 0;
              left: 1px;
            }

            &:last-child {
              left: 6px;
            }
          }
        }

        .focus-image {
          width: 44px;
          height: 44px;
          border-radius: 100px;
          overflow: hidden;
          position: absolute;
          object-fit: cover;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }

      .focus-image-empty {
        width: 44px;
        height: 44px;
        border-radius: 100px;
        background: #f4f4f4;
        padding: 10px 9px;
        box-sizing: border-box;
        position: relative;
        margin-right: 12px;

        &:before {
          content: '';
          display: inline-block;
          width: 25px;
          height: 24px;
          background: url('data:image/png;base64,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')
            no-repeat center;
          background-size: contain;
        }
      }

      .focus-empty-text {
        display: flex;
        font-size: 12px;
        color: #9499a0;
        align-items: center;
      }

      .focus-name-fanse {
        display: inline-block;
        /* float: left; */

        .focus-name {
          max-width: 96px;
          margin-bottom: 10px;
          margin-top: 2px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          text-align: center;
          font-size: 12px;
          color: #18191c;
          font-size: 12px;
        }

        .focus-name-wrap {
          max-width: 48px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          text-align: center;
          margin-left: 5px;
          color: #18191c;
          font-size: 12px;
        }

        .focus-fanse {
          color: #9499a0;
          font-size: 12px;
        }

        .left {
          text-align: left;
        }
      }

      .empty-online {
        font-size: 14px;
        color: #9499a0;
        margin: 0 auto;
        height: 50px;
        line-height: 50px;
      }
    }

    .highlight-areas-ctnr {
      margin-left: 17px;
      margin-top: 32px;
      /* font-size: 0; */
      white-space: nowrap;
      position: relative;

      .no-select,
      .none-select {
        user-select: none;
      }

      .t-center {
        text-align: center;
      }

      .v-top {
        vertical-align: top;
      }

      .hight-title {
        font-size: 16px;
        color: #18191c;
        position: absolute;
        left: 0;
        top: -32px;
        font-weight: 700;
      }

      .highlight-area-item {
        background-color: #ffffff !important;
        font-size: 12px;
        background: #fff;
        border-radius: 4px;
        padding: 18px 0 !important;
        margin: 0 4px !important;
        text-align: left;
        display: inline-block;
        position: relative;

        &:hover {
          box-shadow: 4px 4px 20px 0 rgba(205, 216, 228, 0.6);
        }

        .area-icon {
          height: 35px;
          width: 35px;
          display: block;
          margin: 0 auto 10px;
          position: relative;
          cursor: pointer;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center center;
          vertical-align: middle;

          &-1 {
            height: 30px;
            width: 30px;
            margin-top: 5px;
            background-image: url('data:image/png;base64,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');
          }

          &-2 {
            background-image: url('data:image/png;base64,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');
          }

          &-3 {
            background-image: url('data:image/png;base64,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');
          }

          &-4 {
            background-image: url('data:image/png;base64,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');
          }

          &-5 {
            background-image: url('data:image/png;base64,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');
          }

          &-6 {
            height: 30px;
            width: 30px;
            margin-top: 5px;
            background-image: url('data:image/png;base64,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');
          }

          &-7 {
            background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAXNSR0IArs4c6QAAFfBJREFUeF7tnWt63DYSRUl9UWZZsXZgr8jxiuwdWFnWxPnEGXRCp93uJgGwqogLHP3JQ2ChcOryEgAfmid+IAABCIgQmEXyJE0IQAACE4aFCCAAARkCGJZMqUgUAhDAsNAABCAgQwDDkikViUIAAhgWGoAABGQIYFgypSJRCEAAw0IDEICADAEMS6ZUJAoBCGBYaAACEJAhgGHJlIpEIQABDAsNQAACMgQwLJlSkSgEIIBhoQEIQECGAIYlUyoShQAEMCw0AAEIyBDAsGRKRaIQgACGhQYgAAEZAhiWTKlIFAIQwLDQAAQgIEMAw5IpFYlCAAIYFhqAAARkCGBYMqUiUQhAAMNCAxCAgAwBDEumVCQKAQhgWGgAAhCQIYBhyZSKRCEAAQwLDUAAAjIEMCyZUpEoBCCAYaEBCEBAhgCGJVMqEoUABDAsNAABCMgQwLBkSkWiEIAAhoUGIAABGQIYlkypSBQCEMCw0AAEICBDAMOSKRWJQgACGBYaOETg2+df3qUAb9PT5Z9P8/Lb5b+X+Y/rwE/T2+vzh79eD3XGwcMTwLCGl0A5gItJzfPHdOQyTRejyv2Zp+k1mRkGlkuMdtcEMCz0kEVgNalSg9oLvizzp/98+PP3vXb8HgKJAIaFDjYJeBnVbacYF0LMIYBh5VAatM1/P//6+zwvl6Vf1A/GFUVasx8MS7NurllHzaoeDQLTci2vdHAMS7p89smfMau6N4q0Of/8/tuL/QiJqEwAw1KunnHurZjV9bDmZXnhcQjjQguHw7CEi2eZ+rcvz1+t7wBa5ccS0YqkfhwMS7+Gh0aQ9quWef56KEjAwZhWAGSBLjAsgSJ5pahiVuv4MS0vJejExbB0amWaaYv7VTkDZDM+h1K/bTCsfmv7cGSqZsVm/IBivRkyhjWYBlreXC8tBUvEUmL67TEs/RpmjeDsh0GzkqxohGlVQBM+BMMSLl5u6mqb67njYjO+lJR+ewxLv4abI+hhvyqnRGzG51DSb4Nh6dew68310vLwZHwpMa32GJZWvbKzPWNz/frjfNdfII1+gp59rWyZyDXEsORKtp3wGZvrewaRckoGFvmpmr2cOiv7MMPBsDoqdfTmeum+UfR+GqbVkbj/GQqG1UlNVcygdVPtRA7dDgPD6qC0KmZ1jTp6j43N+A6Ezjfd9YsYbVaWJ3507iwR9fXODEu4hpGzlLRfNS3LJ+uP6WFawgI8IXUM6wToR7uMvhNYurleOj5Mq5TYuO0xLLHaR29aRy2jok3L24TFZCWTLoYlU6ppij6po8xqLcEZM0ePZa6QpORSxbBESta7WV2XYaSxisivmTQxrGZK8TiRyM31lIXlncBavJhWLbm+j8OwGq7v6EskTKthcZ6UGoZ1Evi9bqM311vdhMa09pQy1u8xrAbrzUn6Y1HOMG824xs8MXjSvb2iYFbs5bWnynYyYobVTi3CH1toYXO9FD+GXkqsr/YYViP1jLwT6PWaTRRKTCuKdHv9YFgn1+SM/Znn999eTh724e4xrcMIJQNgWCeWLdqsop9c90Ybza/VO6nenFuKj2GdVA1mCHbgI5fTKWvFvT872udGwrBO4I9Z2UOHqT3TFiNiWMFVYTbgBxzT8mPbSmQMK6gSZ7xm08Pmeml5MK1SYlrtMayAekVvDve2uV5aomjebMaXVqi+PYZVzy7rSK74WZhcGrH8dsF6alAMyxE/ZuUINzM0NcgEJdIMw3IqFFd3J7AVYTGtCmiNHoJhGRfmjM11viywX0RMa5+RQgsMy7BKbPYawnQIRX0coAaHxLCMgHMFNwIZEIblegBkpy4wLAOwmJUBxOAQ1CwYuFF3GNZBkNHC5z22gwW7Ojy6dqM/H2dROQzrAMXIpYX6N6wOYHY9FNNyxWseHMOqQHrGncARX7OpKE3VIWzGV2E75SAMqxB7tLhZRhQWqLJ59EUopcnyvrxYGFYBM5YPBbBEm1LjtguHYWXWByFnguqgGbVut4gYVkZtIjfXWSpkFCSgCaYVALmiCwxrA1r0vgZ3AisU7HgIpuUItzI0hvUAXPTmOt9UqlSw82FctJwBF4bHsO4A48paqKIBmkdvC3B3+L6oMKwbLpjVAO5TOUS0UQnO8DAM6wpmtCB5DsdQyUGhojXCTOvHwmJY//CInPKzuR7kLk7dYFpOYDPCDm9YbK5nqIQmPxFAN+eIYmjD4kp5juh66jVyZp64jb6NMKxhYVY92ca5Y0FLcfyHNKxogY1+VYyT83k9RWtq1M344QyLKfx5J3XvPWNa/hUexrDOeGKZb1j5C7i1HtiM963IEIYVLaJRp+u+UtWKzkzep17dGxbTdB/hEHWfANrbZ1TaomvDQjClcqC9NQE0aEu0W8OKFgp3Am2F2VO0aC32vCXRpWFFCoTXbHqyFr+xsI9qw7Y7w4o2K+4E2ghxlCiRm/E9zrS6MqxIs+pRDKOYxtnjRKf1FejGsBBBvQg4Mp4Aeq1j3o1h/fnlealDUHYUm+tlvGj9mECkaf36/lsX53oXg4goPJvrWI8HgajN+F7+ZoC8YUWZFZvrHqcrMVcCEZvxPawO5A3LeynI5jqmEkXA++LbwyxL2rC8C4xZRZ2q9LMS8Na0+ixL2rA8Z1eYFSZyFgFP01KfZckaludmpfpV6KwTjX7tCLia1rK8PH/469Uu27hIsoblUVDuBMYJj572CXh9w035gixrWNbLQfWp8r78aaFKwPrirKx1ScOyXg6yX6V6Ko+Tt/VjD6qzLEnDsr7i9PIU8Din75gjtVxVqF6khzcs1SvNmKfs2KO2XFlgWIFaspphKa/lA3HTVUMErJaGqtqXnGFZFU31KtPQ+UMqwQRGv1gPbVgsB4PPNro7TMBqWcgM63Ap8gNYbT6y2Z7PnJbtEBhZ/5IzrJEL1s5pQyZnERhZ/xjWWaqjXwhUEsCwKsGdddjIBTuLOf22Q2Bk/TPDakeHZAKBLAIYVhamdhqNVrDLS7DpZ54/rlVYpunv/9fBT7pj9bbMf6ShPE1vr6pfEogqxWj6v+bKDCtKZYX9rG/qp8N6MqdcDDwj95gUhpWrokba9Vwwr0+KNFK64jQwrp+R9az/PYEww9ojFPh7q6eYA1MO6wrj+hc1hhUmO5uOeiyY1etGNoTbjKL6dLY1zR71n8uIGVYuKad2LAHLwY7+ShWGVa6ZU4/opWBW74WdWoyTOh/ZtHrRf410mGHVUDM6xkp4RunIhRn1XVAr3Sjyw7BOOk3ZYD8OftQ9LQzruHZCI6gXDLOyk8uIdw/V9X+k+sywjtCrPNZKcJXdd3fYaPtZVvphSRh0KigXjNmVvUhGWxoq6/9o9ZlhHSVYeLyV2Aq77b75SLMsKw0xwwo6LVQLxuzKTyAjzbJU9W9RfWZYFhQzY1gJLbO74ZopzhhqimSlI0VeGFaNYiqO4SHRCmgNHJJmbimN9PmbVj59g2E1IIySFBQLxnKwpMJttz37UQpF/VtVlBmWFcmdOLzcHAQ6sJuzjAvDCiyyRVeKBcOwLCrfZoxo41LUv1XlmGFZkWSGFUSyzW4iTQvDalMDD7NSLJhVzvegrBvDlp9STjEt46W8PWK2Jt2I58GstMRdwiD1KBbMKucV8cWkluXT7R9sSJv7T/PyW43ZbMWc5+X7H8AoKbNHzJL+z2jrbVpWWsKwgtShWDCrnBPinOVH6V1Jj5h7J26vHy/0fojVSksYFoblvozNMZY1iVzTKomZe/OgJKbVCRgkv6xuPE3LiheGlVXK440UC3ZWznsGU3pi5TwAW2JWSQ05MY+rJj5CKYfcDM/SUm5+nu24S+hJ9yq2hchqToA9M6iK+eX569YeWc2Ve89Yg8pk3s3esrimQwstpX5r6lSTr+UxGJYlzY1YFiKrMpfPv7xb5vnro9RqTqg9E6w5Ebo1rGl6fX7/7cVSZhZawrAsK7ITS7FgFjnXmEtCudV3lblsmGDpErN0vy1QZmZd1dbtUQIWWsKwzMq7H0ixYBY51wrf2rC2NvMxrJ/1W8sEw7rLct8gWmthcfJHX2Escq5ZEu7dKawxwb2YVbO2nX2x1jRYkg+GVUJruy17WHYsNyNZGFaN8PfMpSbm3lhqTHAvZlCZ3LqpYcIMixnWDwRqZgK1irY6IUtmWXtmtY6l5GTKjVnCNjdmLfsWjiup216+VloqqdFeTlG/Z4YVRNpKZCndHIPZu5N3PezcWZZHzBHM6lIzw7uFVlrCsMRO/siCWYlsRbx1xa41gciYXq/lpJqm2G/T07vS9x9v33usjXPvNMCwbMyBGZYNx90o1oZ1bVzrv6eXntO/17z4/H15OE2v6XPA1zGPxFtnF9YxHwG/vggVzQiX5eX2RfK1j9oLwG2OVhdIKy1Z5bMrfsMGGJYhzK1QViILSle2m9uTMMe0cvaXcuLsQbMyCCstWeWzN27L32NYljQ3YvX6JHcQvqxuHi27ttjnmNXa+dEaWhkEhpUlh3YaKRbsqNjbod9uJo/MZ2t2lHMD47th7bzmtEcGw9ojtP97Zlj7jExaYFgmGDeDbM2WHl3kSk3kyMWytK9Hgz2Sw3VMq3z8K/tvDxhWEG2LPZCgVGW7wbDKSodhlfGqbq16hbHKuxpc5wc+OgFZEt4vPIYVdEJYnfjRBWNZ6CeQ2mfISp6POvp4g5XeVPVvUX2WhBYUM2OwLMwEVdHs0eZ5DvOcjfejZpWGhGFVFPbmEAzrOMOiCMyyinBlNX74OEPBXb2tGVqO6eUkimHlUNpug2EdZ1gUwUr8RZ123vjeKzXTPH8sfUI/mdbT9Pa6PvFu+fpQydJzr1wsCfcINfZ79YIxy2pMUAHplDygupeOuv73xrf1e2ZYR+hVHsssqxKc8GEYlk3xMCwbjsVRMK1iZNIH5Gzs5w6QGVYuqUba9VIwiztPjZSENHYIWG24p2560X+NaJhh1VAzPAbTMoTZaCjL5SCG1WiRt9Lq7QqDaQmKsCBly9kVhlUAvpWmvRlW4sqeVivqss3DenaFYdnWJyRaj4a1gmO2FSKhsE6sZ1cYVljp7Drq2bAwLjudnB3JY3aFYZ1d1Yr+RzCsFcv6hxDS99pLn9yuQMshRgS8zArDMipQZJiRDOuW6+V1kX9+av4yzG289MrI9R+IqK1j6V+oqe1H5TiPpeA69pH1z2MNKmfAnTyP7ndZPszITYN/C2TJ9Z48MSyxk3bkgl2XqvadRMsXcX/Ip+DrCGKSy07X26xYEmaXop2GGFb9YxCeeyvf992+PH8dbb/N6yLADOtHAiwJ2/HhokxqloMRV/91EDX5FQFoqHHEReB6uCNfsDGshoRfkkqJaCOv/rdj6Nm4br/DVVK/I21Lar/Vj+eNgSPj2zoWw/Ii6xi3xASir/6Phl2SsyM6k9BnGdWaPIZlUsa4ICMXLFHOPfkjl4C51V+fK0vt07Nl6Z8t73ddzOmS5PIp/WP9GmnueD3ajax/ZlgeinKOuSfYM5eAzkOvDp9r8rcdtGj6e/XPhcSSMJfUwXYjF2zvxGtlCXiwxC6H77G712mL5j+y/plhuZwafkG3TroWZwN+JOoil5oWhlXH2esoDMuLrFPce1fXFk8qp+GbhS0xrtYuBMywzGQQE2jUgt07yVgC1msu17RauyCMqv9UaWZY9XoPP/L2VZzWrvzhQAw6zDWtljaoMSyDwkeGGLFg1y8Xt3bFj6y9V197xtXSxWFE/a91Z4bldQYYx11PKJaAxmCvwm3e0Jim1+f33178es+PjGHls2qi5YgFS2Nu6SrfhBAcktgyrVaWhSPqnxnWNE2tCHDvvEvLwRaesN7Ls6ff3zOuVi4YGJaY0kYumFippNO9Na1W9g5H1j97WNKnFMl7E/jJtJbl5ezZLoblXXXj+CMXzBgl4TIJrMbVwixrZP0zw8oULM0gkEwrfWHi7LuFGJaYFkcumFipukv3YlrT2+uZy8KR9c8Mq7tTigH1TgDDEqvwyAUTKxXpOhAYWf/MsBwERUgIeBLAsDzpOsQeuWAOOAkpRmBk/TPDEhMr6UIAwxLTwMgFEysV6ToQGFn/zLAcBEVICHgSwLA86TrEHrlgDjgJKUZgZP0zwxITK+lCAMMS08DIBRMrFek6EBhZ/8ywHARFSAh4EsCwPOk6xB65YA44CSlGYGT9M8MSEyvpQgDDEtPAyAUTKxXpOhAYWf/MsBwERUgIeBLAsDzpOsQeuWAOOAkpRmBk/UvOsG7/AnKt3lr5Kyi1+XPceASu/6DukdG38KnnmvwxrA9/vdaA4xgInEFg7y9U5+aEYeWSMmhnNsNq6K/5GmAhxAAEMCzBIlsVLQ2dZaGgAAZN2VL3yzJ/+s+HP39XQ6m5JPz8y7tlnr9awFadGluMnRhaBKxWFmnUGFZg7a02HteUMa3A4tFVFQFLs0oJ/Pr+m+RkRTLpBNy6gMm03pb5D8VpctUZwEESBNLFeZrnj8s0vbNKWPkCjWHdqCBNldP/Ovtvz1mJkzh6BC4mddlgtTWqlYTqcvCCRK+cf2dsvSxU5UDeECgloHyjSdawPJaFpYWnPQTUCCgvB6VnWMyy1E4V8m2BgPJyUN6wmGW1cAqQgwoBdbPqw7AMn8lSER55QqCGAIZVQ83hGOtHHBxSJCQETiXQg1l1McNaVWD1yY1TVUXnEHAioPqg6C0O6buE14PhMQcnpRNWnoDyYwzdGlYamOXLofIqZQAQEH5n8FHxuplhrQPEtDhPIfA3gV72ra7r2Z1hMdPidIVAn2bV1ab7rUiZaXHajkqgx5nVWssuZ1jr4NiIH/WUHXfcPW2w36ti14bFvta4J+5oI1d/RzC3XkMY1rqvdVkDz8vHXDi0g0DrBJJR/X93/dPzIH9MZRjDup5tPc3Lb5YfRGtd1OTXH4HRjGqIPawtmab9rbfp6R3m1d/J3OuILiaVfgaaUd3WcrgZ1iMxp7uK6XfJwNY2zMJ6PfXbHtd3Y5qmKX22O339NmU8yrJvqzoYVtvaJTsIQOCKAIaFHCAAARkCGJZMqUgUAhDAsNAABCAgQwDDkikViUIAAhgWGoAABGQIYFgypSJRCEAAw0IDEICADAEMS6ZUJAoBCGBYaAACEJAhgGHJlIpEIQABDAsNQAACMgQwLJlSkSgEIIBhoQEIQECGAIYlUyoShQAEMCw0AAEIyBDAsGRKRaIQgACGhQYgAAEZAhiWTKlIFAIQwLDQAAQgIEMAw5IpFYlCAAIYFhqAAARkCGBYMqUiUQhAAMNCAxCAgAwBDEumVCQKAQhgWGgAAhCQIYBhyZSKRCEAAQwLDUAAAjIEMCyZUpEoBCCAYaEBCEBAhgCGJVMqEoUABDAsNAABCMgQwLBkSkWiEIAAhoUGIAABGQIYlkypSBQCEMCw0AAEICBDAMOSKRWJQgACGBYagAAEZAhgWDKlIlEIQADDQgMQgIAMAQxLplQkCgEIYFhoAAIQkCGAYcmUikQhAAEMCw1AAAIyBDAsmVKRKAQg8D8alm/wYOfIgQAAAABJRU5ErkJggg==');
          }
        }

        .area-detail {
          width: 87px;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-left: 2px;
          cursor: pointer;
          vertical-align: middle;

          .area-name {
            font-size: 16px !important;
            margin-bottom: 6px;

            &-1 {
              color: rgb(12, 37, 225);
            }

            &-2 {
              color: rgb(157, 83, 216);
            }

            &-3 {
              color: rgb(225, 132, 86);
            }

            &-4 {
              color: rgb(82, 104, 232);
            }

            &-5 {
              color: rgb(215, 151, 54);
            }

            &-6 {
              color: rgb(77, 141, 102);
            }

            &-7 {
              color: rgb(88, 89, 180);
            }
          }

          .area-desc {
            width: 100%;
            text-align: center;
            padding: 0 10px;
            box-sizing: border-box;
            color: #9499a0 !important;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }

  .content-container {
    width: 1140px;
    margin: 0 auto 40px;
    display: flex;
  }

  .area-container {
    width: 1140px;
    box-sizing: border-box;
    /* margin: 10px auto; */
    /* width: $w-1350; */
    margin: 0 auto 40px;

    .area-item {
      margin-left: 10px;

      .title {
        padding: 10px 0;
        font-size: 22px;
      }

      .live-room-list {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        /* justify-content: space-between; */

        .live-room {
          display: inline-block;
          /* margin-right: 32px; */
          margin-bottom: 10px;
          width: 210px;
          cursor: pointer;

          .cover {
            position: relative;
            overflow: hidden;
            width: 100%;
            height: 120px;
            border-radius: 8px;

            @extend %containBg;

            .cdn-ico {
              position: absolute;
              top: -10px;
              right: -10px;
              z-index: 2;
              width: 70px;
              height: 28px;
              background-color: #f87c48;
              color: white;
              transform: rotate(45deg);
              transform-origin: bottom;

              .txt {
                margin-left: 18px;
                background-image: initial !important;
                font-size: 13px;
              }
            }

            .txt {
              position: absolute;
              bottom: 0;
              left: 0;
              box-sizing: border-box;
              padding: 4px 8px;
              width: 100%;
              height: 26px;
              border-radius: 0 0 4px 4px;
              background-image: linear-gradient(180deg, #0000 0, #00000052);
              color: #fff;
              text-align: left;
              text-align: initial;
              font-size: 13px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }

          .desc {
            display: flex;
            padding: 10px 0;
            font-size: 14px;

            .avatar-wrap {
              position: relative;

              .cycle-wrap {
                position: relative;
                width: 40px;
                height: 40px;

                img {
                  display: inline-block;
                  box-sizing: border-box;
                  margin: 0 auto;
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                  cursor: pointer;
                }
              }
            }

            .info {
              margin-left: 10px;
              width: calc(100% - 50px);
              color: #333;

              .bottom {
                color: #9499a0;
                font-size: 14px;
                margin-top: 3px;
              }
            }
          }
        }

        .null {
          width: 100%;
          text-align: center;
        }
      }
    }
  }

  .foot {
    margin-top: 10px;
    text-align: center;
  }
}

.ad-wrap-a {
  position: fixed;
  top: 300px;
  left: 10px;
  // background-color: red;
  z-index: 999;
  width: 250px;
  // height: 150px;
  border-radius: 10px;

  ins {
    width: 100%;
    height: 100%;
  }
}

/* 过渡动画 */
.hover-box {
  position: absolute;
  z-index: 10;
  top: 140px;
  left: 185px;
  transform: translateX(-50%);
  background: #ffffff;
  color: #000000;
  padding: 15px 12px;
  border-radius: 10px;
  font-size: 12px;
  white-space: nowrap;
  width: 350px;
  /* 添加阴影 */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  cursor: auto;

  /* 初始隐藏状态 */
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.5s ease,
    visibility 0.5s;

  &-3 {
    left: 50px;
  }

  &-4 {
    left: 50px;
  }

  &-5 {
    left: 50px;
  }

  &-6 {
    left: -20px;
  }

  &-7 {
    left: -100px;
  }

  .top {
    font-size: 16px;
    text-align: center;
    margin-bottom: 10px;
    font-weight: 500;
  }

  .content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* 每行固定 3 个 */
    gap: 10px;
    /* 可选：每个 item 之间的间距 */
    width: 100%;
    /* 保证整个 content 撑开 */

    &-item {
      width: 100%;
      /* 让 item 充满 grid */
      max-width: 200px;
      /* 限制最大宽度 */
      padding: 10px;
      font-size: 14px;
      box-sizing: border-box;
      white-space: nowrap;
      /* 不换行 */
      overflow: hidden;
      /* 超出部分隐藏 */
      text-overflow: ellipsis;
      /* 超出部分显示省略号 */
      border: 1px solid #ddd;
      border-radius: 10px;
      cursor: pointer;
      text-align: center;

      &:hover {
        border: 1px solid #ffd700;
        color: #ffd700;
      }
    }
  }

  .bottom {
    text-align: center;
    font-size: 14px;
    margin-top: 10px;
    color: #9499a0;
    cursor: pointer;
  }
}

/* 显示时 */
.hover-visible {
  opacity: 1;
  visibility: visible;
}

// 屏幕宽度小于1330的时候
@media screen and (max-width: 1330px) {
  .home-wrap {
    .play-container {
      .container {
        height: calc($w-900 / $video-ratio);

        .left {
          width: $w-900;

          :deep(canvas) {
            max-width: $w-900;
            max-height: calc($w-900 / $video-ratio);
          }

          :deep(video) {
            max-width: $w-900;
            max-height: calc($w-900 / $video-ratio);
          }
        }
      }
    }

    .area-container {
      width: $w-1150;

      .area-item {
        .live-room-list {
          .live-room {
            width: 250px;
          }
        }
      }
    }
  }
}
</style>
