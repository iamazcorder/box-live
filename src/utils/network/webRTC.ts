import { getRandomString } from 'billd-utils';

import { prodDomain } from '@/spec-config';
import { useNetworkStore } from '@/store/network';
import { WsCandidateType, WsMsgTypeEnum } from '@/types/websocket';

/** 设置约束 */
export async function handlConstraints(data: {
  frameRate: number;
  height: number;
  stream: MediaStream;
}): Promise<number> {
  const { frameRate, height, stream } = data;
  const queue: Promise<any>[] = [];
  console.log('开始设置约束', JSON.stringify({ height, frameRate }));
  stream.getTracks().forEach((track) => {
    if (track.kind === 'video') {
      queue.push(
        track.applyConstraints({
          height: { ideal: height },
          frameRate: { ideal: frameRate },
        })
      );
    }
  });
  try {
    await Promise.all(queue);
    console.log('设置设置约束成功');
    return 1;
  } catch (error) {
    console.error('设置设置约束失败', error);
    return 0;
  }
}

export class WebRTCClass {
  roomId = '-1';
  sender = '';
  receiver = '';
  sucessCb;

  videoEl: HTMLVideoElement;

  peerConnection: RTCPeerConnection | null = null;
  dataChannel: RTCDataChannel | null = null;
  cbDataChannel: RTCDataChannel | null = null;

  /** 最大码率 */
  maxBitrate = -1;
  /** 最大帧率 */
  maxFramerate = -1;
  /** 分辨率 */
  resolutionRatio = -1;

  localStream?: MediaStream | null;

  isSRS: boolean;

  loss = -1;

  rtt = -1;

  outboundFps = -1;
  inboundFps = -1;

  getStatsDelay = 1000;
  loopGetStatsTimer: any = null;

  preBytesSent = 0;
  /** 发送码率，单位kb/s */
  bytesSent = 0;

  preBytesReceived = 0;
  /** 接收码率，单位kb/s */
  bytesReceived = 0;

  constructor(data: {
    roomId: string;
    videoEl: HTMLVideoElement;
    maxBitrate?: number;
    maxFramerate?: number;
    resolutionRatio?: number;
    isSRS: boolean;
    sender: string;
    receiver: string;
    sucessCb?: any;
  }) {
    this.roomId = data.roomId;
    this.videoEl = data.videoEl;
    // document.body.appendChild(this.videoEl);
    this.sender = data.sender;
    this.receiver = data.receiver;
    this.sucessCb = data.sucessCb;
    if (data.maxBitrate) {
      this.maxBitrate = data.maxBitrate;
    }
    if (data.resolutionRatio) {
      this.resolutionRatio = data.resolutionRatio;
    }
    if (data.maxFramerate) {
      this.maxFramerate = data.maxFramerate;
    }
    this.isSRS = data.isSRS;
    console.warn('new webrtc参数:', data);
    this.loopGetStats();
    this.createPeerConnection();
  }

  loopGetStats = () => {
    this.loopGetStatsTimer = setInterval(async () => {
      if (!this.peerConnection) return;
      try {
        const res = await this.peerConnection.getStats();
        // 总丢包率（音频丢包和视频丢包）
        const loss = 0;
        const rtt = 0;
        let bytesSent = 0;
        let bytesReceived = 0;
        res.forEach((report: RTCInboundRtpStreamStats) => {
          if (report.type === 'outbound-rtp' && report.kind === 'video') {
            this.outboundFps = report.framesPerSecond || 0;
          }
          if (report.type === 'inbound-rtp' && report.kind === 'video') {
            this.inboundFps = report.framesPerSecond || 0;
          }

          // @ts-ignore
          if (report.bytesSent) {
            // @ts-ignore
            bytesSent += report.bytesSent || 0;
          }
          if (report.bytesReceived) {
            // @ts-ignore
            bytesReceived += report.bytesReceived || 0;
          }
        });
        this.bytesSent =
          (bytesSent - this.preBytesSent) / 1024 / (this.getStatsDelay / 1000);
        this.bytesReceived =
          (bytesReceived - this.preBytesReceived) /
          1024 /
          (this.getStatsDelay / 1000);
        this.preBytesSent = bytesSent;
        this.preBytesReceived = bytesReceived;
        this.loss = loss;
        this.rtt = rtt;

        this.update();
      } catch (error) {
        console.error('getStats错误');
        console.log(error);
      }
    }, this.getStatsDelay);
  };

  prettierLog = (data: {
    msg: string;
    type?: 'log' | 'warn' | 'error' | 'success';
  }) => {
    const { msg, type } = data;
    if (type === 'success') {
      console.log(
        `%c ` +
          `【WebRTCClass】${new Date().toLocaleString()},房间id:${
            this.roomId
          }` +
          ` %c ${msg} ` +
          `%c`,
        'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
        'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
        'background:transparent'
      );
    } else {
      console[type || 'log'](
        `【WebRTCClass】${new Date().toLocaleString()},房间id:${this.roomId}`,
        msg
      );
    }
  };

  /** 设置最大码率 */
  setMaxBitrate = (maxBitrate: number) => {
    console.log('开始设置最大码率', maxBitrate);
    return new Promise<number>((resolve) => {
      this.peerConnection?.getSenders().forEach((sender) => {
        if (sender.track?.kind === 'video') {
          const parameters = { ...sender.getParameters() };
          if (parameters.encodings[0]) {
            const val = 1000 * maxBitrate;
            if (parameters.encodings[0].maxBitrate === val) {
              console.log('最大码率不变，不设置');
              resolve(1);
              return;
            }
            parameters.encodings[0].maxBitrate = val;
            sender
              .setParameters(parameters)
              .then(() => {
                console.log('设置最大码率成功', maxBitrate);
                this.maxBitrate = val;
                resolve(1);
              })
              .catch((error) => {
                console.error('设置最大码率失败', maxBitrate, error);
                resolve(0);
              });
          }
        }
      });
    });
  };

  /** 创建offer */
  createOffer = async () => {
    if (!this.peerConnection) return;
    this.prettierLog({ msg: 'createOffer开始', type: 'warn' });
    try {
      const sdp = await this.peerConnection.createOffer();
      this.prettierLog({ msg: 'createOffer成功', type: 'warn' });
      return sdp;
    } catch (error) {
      this.prettierLog({ msg: 'createOffer失败', type: 'error' });
      console.error(error);
    }
  };

  /** 创建answer */
  createAnswer = async () => {
    if (!this.peerConnection) return;
    this.prettierLog({ msg: 'createAnswer开始', type: 'warn' });
    try {
      const sdp = await this.peerConnection.createAnswer();
      this.prettierLog({ msg: 'createAnswer成功', type: 'warn' });
      return sdp;
    } catch (error) {
      this.prettierLog({ msg: 'createAnswer失败', type: 'error' });
      console.error(error);
    }
  };

  /** 处理candidate */
  addIceCandidate = async (candidate: RTCIceCandidateInit) => {
    this.prettierLog({ msg: 'addIceCandidate开始', type: 'warn' });
    try {
      await this.peerConnection?.addIceCandidate(candidate);
      this.prettierLog({ msg: 'addIceCandidate成功', type: 'warn' });
    } catch (error) {
      this.prettierLog({ msg: 'addIceCandidate错误', type: 'error' });
      console.error(error);
    }
  };

  /** 设置本地描述 */
  setLocalDescription = async (sdp: RTCLocalSessionDescriptionInit) => {
    if (!this.peerConnection) return;
    this.prettierLog({ msg: 'setLocalDescription开始', type: 'warn' });
    try {
      await this.peerConnection.setLocalDescription(sdp);
      this.prettierLog({ msg: 'setLocalDescription成功', type: 'warn' });
    } catch (error) {
      this.prettierLog({ msg: 'setLocalDescription失败', type: 'error' });
      console.error(error);
    }
  };

  /** 设置远端描述 */
  setRemoteDescription = async (sdp: RTCSessionDescriptionInit) => {
    if (!this.peerConnection) return;
    this.prettierLog({ msg: 'setRemoteDescription开始', type: 'warn' });
    try {
      await this.peerConnection.setRemoteDescription(sdp);
      this.prettierLog({ msg: 'setRemoteDescription成功', type: 'warn' });
    } catch (error) {
      this.prettierLog({ msg: 'setRemoteDescription失败', type: 'error' });
      console.error(error);
    }
  };

  handleStreamEvent = () => {
    if (!this.peerConnection) return;
    // 废弃：https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addStream
    // this.prettierLog({ msg: '开始监听pc的addstream事件', type: 'warn' });
    // this.peerConnection.addEventListener('addstream', (event) => {
    //   this.prettierLog({ msg: 'pc收到addstream事件', type: 'warn' });
    //   console.log('addstream事件的event', event);
    //   console.log('addstream事件的stream', event.stream);
    //   console.log('addstream事件的视频轨', event.stream.getVideoTracks());
    //   console.log('addstream事件的音频轨', event.stream.getAudioTracks());
    // });

    this.prettierLog({ msg: '开始监听pc的track事件', type: 'warn' });
    this.peerConnection.addEventListener('track', (event) => {
      this.prettierLog({ msg: 'pc收到track事件', type: 'warn' });
      console.log('track事件的event', event);
      console.log('track事件的stream', event.streams[0]);
      console.log('track事件的视频轨', event.streams[0].getVideoTracks());
      console.log('track事件的音频轨', event.streams[0].getAudioTracks());
      const stream = event.streams[0];
      stream.onremovetrack = () => {
        this.prettierLog({ msg: 'onremovetrack事件', type: 'warn' });
      };
      this.localStream = event.streams[0];
      this.videoEl.srcObject = event.streams[0];
    });
  };

  handleConnectionEvent = () => {
    if (!this.peerConnection) return;

    this.prettierLog({ msg: '开始监听pc的icecandidate事件', type: 'warn' });
    this.peerConnection.addEventListener('icecandidate', (event) => {
      this.prettierLog({ msg: 'pc收到icecandidate', type: 'warn' });
      if (event.candidate) {
        const networkStore = useNetworkStore();
        networkStore.wsMap.get(this.roomId)?.send<WsCandidateType['data']>({
          requestId: getRandomString(8),
          msgType: this.isSRS
            ? WsMsgTypeEnum.srsCandidate
            : WsMsgTypeEnum.nativeWebRtcCandidate,
          data: {
            candidate: event.candidate,
            sender: this.sender,
            receiver: this.receiver,
            live_room_id: Number(this.roomId),
          },
        });
      } else {
        console.log('没有候选者了');
      }
    });

    this.prettierLog({
      msg: '开始监听pc的iceconnectionstatechange事件',
      type: 'warn',
    });
    this.peerConnection.addEventListener(
      'iceconnectionstatechange',
      (event: any) => {
        this.prettierLog({
          msg: 'pc收到iceconnectionstatechange',
          type: 'warn',
        });
        // https://developer.mozilla.org/zh-CN/docs/Web/API/RTCPeerConnection/connectionState
        const iceConnectionState = event.currentTarget.iceConnectionState;
        console.log('iceconnectionstatechange', iceConnectionState);
        if (iceConnectionState === 'connected') {
          // ICE 代理至少对每个候选发现了一个可用的连接，此时仍然会继续测试远程候选以便发现更优的连接。同时可能在继续收集候选。
          this.prettierLog({
            msg: 'iceConnectionState:connected',
            type: 'warn',
          });
          this.update();
        }
        if (iceConnectionState === 'completed') {
          // ICE 代理已经发现了可用的连接，不再测试远程候选。
          this.prettierLog({
            msg: 'iceConnectionState:completed',
            type: 'warn',
          });
        }
        if (iceConnectionState === 'failed') {
          // ICE 候选测试了所有远程候选没有发现匹配的候选。也可能有些候选中发现了一些可用连接。
          this.prettierLog({
            msg: 'iceConnectionState:failed',
            type: 'error',
          });
          this.close();
        }
        if (iceConnectionState === 'disconnected') {
          // 测试不再活跃，这可能是一个暂时的状态，可以自我恢复。
          this.prettierLog({
            msg: 'iceConnectionState:disconnected',
            type: 'error',
          });
          this.close();
        }
        if (iceConnectionState === 'closed') {
          // ICE 代理关闭，不再应答任何请求。
          this.prettierLog({
            msg: 'iceConnectionState:closed',
            type: 'error',
          });
        }
      }
    );

    this.prettierLog({
      msg: '开始监听pc的connectionstatechange事件',
      type: 'warn',
    });
    this.peerConnection.addEventListener(
      'connectionstatechange',
      (event: any) => {
        const connectionState = event.currentTarget.connectionState;
        this.prettierLog({
          msg: 'pc收到connectionstatechange',
          type: 'warn',
        });
        console.log('connectionstatechange', connectionState);
        if (connectionState === 'connected') {
          // 表示每一个 ICE 连接要么正在使用（connected 或 completed 状态），要么已被关闭（closed 状态）；并且，至少有一个连接处于 connected 或 completed 状态。
          this.prettierLog({
            msg: 'connectionState:connected',
            type: 'warn',
          });
          this.prettierLog({
            msg: 'webrtc连接成功！',
            type: 'success',
          });
          console.log('sender', this.sender, 'receiver', this.receiver);
          this.sucessCb?.(this.localStream);
          // appStore.liveLine = LiveLineEnum.rtc;
          if (this.maxBitrate !== -1) {
            this.setMaxBitrate(this.maxBitrate);
          }
        }
        if (connectionState === 'disconnected') {
          // 表示至少有一个 ICE 连接处于 disconnected 状态，并且没有连接处于 failed、connecting 或 checking 状态。
          this.prettierLog({
            msg: 'connectionState:disconnected',
            type: 'error',
          });
          this.close();
        }
        if (connectionState === 'closed') {
          // 表示 RTCPeerConnection 已关闭。
          this.prettierLog({
            msg: 'connectionState:closed',
            type: 'error',
          });
        }
        if (connectionState === 'failed') {
          // 表示至少有一个 ICE 连接处于 failed 的状态。
          this.prettierLog({
            msg: 'connectionState:failed',
            type: 'error',
          });
          this.close();
        }
      }
    );

    this.prettierLog({
      msg: '开始监听pc的icecandidateerror事件',
      type: 'warn',
    });
    this.peerConnection.addEventListener('icecandidateerror', (err) => {
      this.prettierLog({
        msg: 'pc收到icecandidateerror',
        type: 'error',
      });
      console.log(err);
    });

    this.prettierLog({
      msg: '开始监听pc的negotiationneeded事件',
      type: 'warn',
    });
    this.peerConnection.addEventListener('negotiationneeded', () => {
      this.prettierLog({
        msg: 'pc收到negotiationneeded',
        type: 'warn',
      });
    });
  };

  dataChannelSend = <T extends unknown>({
    // 写成<T extends unknown>而不是<T>是为了避免eslint将箭头函数的<T>后面的内容识别成jsx语法
    msgType,
    requestId,
    data,
  }: {
    msgType: WsMsgTypeEnum;
    requestId: string;
    data?: T;
  }) => {
    if (this.dataChannel?.readyState !== 'open') {
      console.error('dataChannel未连接成功，不发送消息！', msgType, data);
      return;
    }
    this.dataChannel.send(
      JSON.stringify({
        msgType,
        requestId,
        data,
      })
    );
  };

  /** 创建对等连接 */
  createPeerConnection = () => {
    if (!window.RTCPeerConnection) {
      console.error('当前环境不支持RTCPeerConnection！');
      alert('当前环境不支持RTCPeerConnection！');
      return;
    }
    if (!this.peerConnection) {
      const iceServers = this.isSRS
        ? []
        : [
            // {
            //   urls: 'stun:stun.l.google.com:19302',
            // },
            {
              urls: `turn:hk.${prodDomain}`,
              username: 'hss',
              credential: '123456',
            },
          ];
      this.peerConnection = new RTCPeerConnection({
        iceServers,
      });
      if (!this.isSRS) {
        // this.handleDataChannel();
      }
      this.handleStreamEvent();
      this.handleConnectionEvent();
      this.update();
    }
  };

  handleDataChannel = () => {
    if (!this.peerConnection) return;
    this.peerConnection.ondatachannel = (event) => {
      this.cbDataChannel = event.channel;
      this.update();
    };
    this.dataChannel = this.peerConnection.createDataChannel('MessageChannel', {
      // maxRetransmits，用户代理应尝试重新传输在不可靠模式下第一次失败的消息的最大次数。虽然该值是 16 位无符号数，但每个用户代理都可以将其限制为它认为合适的任何最大值。
      maxRetransmits: 3,
      // ordered，表示通过 RTCDataChannel 的信息的到达顺序需要和发送顺序一致 (true), 或者到达顺序不需要和发送顺序一致 (false). 默认：true
      ordered: false,
      protocol: 'udp',
    });
    this.dataChannel.onopen = () => {
      this.prettierLog({
        msg: 'dataChannel连接成功！',
        type: 'success',
      });
    };
    this.dataChannel.onerror = () => {
      this.prettierLog({
        msg: 'dataChannel连接失败！',
        type: 'error',
      });
    };
  };

  /** 手动关闭webrtc连接 */
  close = () => {
    try {
      this.prettierLog({ msg: '手动关闭webrtc连接', type: 'warn' });
      clearInterval(this.loopGetStatsTimer);
      this.localStream?.getTracks().forEach((track) => {
        track.stop();
      });
      this.localStream = null;
      this.peerConnection?.close();
      this.peerConnection = null;
      this.dataChannel = null;
      this.videoEl.remove();
    } catch (error) {
      this.prettierLog({ msg: '手动关闭webrtc连接失败', type: 'error' });
      console.error(error);
    }
  };

  /** 更新store */
  update = () => {
    const networkStore = useNetworkStore();
    networkStore.rtcMap.set(this.receiver, { ...this });
  };
}
