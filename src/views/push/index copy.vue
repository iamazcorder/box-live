<template>
  <div class="push-wrap">
    <div class="left">
      <div class="resource-card">
        <div class="title">素材列表</div>
        <div class="list">
          <div
            v-for="(item, index) in appStore.allTrack.filter(
              (item) => !item.hidden
            )"
            :key="index"
            class="item"
            @click="handleActiveObject(item)"
          >
            <div class="item-left">
              <div
                class="control-item"
                @click="handleEye(item)"
              >
                <n-icon
                  size="16"
                  v-if="item.openEye && item.type !== MediaTypeEnum.microphone"
                >
                  <EyeOutline></EyeOutline>
                </n-icon>
                <n-icon
                  size="16"
                  v-else
                >
                  <EyeOffOutline></EyeOffOutline>
                </n-icon>
              </div>
              <div class="name">
                <!-- {{ NODE_ENV === 'development' ? item.id : '' }} -->
                ({{ mediaTypeEnumMap[item.type] }}){{ item.mediaName }}
              </div>
            </div>

            <div class="control">
              <div
                v-if="item.audio === 1"
                class="control-item"
                @click.stop="handleChangeMuted(item)"
              >
                <n-popover
                  placement="top"
                  trigger="hover"
                  :flip="false"
                >
                  <template #trigger>
                    <n-icon size="16">
                      <VolumeMuteOutline v-if="item.muted"></VolumeMuteOutline>
                      <VolumeHighOutline v-else></VolumeHighOutline>
                    </n-icon>
                  </template>
                  <div class="slider">
                    <n-slider
                      :value="item.volume"
                      :step="1"
                      @update-value="(v) => handleChangeVolume(item, v)"
                    />
                  </div>
                </n-popover>
              </div>
              <div
                class="control-item"
                @click="handleEdit(item)"
              >
                <n-icon size="16">
                  <CreateOutline></CreateOutline>
                </n-icon>
              </div>
              <div
                class="control-item"
                @click.stop="handleDel(item)"
              >
                <n-icon size="16">
                  <Close></Close>
                </n-icon>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <n-button
            size="small"
            type="primary"
            @click="showSelectMediaModalCpt = true"
          >
            添加素材
          </n-button>
        </div>
      </div>
    </div>
    <div
      ref="topRef"
      class="center"
    >
      <div
        ref="containerRef"
        class="container"
      >
        <!-- <div class="screenshot" @click="handleScreenshot">
          <n-popover placement="top" trigger="hover" :flip="false">
            <template #trigger>
              <n-icon size="26" :color="THEME_COLOR">
                <Camera></Camera>
              </n-icon>
            </template>
            <div class="slider">截屏</div>
          </n-popover>
        </div> -->
        <div
          class="recording"
          v-if="recording"
        >
          ● REC {{ recordVideoTime }}
        </div>
        <!-- <div class="record-ico" @click="handleRecordVideo">
          <n-popover placement="top" trigger="hover" :flip="false">
            <template #trigger>
              <n-icon size="26" :color="recording ? 'red' : THEME_COLOR">
                <Videocam v-if="!recording"></Videocam>
                <VideocamOffSharp v-else></VideocamOffSharp>
              </n-icon>
            </template>
            <div class="slider">{{ !recording ? '开始录制' : '结束录制' }}</div>
          </n-popover>
        </div> -->
        <canvas
          id="pushCanvasRef"
          ref="pushCanvasRef"
        ></canvas>
        <div
          v-if="appStore.allTrack.filter((item) => !item.hidden).length <= 0"
          class="add-wrap"
        >
          <div class="add-wrap_top">
            <img
              src="https://s1.hdslb.com/bfs/static/blive/web-hime/static/add_materials.889718e0.png"
              activity-name="添加直播素材"
              @click="showSelectMediaModalCpt = true"
            />
          </div>
          <div class="add-wrap_bottom">
            <img
              class="pointer w-85px mr-15px"
              src="https://s1.hdslb.com/bfs/static/blive/web-hime/static/screen2.72c15a3b.png"
              is-main-activity="1"
              activity-name="添加窗口"
              @click="handleStartMedia(allMediaTypeList[MediaTypeEnum.screen])"
            />
            <img
              class="pointer w-85px mr-15px"
              src="https://s1.hdslb.com/bfs/static/blive/web-hime/static/camera2.c0deb764.png"
              is-main-activity="1"
              activity-name="添加摄像头"
              @click="handleStartMedia(allMediaTypeList[MediaTypeEnum.camera])"
            />
            <img
              class="pointer w-85px"
              src="https://s1.hdslb.com/bfs/static/blive/web-hime/static/more.9b2d46a4.png"
              is-main-activity="1"
              activity-name="添加直播素材"
              @click="showSelectMediaModalCpt = true"
            />
          </div>
          <!-- <n-space>
            <n-button v-for="(item, index) in allMediaTypeList" :key="index" class="item" @click="handleStartMedia(item)">
              {{ item.txt }}
            </n-button>
          </n-space> -->
        </div>
      </div>

      <div
        ref="bottomRef"
        class="room-control"
      >
        <!-- <span v-if="NODE_ENV === 'development'" class="debug-info">
          <span>{{
            liveRoomTypeEnumMap[appStore.liveRoomInfo?.type + '']
          }}</span>
          <span>：</span>
          <span>{{ mySocketId }}</span>
        </span> -->
        <div class="info">
          <div
            class="avatar"
            v-lazy:background-image="userStore.userInfo?.avatar"
          ></div>
          <div class="detail">
            <div class="top">
              <div class="top_left">
                <div
                  class="name"
                  v-if="appStore.liveRoomInfo"
                >
                  <div
                    class="name_val"
                    v-if="!showEditNameInput"
                  >
                    {{ liveRoomInfo.name }}
                  </div>
                  <div
                    class="name_edit"
                    v-else
                  >
                    <div class="name_edit_input">
                      <input
                        type="text"
                        v-model="title"
                        placeholder="请输入直播标题"
                      />
                      <div class="ico search"></div>
                    </div>
                    <button
                      @click="handleSaveTitle"
                      class="name_edit_btn name_edit_confirm"
                    >
                      确定
                    </button>
                    <button
                      @click="handleCancelSaveTitle"
                      class="name_edit_btn name_edit_cancel"
                    >
                      取消
                    </button>
                  </div>
                  <div
                    class="ico edit"
                    @click="showEditNameInput = true"
                    v-if="!showEditNameInput"
                  ></div>
                </div>
                <div class="area">
                  <div
                    class="area_btn"
                    @click="showModal = true"
                  >
                    {{ selectedCategory }}
                  </div>
                </div>
              </div>
              <!-- <div class="rtc-info">
                <div class="item">延迟：{{ rtcRtt || '-' }}</div>
                <div class="item">丢包：{{ rtcLoss || '-' }}</div>
                <div class="item">帧率：{{ rtcFps || '-' }}</div>
                <div class="item">发送码率：{{ rtcBytesSent || '-' }}</div>
                <div class="item">接收码率：{{ rtcBytesReceived || '-' }}</div>
              </div> -->
              <div class="other">
                <!-- <span class="item share" @click="handleShare">
                  分享直播间
                </span>
                <span class="item">
                  正在观看：
                  {{ liveUserList.length }}
                </span> -->
                <div class="item">
                  <div class="ico eye"></div>
                  {{ liveRoomInfo.views_count }}人看过
                </div>
                <div class="item">
                  <div class="ico like"></div>
                  {{ dianzanNum }}点赞
                </div>
              </div>
            </div>
            <div class="bottom">
              <div class="rtc-config">
                <div class="item-list">
                  <div class="item">
                    <div class="txt">码率设置：</div>
                    <div class="down small">
                      <n-select
                        size="small"
                        v-model:value="currentMaxBitrate"
                        :options="maxBitrate"
                      />
                    </div>
                  </div>
                  <!-- <div class="item">
                    <div class="txt">帧率：</div>
                    <div class="down small">
                      <n-select size="small" v-model:value="currentMaxFramerate" :options="maxFramerate" />
                    </div>
                  </div> -->
                  <div class="item">
                    <div class="txt">分辨率设置：</div>
                    <div class="down big">
                      <n-select
                        size="small"
                        v-model:value="currentResolutionRatio"
                        :options="resolutionRatio"
                      />
                    </div>
                  </div>
                  <!-- <div class="item">
                    <div class="txt">视频内容：</div>
                    <div class="down small">
                      <n-select size="small" v-model:value="currentVideoContentHint" :options="videoContentHint" />
                    </div>
                  </div>
                  <div class="item">
                    <div class="txt">音频内容：</div>
                    <div class="down big">
                      <n-select size="small" v-model:value="currentAudioContentHint" :options="audioContentHint" />
                    </div>
                  </div> -->
                </div>
                <div class="rtc-network"></div>
              </div>
              <div class="rtc-btns">
                <div
                  class="screenshot"
                  @click="handleScreenshot"
                >
                  <n-popover
                    placement="top"
                    trigger="hover"
                    :flip="false"
                  >
                    <template #trigger>
                      <n-icon
                        size="26"
                        :color="THEME_COLOR"
                      >
                        <Camera></Camera>
                      </n-icon>
                    </template>
                    <div class="slider">截屏</div>
                  </n-popover>
                </div>
                <div
                  class="record-ico"
                  @click="handleRecordVideo"
                >
                  <n-popover
                    placement="top"
                    trigger="hover"
                    :flip="false"
                  >
                    <template #trigger>
                      <n-icon
                        size="26"
                        :color="recording ? 'red' : THEME_COLOR"
                      >
                        <Videocam v-if="!recording"></Videocam>
                        <VideocamOffSharp v-else></VideocamOffSharp>
                      </n-icon>
                    </template>
                    <div class="slider">
                      {{ !recording ? '开始录制' : '结束录制' }}
                    </div>
                  </n-popover>
                </div>
                <n-button
                  v-if="!roomLiving"
                  type="primary"
                  @click="handleStartLive"
                >
                  开始直播
                </n-button>
                <n-button
                  v-else
                  type="error"
                  @click="handleEndLive"
                >
                  结束直播
                </n-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div>
    <SelectMediaModalCpt
      v-if="showSelectMediaModalCpt"
      :all-media-type-list="allMediaTypeList"
      @close="showSelectMediaModalCpt = false"
      @ok="handleShowMediaModalCpt"
    ></SelectMediaModalCpt>

    <MediaModalCpt
      v-if="showMediaModalCpt"
      :is-edit="isEdit"
      :media-type="currentMediaType"
      :init-data="currentMediaData"
      @close="showMediaModalCpt = false"
      @add-ok="addMediaOk"
      @edit-ok="editMediaOk"
    ></MediaModalCpt>

    <OpenMicophoneTipCpt
      v-if="showOpenMicophoneTipCpt"
      @close="showOpenMicophoneTipCpt = false"
    ></OpenMicophoneTipCpt>
  </div>
</template>

<script lang="ts" setup>
import { emojiArray } from '@/emoji';
import {
  Camera,
  Close,
  CreateOutline,
  EyeOffOutline,
  EyeOutline,
  Videocam,
  VideocamOffSharp,
  VolumeHighOutline,
  VolumeMuteOutline,
} from '@vicons/ionicons5';
import { AVRecorder } from '@webav/av-recorder';
import { copyToClipBoard, openToTarget } from 'billd-utils';
import { fabric } from 'fabric';
import {
  computed,
  markRaw,
  onMounted,
  onUnmounted,
  Raw,
  reactive,
  ref,
  watch,
} from 'vue';
import { useRoute } from 'vue-router';

import { createLiveRoomRecording, fetchUpdateMyLiveRoom } from '@/api/liveRoom';
import { fetchGetWsMessageList } from '@/api/wsMessage';
import { mediaTypeEnumMap, THEME_COLOR, URL_QUERY } from '@/constant';
import { commentAuthTip, loginTip } from '@/hooks/use-login';
import { usePush } from '@/hooks/use-push';
import { useRTCParams } from '@/hooks/use-rtcParams';
import { useTip } from '@/hooks/use-tip';
import { useUpload } from '@/hooks/use-upload';
import { useWebsocket } from '@/hooks/use-websocket';
import {
  DanmuMsgTypeEnum,
  GoodsTypeEnum,
  MediaTypeEnum,
  WsMessageContentTypeEnum,
  WsMessageIsFileEnum,
  WsMessageIsShowEnum,
  WsMessageIsVerifyEnum,
} from '@/interface';
import { QINIU_KODO } from '@/spec-config';
import { AppRootState, useAppStore } from '@/store/app';
import { useCacheStore } from '@/store/cache';
import { useNetworkStore } from '@/store/network';
import { useUserStore } from '@/store/user';
import { LiveRoomTypeEnum } from '@/types/ILiveRoom';
import {
  base64ToFile,
  createVideo,
  formatDownTime2,
  generateBase64,
  getLiveRoomPageUrl,
  getRandomEnglishString,
  handleUserMedia,
  readFile,
  saveFile,
  setAudioTrackContentHints,
  setVideoTrackContentHints,
} from '@/utils';

import { fetchGoodsList } from '@/api/goods';
import { fetchLiveRoomOnlineUser } from '@/api/live';
import { fetchUserHasLiveRoom } from '@/api/userLiveRoom';
import router, { routerName } from '@/router';
import MediaModalCpt from './mediaModal/index.vue';
import OpenMicophoneTipCpt from './openMicophoneTip/index.vue';
import SelectMediaModalCpt from './selectMediaModal/index.vue';

const route = useRoute();
const userStore = useUserStore();
const appStore = useAppStore();
const networkStore = useNetworkStore();
const cacheStore = useCacheStore();
const {
  maxBitrate,
  maxFramerate,
  resolutionRatio,
  audioContentHint,
  videoContentHint,
  allMediaTypeList,
} = useRTCParams();

const {
  startLive,
  endLive,
  keydownDanmu,
  sendBlob,
  sendRoomNoLive,
  roomId,
  msgIsFile,
  mySocketId,
  canvasVideoStream,
  roomLiving,
  currentResolutionRatio,
  currentMaxBitrate,
  currentMaxFramerate,
  currentAudioContentHint,
  currentVideoContentHint,
  danmuStr,
  damuList,
  liveUserList,
} = usePush();

const { sendDanmuTxt, sendDanmuImg, sendDanmuDianzan } = useWebsocket();

const addMediaOkMap = ref(new Map());
const currentMediaType = ref(MediaTypeEnum.camera);
const currentMediaData = ref<AppRootState['allTrack'][0]>();
const recording = ref(false);
const showOpenMicophoneTipCpt = ref(false);
const showSelectMediaModalCpt = ref(false);
const showMediaModalCpt = ref(false);
const isEdit = ref(false);
const topRef = ref<HTMLDivElement>();
const bottomRef = ref<HTMLDivElement>();
const danmuListRef = ref<HTMLDivElement>();
const containerRef = ref<HTMLDivElement>();
const pushCanvasRef = ref<HTMLCanvasElement>();
const webaudioVideo = ref<HTMLVideoElement>();
const fabricCanvas = ref<fabric.Canvas>();
const startTime = ref(+new Date());
const initAudioFlag = ref(false);
const msgLoading = ref(false);
const uploadRef = ref<HTMLInputElement>();
const nullAudioStream = ref<MediaStream>();
const showEmoji = ref(false);
const worker = ref<Worker>();
const workerTimerId = ref();
const workerMsrTimerId = ref();
const timeCanvasDom = ref<Raw<fabric.Text>[]>([]);
const stopwatchCanvasDom = ref<Raw<fabric.Text>[]>([]);
const wrapSize = reactive({
  width: 0,
  height: 0,
});
const bodyAppendChildElArr = ref<HTMLElement[]>([]);
const liveType = Number(route.query[URL_QUERY.liveType]);
const recorder = ref<MediaRecorder>();
const bolbId = ref(0);
const msrDelay = ref(1000 * 1);
const msrMaxDelay = ref(1000 * 5);
const suggestedName = ref('');
const recordVideoTimer = ref();
const areaList = ref<{ label: string; value: number }[]>([]);
const currentArea = ref(-1);
const recordVideoTime = ref('00:00:00');
let avRecorder: AVRecorder | null = null;
const loopGetLiveUserTimer = ref();
const curTab = ref('audience');

const liveRoomInfo = ref<any>({});
const title = ref('');
const showEditNameInput = ref(false);
// 直播一级分区
const parentCategory = ref<any>({});
// 直播二级分区
const childCategory = ref<any>({});
// 控制分区弹窗显示的状态
const showModal = ref(false);
const giftIconMap = ref<any>({});
const giftGoodsList = ref<any>([]);
const recordedChunks = ref<any>([]);
const globalAudioContext = ref<any>(null);

watch(
  () => userStore.userInfo?.id,
  () => {
    if (userStore.userInfo?.id) {
      getLiveRoomInfo();
    }
  }
);

onMounted(() => {
  if (userStore.userInfo?.id) {
    getLiveRoomInfo();
  }
});

const dianzanNum = computed(() => {
  const dianzanList = damuList.value.filter(
    (item) => item.msg_type === DanmuMsgTypeEnum.dianzan
  );
  return dianzanList.length;
});

async function getGoodsList() {
  try {
    // giftLoading.value = true;
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
    }
  } catch (error) {
    console.log(error);
  } finally {
    // giftLoading.value = false;
  }
}

const handleJump = (id) => {
  const url = router.resolve({
    name: routerName.user,
    params: { id },
  });
  openToTarget(url.href);
};

const getLiveRoomInfo = async () => {
  const res = await fetchUserHasLiveRoom(Number(userStore.userInfo?.id));
  if (res.code === 200) {
    liveRoomInfo.value = res.data.live_room;
    updateLiveRoomInfo(res.data.live_room);
  }
};

const updateLiveRoomInfo = (liveRoom) => {
  liveRoomInfo.value.name = liveRoom.name;
  title.value = liveRoom.name;
  parentCategory.value = appStore.areaList.find(
    (item) => item.id === liveRoom?.parent_category_id
  );
  childCategory.value = parentCategory.value.children.find(
    (item) => item.id === liveRoom?.child_category_id
  );
};

const handleSaveTitle = async () => {
  const res = await fetchUpdateMyLiveRoom({ name: title.value });
  if (res.code === 200) {
    window.$message.success('标题设置成功');
    liveRoomInfo.value.name = title.value;
    showEditNameInput.value = false;
  } else {
    window.$message.error('标题设置失败，请稍后重试');
  }
};

const handleCancelSaveTitle = () => {
  title.value = liveRoomInfo.value.name;
  showEditNameInput.value = false;
};

// 显示的分区文字
const selectedCategory = computed(() => {
  if (parentCategory.value?.name && childCategory.value?.name) {
    return `${parentCategory.value.name}·${childCategory.value.name}`;
  }
  return '请选择分区';
});

// 选择分区
const handleCategorySelect = ($event) => {
  showModal.value = $event.showModal;
  parentCategory.value = $event.curParentCategory;
  childCategory.value = $event.curChildCategory;
  handleSaveCategory($event.curParentCategory, $event.curChildCategory);
};

const handleSaveCategory = async (parentId, childId) => {
  if (parentId && childId) {
    const res = await fetchUpdateMyLiveRoom({
      parent_category_id: parentId,
      child_category_id: childId,
    });
    if (res.code === 200) {
      window.$message.success('分区设置成功');
    } else {
      window.$message.error('分区设置失败，请稍后重试');
    }
  } else {
    window.$message.warning('请先选择分区');
  }
};

function handleTabChange(tab) {
  curTab.value = tab;
}

// 计算并返回网络的延迟（rtt）信息
const rtcRtt = computed(() => {
  const arr: any[] = [];
  networkStore.rtcMap.forEach((rtc) => {
    arr.push(`${rtc.rtt}ms`);
  });
  return arr.join();
});
// 计算并返回丢包率信息
const rtcLoss = computed(() => {
  const arr: any[] = [];
  networkStore.rtcMap.forEach((rtc) => {
    arr.push(`${Number(rtc.loss.toFixed(2))}%`);
  });
  return arr.join();
});
// 计算并返回视频帧率信息
const rtcFps = computed(() => {
  const arr: any[] = [];
  networkStore.rtcMap.forEach((rtc) => {
    arr.push(`${Number(rtc.outboundFps.toFixed(2))}`);
  });
  return arr.join();
});
// 计算并返回已发送的字节数
const rtcBytesSent = computed(() => {
  const arr: any[] = [];
  networkStore.rtcMap.forEach((rtc) => {
    arr.push(`${Number(rtc.bytesSent.toFixed(0))}kb/s`);
  });
  return arr.join();
});
// 计算并返回已接收的字节数
const rtcBytesReceived = computed(() => {
  const arr: any[] = [];
  networkStore.rtcMap.forEach((rtc) => {
    arr.push(`${Number(rtc.bytesReceived.toFixed(0))}kb/s`);
  });
  return arr.join();
});

// 监听`roomLiving`的变化，当直播结束时，调用`endLive`并提示用户
watch(
  () => roomLiving.value,
  (newval) => {
    if (!newval) {
      endLive();
      useTip({
        content: '直播已结束',
        hiddenCancel: true,
        hiddenConfirm: true,
      });
    } else {
      uploadLivePreview();
    }
  }
);
// 监听最大比特率变化，更新推流设置
watch(
  () => currentMaxBitrate.value,
  (newval) => {
    console.log('码率变了', newval);
    if (liveType === LiveRoomTypeEnum.msr) {
      const stream = pushCanvasRef.value!.captureStream();
      const audioTrack = webaudioVideo
        // @ts-ignore
        .value!.captureStream()
        .getAudioTracks()[0];
      stream.addTrack(audioTrack);
      handleMsr(stream);
    }
  }
);
// 监听视频内容提示变化，设置视频流内容提示
watch(
  () => currentVideoContentHint.value,
  (newval) => {
    console.log('视频内容变了', newval);
    if (canvasVideoStream.value) {
      setVideoTrackContentHints(
        canvasVideoStream.value,
        // @ts-ignore
        currentVideoContentHint.value
      );
    }
  }
);
// 监听音频内容提示变化，设置音频流内容提示
watch(
  () => currentAudioContentHint.value,
  (newval) => {
    console.log('音频内容变了', newval);
    if (canvasVideoStream.value) {
      setAudioTrackContentHints(
        canvasVideoStream.value,
        // @ts-ignore
        currentAudioContentHint.value
      );
    }
  }
);
// 监听帧率变化，调整画布的渲染帧率
watch(
  () => currentMaxFramerate.value,
  (newval) => {
    console.log('帧率变了，修改画布', newval);
    renderFrame();
  }
);
// 监听分辨率变化，更新画布的属性
watch(
  () => currentResolutionRatio.value,
  (newval, oldval) => {
    console.log('分辨率变了，修改画布', newval);
    changeCanvasAttr({ newHeight: newval, oldHeight: oldval });
  }
);
// 监听RTC网络状态变化，更新媒体流
watch(
  () => networkStore.rtcMap,
  (newVal) => {
    newVal.forEach((item) => {
      if (appStore.allTrack.find((v) => v.mediaName === item.receiver)) {
        return;
      }
      const streamid = item.localStream?.id;
      if (!streamid) return;
      if (addMediaOkMap.value.get(streamid)) return;
      addMediaOkMap.value.set(streamid, item);
      addMediaOk({
        id: getRandomEnglishString(6),
        openEye: true,
        audio: 1,
        video: 1,
        mediaName: item.receiver,
        type: MediaTypeEnum.metting,
        track: item.localStream?.getVideoTracks()[0],
        trackid: item.localStream?.getVideoTracks()[0].id,
        stream: item.localStream || undefined,
        streamid: item.localStream?.id,
        hidden: false,
        muted: false,
        scaleInfo: {},
      });
    });
  },
  {
    deep: true,
    immediate: true,
  }
);

watch(
  () => damuList.value.length,
  () => {
    setTimeout(() => {
      handleScrollTop();
    }, 0);
  }
);
// 检查房间名是否合法
function roomNameIsOk() {
  if (!appStore.liveRoomInfo) return;
  if (!appStore.liveRoomInfo.name!.length) {
    window.$message.warning('请输入房间名！');
    return false;
  }
  if (
    appStore.liveRoomInfo.name!.length < 3 ||
    appStore.liveRoomInfo.name!.length > 20
  ) {
    window.$message.warning('房间名要求3-20个字符！');
    return false;
  }
  return true;
}
// 修改房间名
async function changeLiveRoomName() {
  showEditNameInput.value = false;
  if (!roomNameIsOk()) return;
  if (appStore.liveRoomInfo) {
    const res = await fetchUpdateMyLiveRoom(appStore.liveRoomInfo);
    if (res.code === 200) {
      window.$message.success('修改成功！');
    }
  }
}
// 修改房间所在区域
async function changeLiveRoomArea() {
  if (appStore.liveRoomInfo) {
    appStore.liveRoomInfo.areas = appStore.areaList.filter(
      (v) => v.id === currentArea.value
    );
    // @ts-ignore
    const res = await fetchUpdateMyLiveRoom({ areas: [currentArea.value] });
    if (res.code === 200) {
      window.$message.success('修改成功！');
    }
  }
}
// 发送弹幕
function handleSendDanmu() {
  sendDanmuTxt(danmuStr.value, roomId.value);
  danmuStr.value = '';
}
// 处理输入框中内容的拼接
function handlePushStr(str) {
  danmuStr.value += str;
  showEmoji.value = false;
}
// 处理滚动条位置，将滚动条滚动到最底部并多增加一定的偏移量
function handleScrollTop() {
  // 如果danmuListRef对象存在（即弹幕列表存在），则调整其scrollTop属性
  if (danmuListRef.value) {
    // 将滚动条设置为元素的scrollHeight（即内容的总高度）加上10000的偏移量
    danmuListRef.value.scrollTop = danmuListRef.value.scrollHeight + 10000;
  }
}
// 处理Blob数据的发送
function handleSendBlob(event: BlobEvent) {
  bolbId.value += 1;
  // const val = bolbId.value;
  // if (val % 3 === 0) {
  //   setTimeout(() => {
  //     sendBlob({
  //       blob: event.data,
  //       blobId: `${val}`,
  //       delay: msrDelay.value,
  //       max_delay: msrMaxDelay.value,
  //     });
  //   }, 1000);
  //   return;
  // }
  sendBlob({
    blob: event.data,
    blobId: `${bolbId.value}`,
    delay: msrDelay.value,
    max_delay: msrMaxDelay.value,
  });
}
// 模拟点击上传按钮，触发上传操作
function mockClick() {
  if (!loginTip()) {
    return;
  }
  if (!commentAuthTip()) {
    return;
  }
  uploadRef.value?.click();
}
// 处理文件上传变化
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
// 处理不同类型的MediaRecorder支持情况
function handleMediaRecorderAllType() {
  const types = [
    'video/webm',
    'audio/webm',
    'video/mpeg',
    'video/webm;codecs=vp8',
    'video/webm;codecs=vp9',
    'video/webm;codecs=daala',
    'video/webm;codecs=h264',
    'audio/webm;codecs=opus',
    'audio/webm;codecs=aac',
    'audio/webm;codecs=h264,opus',
    'video/webm;codecs=avc1.64001f,opus',
    'video/webm;codecs=avc1.4d002a,opus',
  ];
  Object.keys(types).forEach((item) => {
    console.log(types[item], MediaRecorder.isTypeSupported(types[item]));
  });
}
// 处理媒体录制（例如摄像头和麦克风的录制流）
function handleMsr(stream: MediaStream) {
  // https://developer.mozilla.org/en-US/docs/Web/Media/Formats/codecs_parameter
  const mimeType = 'video/webm;codecs=avc1.4d002a,opus';
  // const mimeType = 'video/webm;codecs=avc1.64001f,opus'; // b站的参数

  if (!MediaRecorder.isTypeSupported(mimeType)) {
    console.error('不支持', mimeType);
    return;
  } else {
    console.log('支持', mimeType);
  }
  /**
   * 小写的 "kb/s" 表示千比特每秒，而大写的 "KB/s" 表示千字节每秒
   * 例如，当我们说 100 kb/s 时，意思是每秒传输100千比特（比特）的数据。而当我们说 100 KB/s 时，意思是每秒传输100千字节（字节）的数据，相当于800千比特（比特）
   * 千字节（KB）、兆字节（MB）、千兆字节（GB）
   * 8 比特（bits）等于 1 字节（byte）
   * 1 Kbps（千比特每秒）等于 0.125 KB/s（千字节每秒）
   * 1 Mbps（兆比特每秒）等于 0.125 MB/s（兆字节每秒）
   * bit，比特
   * byte，字节
   * videoBitsPerSecond的单位是比特，假设videoBitsPerSecond值是1000*2000，即2000000
   * 2000000比特等于2000000 / 8 / 1000 = 250 KB/s
   */

  recorder.value = new MediaRecorder(stream, {
    mimeType,
    // bitsPerSecond: 1000 * currentMaxBitrate.value,
    videoBitsPerSecond: 1000 * currentMaxBitrate.value, // 单位是比特
    // audioBitsPerSecond: 1000 * 2000,
  });
  recorder.value.ondataavailable = handleSendBlob;
  worker.value?.postMessage({
    type: 'request-clear-loop',
    timer: workerMsrTimerId.value,
  });
  worker.value?.postMessage({
    type: 'request-start-msr-loop',
    delay: msrDelay.value,
  });
  worker.value?.addEventListener('message', (e) => {
    if (e.data.type === 'response-start-msr-loop') {
      workerMsrTimerId.value = e.data.timer;
    } else if (e.data.type === 'response-msr-looping') {
      recorder.value?.stop();
      recorder.value?.start();
    }
  });
}

watch(
  () => appStore.areaList,
  (newval) => {
    if (newval) {
      const res: any[] = [];
      appStore.areaList.forEach((v) => {
        res.push({ label: v.name, value: v.id });
      });
      areaList.value = res;
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

watch(
  () => appStore.liveRoomInfo,
  (newval) => {
    if (newval) {
      handleSendGetLiveUser(appStore.liveRoomInfo?.id!);
      handleHistoryMsg();
      const area = newval.areas?.[0];
      if (area) {
        currentArea.value = area.id!;
      }
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

onMounted(() => {
  getGoodsList();
  worker.value = new Worker('worker.js');
  setTimeout(() => {
    scrollTo(0, 0);
  }, 100);
  handleMediaRecorderAllType();
  initUserMedia();
  initCanvas();
  handleCache();
});

onUnmounted(() => {
  clearInterval(recordVideoTimer.value);
  recorder.value?.stop();
  bodyAppendChildElArr.value.forEach((el) => {
    el.remove();
  });
  clearFrame();
  worker.value?.terminate();

  appStore.allTrack.forEach((v) => {
    v.videoEl?.pause();
    v.videoEl?.removeAttribute('src');
    v.videoEl?.remove();
    v.stream?.getTracks().forEach((track) => {
      track.stop();
      v.stream?.removeTrack(track);
    });
  });
  clearInterval(loopGetLiveUserTimer.value);
});

function handleSendGetLiveUser(liveRoomId: number) {
  clearInterval(loopGetLiveUserTimer.value);
  async function main() {
    const res = await fetchLiveRoomOnlineUser({ live_room_id: liveRoomId });
    if (res.code === 200) {
      liveUserList.value = res.data;
    }
  }
  setTimeout(() => {
    main();
  }, 500);
  loopGetLiveUserTimer.value = setInterval(() => {
    main();
  }, 1000 * 3);
}

async function initUserMedia() {
  const res1 = await handleUserMedia({ video: true, audio: true });
  console.log('初始化获取摄像头成功', res1);
  const res2 = await handleUserMedia({ video: false, audio: true });
  console.log('初始化获取麦克风成功', res2);
  if (!res1 || !res2) {
    showOpenMicophoneTipCpt.value = true;
  }
}

function renderAll() {
  timeCanvasDom.value.forEach((item) => {
    item.text = new Date().toLocaleString();
  });
  stopwatchCanvasDom.value.forEach((item) => {
    const res = formatDownTime2({
      endTime: +new Date(),
      startTime: startTime.value,
      showMillisecond: true,
      addZero: true,
    });
    item.text = `${res.d}天${res.h}时${res.m}分${res.s}秒${res.ms}毫秒`;
  });
  fabricCanvas.value?.renderAll();
}

function clearFrame() {
  worker.value?.postMessage({
    type: 'request-clear-loop',
    data: {
      timer: workerTimerId.value,
    },
  });
}

function renderFrame() {
  /**
   * 理论情况：
   * currentMaxFramerate等于20，即每秒20帧，即1000 / 20 = 50毫秒轮询一次
   * currentMaxFramerate等于30，即每秒30帧，即1000 / 30 = 33.333毫秒轮询一次
   * currentMaxFramerate等于30，即每秒60帧，即1000 / 60 = 16.666毫秒轮询一次
   * 实际情况：
   * currentMaxFramerate等于20，即50毫秒轮询一次，实际fps是18
   * currentMaxFramerate等于20，希望fps是20，即需要(18/20) * 50 = 45毫秒轮询一次
   */
  let delay = 1000 / currentMaxFramerate.value;
  delay = (18 / 20) * delay;
  worker.value?.postMessage({
    type: 'request-clear-loop',
    timer: workerTimerId.value,
  });
  worker.value?.postMessage({
    type: 'request-start-loop',
    delay,
  });
  worker.value?.addEventListener('message', (e) => {
    if (e.data.type === 'response-start-loop') {
      workerTimerId.value = e.data.timer;
    } else if (e.data.type === 'response-looping') {
      renderAll();
    }
  });
}

function handleNullAudio() {
  // // 创建AudioContext对象
  // const audioContext = new window.AudioContext({ sampleRate: 48000 });
  // 仅在 AudioContext 为空时创建，并确保采样率符合要求
  if (!globalAudioContext.value) {
    globalAudioContext.value = new window.AudioContext({ sampleRate: 48000 });
  }

  const audioContext = globalAudioContext.value;
  const source = audioContext.createBufferSource();
  const destination = audioContext.createMediaStreamDestination();

  source.connect(destination);
  source.start();

  const stream = destination.stream;

  if (stream) {
    console.log('已创建空的直播音频流');
    const video = createVideo({ appendChild: false });
    video.srcObject = stream;
    nullAudioStream.value = stream;
  } else {
    console.error('无法创建空的直播音频流');
  }
}

// function handleMixedAudio() {
//   const allAudioTrack = appStore.allTrack.filter((item) => item.audio === 1);
//   const nullAudio = nullAudioStream.value?.getAudioTracks()[0];
//   if (nullAudio) {
//     allAudioTrack.push({
//       openEye: true,
//       id: getRandomEnglishString(6),
//       audio: 2,
//       video: 1,
//       mediaName: '占位空音频',
//       type: MediaTypeEnum.webAudio,
//       track: nullAudio,
//       trackid: nullAudio.id,
//       stream: nullAudioStream.value,
//       streamid: nullAudioStream.value?.id,
//       hidden: false,
//       muted: false,
//       scaleInfo: {},
//     });
//   }
//   const audioCtx = new AudioContext();
//   if (canvasVideoStream.value?.getAudioTracks()[0]) {
//     canvasVideoStream.value.removeTrack(
//       canvasVideoStream.value.getAudioTracks()[0]
//     );
//   }
//   const res: { source: MediaStreamAudioSourceNode; gainNode: GainNode }[] = [];
//   allAudioTrack.forEach((item) => {
//     if (!audioCtx || !item.stream) return;
//     const source = audioCtx.createMediaStreamSource(item.stream);
//     const gainNode = audioCtx.createGain();
//     gainNode.gain.value = (item.volume || 0) / 100;
//     source.connect(gainNode);
//     res.push({ source, gainNode });
//     // console.log('混流', item.stream?.id, item.stream);
//   });
//   const destination = audioCtx.createMediaStreamDestination();
//   res.forEach((item) => {
//     item.source.connect(item.gainNode);
//     item.gainNode.connect(destination);
//   });
//   if (webaudioVideo.value) {
//     webaudioVideo.value.remove();
//   }
//   webaudioVideo.value = createVideo({
//     appendChild: false,
//     muted: true,
//   });
//   bodyAppendChildElArr.value.push(webaudioVideo.value);
//   webaudioVideo.value.className = 'web-audio-video';
//   webaudioVideo.value!.srcObject = destination.stream;
//   const resAudio = destination.stream.getAudioTracks()[0];
//   canvasVideoStream.value?.addTrack(resAudio);
//   networkStore.rtcMap.forEach((rtc) => {
//     const sender = rtc.peerConnection
//       ?.getSenders()
//       .find((sender) => sender.track?.id === resAudio.id);
//     if (!sender) {
//       rtc.peerConnection
//         ?.getSenders()
//         ?.find((sender) => sender.track?.kind === 'audio')
//         ?.replaceTrack(resAudio);
//     }
//   });
// }
function handleMixedAudio() {
  if (!globalAudioContext.value) {
    globalAudioContext.value = new AudioContext({ sampleRate: 48000 });
  }
  const audioCtx = globalAudioContext.value;

  const allAudioTrack = appStore.allTrack.filter((item) => item.audio === 1);
  const nullAudio = nullAudioStream.value?.getAudioTracks()[0];

  if (nullAudio) {
    allAudioTrack.push({
      openEye: true,
      id: getRandomEnglishString(6),
      audio: 2,
      video: 1,
      mediaName: '占位空音频',
      type: MediaTypeEnum.webAudio,
      track: nullAudio,
      trackid: nullAudio.id,
      stream: nullAudioStream.value,
      streamid: nullAudioStream.value?.id,
      hidden: false,
      muted: false,
      scaleInfo: {},
    });
  }

  if (canvasVideoStream.value?.getAudioTracks()[0]) {
    canvasVideoStream.value.removeTrack(
      canvasVideoStream.value.getAudioTracks()[0]
    );
  }

  const res: any = [];
  allAudioTrack.forEach((item) => {
    if (!audioCtx || !item.stream) return;
    const source = audioCtx.createMediaStreamSource(item.stream);
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = (item.volume || 0) / 100;
    source.connect(gainNode);
    res.push({ source, gainNode });
  });

  const destination = audioCtx.createMediaStreamDestination();
  res.forEach((item) => {
    item.source.connect(item.gainNode);
    item.gainNode.connect(destination);
  });

  if (webaudioVideo.value) {
    webaudioVideo.value.remove();
  }
  webaudioVideo.value = createVideo({
    appendChild: false,
    muted: true,
  });
  bodyAppendChildElArr.value.push(webaudioVideo.value);
  webaudioVideo.value.className = 'web-audio-video';
  webaudioVideo.value!.srcObject = destination.stream;

  const resAudio = destination.stream.getAudioTracks()[0];
  canvasVideoStream.value?.addTrack(resAudio);

  networkStore.rtcMap.forEach((rtc) => {
    const sender = rtc.peerConnection
      ?.getSenders()
      .find((sender) => sender.track?.id === resAudio.id);
    if (!sender) {
      rtc.peerConnection
        ?.getSenders()
        ?.find((sender) => sender.track?.kind === 'audio')
        ?.replaceTrack(resAudio);
    }
  });
}

function handleEndLive() {
  clearLoop();
  endLive();
  sendRoomNoLive();
}

function clearLoop() {
  worker.value?.postMessage({
    type: 'request-clear-loop',
    timer: workerMsrTimerId.value,
  });
  recorder.value?.removeEventListener('dataavailable', handleSendBlob);
}

async function handleHistoryMsg() {
  if (damuList.value?.length > 0) return;
  try {
    const res = await fetchGetWsMessageList({
      nowPage: 1,
      pageSize: appStore.liveRoomInfo?.history_msg_total || 100,
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
      if (
        appStore.liveRoomInfo?.system_msg &&
        appStore.liveRoomInfo?.system_msg !== ''
      ) {
        damuList.value.push({
          send_msg_time: +new Date(),
          live_room_id: Number(roomId.value),
          id: -1,
          content: appStore.liveRoomInfo?.system_msg,
          content_type: WsMessageContentTypeEnum.txt,
          msg_type: DanmuMsgTypeEnum.system,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function handleScreenshot() {
  const url = generateBase64(pushCanvasRef.value!);
  const a = document.createElement('a');
  const event = new MouseEvent('click');
  a.download = `${+new Date()}截屏`;
  a.href = url;
  a.dispatchEvent(event);
}

/**
 * 处理视频录制的函数
 * 该函数会检查浏览器是否支持视频录制，并在用户允许的情况下开始或停止录制。
 */
// async function handleRecordVideo() {
//   // 检查当前环境是否支持 VideoDecoder 和 AudioEncoder
//   if (!window.VideoDecoder || !window.AudioEncoder) {
//     window.$message.warning(`当前环境不支持录制视频`);
//     return;
//   }

//   // 初始化音频录制
//   initAudio();

//   try {
//     // 如果当前未录制，则开始录制
//     if (!recording.value) {
//       // 生成建议的文件名，格式为 billd直播录制-时间戳.mp4
//       suggestedName.value = `billd直播录制-${+new Date()}.mp4`;

//       // 使用 showSaveFilePicker 让用户选择保存路径
//       const fileHandle = await window.showSaveFilePicker({
//         suggestedName: suggestedName.value, // 默认文件名
//       });

//       // 获取文件写入对象
//       const writer = await fileHandle.createWritable();

//       // 创建 AVRecorder 实例，克隆 canvasVideoStream 进行录制
//       avRecorder = new AVRecorder(canvasVideoStream.value!.clone(), {});

//       // 开始录制
//       await avRecorder.start();

//       // 记录录制开始的时间戳
//       const startTime = +new Date();

//       // 设置定时器，每秒更新录制时长显示
//       recordVideoTimer.value = setInterval(() => {
//         // 计算录制的时间
//         const res = formatDownTime2({
//           endTime: +new Date(), // 当前时间
//           startTime, // 录制开始时间
//           showMillisecond: true, // 是否显示毫秒
//           addZero: true, // 是否补零（如 01:02:03）
//         });

//         // 根据计算结果更新录制时间显示
//         if (res.d) {
//           recordVideoTime.value = `${res.d}天${res.h}:${res.m}:${res.s}`;
//         } else {
//           recordVideoTime.value = `${res.h}:${res.m}:${res.s}`;
//         }
//       }, 1000);

//       console.log(avRecorder.outputStream, '////')

//       // 将 AVRecorder 录制的输出流写入文件
//       avRecorder.outputStream?.pipeTo(writer).catch(console.error);
//     } else {
//       // 如果已经在录制，则停止录制
//       clearInterval(recordVideoTimer.value); // 清除定时器
//       recordVideoTime.value = '00:00:00'; // 重置录制时间显示

//       // 停止录制并保存文件
//       await avRecorder?.stop();

//       // 提示用户文件已成功保存
//       window.$message.success(`录制文件: ${suggestedName.value} 已保存到本地`);

//       // 释放 avRecorder 资源
//       avRecorder = null;
//     }

//     // 切换录制状态
//     recording.value = !recording.value;
//   } catch (error) {
//     console.log(error);
//     recording.value = false; // 发生错误时，确保 recording 状态被重置
//   }
// }

async function handleRecordVideo() {
  if (!window.VideoDecoder || !window.AudioEncoder) {
    window.$message.warning(`当前环境不支持录制视频`);
    return;
  }

  initAudio();

  try {
    if (!recording.value) {
      suggestedName.value = `billd直播录制-${+new Date()}.mp4`;

      // 创建 AVRecorder
      avRecorder = new AVRecorder(canvasVideoStream.value!.clone(), {});

      await avRecorder.start();

      const startTime = +new Date();
      recordVideoTimer.value = setInterval(() => {
        const res = formatDownTime2({
          endTime: +new Date(),
          startTime,
          showMillisecond: true,
          addZero: true,
        });

        if (res.d) {
          recordVideoTime.value = `${res.d}天${res.h}:${res.m}:${res.s}`;
        } else {
          recordVideoTime.value = `${res.h}:${res.m}:${res.s}`;
        }
      }, 1000);
      // 监听 outputStream 数据
      if (avRecorder.outputStream) {
        collectStreamData(avRecorder.outputStream);
      }
    } else {
      clearInterval(recordVideoTimer.value);
      recordVideoTime.value = '00:00:00';

      await avRecorder?.stop();

      // 录制停止后，将 `recordedChunks` 转换为 `Blob`
      if (recordedChunks.value.length > 0) {
        const videoBlob = new Blob(recordedChunks.value, { type: 'video/mp4' });

        // **获取视频时长**
        getVideoDuration(videoBlob).then((duration) => {
          console.log(`🎥 录制时长: ${formatDuration(duration)}`);

          const videoFile = new File([videoBlob], suggestedName.value, {
            type: 'video/mp4',
          });

          createLiveRoomRecording({
            live_room_id: liveRoomInfo.value.id,
            title: `直播录制-${+new Date()}`,
            parent_category_id: liveRoomInfo.value.parent_category_id,
            child_category_id: liveRoomInfo.value.child_category_id,
            videoFile: videoFile,
            duration: duration, // ⬅️ 传给后端
          })
            .then(() => {
              window.$message.success(`录制文件已成功上传至服务器`);
            })
            .catch((error) => {
              console.error('上传视频失败:', error);
              window.$message.error('视频上传失败');
            });

          // 清空 recordedChunks
          recordedChunks.value = [];
        });

        // 清空 recordedChunks
        recordedChunks.value = [];
      } else {
        console.error('没有捕获到视频数据，无法上传');
      }

      avRecorder = null;
    }

    recording.value = !recording.value;
  } catch (error) {
    console.log(error);
    recording.value = false;
  }
}

/** 获取视频时长 */
function getVideoDuration(videoBlob) {
  return new Promise((resolve) => {
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';

    // 监听 `loadedmetadata` 事件
    tempVideo.onloadedmetadata = () => {
      resolve(tempVideo.duration);
    };

    tempVideo.src = URL.createObjectURL(videoBlob);
  });
}

/** 格式化时长（秒 → 00:00:00） */
function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours > 0 ? `${hours}:` : ''}${String(minutes).padStart(
    2,
    '0'
  )}:${String(secs).padStart(2, '0')}`;
}

/**
 * 监听 outputStream 并收集数据块
 * @param {ReadableStream} stream - AVRecorder 的输出流
 */
async function collectStreamData(stream) {
  const reader = stream.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    recordedChunks.value.push(value);
  }
}

/**
 * 初始化音频处理函数
 * 该函数用于确保音频正确初始化，仅在首次调用时执行
 */
function initAudio() {
  if (initAudioFlag.value) return; // 如果已经初始化过，则直接返回
  initAudioFlag.value = true; // 标记音频已初始化

  // 处理空音频（可能用于避免音轨丢失）
  handleNullAudio();

  // 处理混合音频（可能用于混合麦克风和系统音频）
  handleMixedAudio();
}
// async function initAudio() {
//   try {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       audio: {
//         sampleRate: 48000, // 强制使用 48000Hz 采样率
//         channelCount: 2, // 立体声
//       },
//     });

//     const audioContext = new AudioContext({ sampleRate: 48000 });
//     const source = audioContext.createMediaStreamSource(stream);
//     const destination = audioContext.createMediaStreamDestination();
//     source.connect(destination);

//     return destination.stream;
//   } catch (error) {
//     console.error('音频初始化失败:', error);
//   }
// }

async function uploadLivePreview() {
  const base64 = generateBase64(pushCanvasRef.value!);
  const file = base64ToFile(base64, `tmp.webp`);
  const uploadRes = await useUpload({
    prefix: QINIU_KODO.hssblog.prefix['billd-live/live-preview/'],
    file,
  });
  if (uploadRes.flag && uploadRes.resultUrl) {
    fetchUpdateMyLiveRoom({ cover_img: uploadRes.resultUrl });
  }
}

function handleShare() {
  useTip({
    content: `直播间地址：${getLiveRoomPageUrl(+roomId.value)}`,
    title: '分享',
    confirmButtonText: '复制',
    hiddenCancel: true,
    maskClosable: false,
  })
    .then(() => {
      copyToClipBoard(getLiveRoomPageUrl(+roomId.value));
      window.$message.success('复制成功');
    })
    .catch();
}

function handleStartLive() {
  if (!appStore.allTrack.length) {
    window.$message.warning('至少选择一个素材');
    return;
  }
  initAudio();
  startLive({
    type: liveType,
    msrDelay: msrDelay.value,
    msrMaxDelay: 5000,
  });
  if (liveType === LiveRoomTypeEnum.msr) {
    const stream = pushCanvasRef.value!.captureStream();
    // @ts-ignore
    const audioTrack = webaudioVideo.value!.captureStream().getAudioTracks()[0];
    stream.addTrack(audioTrack);
    handleMsr(stream);
  }
}

function handleScale({ width, height }: { width: number; height: number }) {
  const resolutionHeight = currentResolutionRatio.value;
  const resolutionWidth = currentResolutionRatio.value * appStore.videoRatio;
  let ratio = 1;
  if (width > resolutionWidth) {
    const r1 = resolutionWidth / width;
    ratio = r1;
  }
  if (height > resolutionHeight) {
    const r1 = resolutionHeight / height;
    if (ratio > r1) {
      ratio = r1;
    }
  }
  return ratio;
}

function autoCreateVideo(data: {
  file?: File;
  stream?: MediaStream;
  id: string;
  rect?: { left: number; top: number };
  scaleInfo?: Record<number, { scaleX: number; scaleY: number }>;
  muted?: boolean;
}) {
  const { file, id, rect, scaleInfo, muted } = data;
  let stream = data.stream;
  let videoEl: HTMLVideoElement;
  if (file) {
    const url = URL.createObjectURL(file);
    videoEl = createVideo({
      appendChild: false,
      muted,
    });
    videoEl.src = url;
    // @ts-ignore
    stream = videoEl.captureStream();
  } else {
    videoEl = createVideo({ appendChild: false, muted });
    if (stream) {
      videoEl.srcObject = stream;
    }
  }
  bodyAppendChildElArr.value.push(videoEl);
  videoEl.setAttribute('videoid', id);
  return new Promise<{
    canvasDom: Raw<fabric.Image>;
    videoEl: HTMLVideoElement;
    scale: number;
    stream: MediaStream;
  }>((resolve) => {
    videoEl.onloadedmetadata = () => {
      let canvasDom: Raw<fabric.Image>;
      let ratio;
      function main() {
        const width =
          stream?.getVideoTracks()[0].getSettings().width! ||
          videoEl.videoWidth;
        const height =
          stream?.getVideoTracks()[0].getSettings().height! ||
          videoEl.videoHeight;
        ratio = handleScale({ width, height });
        videoEl.width = width;
        videoEl.height = height;
        const old = appStore.allTrack.find((item) => item.id === id);
        if (canvasDom) {
          fabricCanvas.value?.remove(canvasDom);
          canvasDom = markRaw(
            new fabric.Image(videoEl, {
              top: (old?.rect?.top || rect?.top || 0) / window.devicePixelRatio,
              left:
                (old?.rect?.left || rect?.left || 0) / window.devicePixelRatio,
              width,
              height,
            })
          );
        } else {
          canvasDom = markRaw(
            new fabric.Image(videoEl, {
              top: (old?.rect?.top || rect?.top || 0) / window.devicePixelRatio,
              left:
                (old?.rect?.left || rect?.left || 0) / window.devicePixelRatio,
              width,
              height,
            })
          );
        }
        appStore.allTrack.forEach((item) => {
          if (item.id === id) {
            if (item.canvasDom) {
              item.canvasDom = canvasDom;
            }
          }
        });
        handleMoving({ canvasDom, id });
        handleScaling({ canvasDom, id });
        canvasDom.scale(scaleInfo?.[window.devicePixelRatio]?.scaleX || 1);
        fabricCanvas.value!.add(canvasDom);
        resolve({ canvasDom, scale: ratio, videoEl, stream: stream! });
      }
      main();
      videoEl?.addEventListener('resize', () => {
        main();
      });
    };
  });
}

// 容器宽高，1280*720，即720p
// canvas容器宽高，2560*1440，即1440p

// ======
// 容器宽高，960*540，即540p
// dom宽高，640*480
// canvas容器宽高，960*540，即540p
// 将dom绘制到容器里，此时dom的大小就是640*480
// 需求，不管切换多少分辨率，我要看到的dom都是一样大小，即
// 960*540时，dom是640*480
// 1280*720时，dom不能是640*480了，因为这样他就会对比上一个分辨率的dom看起来小了，960/1280=0.75,540/720=0.75，
// 其实就是分辨率变大了，我们就要将图片也变大，即图片的宽是640/0.75=853.4，高是480/0.75=640
// 坐标变化，960*540时，dom坐标是100,100
// 1280*720时，dom的坐标不能再是100，100了，否则对比上一个分辨率看起来偏

function changeCanvasAttr({
  newHeight,
  oldHeight,
}: {
  newHeight: number;
  oldHeight: number;
}) {
  if (fabricCanvas.value) {
    const resolutionHeight =
      currentResolutionRatio.value / window.devicePixelRatio;
    const resolutionWidth =
      (currentResolutionRatio.value / window.devicePixelRatio) *
      appStore.videoRatio;
    fabricCanvas.value.setWidth(resolutionWidth);
    fabricCanvas.value.setHeight(resolutionHeight);
    appStore.allTrack.forEach((iten) => {
      const item = iten.canvasDom;

      if (item) {
        // 分辨率变小了，将图片变小
        if (newHeight < oldHeight) {
          const ratio2 = oldHeight / newHeight;
          item.left = item.left! / ratio2;
          item.top = item.top! / ratio2;
        } else {
          // 分辨率变大了，将图片变大
          const ratio2 = oldHeight / newHeight;
          item.left = item.left! / ratio2;
          item.top = item.top! / ratio2;
        }
      }
    });
    appStore.allTrack.forEach((iten) => {
      const item = iten.canvasDom;

      if (item) {
        // 分辨率变小了，将图片变小
        if (newHeight < oldHeight) {
          const ratio = newHeight / oldHeight;
          const ratio1 = (item.scaleX || 1) * ratio;
          item.scale(ratio1);
        } else {
          // 分辨率变大了，将图片变大
          const ratio = newHeight / oldHeight;
          const ratio1 = (item.scaleX || 1) * ratio;
          item.scale(ratio1);
        }
      }
    });

    changeCanvasStyle();
  }
}

function changeCanvasStyle() {
  // @ts-ignore
  fabricCanvas.value.wrapperEl.style.width = `${wrapSize.width}px`;
  // @ts-ignore
  fabricCanvas.value.wrapperEl.style.height = `${wrapSize.height}px`;
  // @ts-ignore
  fabricCanvas.value.lowerCanvasEl.style.width = `${wrapSize.width}px`;
  // @ts-ignore
  fabricCanvas.value.lowerCanvasEl.style.height = `${wrapSize.height}px`;
  // @ts-ignore
  fabricCanvas.value.upperCanvasEl.style.width = `${wrapSize.width}px`;
  // @ts-ignore
  fabricCanvas.value.upperCanvasEl.style.height = `${wrapSize.height}px`;
}

function initCanvas() {
  const resolutionHeight =
    currentResolutionRatio.value / window.devicePixelRatio;
  const resolutionWidth =
    (currentResolutionRatio.value / window.devicePixelRatio) *
    appStore.videoRatio;
  const wrapWidth = containerRef.value!.getBoundingClientRect().width;
  // const wrapWidth = 1920;
  const ratio = wrapWidth / resolutionWidth;
  const wrapHeight = resolutionHeight * ratio;
  // const wrapHeight = 1080;
  // lower-canvas: 实际的canvas画面，也就是pushCanvasRef
  // upper-canvas: 操作时候的canvas
  const ins = markRaw(new fabric.Canvas(pushCanvasRef.value!));
  ins.setWidth(resolutionWidth);
  ins.setHeight(resolutionHeight);
  ins.setBackgroundColor('#1b1b1b', () => {
    console.log('setBackgroundColor回调');
  });
  wrapSize.width = wrapWidth;
  wrapSize.height = wrapHeight;
  fabricCanvas.value = ins;
  renderFrame();
  changeCanvasStyle();
}

/**
 * 1: {scaleX: 1, scaleY: 1}
 * 2: {scaleX: 0.5, scaleY: 0.5}
 * 3: {scaleX: 0.3333333333333333, scaleY: 0.3333333333333333}
 * 4: {scaleX: 0.25, scaleY: 0.25}
 */

/**
 * 二倍屏即1px里面有2个像素；三倍屏1px里面有3个像素，以此类推
 * 一个图片，宽高都是100px
 * 一倍屏展示：100px等于100个像素，一比一展示
 * 二倍屏展示：100px等于100个像素，二比一展示，即在二倍屏的100px看起来会比一倍屏的100px小一倍
 * 如果需要在一杯和二倍屏幕的时候看的大小都一样：
 * 1，在二倍屏的时候，需要将100px放大一倍，即200px；
 * 2，在一倍屏的时候，需要将100px缩小一倍，即50px；
 */
function handleScaling({ canvasDom, id }) {
  canvasDom.on('scaling', () => {
    appStore.allTrack.forEach((item) => {
      if (id === item.id) {
        item.scaleInfo[window.devicePixelRatio] = {
          scaleX: canvasDom.scaleX || 1,
          scaleY: canvasDom.scaleY || 1,
        };
        Object.keys(item.scaleInfo).forEach((iten) => {
          if (window.devicePixelRatio !== Number(iten)) {
            if (window.devicePixelRatio > Number(iten)) {
              item.scaleInfo[iten] = {
                scaleX:
                  item.scaleInfo[window.devicePixelRatio].scaleX *
                  window.devicePixelRatio,
                scaleY:
                  item.scaleInfo[window.devicePixelRatio].scaleY *
                  window.devicePixelRatio,
              };
            } else {
              if (window.devicePixelRatio === 1) {
                item.scaleInfo[iten] = {
                  scaleX: item.scaleInfo[1].scaleX / Number(iten),
                  scaleY: item.scaleInfo[1].scaleY / Number(iten),
                };
              } else {
                item.scaleInfo[iten] = {
                  scaleX: item.scaleInfo[1].scaleX * Number(iten),
                  scaleY: item.scaleInfo[1].scaleY * Number(iten),
                };
              }
            }
          }
        });
      }
    });
    cacheStore.setResourceList(appStore.allTrack);
  });
}
function handleMoving({
  canvasDom,
  id,
}: {
  canvasDom: fabric.Image | fabric.Text;
  id: string;
}) {
  canvasDom.on('moving', () => {
    appStore.allTrack.forEach((item) => {
      if (id === item.id) {
        item.rect = {
          top: (canvasDom.top || 0) * window.devicePixelRatio,
          left: (canvasDom.left || 0) * window.devicePixelRatio,
        };
      }
    });
    cacheStore.setResourceList(appStore.allTrack);
  });
}

async function handleDisplayMedia({ video, audio }) {
  try {
    const event = await navigator.mediaDevices.getDisplayMedia({
      video,
      audio,
    });
    return event;
  } catch (error) {
    console.log(error);
  }
}

async function handleCache() {
  const res: AppRootState['allTrack'] = [];
  const err: string[] = [];
  const queue: any[] = [];
  cacheStore['resource-list'].forEach((item) => {
    // @ts-ignore
    const obj: AppRootState['allTrack'][0] = {};
    obj.openEye = item.openEye;
    obj.audio = item.audio;
    obj.video = item.video;
    obj.id = item.id;
    obj.deviceId = item.deviceId;
    obj.type = item.type;
    obj.hidden = item.hidden;
    obj.mediaName = item.mediaName;
    obj.muted = true;
    obj.volume = item.volume;
    obj.rect = item.rect;
    obj.scaleInfo = item.scaleInfo;
    obj.stopwatchInfo = item.stopwatchInfo;

    async function handleMediaVideo() {
      const { code, file } = await readFile(item.id);
      if (code === 1 && file) {
        const { videoEl, stream, canvasDom } = await autoCreateVideo({
          file,
          id: obj.id,
          muted: true,
          rect: item.rect,
          scaleInfo: item.scaleInfo,
        });
        if (obj.volume !== undefined) {
          videoEl.volume = obj.volume / 100;
        }
        obj.videoEl = videoEl;
        obj.canvasDom = canvasDom;
        obj.stream = stream;
        obj.streamid = stream.id;
        obj.track = stream.getVideoTracks()[0];
        obj.trackid = stream.getVideoTracks()[0].id;
      } else {
        console.error('读取文件失败');
      }
    }

    async function handleImg() {
      const { code, file } = await readFile(item.id);
      if (code === 1 && file) {
        const imgEl = await new Promise<HTMLImageElement>((resolve) => {
          const reader = new FileReader();
          reader.addEventListener(
            'load',
            function () {
              const img = document.createElement('img');
              img.src = reader.result as string;
              img.onload = () => {
                resolve(img);
              };
            },
            false
          );
          if (file) {
            reader.readAsDataURL(file);
          }
        });
        if (fabricCanvas.value) {
          const canvasDom = markRaw(
            new fabric.Image(imgEl, {
              top: (item.rect?.top || 0) / window.devicePixelRatio,
              left: (item.rect?.left || 0) / window.devicePixelRatio,
              width: imgEl.width,
              height: imgEl.height,
            })
          );
          handleMoving({ canvasDom, id: obj.id });
          handleScaling({ canvasDom, id: obj.id });
          canvasDom.scale(
            item.scaleInfo?.[window.devicePixelRatio]?.scaleX || 1
          );
          canvasDom.opacity = item.openEye ? 1 : 0;
          fabricCanvas.value.add(canvasDom);
          obj.canvasDom = canvasDom;
        }
      } else {
        console.error('读取文件失败');
      }
    }

    async function handleScreen() {
      try {
        const event = await handleDisplayMedia({
          video: true,
          audio: true,
        });
        if (!event) return;
        const videoEl = createVideo({ appendChild: false });
        bodyAppendChildElArr.value.push(videoEl);
        videoEl.setAttribute('videoid', obj.id);
        videoEl.srcObject = event;
        await new Promise((resolve) => {
          videoEl.onloadedmetadata = () => {
            const stream = videoEl
              // @ts-ignore
              .captureStream();
            const width = stream.getVideoTracks()[0].getSettings().width!;
            const height = stream.getVideoTracks()[0].getSettings().height!;
            videoEl.width = width;
            videoEl.height = height;

            const canvasDom = markRaw(
              new fabric.Image(videoEl, {
                top: (item.rect?.top || 0) / window.devicePixelRatio,
                left: (item.rect?.left || 0) / window.devicePixelRatio,
                width,
                height,
              })
            );
            handleMoving({ canvasDom, id: item.id });
            handleScaling({ canvasDom, id: item.id });
            canvasDom.scale(
              item.scaleInfo?.[window.devicePixelRatio]?.scaleX || 1
            );
            canvasDom.opacity = item.openEye ? 1 : 0;
            fabricCanvas.value!.add(canvasDom);
            obj.videoEl = videoEl;
            obj.canvasDom = canvasDom;
            resolve({ videoEl, canvasDom });
          };
        });
      } catch (error) {
        console.error(error);
        handleDel(obj);
        err.push(obj.id);
      }
    }

    async function handleMicrophone() {
      const event = await handleUserMedia({
        video: false,
        audio: { deviceId: obj.deviceId },
      });
      if (!event) return;
      const videoEl = createVideo({ appendChild: false, muted: true });
      bodyAppendChildElArr.value.push(videoEl);
      videoEl.setAttribute('videoid', obj.id);
      videoEl.srcObject = event;
      if (obj.volume !== undefined) {
        videoEl.volume = obj.muted ? 0 : obj.volume / 100;
      }
      obj.videoEl = videoEl;
      obj.stream = event;
      obj.streamid = event.id;
      obj.track = event.getAudioTracks()[0];
      obj.trackid = event.getAudioTracks()[0].id;
    }

    async function handleCamera() {
      const event = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: obj.deviceId },
        audio: false,
      });
      const videoEl = createVideo({ appendChild: false });
      bodyAppendChildElArr.value.push(videoEl);
      videoEl.setAttribute('videoid', obj.id);
      videoEl.srcObject = event;
      await new Promise((resolve) => {
        videoEl.onloadedmetadata = () => {
          const stream = videoEl
            // @ts-ignore
            .captureStream();
          const width = stream.getVideoTracks()[0].getSettings().width!;
          const height = stream.getVideoTracks()[0].getSettings().height!;
          videoEl.width = width;
          videoEl.height = height;

          const canvasDom = markRaw(
            new fabric.Image(videoEl, {
              top: (item.rect?.top || 0) / window.devicePixelRatio,
              left: (item.rect?.left || 0) / window.devicePixelRatio,
              width,
              height,
            })
          );
          handleMoving({ canvasDom, id: item.id });
          handleScaling({ canvasDom, id: item.id });
          canvasDom.scale(
            item.scaleInfo?.[window.devicePixelRatio]?.scaleX || 1
          );
          canvasDom.opacity = item.openEye ? 1 : 0;
          fabricCanvas.value!.add(canvasDom);
          obj.videoEl = videoEl;
          obj.canvasDom = canvasDom;
          resolve({ videoEl, canvasDom });
        };
      });
    }

    if ([MediaTypeEnum.metting, MediaTypeEnum.pk].includes(obj.type)) {
      err.push(obj.id);
    }

    if (item.type === MediaTypeEnum.media && item.video === 1) {
      queue.push(handleMediaVideo());
    } else if (item.type === MediaTypeEnum.screen) {
      queue.push(handleScreen());
    } else if (item.type === MediaTypeEnum.camera) {
      queue.push(handleCamera());
    } else if (item.type === MediaTypeEnum.microphone) {
      queue.push(handleMicrophone());
    } else if (item.type === MediaTypeEnum.img) {
      queue.push(handleImg());
    } else if (item.type === MediaTypeEnum.txt) {
      obj.txtInfo = item.txtInfo;
      obj.scaleInfo = item.scaleInfo;
      if (fabricCanvas.value) {
        const canvasDom = markRaw(
          new fabric.Text(item.txtInfo?.txt || '', {
            top: (item.rect?.top || 0) / window.devicePixelRatio,
            left: (item.rect?.left || 0) / window.devicePixelRatio,
            fill: item.txtInfo?.color,
          })
        );
        handleMoving({ canvasDom, id: obj.id });
        handleScaling({ canvasDom, id: obj.id });
        // fabric.Text类型不能除以分辨率
        canvasDom.scale(item.scaleInfo?.[window.devicePixelRatio]?.scaleX || 1);
        canvasDom.opacity = item.openEye ? 1 : 0;
        fabricCanvas.value.add(canvasDom);
        obj.canvasDom = canvasDom;
      }
    } else if (item.type === MediaTypeEnum.time) {
      obj.timeInfo = item.timeInfo;
      obj.scaleInfo = item.scaleInfo;
      if (fabricCanvas.value) {
        const canvasDom = markRaw(
          new fabric.Text(new Date().toLocaleString(), {
            top: (item.rect?.top || 0) / window.devicePixelRatio,
            left: (item.rect?.left || 0) / window.devicePixelRatio,
            fill: item.timeInfo?.color,
          })
        );
        timeCanvasDom.value.push(canvasDom);
        handleMoving({ canvasDom, id: obj.id });
        handleScaling({ canvasDom, id: obj.id });
        // fabric.Text类型不能除以分辨率
        canvasDom.scale(item.scaleInfo?.[window.devicePixelRatio]?.scaleX || 1);
        canvasDom.opacity = item.openEye ? 1 : 0;
        fabricCanvas.value.add(canvasDom);
        obj.canvasDom = canvasDom;
      }
    } else if (item.type === MediaTypeEnum.stopwatch) {
      obj.stopwatchInfo = item.stopwatchInfo;
      obj.scaleInfo = item.scaleInfo;
      if (fabricCanvas.value) {
        const canvasDom = markRaw(
          new fabric.Text('00天00时00分00秒000毫秒', {
            top: (item.rect?.top || 0) / window.devicePixelRatio,
            left: (item.rect?.left || 0) / window.devicePixelRatio,
            fill: item.stopwatchInfo?.color,
          })
        );
        stopwatchCanvasDom.value.push(canvasDom);
        handleMoving({ canvasDom, id: obj.id });
        handleScaling({ canvasDom, id: obj.id });
        // fabric.Text类型不能除以分辨率
        canvasDom.scale(item.scaleInfo?.[window.devicePixelRatio]?.scaleX || 1);
        canvasDom.opacity = item.openEye ? 1 : 0;
        fabricCanvas.value.add(canvasDom);
        obj.canvasDom = canvasDom;
      }
    }
    res.push(obj);
  });
  await Promise.all(queue);

  canvasVideoStream.value = pushCanvasRef.value!.captureStream();
  appStore.setAllTrack(res.filter((v) => !err.includes(v.id)));
}

function handleShowMediaModalCpt(val: MediaTypeEnum) {
  isEdit.value = false;
  currentMediaData.value = undefined;
  showMediaModalCpt.value = true;
  showSelectMediaModalCpt.value = false;
  currentMediaType.value = val;
}

function handleEdit(item: AppRootState['allTrack'][0]) {
  currentMediaType.value = item.type;
  currentMediaData.value = item;
  isEdit.value = true;
  showMediaModalCpt.value = true;
}

function setScaleInfo({ track, canvasDom, scale = 1 }) {
  [1, 2, 3, 4].forEach((devicePixelRatio) => {
    track.scaleInfo[devicePixelRatio] = {
      scaleX: (1 / devicePixelRatio) * scale,
      scaleY: (1 / devicePixelRatio) * scale,
    };
  });
  if (window.devicePixelRatio !== 1) {
    const ratio = (1 / window.devicePixelRatio) * scale;
    canvasDom.scale(ratio);
    track.scaleInfo[window.devicePixelRatio] = {
      scaleX: ratio,
      scaleY: ratio,
    };
  }
}

async function addMediaOk(val: AppRootState['allTrack'][0]) {
  showMediaModalCpt.value = false;
  if (val.type === MediaTypeEnum.screen) {
    const event = await handleDisplayMedia({
      video: {
        deviceId: val.deviceId,
        // displaySurface: 'monitor', // browser默认标签页;window默认窗口;monitor默认整个屏幕
      },
      audio: true,
    });
    if (!event) return;
    const videoTrack: AppRootState['allTrack'][0] = {
      id: getRandomEnglishString(6),
      openEye: true,
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.screen,
      track: event.getVideoTracks()[0],
      trackid: event.getVideoTracks()[0].id,
      stream: event,
      streamid: event.id,
      hidden: false,
      muted: false,
      scaleInfo: {},
      rect: { left: 0, top: 0 },
    };

    const { canvasDom, videoEl, scale } = await autoCreateVideo({
      stream: event,
      id: videoTrack.id,
      rect: videoTrack.rect,
      scaleInfo: videoTrack.scaleInfo,
    });
    setScaleInfo({ canvasDom, track: videoTrack, scale });
    videoTrack.videoEl = videoEl;
    videoTrack.canvasDom = canvasDom;

    const audio = event.getAudioTracks();
    if (audio.length) {
      videoTrack.audio = 1;
      videoTrack.volume = appStore.normalVolume;
      const audioTrack: AppRootState['allTrack'][0] = {
        openEye: true,
        id: videoTrack.id,
        audio: 1,
        video: 2,
        mediaName: val.mediaName,
        type: MediaTypeEnum.screen,
        track: event.getAudioTracks()[0],
        trackid: event.getAudioTracks()[0].id,
        stream: event,
        streamid: event.id,
        hidden: true,
        muted: false,
        volume: videoTrack.volume,
        scaleInfo: {},
      };
      const res = [...appStore.allTrack, videoTrack, audioTrack];
      appStore.setAllTrack(res);
      cacheStore.setResourceList(res);
      handleMixedAudio();
    } else {
      const res = [...appStore.allTrack, videoTrack];
      appStore.setAllTrack(res);
      cacheStore.setResourceList(res);
    }
    console.log('获取窗口成功');
  } else if (val.type === MediaTypeEnum.camera) {
    const event = await handleUserMedia({
      video: {
        deviceId: val.deviceId,
      },
      audio: false,
    });
    if (!event) return;
    const videoTrack: AppRootState['allTrack'][0] = {
      id: getRandomEnglishString(6),
      openEye: true,
      deviceId: val.deviceId,
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.camera,
      track: event.getVideoTracks()[0],
      trackid: event.getVideoTracks()[0].id,
      stream: event,
      streamid: event.id,
      hidden: false,
      muted: false,
      scaleInfo: {},
      rect: { left: 0, top: 0 },
    };
    const { canvasDom, videoEl, scale } = await autoCreateVideo({
      stream: event,
      id: videoTrack.id,
      rect: videoTrack.rect,
      scaleInfo: videoTrack.scaleInfo,
    });
    setScaleInfo({ canvasDom, track: videoTrack, scale });
    videoTrack.videoEl = videoEl;
    videoTrack.canvasDom = canvasDom;

    const res = [...appStore.allTrack, videoTrack];
    appStore.setAllTrack(res);
    cacheStore.setResourceList(res);
    console.log('获取摄像头成功');
  } else if (val.type === MediaTypeEnum.pk) {
    const event = val.stream;
    if (!event) return;
    const videoTrack: AppRootState['allTrack'][0] = {
      id: getRandomEnglishString(6),
      openEye: true,
      deviceId: val.deviceId,
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.pk,
      track: event.getVideoTracks()[0],
      trackid: event.getVideoTracks()[0].id,
      stream: event,
      streamid: event.id,
      hidden: false,
      muted: false,
      scaleInfo: {},
      rect: { left: 0, top: 0 },
    };
    const { canvasDom, videoEl, scale } = await autoCreateVideo({
      stream: event,
      id: videoTrack.id,
      rect: videoTrack.rect,
      scaleInfo: videoTrack.scaleInfo,
    });
    setScaleInfo({ canvasDom, track: videoTrack, scale });
    videoTrack.videoEl = videoEl;
    videoTrack.canvasDom = canvasDom;

    const res = [...appStore.allTrack, videoTrack];
    appStore.setAllTrack(res);
    cacheStore.setResourceList(res);
    console.log('获取pk成功');
  } else if (val.type === MediaTypeEnum.metting) {
    const stream = val.stream;

    if (!stream) return;
    const mettingVideoTrack = val;
    mettingVideoTrack.rect = { left: 0, top: 0 };
    const { canvasDom, videoEl, scale } = await autoCreateVideo({
      stream,
      id: mettingVideoTrack.id,
      rect: mettingVideoTrack.rect,
      scaleInfo: mettingVideoTrack.scaleInfo,
    });
    setScaleInfo({ canvasDom, track: mettingVideoTrack, scale });
    mettingVideoTrack.videoEl = videoEl;
    mettingVideoTrack.canvasDom = canvasDom;

    const res = [...appStore.allTrack, mettingVideoTrack];
    appStore.setAllTrack(res);
    cacheStore.setResourceList(res);
    console.log('获取会议成功');
    if (stream.getAudioTracks()[0]) {
      console.log('会议有音频');
      mettingVideoTrack.audio = 1;
      mettingVideoTrack.volume = appStore.normalVolume;
      const audioTrack: AppRootState['allTrack'][0] = {
        id: mettingVideoTrack.id,
        openEye: true,
        audio: 1,
        video: 2,
        mediaName: val.mediaName,
        type: MediaTypeEnum.media,
        track: stream.getAudioTracks()[0],
        trackid: stream.getAudioTracks()[0].id,
        stream,
        streamid: stream.id,
        hidden: true,
        muted: false,
        volume: mettingVideoTrack.volume,
        scaleInfo: {},
      };
      const res = [...appStore.allTrack, audioTrack];
      appStore.setAllTrack(res);
      cacheStore.setResourceList(res);
      handleMixedAudio();
    }
  } else if (val.type === MediaTypeEnum.microphone) {
    const event = await handleUserMedia({
      video: false,
      audio: { deviceId: val.deviceId },
    });
    if (!event) return;
    const microphoneVideoTrack: AppRootState['allTrack'][0] = {
      id: getRandomEnglishString(6),
      openEye: true,
      deviceId: val.deviceId,
      audio: 1,
      video: 2,
      mediaName: val.mediaName,
      type: MediaTypeEnum.microphone,
      track: event.getAudioTracks()[0],
      trackid: event.getAudioTracks()[0].id,
      stream: event,
      streamid: event.id,
      hidden: false,
      muted: false,
      volume: appStore.normalVolume,
      scaleInfo: {},
    };
    const videoEl = createVideo({ appendChild: false, muted: true });
    bodyAppendChildElArr.value.push(videoEl);
    videoEl.setAttribute('videoid', microphoneVideoTrack.id);
    videoEl.srcObject = event;
    microphoneVideoTrack.videoEl = videoEl;
    const res = [...appStore.allTrack, microphoneVideoTrack];
    appStore.setAllTrack(res);
    cacheStore.setResourceList(res);
    handleMixedAudio();
    console.log('获取麦克风成功');
  } else if (val.type === MediaTypeEnum.txt) {
    const txtTrack: AppRootState['allTrack'][0] = {
      id: getRandomEnglishString(6),
      openEye: true,
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.txt,
      track: undefined,
      trackid: undefined,
      stream: undefined,
      streamid: undefined,
      hidden: false,
      muted: false,
      scaleInfo: {},
    };
    if (fabricCanvas.value) {
      const canvasDom = markRaw(
        new fabric.Text(val.txtInfo?.txt || '', {
          top: 0,
          left: 0,
          fill: val.txtInfo?.color,
        })
      );
      handleMoving({ canvasDom, id: txtTrack.id });
      handleScaling({ canvasDom, id: txtTrack.id });
      txtTrack.txtInfo = val.txtInfo;
      if (window.devicePixelRatio !== 1) {
        const ratio = 1 / window.devicePixelRatio;
        canvasDom.scale(ratio);
        txtTrack.scaleInfo[window.devicePixelRatio] = {
          scaleX: ratio,
          scaleY: ratio,
        };
      } else {
        txtTrack.scaleInfo[window.devicePixelRatio] = { scaleX: 1, scaleY: 1 };
      }
      txtTrack.canvasDom = canvasDom;
      fabricCanvas.value.add(canvasDom);
    }

    const res = [...appStore.allTrack, txtTrack];
    // @ts-ignore
    appStore.setAllTrack(res);
    // @ts-ignore
    cacheStore.setResourceList(res);
    console.log('获取文字成功');
  } else if (val.type === MediaTypeEnum.time) {
    const timeTrack: AppRootState['allTrack'][0] = {
      id: getRandomEnglishString(6),
      openEye: true,
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.time,
      track: undefined,
      trackid: undefined,
      stream: undefined,
      streamid: undefined,
      hidden: false,
      muted: false,
      scaleInfo: {},
    };
    if (fabricCanvas.value) {
      const canvasDom = markRaw(
        new fabric.Text(new Date().toLocaleString(), {
          top: 0,
          left: 0,
          fill: val.timeInfo?.color,
        })
      );
      setScaleInfo({ canvasDom, track: timeTrack });
      timeCanvasDom.value.push(canvasDom);
      handleMoving({ canvasDom, id: timeTrack.id });
      handleScaling({ canvasDom, id: timeTrack.id });
      timeTrack.timeInfo = val.timeInfo;
      timeTrack.canvasDom = canvasDom;
      fabricCanvas.value.add(canvasDom);
    }

    const res = [...appStore.allTrack, timeTrack];
    // @ts-ignore
    appStore.setAllTrack(res);
    // @ts-ignore
    cacheStore.setResourceList(res);
    console.log('获取时间成功');
  } else if (val.type === MediaTypeEnum.stopwatch) {
    const stopwatchTrack: AppRootState['allTrack'][0] = {
      id: getRandomEnglishString(6),
      openEye: true,
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.stopwatch,
      track: undefined,
      trackid: undefined,
      stream: undefined,
      streamid: undefined,
      hidden: false,
      muted: false,
      scaleInfo: {},
    };
    if (fabricCanvas.value) {
      const canvasDom = markRaw(
        new fabric.Text('00天00时00分00秒000毫秒', {
          top: 0,
          left: 0,
          fill: val.stopwatchInfo?.color,
          // editable: true,
        })
      );
      setScaleInfo({ canvasDom, track: stopwatchTrack });
      stopwatchCanvasDom.value.push(canvasDom);
      handleMoving({ canvasDom, id: stopwatchTrack.id });
      handleScaling({ canvasDom, id: stopwatchTrack.id });
      stopwatchTrack.stopwatchInfo = val.stopwatchInfo;
      stopwatchTrack.canvasDom = canvasDom;
      fabricCanvas.value.add(canvasDom);
    }

    const res = [...appStore.allTrack, stopwatchTrack];
    // @ts-ignore
    appStore.setAllTrack(res);
    // @ts-ignore
    cacheStore.setResourceList(res);
    console.log('获取秒表成功');
  } else if (val.type === MediaTypeEnum.img) {
    const imgTrack: AppRootState['allTrack'][0] = {
      id: getRandomEnglishString(6),
      openEye: true,
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.img,
      track: undefined,
      trackid: undefined,
      stream: undefined,
      streamid: undefined,
      hidden: false,
      muted: false,
      scaleInfo: {},
    };

    if (fabricCanvas.value) {
      if (!val.imgInfo) return;
      const file = val.imgInfo[0].file!;
      const { code } = await saveFile({ file, fileName: imgTrack.id });
      if (code !== 1) return;
      const imgEl = await new Promise<HTMLImageElement>((resolve) => {
        const reader = new FileReader();
        reader.addEventListener(
          'load',
          function () {
            const img = document.createElement('img');
            img.src = reader.result as string;
            img.onload = () => {
              resolve(img);
            };
          },
          false
        );
        if (file) {
          reader.readAsDataURL(file);
        }
      });

      const canvasDom = markRaw(
        new fabric.Image(imgEl, {
          top: 0,
          left: 0,
          width: imgEl.width,
          height: imgEl.height,
        })
      );
      const scale = handleScale({ width: imgEl.width, height: imgEl.height });
      setScaleInfo({ canvasDom, track: imgTrack, scale });
      handleMoving({ canvasDom, id: imgTrack.id });
      handleScaling({ canvasDom, id: imgTrack.id });
      imgTrack.canvasDom = canvasDom;
      fabricCanvas.value.add(canvasDom);
    }

    const res = [...appStore.allTrack, imgTrack];
    // @ts-ignore
    appStore.setAllTrack(res);
    // @ts-ignore
    cacheStore.setResourceList(res);
    console.log('获取图片成功');
  } else if (val.type === MediaTypeEnum.media) {
    const mediaVideoTrack: AppRootState['allTrack'][0] = {
      id: getRandomEnglishString(6),
      openEye: true,
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.media,
      track: undefined,
      trackid: undefined,
      stream: undefined,
      streamid: undefined,
      hidden: false,
      muted: false,
      scaleInfo: {},
      rect: { left: 0, top: 0 },
    };
    if (fabricCanvas.value) {
      if (!val.mediaInfo) return;
      const file = val.mediaInfo[0].file!;
      const { code } = await saveFile({ file, fileName: mediaVideoTrack.id });
      if (code !== 1) return;
      const { videoEl, canvasDom, scale, stream } = await autoCreateVideo({
        file,
        id: mediaVideoTrack.id,
        muted: mediaVideoTrack.muted,
        rect: mediaVideoTrack.rect,
        scaleInfo: mediaVideoTrack.scaleInfo,
      });
      setScaleInfo({ canvasDom, track: mediaVideoTrack, scale });
      mediaVideoTrack.videoEl = videoEl;
      mediaVideoTrack.canvasDom = canvasDom;
      mediaVideoTrack.stream = stream;
      mediaVideoTrack.streamid = stream.id;
      mediaVideoTrack.track = stream.getVideoTracks()[0];
      mediaVideoTrack.trackid = stream.getVideoTracks()[0].id;

      if (stream.getAudioTracks()[0]) {
        console.log('视频有音频');
        mediaVideoTrack.audio = 1;
        mediaVideoTrack.volume = appStore.normalVolume;
        const audioTrack: AppRootState['allTrack'][0] = {
          id: mediaVideoTrack.id,
          openEye: true,
          audio: 1,
          video: 2,
          mediaName: val.mediaName,
          type: MediaTypeEnum.media,
          track: stream.getAudioTracks()[0],
          trackid: stream.getAudioTracks()[0].id,
          stream,
          streamid: stream.id,
          hidden: true,
          muted: false,
          volume: mediaVideoTrack.volume,
          scaleInfo: {},
        };
        const res = [...appStore.allTrack, audioTrack];
        appStore.setAllTrack(res);
        cacheStore.setResourceList(res);
        handleMixedAudio();
      }
    }
    const res = [...appStore.allTrack, mediaVideoTrack];
    // @ts-ignore
    appStore.setAllTrack(res);
    // @ts-ignore
    cacheStore.setResourceList(res);
    console.log('获取视频成功');
  }
}

function editMediaOk(val: AppRootState['allTrack'][0]) {
  console.log('editMediaOk');
  showMediaModalCpt.value = false;
  const res = appStore.allTrack.map((item) => {
    if (item.id === val.id) {
      item.mediaName = val.mediaName;
      item.timeInfo = val.timeInfo;
      item.stopwatchInfo = val.stopwatchInfo;
      item.txtInfo = val.txtInfo;
      if (
        [
          MediaTypeEnum.txt,
          MediaTypeEnum.time,
          MediaTypeEnum.stopwatch,
        ].includes(val.type)
      ) {
        if (item.canvasDom) {
          // @ts-ignore
          item.canvasDom.set(
            'fill',
            val.txtInfo?.color ||
              val.timeInfo?.color ||
              val.stopwatchInfo?.color
          );
        }
      }
      if (val.type === MediaTypeEnum.txt) {
        if (item.canvasDom) {
          // @ts-ignore
          item.canvasDom.set('text', val.txtInfo?.txt);
        }
      }
      if (val.openEye) {
        if (item.canvasDom) {
          item.canvasDom.opacity = 1;
        }
      } else {
        if (item.canvasDom) {
          item.canvasDom.opacity = 0;
        }
      }
    }
    return item;
  });
  appStore.setAllTrack(res);
  cacheStore.setResourceList(res);
}

function handleChangeMuted(item: AppRootState['allTrack'][0]) {
  if (item.videoEl) {
    const res = !item.muted;
    item.volume = res ? 0 : appStore.normalVolume;
    item.muted = res;
    if (item.type) {
      if (item.type !== MediaTypeEnum.microphone) {
        item.videoEl.muted = res;
      }
      item.videoEl.volume = res ? 0 : appStore.normalVolume / 100;
    }
    cacheStore.setResourceList(appStore.allTrack);
    handleMixedAudio();
  }
}

function handleChangeVolume(item: AppRootState['allTrack'][0], v) {
  const res = appStore.allTrack.map((iten) => {
    if (iten.id === item.id) {
      if (item.volume !== undefined) {
        iten.volume = v;
        iten.muted = v === 0;
        if (iten.videoEl && item.type) {
          iten.videoEl.volume = v / 100;
          if (item.type !== MediaTypeEnum.microphone) {
            iten.videoEl.muted = v === 0;
          }
        }
      }
    }
    return iten;
  });
  appStore.setAllTrack(res);
  cacheStore.setResourceList(res);
  handleMixedAudio();
}

function handleEye(item: AppRootState['allTrack'][0]) {
  let current;
  appStore.allTrack.forEach((iten) => {
    if (iten.id === item.id) {
      iten.openEye = !iten.openEye;
      current = iten;
    }
  });
  if (current) {
    editMediaOk(current);
  }
  cacheStore.setResourceList(appStore.allTrack);
}

function handleActiveObject(item: AppRootState['allTrack'][0]) {
  let current: AppRootState['allTrack'][0] | undefined;
  appStore.allTrack.forEach((iten) => {
    if (iten.id === item.id) {
      current = iten;
    }
  });
  if (current?.canvasDom) {
    fabricCanvas.value?.setActiveObject(current.canvasDom);
  }
}

function handleDel(item: AppRootState['allTrack'][0]) {
  if (item.canvasDom !== undefined) {
    fabricCanvas.value?.remove(item.canvasDom);
  }
  const delItem = appStore.allTrack.filter((iten) => iten.id === item.id);

  delItem.forEach((v) => {
    v.videoEl?.pause();
    v.videoEl?.removeAttribute('src');
    v.videoEl?.remove();
    v.stream?.getTracks().forEach((track) => {
      track.stop();
      v.stream?.removeTrack(track);
    });
  });
  bodyAppendChildElArr.value.forEach((el) => {
    const videoid = el.getAttribute('videoid');
    if (item.id === videoid) {
      el.remove();
    }
  });
  const res = appStore.allTrack.filter((iten) => iten.id !== item.id);
  appStore.setAllTrack(res);
  cacheStore.setResourceList(res);
  handleMixedAudio();
}

function handleStartMedia(item: { type: MediaTypeEnum; txt: string }) {
  currentMediaType.value = item.type;
  showMediaModalCpt.value = true;
}
</script>

<style lang="scss" scoped>
.slider {
  width: 80px;
}

.push-wrap {
  display: flex;
  justify-content: space-between;
  /* margin: 15px auto 0; */
  width: $w-1350;
  width: 100vw;
  height: 92.2vh;
  overflow: hidden;

  background-image: url('@/assets/img/live_bg.jpg');

  .center {
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    width: $w-960;
    height: 100%;
    border-radius: 6px;
    /* background-color: white; */
    color: #9499a0;
    vertical-align: top;
    margin-top: 40px;

    .container {
      position: relative;
      /* height: 100%; */
      background-color: rgba($color: #232222, $alpha: 0.5);
      line-height: 0;

      .recording {
        position: absolute;
        top: 5px;
        left: 5px;
        z-index: 100;
        color: red;
        font-size: 12px;
        line-height: 1;
      }

      .record-ico {
        position: absolute;
        top: 0;
        left: -10px;
        cursor: pointer;
        transform: translateX(-100%);
      }

      .screenshot {
        position: absolute;
        top: 30px;
        left: -10px;
        cursor: pointer;
        transform: translateX(-100%);
      }

      .rtt {
        position: absolute;
        top: 5px;
        left: 5px;
        z-index: 100;
        color: red;
        font-size: 12px;
        line-height: 1;
      }

      .add-wrap {
        position: absolute;
        top: 50%;
        left: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        padding: 10px 20px;
        border-radius: 6px;
        /* background-color: white; */
        transform: translate(-50%, -50%);

        &_top {
          width: 100%;
          display: flex;
          justify-content: center;

          img {
            width: 100px;
            cursor: pointer;
          }
        }

        &_bottom {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;

          img {
            cursor: pointer;
            width: 85px;

            &:nth-child(2) {
              margin: 0 15px;
            }
          }
        }
      }
    }

    .room-control {
      position: relative;
      display: flex;
      justify-content: space-between;
      padding: 15px;
      border-radius: 0 0 6px 6px;
      background-color: rgba(255, 255, 255, 0.9);

      .debug-info {
        position: absolute;
        right: 0;
        bottom: 0;
        font-size: 14px;
      }

      .info {
        display: flex;
        width: 100%;

        .avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-position: center center;
          background-size: cover;
          background-repeat: no-repeat;
        }

        .detail {
          display: flex;
          flex: 1;
          flex-direction: column;
          margin-left: 20px;
          font-size: 14px;

          .top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #18191c;

            &_left {
              display: flex;
              align-items: center;
            }

            .name {
              display: flex;
              align-items: center;
              margin-right: 15px;

              &_val {
                font-size: 16px;
                line-height: 1;
                color: #18191c;
              }

              &_edit {
                /* width: 180px; */
                display: flex;

                &_input {
                  display: flex;
                  align-items: center;
                  position: relative;
                  width: 170px;
                  height: 30px;
                  border: 1px solid rgb(224, 224, 230);
                  border-radius: 3px;
                  padding: 0 5px;

                  &:focus-within {
                    border-color: #ffd700;
                  }

                  input {
                    flex: 1;
                    border: none;
                    outline: none;
                    background: transparent;
                    font-size: 14px;
                    padding: 0 10px;
                    height: 100%;
                    color: rgb(51, 54, 57);
                  }
                }

                &_btn {
                  padding: 6px 15px;
                  border-radius: 2px;
                  border: none;
                  margin-left: 10px;
                  cursor: pointer;
                }

                &_confirm {
                  color: #fff;
                  background-color: #ffd700;
                }

                &_cancel {
                  background-color: transparent;
                  color: #ffd700;
                  border: 1px solid #ffd700;
                }
              }
            }

            .rtc-info {
              display: flex;
              flex: 1;
            }

            .area {
              display: flex;
              align-items: center;
              margin-right: 15px;

              &_btn {
                background-color: #ffd700;
                border-radius: 14px;
                color: #fff;
                cursor: pointer;
                font-size: 15px;
                height: 28px;
                line-height: 28px;
                /* min-width: 90px; */
                padding: 0 15px;
              }

              .val {
                width: 130px;
              }
            }

            .other {
              display: flex;

              .item {
                display: flex;
                margin-right: 10px;
                color: #9499a0;
                font-size: 12px;

                &.share {
                  cursor: pointer;
                }
              }
            }
          }

          .bottom {
            display: flex;
            align-items: center;
            flex: 1;
            justify-content: space-between;

            .rtc-config {
              .item-list {
                display: flex;
                align-items: center;
                flex: 1;

                .item {
                  display: flex;
                  align-items: center;
                  padding-right: 10px;

                  .txt {
                    color: #18191c;
                    font-size: 13px;
                  }

                  .down {
                    &.small {
                      width: 85px;
                    }

                    &.big {
                      width: 105px;
                    }
                  }
                }
              }
            }

            .rtc-btns {
              display: flex;
              align-items: center;

              .screenshot {
                margin-right: 10px;
              }

              .record-ico {
                margin-right: 10px;
              }
            }

            .rtc-network {
              display: flex;

              .item {
                padding-right: 10px;
              }
            }
          }
        }
      }
    }
  }

  .left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    width: 220px;
    border-radius: 6px;
    background-color: white;
    color: #9499a0;
    margin-right: 10px;
    margin-left: 20px;
    margin-top: 40px;
    margin-bottom: 43px;
    background-color: rgba(255, 255, 255, 0.9);

    .resource-card {
      position: relative;
      box-sizing: border-box;
      /* margin-bottom: 10px; */
      padding: 15px;
      width: 100%;
      height: 100%;
      /* flex: 1; */
      border-radius: 6px;

      .title {
        text-align: initial;
        color: #18191c;
        font-size: 14px;
      }

      .list {
        overflow: scroll;
        width: calc(100% + 5px);
        height: 218px;

        @extend %customScrollbar;

        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 5px 0;
          font-size: 14px;
          cursor: pointer;

          user-select: none;

          .item-left {
            display: flex;
            align-items: center;
            height: 100%;

            .control-item {
              height: 100%;
              line-height: 0;
              cursor: pointer;

              &:not(:last-child) {
                margin-right: 6px;
              }
            }

            .name {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              max-width: 130px;
            }
          }

          .control {
            display: flex;
            align-items: center;

            .control-item {
              line-height: 0;
              cursor: pointer;

              &:not(:last-child) {
                margin-right: 6px;
              }
            }
          }
        }
      }

      .bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 10px;
      }
    }
  }

  .right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    margin-left: 10px;
    width: 240px;
    border-radius: 6px;
    /* background-color: white; */
    color: #9499a0;
    margin-right: 20px;
    margin-top: 40px;
    margin-bottom: 43px;

    .rank-wrap {
      background-color: $theme-color-papayawhip;
      border-radius: 6px;
      margin-bottom: 10px;
      background-color: rgba(255, 255, 255, 0.9);
      padding: 5px 0;

      .tab {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 30px;
        font-size: 12px;
        margin-bottom: 10px;

        &_item {
          width: 50%;
          display: flex;
          justify-content: center;
          cursor: pointer;

          &:hover {
            color: #6f6e6e;
          }

          &_active {
            color: #000000;
            font-weight: 500;

            &:hover {
              color: #000000;
            }
          }

          &:first-child {
            width: 60%;
            border-right: 1px solid #ccc;
          }
        }
      }

      .user-list {
        overflow-y: scroll;
        box-sizing: border-box;
        padding: 0 15px;
        height: 150px;

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

    .resource-card {
      position: relative;
      box-sizing: border-box;
      margin-bottom: 10px;
      padding: 10px;
      width: 100%;
      height: 290px;
      border-radius: 6px;

      .title {
        text-align: initial;
      }

      .list {
        overflow: scroll;
        width: calc(100% + 5px);
        height: 218px;

        @extend %customScrollbar;

        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 5px 0;
          font-size: 14px;
          cursor: pointer;

          user-select: none;

          .item-left {
            display: flex;
            align-items: center;
            height: 100%;

            .control-item {
              height: 100%;
              line-height: 0;
              cursor: pointer;

              &:not(:last-child) {
                margin-right: 6px;
              }
            }
          }

          .control {
            display: flex;
            align-items: center;

            .control-item {
              line-height: 0;
              cursor: pointer;

              &:not(:last-child) {
                margin-right: 6px;
              }
            }
          }
        }
      }

      .bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 10px;
      }
    }

    .danmu-card {
      position: relative;
      flex: 1;
      box-sizing: border-box;
      padding: 15px 15px 0px;
      width: 100%;
      border-radius: 6px;
      background-color: rgba(255, 255, 255, 0.9);
      text-align: initial;

      .title {
        margin-bottom: 10px;
        color: #18191c;
        font-size: 14px;
      }

      .list {
        overflow: scroll;
        height: 240px;

        &::-webkit-scrollbar {
          width: 5px;
          /* 隐藏垂直滚动条 */
          height: 0;
          /* 隐藏水平滚动条 */
        }

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

          .name {
            color: #9499a0;
            cursor: pointer;

            &.system {
              color: red;
            }
          }

          .msg {
            margin-top: 4px;
            color: #61666d;

            &.img {
              img {
                width: 80%;
              }
            }

            &.dianzan {
              color: #9499a0;
              font-size: 12px;
            }
          }
        }
      }

      .send-msg {
        position: absolute;
        bottom: 10px;
        left: 10px;
        box-sizing: border-box;
        padding: 4px 0;
        width: 90%;

        .control {
          display: flex;
          margin: 6px 0;

          .emoji-list {
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            overflow: scroll;
            box-sizing: border-box;
            padding: 3px;
            padding-right: 0;
            height: 170px;
            background-color: #fff;
            transform: translateY(-100%);
            width: 200px;
            background-color: #faf4d8;
            border: 1px solid #e2e2e2;
            border-radius: 4px;

            @extend %customScrollbar;

            &::-webkit-scrollbar {
              width: 3px;
            }

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
            background-color: #ececec;
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
          /* margin: 0 auto; */
          padding: 10px;
          width: 75%;
          height: 30px;
          outline: none;
          border: 1px solid hsla(0, 0%, 60%, 0.2);
          border-radius: 4px;
          background-color: #f5f6f7;
          font-size: 14px;
          height: 34px;
          line-height: 34px;
        }

        .btn {
          /* height: 30px; */
          /* box-sizing: border-box; */
          /* margin-top: 10px; */
          /* margin-left: auto; */
          /* padding: 4px; */
          padding: 6px 15px;
          /* width: 50px; */
          border-radius: 4px;
          background-color: $theme-color-gold;
          color: white;
          /* text-align: center; */
          margin-left: 5px;
          font-size: 12px;
          cursor: pointer;
        }
      }

      // .send-msg {
      //   display: flex;
      //   align-items: center;
      //   box-sizing: border-box;
      //   width: calc(100% - 20px);
      //   .ipt {
      //     display: block;
      //     box-sizing: border-box;
      //     margin: 0 auto;
      //     margin-right: 10px;
      //     padding: 10px;
      //     width: 80%;
      //     height: 30px;
      //     outline: none;
      //     border: 1px solid hsla(0, 0%, 60%, 0.2);
      //     border-radius: 4px;
      //     background-color: #f1f2f3;
      //     font-size: 14px;
      //   }
      // }
    }
  }
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

  &.edit {
    width: 25px;
    height: 25px;
    @include setBackground('@/assets/img/edit.svg');
    cursor: pointer;
  }
}

// 屏幕宽度大于1500的时候
@media screen and (min-width: $w-1500) {
  .push-wrap {
    width: $w-1475;

    .left {
      width: $w-1150;
    }

    .right {
      width: $w-300;
    }
  }
}
</style>
