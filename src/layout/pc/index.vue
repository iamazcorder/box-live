<template>
  <div class="layout">
    <!-- <div class="fixed-mask"></div> -->
    <HeadCpt></HeadCpt>
    <router-view v-slot="{ Component }">
      <component :is="Component"></component>
    </router-view>
    <SidebarCpt v-if="isShowSideBar"></SidebarCpt>
    <LoginModal v-if="appStore.showLoginModal"></LoginModal>
    <PayCourse v-if="appStore.usePayCourse"></PayCourse>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import HeadCpt from './head/index.vue';
import SidebarCpt from './sidebar/index.vue';

const route = useRoute();
document.body.style.minWidth = '1200px';
const appStore = useAppStore();
const isShowSideBar = ref(false);

watch(
  () => route.path,
  () => {
    handleShowSideBar();
  }
);

onMounted(() => {
  handleShowSideBar();
});

const handleShowSideBar = () => {
  if (route.path === '/' || route.path === '/area') {
    isShowSideBar.value = true;
  } else {
    isShowSideBar.value = false;
  }
};
</script>

<style lang="scss" scoped>
.layout {
  box-sizing: border-box;
  padding-top: $header-height;
  min-height: 100vh;

  .fixed-mask {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 50;
    width: 400px;
    height: 300px;
    background-color: #ffd700;
    background-image: linear-gradient(239deg, #ffd700 0%, #ffffff 100%);
    opacity: 0.2;
    filter: blur(70px);
    pointer-events: none;
  }
}
</style>
