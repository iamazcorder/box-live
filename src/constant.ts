import { GoodsTypeEnum, MediaTypeEnum } from '@/interface';
import { prodDomain, QINIU_KODO } from '@/spec-config';
import { LiveRoomTypeEnum } from '@/types/ILiveRoom';

export const QQ_CLIENT_ID = `101958191`;
export const QQ_OAUTH_URL = `https://graph.qq.com/oauth2.0`;
export const QQ_REDIRECT_URI = `https://live.${prodDomain}/oauth/qq_login`;

export const WECHAT_REDIRECT_URI = `https://live.${prodDomain}/oauth/wechat_login`;

export const QRCODE_LOGIN_URI = `https://live.${prodDomain}/qrcodeLogin`;

export const AUTHOR_GITHUB = `https://github.com/galaxy-s10`;

export const PROJECT_NAME = 'billd-live';

export const AUTHOR_INFO = {
  github: 'https://github.com/galaxy-s10',
  wechat: 'shuisheng9905',
  qq: '2274751790',
};

export const appBuildInfo =
  // @ts-ignore
  process.env.BilldHtmlWebpackPlugin as BilldHtmlWebpackPluginLog;

export const COOKIE_DOMAIN =
  process.env.NODE_ENV === 'development' ? undefined : `.${prodDomain}`;

export const THEME_COLOR = '#ffd700';

export const SRS_CB_URL_QUERY = {
  publishKey: 'pushkey',
  publishType: 'pushtype',
  userToken: 'usertoken',
  userId: 'userid',
  randomId: 'randomid',
  roomId: 'roomid',
  isdev: 'isdev',
};

export const URL_QUERY = {
  goodsType: 'goodsType',
  pkKey: 'pkKey',
  roomId: 'roomId',
  liveType: 'liveType',
  isBilibili: 'isBilibili',
};

export const COMMON_URL = {
  apifox: `https://apifox.com/apidoc/shared-c7556b54-17b2-494e-a039-572d83f103ed/`,
  admin: `https://live-admin.${prodDomain}`,
  bilibiliCollectiondetail: `https://space.bilibili.com/381307133/channel/collectiondetail?sid=1458070&ctype=0`,
  payCoursesArticle: `https://www.${prodDomain}/article/151`,
  desk: `https://desk.${prodDomain}`,
  download: {
    live: {
      flutter: {
        android: `${QINIU_KODO.hssblog.url}/billd-live/download/billd-live-v0.0.4.apk`,
        github: 'https://github.com/galaxy-s10/billd-live-flutter',
      },
      reactNative: {
        android: '',
        github: 'https://github.com/galaxy-s10/billd-live-react-native',
      },
      kotlin: {
        android: '',
        github: 'https://github.com/galaxy-s10/billd-live-kotlin',
      },
      electron: {
        github: 'https://github.com/galaxy-s10/billd-live-electron',
        windows: ``,
        macOS: ``,
      },
    },
    desk: {
      electron: {
        windows: `${QINIU_KODO.hssblog.url}/billd-desk-electron/download/billd-desk-win-latest.exe`,
        macOS: `${QINIU_KODO.hssblog.url}/billd-desk-electron/download/billd-desk-mac-latest.dmg`,
        github: 'https://github.com/galaxy-s10/billd-desk-electron',
      },
      flutter: {
        ios: ``,
        android: ``,
        github: 'https://github.com/galaxy-s10/billd-desk-flutter',
      },
    },
  },
  release: {
    flutter: 'https://github.com/galaxy-s10/billd-live-flutter',
    kotlin: 'https://github.com/galaxy-s10/billd-live-kotlin',
    reactNative: 'https://github.com/galaxy-s10/billd-live-react-native',
    electron: 'https://github.com/galaxy-s10/billd-live-electron',
    desk: 'https://github.com/galaxy-s10/billd-desk',
  },
};

export const DEFAULT_AUTH_INFO = {
  ALL_AUTH: {
    id: 1,
    auth_value: 'ALL_AUTH',
  },
  USER_MANAGE: {
    id: 2,
    auth_value: 'USER_MANAGE',
  },
  ROLE_MANAGE: {
    id: 3,
    auth_value: 'ROLE_MANAGE',
  },
  AUTH_MANAGE: {
    id: 4,
    auth_value: 'AUTH_MANAGE',
  },
  MESSAGE_MANAGE: {
    id: 5,
    auth_value: 'MESSAGE_MANAGE',
  },
  MESSAGE_SEND: {
    id: 6,
    auth_value: 'MESSAGE_SEND',
  },
  MESSAGE_DISABLE: {
    id: 7,
    auth_value: 'MESSAGE_DISABLE',
  },
  LOG_MANAGE: {
    id: 8,
    auth_value: 'LOG_MANAGE',
  },
  LIVE_MANAGE: {
    id: 9,
    auth_value: 'LIVE_MANAGE',
  },
  LIVE_PUSH: {
    id: 10,
    auth_value: 'LIVE_PUSH',
  },
  LIVE_PULL: {
    id: 11,
    auth_value: 'LIVE_PULL',
  },
  LIVE_PULL_SVIP: {
    id: 12,
    auth_value: 'LIVE_PULL_SVIP',
  },
  LIVE_PUSH_CDN: {
    id: 13,
    auth_value: 'LIVE_PUSH_CDN',
  },
  LIVE_PUSH_FORWARD_BILIBILI: {
    id: 14,
    auth_value: 'LIVE_PUSH_FORWARD_BILIBILI',
  },
  LIVE_PUSH_FORWARD_HUYA: {
    id: 15,
    auth_value: 'LIVE_PUSH_FORWARD_HUYA',
  },
  LIVE_PUSH_FORWARD_DOUYU: {
    id: 16,
    auth_value: 'LIVE_PUSH_FORWARD_DOUYU',
  },
  LIVE_PUSH_FORWARD_DOUYIN: {
    id: 17,
    auth_value: 'LIVE_PUSH_FORWARD_DOUYIN',
  },
  LIVE_PUSH_FORWARD_KUAISHOU: {
    id: 18,
    auth_value: 'LIVE_PUSH_FORWARD_KUAISHOU',
  },
  LIVE_PUSH_FORWARD_XIAOHONGSHU: {
    id: 19,
    auth_value: 'LIVE_PUSH_FORWARD_XIAOHONGSHU',
  },
};

// 全局的cookie的key
export const COOKIE_KEY = {
  thirdLoginInfo: 'thirdLoginInfo',
};

export const lsKeyPrefix = 'billd_live___';

// 全局的localStorage的key
export const lsKey = {
  lastBuildDate: 'lastBuildDate',
  token: 'token',
};

export const goodsTypeEnumMap = {
  [GoodsTypeEnum.recharge]: '充值',
  [GoodsTypeEnum.gift]: '礼物',
  [GoodsTypeEnum.sponsors]: '赞助',
  [GoodsTypeEnum.support]: '服务',
  [GoodsTypeEnum.qypShop]: '逸鹏的商品',
};

export const mediaTypeEnumMap = {
  [MediaTypeEnum.camera]: '摄像头',
  [MediaTypeEnum.microphone]: '麦克风',
  [MediaTypeEnum.screen]: '窗口',
  [MediaTypeEnum.img]: '图片',
  [MediaTypeEnum.txt]: '文字',
  [MediaTypeEnum.media]: '视频',
  [MediaTypeEnum.time]: '时间',
  [MediaTypeEnum.stopwatch]: '秒表',
  [MediaTypeEnum.pk]: '打pk',
  [MediaTypeEnum.metting]: '会议',
};

export const liveRoomTypeEnumMap = {
  [LiveRoomTypeEnum.msr]: 'msr推流',
  [LiveRoomTypeEnum.obs]: 'obs推流',
  [LiveRoomTypeEnum.pk]: '打pk',
  [LiveRoomTypeEnum.srs]: 'srs推流',
  [LiveRoomTypeEnum.system]: '系统推流',
  [LiveRoomTypeEnum.tencent_css]: '腾讯云css推流',
  [LiveRoomTypeEnum.tencent_css_pk]: '腾讯云css打pk',
  [LiveRoomTypeEnum.wertc_live]: 'webrtc直播',
  [LiveRoomTypeEnum.wertc_meeting_one]: 'webrtc会议一',
  [LiveRoomTypeEnum.wertc_meeting_two]: 'webrtc会议二',
  [LiveRoomTypeEnum.forward_bilibili]: '转推b站',
  [LiveRoomTypeEnum.forward_huya]: '转推虎牙',
  [LiveRoomTypeEnum.forward_all]: '转推所有',
};

export const sliderList = [
  {
    img: `${QINIU_KODO.hssblog.url}/billd-live/image/a4039f86e5352bcfccaddecc4b72a1df.webp`,
    txt: 'SRS',
    link: 'https://ossrs.net',
  },
  {
    img: `${QINIU_KODO.hssblog.url}/image/c3c342f6852706e0b70d011e8753d2d6.webp`,
    txt: 'FFmpeg',
    link: 'https://ffmpeg.org',
  },
  {
    img: `${QINIU_KODO.hssblog.url}/image/0214acde5f5f5e3caf278ce446cc4414.webp`,
    txt: 'WebRTC',
    link: 'https://github.com/webrtc',
  },
  {
    img: `${QINIU_KODO.hssblog.url}/billd-live/image/1277df4371045310acbc4bf2fc0811b8.webp`,
    txt: 'Vue3',
    link: 'https://vuejs.org',
  },
  {
    img: `${QINIU_KODO.hssblog.url}/image/dd907463af7fdec395e5f6d088b0308b.webp`,
    txt: 'Pinia',
    link: 'https://pinia.vuejs.org',
  },
  {
    img: `${QINIU_KODO.hssblog.url}/image/9d54ed9673f2ca4ffc78fc6348f2b736.png`,
    txt: 'TypeScript',
    link: 'https://www.typescriptlang.org',
  },
  {
    img: `${QINIU_KODO.hssblog.url}/image/a6473eed036e5d35ca2c9f7118c974cd.webp`,
    txt: 'Vite4',
    link: 'https://vitejs.dev',
  },
  {
    img: `${QINIU_KODO.hssblog.url}/image/627105f0e5674018cb03c8da036ae5d5.webp`,
    txt: 'Webpack5',
    link: 'https://webpack.js.org',
  },
  {
    img: `${QINIU_KODO.hssblog.url}/billd-live/image/5304af2ea6864369df3ba895d20e3d14.png`,
    txt: 'swc',
    link: 'https://swc.rs',
  },
  {
    img: `${QINIU_KODO.hssblog.url}/image/dd8ffe33c22723381a3664684eaca237.png`,
    txt: 'esbuild',
    link: 'https://esbuild.github.io',
  },
  {
    img: `${QINIU_KODO.hssblog.url}/image/f6b9f5cfade1d96634dddb0b89b056be.png`,
    txt: 'Pnpm',
    link: 'https://pnpm.io',
  },
  {
    img: `${QINIU_KODO.hssblog.url}/image/89fadfed21f1dd6389dfeb227b3d1ca6.webp`,
    txt: 'naive-ui',
    link: 'https://www.naiveui.com',
  },
  {
    img: `${QINIU_KODO.hssblog.url}/image/5ce36cab3d6b23974625900dc4cf39a3.webp`,
    txt: 'Node',
    link: 'https://nodejs.org',
  },
  {
    img: `${QINIU_KODO.hssblog.url}/image/0dcabc80c616240edc3111450fbf79aa.webp`,
    txt: 'socket.io',
    link: 'https://socket.io',
  },
  {
    img: `${QINIU_KODO.hssblog.url}/image/2009474c455813d487803e2acfcbb4af.webp`,
    txt: 'mysql',
    link: 'https://www.mysql.com/',
  },
  {
    img: `${QINIU_KODO.hssblog.url}/image/e66deaf779edb2a94e91f9b0f2995f6d.webp`,
    txt: 'redis',
    link: 'https://redis.io',
  },
  {
    img: `${QINIU_KODO.hssblog.url}/image/fd783552a400643c611c62e9200bb429.webp`,
    txt: 'Sequelize',
    link: 'https://sequelize.org',
  },
  {
    img: `${QINIU_KODO.hssblog.url}/image/dce3470845321ce654d09ce811837749.webp`,
    txt: '腾讯云云直播 CSS',
    link: 'https://cloud.tencent.com/product/css',
  },
  {
    img: `${QINIU_KODO.hssblog.url}/image/074835fbbaf976992e78bc6a585530e6.webp`,
    txt: '阿里云轻量服务器',
    link: 'https://www.aliyun.com',
  },
  {
    img: `${QINIU_KODO.hssblog.url}/image/9a934ebf993f5d3b4146f050f7071518.webp`,
    txt: '七牛云对象存储',
    link: 'https://www.qiniu.com',
  },
  {
    img: `${QINIU_KODO.hssblog.url}/image/e247f6fd39320051d236f3f844b9056f.webp`,
    txt: '支付宝当面付',
    link: 'https://opendocs.alipay.com/open/194',
  },
  {
    img: `${QINIU_KODO.hssblog.url}/image/d5eb237bd54bc4e729186115e89e5935.webp`,
    txt: 'Docker',
    link: 'https://www.docker.com',
  },
  {
    img: `${QINIU_KODO.hssblog.url}/image/92a6f3e295634ddd21b6b8034fa3b25f.webp`,
    txt: 'Jenkins',
    link: 'https://www.jenkins.io',
  },
  {
    img: `${QINIU_KODO.hssblog.url}/image/354823b72eb805264c940f5232d824fe.webp`,
    txt: 'PM2',
    link: 'https://github.com/Unitech/pm2',
  },
  {
    img: `${QINIU_KODO.hssblog.url}/image/d4417f70fa36edbc62b5aa3840cbf25f.webp`,
    txt: 'bilibili',
    link: 'https://www.bilibili.com',
  },
];
