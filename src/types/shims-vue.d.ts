declare module '*.vue' {
  /* eslint-disable */
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '*.webp';
declare module '*.png';

interface Window {
  $message: import('naive-ui/es/message/src/MessageProvider').MessageApiInjection;
  $modal: import('naive-ui/es/modal/src/ModalProvider').ModalApiInjection;
  TXLivePusher: any;
}
