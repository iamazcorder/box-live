import { getRandomString } from 'billd-utils';
import { ref } from 'vue';

import { useRTCParams } from '@/hooks/use-rtcParams';
import { useAppStore } from '@/store/app';
import { useNetworkStore } from '@/store/network';
import { WsAnswerType, WsMsgTypeEnum, WsOfferType } from '@/types/websocket';
import { WebRTCClass } from '@/utils/network/webRTC';

export const useWebRtcLive = () => {
  const appStore = useAppStore();
  const networkStore = useNetworkStore();

  const { maxBitrate, maxFramerate, resolutionRatio } = useRTCParams();
  const currentMaxBitrate = ref(maxBitrate.value[3].value);
  const currentMaxFramerate = ref(maxFramerate.value[2].value);
  const currentResolutionRatio = ref(resolutionRatio.value[3].value);
  const roomId = ref('');
  const canvasVideoStream = ref<MediaStream>();

  function updateWebRtcLiveConfig(data: { roomId; canvasVideoStream }) {
    roomId.value = data.roomId;
    canvasVideoStream.value = data.canvasVideoStream;
  }

  const webRtcLive = {
    newWebRtc: (data: {
      sender: string;
      receiver: string;
      videoEl: HTMLVideoElement;
      sucessCb: (stream) => void;
    }) => {
      return new WebRTCClass({
        maxBitrate: currentMaxBitrate.value,
        maxFramerate: currentMaxFramerate.value,
        resolutionRatio: currentResolutionRatio.value,
        isSRS: false,
        roomId: roomId.value,
        videoEl: data.videoEl,
        sender: data.sender,
        receiver: data.receiver,
        sucessCb: data.sucessCb,
      });
    },
    /**
     * 主播发offer给观众
     */
    sendOffer: async ({
      sender,
      receiver,
    }: {
      sender: string;
      receiver: string;
    }) => {
      console.log('开始webRtcLive的sendOffer', {
        sender,
        receiver,
      });
      try {
        const ws = networkStore.wsMap.get(roomId.value);
        if (!ws) return;
        const rtc = networkStore.rtcMap.get(receiver);
        if (rtc) {
          canvasVideoStream.value?.getTracks().forEach((track) => {
            if (canvasVideoStream.value) {
              console.log(
                'webRtcLive的canvasVideoStream插入track',
                track.kind,
                track
              );
              rtc.peerConnection?.addTrack(track, canvasVideoStream.value);
            }
          });
          const offerSdp = await rtc.createOffer();
          if (!offerSdp) {
            console.error('webRtcLive的offerSdp为空');
            return;
          }
          await rtc.setLocalDescription(offerSdp!);
          networkStore.wsMap.get(roomId.value)?.send<WsOfferType['data']>({
            requestId: getRandomString(8),
            msgType: WsMsgTypeEnum.nativeWebRtcOffer,
            data: {
              live_room: appStore.liveRoomInfo!,
              live_room_id: appStore.liveRoomInfo!.id!,
              sender,
              receiver,
              sdp: offerSdp,
            },
          });
        } else {
          console.error('rtc不存在');
        }
      } catch (error) {
        console.error('webRtcLive的sendOffer错误');
        console.log(error);
      }
    },
    /**
     * 观众收到主播的offer，观众回复主播answer
     */
    sendAnswer: async ({
      sdp,
      sender,
      receiver,
    }: {
      sdp: RTCSessionDescriptionInit;
      sender: string;
      receiver: string;
    }) => {
      console.log('开始webRtcLive的sendAnswer', {
        sender,
        receiver,
      });
      try {
        const ws = networkStore.wsMap.get(roomId.value);
        if (!ws) return;
        const rtc = networkStore.rtcMap.get(receiver);
        if (rtc) {
          await rtc.setRemoteDescription(sdp);
          const answerSdp = await rtc.createAnswer();
          if (!answerSdp) {
            console.error('webRtcLive的answerSdp为空');
            return;
          }
          await rtc.setLocalDescription(answerSdp);
          networkStore.wsMap.get(roomId.value)?.send<WsAnswerType['data']>({
            requestId: getRandomString(8),
            msgType: WsMsgTypeEnum.nativeWebRtcAnswer,
            data: {
              live_room_id: Number(roomId.value),
              sender,
              receiver,
              sdp: answerSdp,
            },
          });
        } else {
          console.error('rtc不存在');
        }
      } catch (error) {
        console.error('webRtcLive的sendAnswer错误');
        console.log(error);
      }
    },
  };

  return { updateWebRtcLiveConfig, webRtcLive };
};
