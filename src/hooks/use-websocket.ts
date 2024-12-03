import { copyToClipBoard, getRandomString } from 'billd-utils';
import { NButton } from 'naive-ui';
import { computed, h, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { fetchVerifyPkKey } from '@/api/liveRoom';
import { THEME_COLOR, URL_QUERY } from '@/constant';
import { commentAuthTip, loginTip } from '@/hooks/use-login';
import { useRTCParams } from '@/hooks/use-rtcParams';
import { useTip } from '@/hooks/use-tip';
import { useForwardAll } from '@/hooks/webrtc/forwardAll';
import { useForwardBilibili } from '@/hooks/webrtc/forwardBilibili';
import { useForwardHuya } from '@/hooks/webrtc/forwardHuya';
import { useWebRtcLive } from '@/hooks/webrtc/live';
import { useWebRtcMeetingOne } from '@/hooks/webrtc/meetingOne';
import { useWebRtcMeetingPk } from '@/hooks/webrtc/meetingPk';
import { useWebRtcSrs } from '@/hooks/webrtc/srs';
import { useWebRtcTencentcloudCss } from '@/hooks/webrtc/tencentcloudCss';
import {
  DanmuMsgTypeEnum,
  ILiveUser,
  IWsMessage,
  WsMessageContentTypeEnum,
  WsMessageIsBilibiliEnum,
} from '@/interface';
import router, { routerName } from '@/router';
import { WEBSOCKET_URL } from '@/spec-config';
import { useAppStore } from '@/store/app';
import { useNetworkStore } from '@/store/network';
import { useUserStore } from '@/store/user';
import { LiveRoomTypeEnum } from '@/types/ILiveRoom';
import {
  WsAnswerType,
  WsBatchSendOffer,
  WsCandidateType,
  WsConnectStatusEnum,
  WsDisableSpeakingType,
  WsJoinType,
  WsLeavedType,
  WsLivePkKeyType,
  WsMessageType,
  WsMsgTypeEnum,
  WsOfferType,
  WsOtherJoinType,
  WsRoomLivingType,
  WsStartLiveType,
} from '@/types/websocket';
import {
  createNullVideo,
  handleUserMedia,
  setAudioTrackContentHints,
  setVideoTrackContentHints,
} from '@/utils';
import {
  WebSocketClass,
  prettierReceiveWsMsg,
} from '@/utils/network/webSocket';

export const useWebsocket = () => {
  const route = useRoute();
  const appStore = useAppStore();
  const userStore = useUserStore();
  const networkStore = useNetworkStore();

  const {
    maxBitrate,
    maxFramerate,
    resolutionRatio,
    videoContentHint,
    audioContentHint,
  } = useRTCParams();
  const { updateWebRtcMeetingPkConfig, webRtcMeetingPk } = useWebRtcMeetingPk();
  const { updateWebRtcSrsConfig, webRtcSrs } = useWebRtcSrs();
  const { updateForwardBilibiliConfig, forwardBilibili } = useForwardBilibili();
  const { updateForwardAllConfig, forwardAll } = useForwardAll();
  const { updateForwardHuyaConfig, forwardHuya } = useForwardHuya();
  const { updateWebRtcTencentcloudCssConfig, webRtcTencentcloudCss } =
    useWebRtcTencentcloudCss();
  const { updateWebRtcLiveConfig, webRtcLive } = useWebRtcLive();
  const { updateWebRtcMeetingOneConfig, webRtcMeetingOne } =
    useWebRtcMeetingOne();

  const connectStatus = ref<WsConnectStatusEnum>();
  const loopHeartbeatTimer = ref();
  const loopGetLiveUserTimer = ref();
  const liveUserList = ref<ILiveUser[]>([]);
  const roomId = ref('');
  const roomLiving = ref(false);
  const isAnchor = ref(false);
  const isBilibili = ref(false);
  const canvasVideoStream = ref<MediaStream>();
  const userStream = ref<MediaStream>();
  const lastCoverImg = ref('');
  const currentMaxBitrate = ref(maxBitrate.value[3].value);
  const currentMaxFramerate = ref(maxFramerate.value[2].value);
  const currentResolutionRatio = ref(resolutionRatio.value[3].value);
  const currentVideoContentHint = ref(videoContentHint.value[3].value);
  const currentAudioContentHint = ref(audioContentHint.value[0].value);
  const timerObj = ref({});
  const keepRtcLivingTimer = ref();
  const damuList = ref<IWsMessage[]>([]);
  const joinedDelay = 5000;
  const keepRtcLivingDelay = 5000;

  watch(
    () => roomLiving.value,
    (newval) => {
      if (newval) {
        appStore.playing = true;
      } else {
        appStore.playing = false;
      }
    },
    {
      immediate: true,
    }
  );

  onUnmounted(() => {
    clearInterval(loopHeartbeatTimer.value);
    clearInterval(loopGetLiveUserTimer.value);
  });

  const mySocketId = computed(() => {
    return networkStore.wsMap.get(roomId.value)?.socketIo?.id || '-1';
  });

  function sendDanmuTxt(txt: string) {
    if (!loginTip()) {
      return;
    }
    if (!commentAuthTip()) {
      return;
    }
    if (!txt.trim().length) {
      window.$message.warning('请输入弹幕内容！');
      return;
    }
    const instance = networkStore.wsMap.get(roomId.value);

    if (!instance) return;
    const messageData: WsMessageType['data'] = {
      content: txt,
      content_type: WsMessageContentTypeEnum.txt,
      msg_type: DanmuMsgTypeEnum.danmu,
      live_room_id: Number(roomId.value),
      is_bilibili: isBilibili.value
        ? WsMessageIsBilibiliEnum.yes
        : WsMessageIsBilibiliEnum.no,
    };
    instance.send({
      requestId: getRandomString(8),
      msgType: WsMsgTypeEnum.message,
      data: messageData,
    });
  }

  function sendDanmuImg(url: string) {
    if (!loginTip()) {
      return;
    }
    if (!commentAuthTip()) {
      return;
    }
    if (!url.trim().length) {
      window.$message.warning('图片不能为空！');
      return;
    }
    const instance = networkStore.wsMap.get(roomId.value);
    if (!instance) return;
    const requestId = getRandomString(8);
    const messageData: WsMessageType['data'] = {
      content: url,
      content_type: WsMessageContentTypeEnum.img,
      msg_type: DanmuMsgTypeEnum.danmu,
      live_room_id: Number(roomId.value),
      is_bilibili: isBilibili.value
        ? WsMessageIsBilibiliEnum.yes
        : WsMessageIsBilibiliEnum.no,
    };
    instance.send({
      requestId,
      msgType: WsMsgTypeEnum.message,
      data: messageData,
    });
  }

  function sendDanmuReward(txt: string) {
    if (!loginTip()) {
      return;
    }
    if (!commentAuthTip()) {
      return;
    }
    if (!txt.trim().length) {
      window.$message.warning('请输入弹幕内容！');
      return;
    }
    const instance = networkStore.wsMap.get(roomId.value);
    if (!instance) return;
    const messageData: WsMessageType['data'] = {
      content: txt,
      content_type: WsMessageContentTypeEnum.txt,
      msg_type: DanmuMsgTypeEnum.reward,
      live_room_id: Number(roomId.value),
      is_bilibili: isBilibili.value
        ? WsMessageIsBilibiliEnum.yes
        : WsMessageIsBilibiliEnum.no,
    };
    instance.send({
      requestId: getRandomString(8),
      msgType: WsMsgTypeEnum.message,
      data: messageData,
    });
  }

  function handleHeartbeat() {}

  function handleStartLive({
    name,
    type,
    msrDelay,
    msrMaxDelay,
  }: {
    name?: string;
    type: LiveRoomTypeEnum;
    videoEl?: HTMLVideoElement;
    msrDelay: number;
    msrMaxDelay: number;
  }) {
    if (appStore.liveRoomInfo) {
      appStore.liveRoomInfo.type = type;
    }
    networkStore.wsMap.get(roomId.value)?.send<WsStartLiveType['data']>({
      requestId: getRandomString(8),
      msgType: WsMsgTypeEnum.startLive,
      data: {
        name: name!,
        type,
        msrDelay,
        msrMaxDelay,
      },
    });
    if (canvasVideoStream.value) {
      setVideoTrackContentHints(
        canvasVideoStream.value,
        // @ts-ignore
        currentVideoContentHint.value
      );
      setAudioTrackContentHints(
        canvasVideoStream.value,
        // @ts-ignore
        currentAudioContentHint.value
      );
    }

    if (type === LiveRoomTypeEnum.srs) {
      updateWebRtcSrsConfig({
        isPk: false,
        roomId: roomId.value,
        canvasVideoStream: canvasVideoStream.value,
      });
      webRtcSrs.newWebRtc({
        sender: mySocketId.value,
        receiver: 'srs',
        videoEl: createNullVideo(),
      });
      webRtcSrs.sendOffer({
        sender: mySocketId.value,
        receiver: 'srs',
      });
    } else if (type === LiveRoomTypeEnum.forward_bilibili) {
      updateForwardBilibiliConfig({
        isPk: false,
        roomId: roomId.value,
        canvasVideoStream: canvasVideoStream.value,
      });
      forwardBilibili.newWebRtc({
        sender: mySocketId.value,
        receiver: 'srs',
        videoEl: createNullVideo(),
      });
      forwardBilibili.sendOffer({
        sender: mySocketId.value,
        receiver: 'srs',
      });
    } else if (type === LiveRoomTypeEnum.forward_huya) {
      updateForwardHuyaConfig({
        isPk: false,
        roomId: roomId.value,
        canvasVideoStream: canvasVideoStream.value,
      });
      forwardHuya.newWebRtc({
        sender: mySocketId.value,
        receiver: 'srs',
        videoEl: createNullVideo(),
      });
      forwardHuya.sendOffer({
        sender: mySocketId.value,
        receiver: 'srs',
      });
    } else if (type === LiveRoomTypeEnum.forward_all) {
      updateForwardAllConfig({
        isPk: false,
        roomId: roomId.value,
        canvasVideoStream: canvasVideoStream.value,
      });
      forwardAll.newWebRtc({
        sender: mySocketId.value,
        receiver: 'srs',
        videoEl: createNullVideo(),
      });
      forwardAll.sendOffer({
        sender: mySocketId.value,
        receiver: 'srs',
      });
    } else if (type === LiveRoomTypeEnum.tencent_css) {
      updateWebRtcTencentcloudCssConfig({
        isPk: false,
        roomId: roomId.value,
        canvasVideoStream: canvasVideoStream.value,
      });
      webRtcTencentcloudCss.newWebRtc({
        sender: mySocketId.value,
        receiver: 'tencentcloud_css',
        videoEl: createNullVideo(),
      });
      webRtcTencentcloudCss.sendOffer({
        sender: mySocketId.value,
        receiver: 'tencentcloud_css',
      });
    } else if (type === LiveRoomTypeEnum.pk) {
      updateWebRtcSrsConfig({
        isPk: true,
        roomId: roomId.value,
        canvasVideoStream: canvasVideoStream.value,
      });
      webRtcSrs.newWebRtc({
        sender: mySocketId.value,
        receiver: 'srs',
        videoEl: createNullVideo(),
      });
      webRtcSrs.sendOffer({
        sender: mySocketId.value,
        receiver: 'srs',
      });
    } else if (type === LiveRoomTypeEnum.tencent_css_pk) {
      updateWebRtcTencentcloudCssConfig({
        isPk: true,
        roomId: roomId.value,
        canvasVideoStream: canvasVideoStream.value,
      });
      webRtcTencentcloudCss.newWebRtc({
        sender: mySocketId.value,
        receiver: 'tencentcloud_css',
        videoEl: createNullVideo(),
      });
      webRtcTencentcloudCss.sendOffer({
        sender: mySocketId.value,
        receiver: 'tencentcloud_css',
      });
    } else if (
      [
        LiveRoomTypeEnum.wertc_live,
        LiveRoomTypeEnum.wertc_meeting_one,
        LiveRoomTypeEnum.wertc_meeting_two,
      ].includes(type)
    ) {
      const main = () => {
        networkStore.wsMap.get(roomId.value)?.send<WsJoinType['data']>({
          requestId: getRandomString(8),
          msgType: WsMsgTypeEnum.keepRtcLiving,
          data: {
            live_room_id: Number(roomId.value),
            duration: keepRtcLivingDelay / 1000,
          },
        });
      };
      main();
      keepRtcLivingTimer.value = setInterval(() => {
        if (!roomLiving.value) {
          clearInterval(keepRtcLivingTimer.value);
          return;
        }
        main();
      }, keepRtcLivingDelay);
    }
  }

  function sendJoin() {
    const instance = networkStore.wsMap.get(roomId.value);
    if (!instance) return;
    instance.send<WsJoinType['data']>({
      requestId: getRandomString(8),
      msgType: WsMsgTypeEnum.join,
      data: {
        live_room_id: Number(roomId.value),
        duration: joinedDelay / 1000,
      },
    });
  }

  function initReceive() {
    const ws = networkStore.wsMap.get(roomId.value);
    if (!ws?.socketIo) return;
    // websocket连接成功
    ws.socketIo.on(WsConnectStatusEnum.connect, () => {
      prettierReceiveWsMsg(WsConnectStatusEnum.connect, ws.socketIo);
      handleHeartbeat();
      if (!ws) return;
      connectStatus.value = WsConnectStatusEnum.connect;
      ws.status = WsConnectStatusEnum.connect;
      ws.update();
      sendJoin();
    });

    // websocket连接断开
    ws.socketIo.on(WsConnectStatusEnum.disconnect, (err) => {
      prettierReceiveWsMsg(WsConnectStatusEnum.disconnect, ws);
      console.log('websocket连接断开', err);
      if (!ws) return;
      ws.status = WsConnectStatusEnum.disconnect;
      ws.update();
    });

    // 收到livePkKey
    ws.socketIo.on(WsMsgTypeEnum.livePkKey, (data: WsLivePkKeyType['data']) => {
      console.log('收到livePkKey', data);
      const url = router.resolve({
        name: routerName.pull,
        params: { roomId: data.live_room_id },
        query: {
          [URL_QUERY.pkKey]: data.key,
        },
      });
      const pkurl = `${window.location.origin}${url.href}`;
      useTip({
        title: '邀请主播加入PK',
        width: '360px',
        hiddenCancel: true,
        content: h('div', [
          h('div', { style: { marginBottom: '5px' } }, `${pkurl}`),
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              color: THEME_COLOR,
              onClick: () => {
                copyToClipBoard(pkurl);
                window.$message.success('复制成功！');
              },
            },
            () => '复制链接' // 用箭头函数返回性能更好。
          ),
          h('div', { style: { marginTop: '5px' } }, '注意，有效期：5分钟'),
        ]),
      }).catch(() => {});
    });

    // 收到srsOffer
    ws.socketIo.on(WsMsgTypeEnum.srsOffer, (data: WsOfferType['data']) => {
      console.log('收到srsOffer', data);
    });

    // 收到srsAnswer
    ws.socketIo.on(WsMsgTypeEnum.srsAnswer, (data: WsAnswerType['data']) => {
      console.log('收到srsAnswer', data);
    });

    // 收到srsCandidate
    ws.socketIo.on(
      WsMsgTypeEnum.srsCandidate,
      (data: WsCandidateType['data']) => {
        console.log('收到srsCandidate', data);
        if (data.receiver === mySocketId.value) {
          console.warn('是发给我的srsCandidate');
          const rtc = networkStore.rtcMap.get(data.sender);
          rtc?.addIceCandidate(data.candidate);
        } else {
          console.error('不是发给我的srsCandidate');
        }
      }
    );

    // 收到nativeWebRtcOffer
    ws.socketIo.on(
      WsMsgTypeEnum.nativeWebRtcOffer,
      async (data: WsOfferType['data']) => {
        console.log('收到nativeWebRtcOffer', data);

        if (
          data.live_room.type === LiveRoomTypeEnum.pk ||
          data.live_room.type === LiveRoomTypeEnum.tencent_css_pk
        ) {
          if (!route.query[URL_QUERY.pkKey]) {
            return;
          }
          if (data.receiver === mySocketId.value) {
            console.warn('是发给我的nativeWebRtcOffer-pk-tencent_css_pk');
            updateWebRtcMeetingPkConfig({
              roomId: roomId.value,
              anchorStream: canvasVideoStream.value,
              // userStream: userStream.value,
            });
            webRtcMeetingPk.newWebRtc({
              // 因为这里是收到offer，而offer是房主发的，所以此时的data.data.sender是房主；data.data.receiver是接收者；
              // 但是这里的nativeWebRtc的sender，得是自己，不能是data.data.sender，不要混淆
              sender: mySocketId.value,
              receiver: data.sender,
              videoEl: createNullVideo(),
            });
            webRtcMeetingPk.addTrack({
              stream: userStream.value,
              receiver: data.sender,
            });
            await webRtcMeetingPk.sendAnswer({
              sender: mySocketId.value,
              // data.data.receiver是接收者；我们现在new pc，发送者是自己，接收者肯定是房主，不能是data.data.receiver，因为data.data.receiver是自己
              receiver: data.sender,
              sdp: data.sdp,
            });
          } else {
            console.error('不是发给我的nativeWebRtcOffer');
          }
        } else if (data.live_room.type === LiveRoomTypeEnum.wertc_live) {
        } else if (data.live_room.type === LiveRoomTypeEnum.wertc_meeting_one) {
        }
      }
    );

    // 收到nativeWebRtcAnswer
    ws.socketIo.on(
      WsMsgTypeEnum.nativeWebRtcAnswer,
      async (data: WsAnswerType['data']) => {
        console.log('收到nativeWebRtcAnswer', data);
        if (data.receiver === mySocketId.value) {
          console.warn('是发给我的nativeWebRtcAnswer');
          const rtc = networkStore.rtcMap.get(data.sender);
          if (rtc) {
            await rtc.setRemoteDescription(data.sdp);
          }
        } else {
          console.error('不是发给我的nativeWebRtcAnswer');
        }
      }
    );

    // 收到nativeWebRtcCandidate
    ws.socketIo.on(
      WsMsgTypeEnum.nativeWebRtcCandidate,
      (data: WsCandidateType['data']) => {
        console.log('收到nativeWebRtcCandidate', data);
        if (data.receiver === mySocketId.value) {
          console.warn('是发给我的nativeWebRtcCandidate');
          const rtc = networkStore.rtcMap.get(data.sender);
          rtc?.addIceCandidate(data.candidate);
        } else {
          console.error('不是发给我的nativeWebRtcCandidate');
        }
      }
    );

    // 主播正在直播
    ws.socketIo.on(
      WsMsgTypeEnum.roomLiving,
      async (data: WsRoomLivingType['data']) => {
        prettierReceiveWsMsg(WsMsgTypeEnum.roomLiving, data);
        roomLiving.value = true;
        if (data.live_room_id !== Number(roomId.value)) {
          return;
        }
        if (
          route.name === routerName.pull ||
          route.name === routerName.h5Room
        ) {
          // 当前是拉流页面
          if (
            appStore.liveRoomInfo?.type === LiveRoomTypeEnum.wertc_meeting_one
          ) {
            await handleMeeting();
          } else if (appStore.liveRoomInfo?.type === LiveRoomTypeEnum.pk) {
            await handlePk();
          }
        } else if (route.name === routerName.push) {
          // 当前是推流页面
        }
      }
    );

    // 主播不在直播
    ws.socketIo.on(WsMsgTypeEnum.roomNoLive, (data) => {
      prettierReceiveWsMsg(WsMsgTypeEnum.roomNoLive, data);
      roomLiving.value = false;
    });

    // 收到用户发送消息
    ws.socketIo.on(WsMsgTypeEnum.message, (data: WsMessageType) => {
      prettierReceiveWsMsg(WsMsgTypeEnum.message, data);
      // @ts-ignore
      data.data.send_msg_time = new Date(
        data.data.send_msg_time!
      ).toLocaleString();
      damuList.value.push(data.data);
    });

    // 收到disableSpeaking
    ws.socketIo.on(
      WsMsgTypeEnum.disableSpeaking,
      (data: WsDisableSpeakingType['data']) => {
        prettierReceiveWsMsg(WsMsgTypeEnum.disableSpeaking, data);
        // if (data.is_disable_speaking) {
        //   window.$message.error('你已被禁言！');
        //   appStore.disableSpeaking.set(data.live_room_id, {
        //     exp: data.disable_expired_at,
        //     label: formatDownTime({
        //       startTime: +new Date(),
        //       endTime: data.disable_expired_at,
        //     }),
        //   });
        //   clearTimeout(timerObj.value[data.live_room_id]);
        //   timerObj.value[data.live_room_id] = setInterval(() => {
        //     if (
        //       data.disable_expired_at &&
        //       +new Date() > data.disable_expired_at
        //     ) {
        //       clearTimeout(timerObj.value[data.live_room_id]);
        //     }
        //     appStore.disableSpeaking.set(data.live_room_id, {
        //       exp: data.disable_expired_at!,
        //       label: formatDownTime({
        //         startTime: +new Date(),
        //         endTime: data.disable_expired_at!,
        //       }),
        //     });
        //   }, 1000);
        //   damuList.value = damuList.value.filter(
        //     (v) => v.request_id !== data.request_id
        //   );
        // }
        if (data.user_id !== userStore.userInfo?.id && data.disable_ok) {
          window.$message.success('禁言成功！');
        }
        if (
          data.user_id !== userStore.userInfo?.id &&
          data.restore_disable_ok
        ) {
          window.$message.success('解除禁言成功！');
        }
        if (
          data.user_id === userStore.userInfo?.id &&
          data.restore_disable_ok
        ) {
          window.$message.success('禁言接触了！');
          clearTimeout(timerObj.value[data.live_room_id]);
          appStore.disableSpeaking.delete(data.live_room_id);
        }
      }
    );

    async function handleMeeting() {
      await useTip({
        content: '是否加入会议？',
      });
      const stream = await handleUserMedia({
        video: true,
        audio: true,
      });
      userStream.value = stream;
      networkStore.wsMap.get(roomId.value)?.send<WsBatchSendOffer['data']>({
        requestId: getRandomString(8),
        msgType: WsMsgTypeEnum.batchSendOffer,
        data: {
          roomId: roomId.value,
        },
      });
    }

    async function handlePk() {
      if (!route.query[URL_QUERY.pkKey]) {
        return;
      }
      const res = await fetchVerifyPkKey({
        liveRoomId: Number(roomId.value),
        key: route.query[URL_QUERY.pkKey],
      });
      if (res.code === 200 && res.data === true) {
        await useTip({
          content: '是否加入PK？',
        });
        const stream = await handleUserMedia({
          video: true,
          audio: true,
        });
        userStream.value = stream;
        networkStore.wsMap.get(roomId.value)?.send<WsBatchSendOffer['data']>({
          requestId: getRandomString(8),
          msgType: WsMsgTypeEnum.batchSendOffer,
          data: {
            roomId: roomId.value,
          },
        });
      } else {
        await useTip({
          content: '加入PK失败，验证pkKey错误！',
          hiddenCancel: true,
          hiddenClose: true,
        });
      }
    }

    // 用户加入房间完成
    ws.socketIo.on(WsMsgTypeEnum.joined, async (data: WsJoinType['data']) => {
      prettierReceiveWsMsg(WsMsgTypeEnum.joined, data);
      setInterval(() => {
        networkStore.wsMap.get(roomId.value)?.send<WsJoinType['data']>({
          requestId: getRandomString(8),
          msgType: WsMsgTypeEnum.keepJoined,
          data: {
            live_room_id: Number(roomId.value),
            duration: joinedDelay / 1000,
          },
        });
      }, joinedDelay);
      if (route.name === routerName.pull || route.name === routerName.h5Room) {
        // 当前是拉流页面
        if (
          roomLiving.value &&
          data.live_room?.type === LiveRoomTypeEnum.wertc_meeting_one
        ) {
          await handleMeeting();
        } else if (
          roomLiving.value &&
          data.live_room?.type === LiveRoomTypeEnum.pk
        ) {
          await handlePk();
        }
      }
    });

    // batchSendOffer
    ws.socketIo.on(
      WsMsgTypeEnum.batchSendOffer,
      (data: WsBatchSendOffer['data']) => {
        if (
          appStore.liveRoomInfo?.type === LiveRoomTypeEnum.wertc_meeting_one
        ) {
          data.socket_list?.forEach((item) => {
            if (item !== mySocketId.value) {
              if (networkStore.rtcMap.get(item)) {
                return;
              }
              webRtcMeetingOne.newWebRtc({
                sender: mySocketId.value,
                receiver: item,
                videoEl: createNullVideo(),
                sucessCb: () => {},
              });
              webRtcMeetingOne.sendOffer({
                sender: mySocketId.value,
                receiver: item,
              });
            }
          });
        } else if (appStore.liveRoomInfo?.type === LiveRoomTypeEnum.pk) {
          data.socket_list?.forEach((item) => {
            if (item !== mySocketId.value) {
              if (networkStore.rtcMap.get(item)) {
                return;
              }
              webRtcMeetingPk.newWebRtc({
                sender: mySocketId.value,
                receiver: item,
                videoEl: createNullVideo(),
              });
              webRtcMeetingPk.sendOffer({
                sender: mySocketId.value,
                receiver: item,
              });
            }
          });
        }
      }
    );

    // 其他用户加入房间
    ws.socketIo.on(WsMsgTypeEnum.otherJoin, (data: WsOtherJoinType['data']) => {
      prettierReceiveWsMsg(WsMsgTypeEnum.otherJoin, data);
      const danmu: IWsMessage = {
        username: data.join_user_info?.username,
        send_msg_time: +new Date(),
        live_room_id: data.live_room_id!,
        id: -1,
        content: '',
        content_type: WsMessageContentTypeEnum.txt,
        msg_type: DanmuMsgTypeEnum.otherJoin,
      };
      damuList.value.push(danmu);
      if (route.name === routerName.push) {
        // 当前是推流页面
        if (!isAnchor.value) {
          console.error('不是主播');
          return;
        }
        if (!roomLiving.value) {
          console.error('主播没点开始直播');
          return;
        }
        if (userStore.userInfo?.id === data.join_user_info?.id) {
          console.error('自己进入直播间，退出');
          return;
        }
        const liveRoomType = appStore.liveRoomInfo?.type;
        if (liveRoomType === LiveRoomTypeEnum.wertc_live) {
          updateWebRtcLiveConfig({
            roomId: roomId.value,
            canvasVideoStream: canvasVideoStream.value,
          });
          data.socket_list.forEach((item) => {
            if (item !== mySocketId.value) {
              if (networkStore.rtcMap.get(item)) {
                return;
              }
              webRtcLive.newWebRtc({
                sender: mySocketId.value,
                receiver: item,
                videoEl: createNullVideo(),
                sucessCb: () => {},
              });
              webRtcLive.sendOffer({
                sender: mySocketId.value,
                receiver: item,
              });
            }
          });
        } else if (liveRoomType === LiveRoomTypeEnum.wertc_meeting_one) {
          updateWebRtcMeetingOneConfig({
            roomId: roomId.value,
            anchorStream: canvasVideoStream.value,
          });
          data.socket_list?.forEach((item) => {
            if (item !== mySocketId.value) {
              if (networkStore.rtcMap.get(item)) {
                return;
              }
              webRtcMeetingOne.newWebRtc({
                sender: mySocketId.value,
                receiver: item,
                videoEl: createNullVideo(),
                sucessCb: () => {},
              });
              webRtcMeetingOne.sendOffer({
                sender: mySocketId.value,
                receiver: item,
              });
            }
          });
        } else if (liveRoomType === LiveRoomTypeEnum.pk) {
          updateWebRtcMeetingPkConfig({
            roomId: roomId.value,
            anchorStream: canvasVideoStream.value,
          });
          // data.socket_list?.forEach((item) => {
          //   if (item !== mySocketId.value) {
          //     if (networkStore.rtcMap.get(item)) {
          //       return;
          //     }
          //     webRtcMeetingPk.newWebRtc({
          //       sender: mySocketId.value,
          //       receiver: item,
          //       videoEl: createNullVideo(),
          //     });
          //     webRtcMeetingPk.sendOffer({
          //       sender: mySocketId.value,
          //       receiver: item,
          //     });
          //   }
          // });
        } else if (liveRoomType === LiveRoomTypeEnum.tencent_css_pk) {
          updateWebRtcMeetingPkConfig({
            roomId: roomId.value,
            anchorStream: canvasVideoStream.value,
          });
          data.socket_list?.forEach((item) => {
            if (item !== mySocketId.value) {
              if (networkStore.rtcMap.get(item)) {
                return;
              }
              webRtcMeetingPk.newWebRtc({
                sender: mySocketId.value,
                receiver: item,
                videoEl: createNullVideo(),
              });
              webRtcMeetingPk.sendOffer({
                sender: mySocketId.value,
                receiver: item,
              });
            }
          });
        }
      } else {
        // 当前不是推流页面
      }
    });

    // 用户离开房间
    ws.socketIo.on(WsMsgTypeEnum.leave, (data) => {
      prettierReceiveWsMsg(WsMsgTypeEnum.leave, data);
    });

    // 用户离开房间完成
    ws.socketIo.on(WsMsgTypeEnum.leaved, (data: WsLeavedType['data']) => {
      prettierReceiveWsMsg(WsMsgTypeEnum.leaved, data);
      console.log('用户离开房间完成', data);
      networkStore.removeRtc(data.socket_id);
      damuList.value.push({
        ...data,
        send_msg_time: +new Date(),
        live_room_id: Number(roomId.value),
        id: -1,
        content: '',
        content_type: WsMessageContentTypeEnum.txt,
        msg_type: DanmuMsgTypeEnum.userLeaved,
      });
    });
  }

  function initRoomId(id: string) {
    roomId.value = id;
  }

  function initWs(data: {
    isAnchor: boolean;
    roomId: string;
    isBilibili?: boolean;
    currentResolutionRatio?: number;
    currentMaxFramerate?: number;
    currentMaxBitrate?: number;
  }) {
    initRoomId(data.roomId);
    isAnchor.value = data.isAnchor;

    if (data.isBilibili !== undefined) {
      isBilibili.value = data.isBilibili;
    }
    if (data.currentMaxBitrate !== undefined) {
      currentMaxBitrate.value = data.currentMaxBitrate;
    }
    if (data.currentMaxFramerate !== undefined) {
      currentMaxFramerate.value = data.currentMaxFramerate;
    }
    if (data.currentResolutionRatio !== undefined) {
      currentResolutionRatio.value = data.currentResolutionRatio;
    }
    new WebSocketClass({
      roomId: roomId.value,
      url: WEBSOCKET_URL,
      isAnchor: data.isAnchor,
    });
    initReceive();
  }

  return {
    initRoomId,
    initWs,
    handleStartLive,
    sendDanmuTxt,
    sendDanmuImg,
    sendDanmuReward,
    keepRtcLivingTimer,
    isBilibili,
    connectStatus,
    mySocketId,
    canvasVideoStream,
    lastCoverImg,
    roomLiving,
    liveUserList,
    damuList,
    currentMaxFramerate,
    currentMaxBitrate,
    currentResolutionRatio,
    currentAudioContentHint,
    currentVideoContentHint,
  };
};
