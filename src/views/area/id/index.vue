<template>
  <div
    class="area-wrap"
    ref="topRef"
    :style="{ height: height + 'px' }"
  >
    <div class="tag-wrap">
      <div
        v-for="tag in tagList"
        key="tag"
        :class="`tag ${curTag === tag.id ? 'active' : ''}`"
        @click="curTag = tag.id"
      >
        {{ tag.name }}
      </div>
    </div>
    <div class="tabs">
      <div
        class="tabs-item"
        :class="curTab === 'live' ? 'tabs-item-active' : ''"
        @click="curTab = 'live'"
      >
        直播
      </div>
      <div
        class="tabs-item"
        :class="curTab === 'video' ? 'tabs-item-active' : ''"
        @click="curTab = 'video'"
      >
        视频
      </div>
    </div>
    <div
      class="live-list"
      v-if="height > 0 && curTab === 'live'"
    >
      <LiveRoomCard
        v-for="(item, index) in liveRoomList"
        :key="index"
        :liveRoomData="item"
        :isFollow="checkIsFollow(item.users?.[0]?.id)"
      />
    </div>
    <!-- <LongList v-if="height > 0 && curTab === 'live'" ref="longListRef" class="live-list" @get-list-data="getLiveList"
      :rootMargin="{
        top: 0,
        bottom: 100,
        left: 0,
        right: 0,
      }" :status="status">
      <LiveRoomCard v-for="(item, index) in liveRoomList" :key="index" :liveRoomData="item"
        :isFollow="checkIsFollow(item.users?.[0]?.id)" />
    </LongList> -->
    <div
      class="video-list"
      v-if="height > 0 && curTab === 'video'"
    >
      <VideoCard
        v-for="(item, index) in videoList"
        :key="index"
        :video="item"
        class="video-card-wrap"
        :isEdit="false"
        :isMy="false"
      />
    </div>
    <div
      class="empty-wrap"
      v-if="
        (curTab === 'live' && liveRoomList.length === 0) ||
        (curTab === 'video' && videoList.length === 0)
      "
    >
      <div class="ico empty-data"></div>
      这里没有数据哦～
    </div>
    <!-- <LongList v-if="height > 0 && curTab === 'video'" ref="longListRef" class="video-list" @get-list-data="getVideoList"
      :rootMargin="{
        top: 0,
        bottom: 100,
        left: 0,
        right: 0,
      }" :status="status">
      <VideoCard v-for="(item, index) in videoList" :key="index" :video="item" class="video-card-wrap" :isEdit="false" />
    </LongList> -->
  </div>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { fetchCategoryList } from '@/api/categories';
import { fetchAllLiveRooms, fetchUserVideos } from '@/api/liveRoom';
import { fetchUserFollowingList } from '@/api/user';
import LiveRoomCard from '@/components/LiveRoomCard/index.vue';
import LongList from '@/components/LongList/index.vue';
import VideoCard from '@/components/VideoCard/index.vue';
import { ICategory } from '@/interface';
import router, { routerName } from '@/router';
import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import { ILiveRoom } from '@/types/ILiveRoom';

const appStore = useAppStore();
const userStore = useUserStore();

const liveRoomList = ref<ILiveRoom[]>([]);
const videoList = ref<ILiveRoom[]>([]);
const tagList = ref<any[]>([]);
const curTag = ref(0);
const route = useRoute();
const status = ref<'loading' | 'nonedata' | 'allLoaded' | 'normal'>('loading');

const longListRef = ref<InstanceType<typeof LongList>>();
const topRef = ref<HTMLDivElement>();
const height = ref(-1);
const loading = ref(false);
const hasMore = ref(true);
const pageParams = reactive({
  nowPage: 0,
  pageSize: 50,
});
const curTab = ref('live');
const followings = ref<any[]>([]);

watch(
  () => route.query.parentAreaId,
  (newVal) => {
    if (!newVal) return;
    liveRoomList.value = [];
    videoList.value = [];
    pageParams.nowPage = 0;
    if (curTab.value === 'live') {
      getLiveList();
    } else {
      getVideoList();
    }
  }
);

watch(
  () => curTab.value,
  () => {
    if (curTab.value === 'live') {
      getLiveList();
    } else {
      getVideoList();
    }
  }
);

watch(
  () => curTag.value,
  () => {
    liveRoomList.value = [];
    videoList.value = [];
    pageParams.nowPage = 0;
    if (curTab.value === 'live') {
      getLiveList();
    } else {
      getVideoList();
    }
  }
);
// watch(
//   () => [route.params.id, route.query.child], // 监听 id 和 query.child
//   ([newId, newChild]) => {
//     if (!newId) return;
//     console.log("路由参数更新:", newId, newChild);
//     liveRoomList.value = [];
//     pageParams.nowPage = 0;
//     getData();
//   },
//   { immediate: true }
// );

onMounted(async () => {
  if (userStore?.userInfo?.id) {
    await requestFollowingList(userStore?.userInfo?.id);
  }
});

watch(
  () => userStore?.userInfo?.id,
  async () => {
    if (userStore?.userInfo?.id) {
      requestFollowingList(userStore?.userInfo?.id);
    }
  }
);

function handleStatus() {
  if (loading.value) {
    status.value = 'loading';
  } else if (hasMore.value) {
    status.value = 'normal';
  } else {
    status.value = 'allLoaded';
  }
  if (!liveRoomList.value?.length) {
    status.value = 'nonedata';
  }
}

function goRoom(item: ILiveRoom) {
  if (!item.live) {
    window.$message.info('该直播间没在直播~');
    return;
  }
  const url = router.resolve({
    name: routerName.pull,
    params: { roomId: item.id },
  });
  openToTarget(url.href);
}

onMounted(() => {
  if (topRef.value) {
    height.value =
      document.documentElement.clientHeight -
      topRef.value.getBoundingClientRect().top;
  }
  if (curTab.value === 'live') {
    getLiveList();
  } else {
    getVideoList();
  }
});

function getListData() {
  if (!hasMore.value) return;
  if (curTab.value === 'live') {
    getLiveList();
  } else {
    getVideoList();
  }
}

async function getAreaList() {
  const res = await fetchCategoryList({});
  if (res.code === 200) {
    const list: ICategory[] = res.data;
    const areaTagsMap = {};
    res.data.forEach((item) => {
      areaTagsMap[item.id] = item.children;
    });
    appStore.areaList = list;
    appStore.areaTagsMap = areaTagsMap;
  }
}

const getLiveList = async () => {
  try {
    if (loading.value) return;
    loading.value = true;
    status.value = 'loading';
    pageParams.nowPage += 1;
    // 获取每个区域下的tag
    if (!appStore.areaTagsMap) {
      await getAreaList();
    }
    // 获取当前的区域 Tag 列表，并在开头插入 "全部"
    const areaTags =
      appStore.areaTagsMap[Number(route.query.parentAreaId)] || [];
    tagList.value = [{ name: '全部', id: 0 }, ...areaTags];
    if (route.query.areaId) {
      const curAreaItem = appStore.areaTagsMap[
        Number(route.query.parentAreaId)
      ]?.find((item) => item.id === Number(route.query.areaId));
      curTag.value = curAreaItem?.id;
    }

    if (route.query.parentAreaId) {
      const res = await fetchAllLiveRooms({
        parent_category_id: route.query.parentAreaId,
        child_category_id: route.query.areaId || curTag.value || undefined,
      });
      if (res.code === 200) {
        liveRoomList.value = res.data?.rows;
        hasMore.value = res.data.hasMore;
      }
    }
  } catch (error) {
    pageParams.nowPage -= 1;
    console.log(error);
  }
  loading.value = false;
  status.value = 'normal';
  handleStatus();
};

const getVideoList = async () => {
  try {
    if (loading.value) return;
    loading.value = true;
    status.value = 'loading';
    pageParams.nowPage += 1;

    if (route.query.parentAreaId) {
      const res = await fetchUserVideos({
        parent_category_id: route.query.parentAreaId,
        child_category_id: route.query.areaId || curTag.value || undefined,
      });
      if (res.code === 200) {
        videoList.value = res.data?.rows;
        hasMore.value = res.data.hasMore;
      }
    }
  } catch (error) {
    pageParams.nowPage -= 1;
    console.log(error);
  }
  loading.value = false;
  status.value = 'normal';
  handleStatus();
};

// 请求关注列表
const requestFollowingList = async (id) => {
  const res = await fetchUserFollowingList({
    userId: id,
  });
  if (res.code === 200) {
    followings.value = res.data;
  }
};

// 判断是否关注
const checkIsFollow = (userId) => {
  return followings.value.some((following: any) => following.id === userId);
};
</script>

<style lang="scss" scoped>
.ico {
  width: 80px;
  height: 80px;
  opacity: 0.9;
  background-size: contain;
  background-repeat: no-repeat;

  &.empty-data {
    margin-bottom: 20px;
    background-image: url('@/assets/img/empty-data.png');
  }
}

.empty-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 150px;
  color: #575555;
}

.area-wrap {
  padding: 20px;

  .tag-wrap {
    box-sizing: border-box;
    /* width: 1450px; */
    /* padding: 0px 40px 0px 50px; */
    margin: 0 140px;

    .tag {
      display: inline-block;
      margin-right: 10px;
      margin-bottom: 10px;
      color: rgb(97, 102, 109);
      font-size: 12px;
      cursor: pointer;
      padding: 2px 10px;
      border-width: 1px;
      border-style: solid;
      border-color: rgba(153, 153, 153, 0.3);
      border-image: initial;
      border-radius: 10px;
    }

    .tag.active {
      background-color: gold;
      color: rgb(255, 255, 255);
      border-width: 1px;
      border-style: solid;
      border-color: gold;
      border-image: initial;
    }
  }

  .tabs {
    display: flex;
    margin: 10px 140px 0;

    &-item {
      font-size: 14px;
      cursor: pointer;
      padding-bottom: 3px;
      margin-right: 20px;
      display: flex;
      align-items: center;
      border-bottom: 2px solid transparent;
      color: #333;
      color: #2f3238;

      &-active {
        color: gold;
        border-bottom: 2px solid #23ade5;
        border-color: gold;
      }
    }
  }

  .title {
    font-size: 20px;
    font-weight: 500;
    padding-left: 50px;
  }

  .empty {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px 0;
  }

  .live-list {
    display: flex;
    align-content: flex-start;
    flex-wrap: wrap;
    margin: 0 120px;
  }

  .video-list {
    display: flex;
    align-content: flex-start;
    flex-wrap: wrap;
    margin: 0 125px;

    .video-card-wrap {
      margin: 15px 10px;
    }
  }

  .paging-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }
}
</style>
