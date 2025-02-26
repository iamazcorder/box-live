// 一定要引入webrtc-adapter（约等于垫片，适配safari等其他浏览器）
import '@/assets/main.scss';
import '@/utils/showBilldVersion';
import 'webrtc-adapter';
// import 'windi.css'; // windicss-webpack-plugin会解析windi.css这个MODULE_ID
import { createApp } from 'vue';
import VueLazyLoad from 'vue-lazyload';
// 引入 Element Plus 和样式
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// 引入 Element Plus 的中文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn';

import lazyErrorPng from '@/assets/img/lazy_error.png';
import lazyLoadingPng from '@/assets/img/lazy_loading.png';
import registerDirectives from '@/directives';
import { i18n } from '@/hooks/use-i18n';
import router from '@/router';
import store from '@/store';

import App from './App.vue';

const app = createApp(App);
registerDirectives(app);
app.use(i18n);
app.use(store);
app.use(router);
app.use(VueLazyLoad, {
  preLoad: 1,
  error: lazyErrorPng,
  loading: lazyLoadingPng,
  attempt: 2,
});

// 使用 Element Plus 并设置语言为中文
app.use(ElementPlus, { locale: zhCn });

app.mount('#app');
