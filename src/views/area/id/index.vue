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
        :class="`tag ${curTag === tag ? 'active' : ''}`"
        @click="curTag = tag"
      >
        {{ tag }}
      </div>
    </div>
    <LongList
      v-if="height > 0"
      ref="longListRef"
      class="list"
      @get-list-data="getListData"
      :rootMargin="{
        top: 0,
        bottom: 100,
        left: 0,
        right: 0,
      }"
      :status="status"
    >
      <div
        v-for="(item, index) in liveRoomList"
        :key="index"
        class="item"
        @click="goRoom(item)"
      >
        <div
          class="cover"
          v-lazy:background-image="item?.cover_img || item?.users?.[0]?.avatar"
        >
          <div
            v-if="item?.live"
            class="living-ico"
          >
            直播中
          </div>
          <div
            v-if="
              item?.cdn === SwitchEnum.yes ||
              [
                LiveRoomTypeEnum.tencent_css,
                LiveRoomTypeEnum.tencent_css_pk,
              ].includes(item.type!)
            "
            class="cdn-ico"
          >
            <div class="txt">CDN</div>
          </div>
          <div class="txt">{{ item?.users?.[0]?.username }}</div>
        </div>
        <div class="desc">{{ item?.name }}</div>
      </div>
    </LongList>
  </div>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { fetchLiveRoomList } from '@/api/area';
import LongList from '@/components/LongList/index.vue';
import { SwitchEnum } from '@/interface';
import router, { routerName } from '@/router';
import { ILiveRoom, LiveRoomTypeEnum } from '@/types/ILiveRoom';

const liveRoomList = ref<ILiveRoom[]>([]);
const tagList = ref([]);
const curTag = ref('全部');
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

watch(
  () => route.params.id,
  (newVal) => {
    if (!newVal) return;
    liveRoomList.value = [];
    pageParams.nowPage = 0;
    getData();
  }
);

const areaTagsMap = {
  1: [
    '全部',
    '剑网3',
    '暗区突围：无限',
    '剑网3缘起',
    '生死狙击2',
    '永劫无间',
    '吃鸡行动',
    '大话西游',
    '赛尔号',
    '最终幻想14',
    '炉石传说',
    '冒险岛',
    '龙之谷',
    '逆战',
    'DNF',
    '三角洲行动',
    'QQ飞车',
    'CS:GO',
    'APEX英雄',
    '穿越火线',
    '魔兽世界',
    '守望先锋',
    'DOTA2',
    '英雄联盟',
    '三国杀',
  ],
  2: [
    '全部',
    '欢乐斗地主',
    'QQ飞车手游',
    'CF手游',
    '元梦之星',
    '蛋仔派对',
    '第五人格',
    '原神',
    '和平精英',
    '王者荣耀',
    '阴阳师',
    '狼人杀',
    '决战！平安京',
    '碧蓝航线',
    '火影忍者手游',
    '鸣潮',
    '崩坏：星穹铁道崩坏3',
    '游戏王',
    '梦幻西游手游',
    '少女前线',
  ],
  3: [
    '全部',
    'NBA2K',
    '幻兽帕鲁',
    '黑神话：悟空',
    '怀旧游戏',
    '独立游戏',
    '主机游戏',
    '荒野大嫖客2',
    '饥荒',
    '战地风云',
    '使命召唤21',
    '塞尔达传说',
    '鬼泣5',
    '方舟',
    '糖豆人',
    '赛博朋克2077',
    '刺客信条',
    '生化危机',
    '我的世界',
  ],
  4: ['全部', '萌宅', '舞见', '颜值'],
  5: ['全部', '唱见电台', '聊天电台', '男声电台'],
  6: ['全部', '游戏赛事', '赛事综合'],
  7: ['全部', '找人玩', '交友', '点唱', '兴趣'],
  8: [
    '全部',
    '生活杂谈',
    '情感杂谈',
    '体育·运动',
    '手工绘画',
    '户外',
    '萌宠',
    '美食',
    '时尚',
    '电子榨菜',
    '沉浸体验',
  ],
};

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
  getData();
});

function getListData() {
  if (!hasMore.value) return;
  getData();
}

async function getData() {
  try {
    if (loading.value) return;
    loading.value = true;
    status.value = 'loading';
    pageParams.nowPage += 1;
    // 获取每个区域下的tag
    tagList.value = areaTagsMap[Number(route.params.id)];
    curTag.value = areaTagsMap[Number(route.params.id)]?.[0];
    const res = await fetchLiveRoomList({
      id: Number(route.params.id),
      live_room_is_show: SwitchEnum.yes,
      nowPage: pageParams.nowPage,
      pageSize: pageParams.pageSize,
    });
    if (res.code === 200) {
      // liveRoomList.value.push(...res.data.rows);
      hasMore.value = res.data.hasMore;
    }
  } catch (error) {
    pageParams.nowPage -= 1;
    console.log(error);
  }
  loading.value = false;
  status.value = 'normal';
  handleStatus();
}
</script>

<style lang="scss" scoped>
.area-wrap {
  padding: 0 20px;

  .tag-wrap {
    box-sizing: border-box;
    width: 1450px;
    padding: 0px 40px 0px 50px;
    margin-bottom: 20px;

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

  .list {
    display: flex;
    align-content: flex-start;
    flex-wrap: wrap;
    justify-content: space-between;

    .item {
      display: inline-block;
      margin-right: 25px;
      margin-bottom: 12px;
      width: 300px;
      cursor: pointer;

      .cover {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 150px;
        border-radius: 8px;

        @extend %containBg;

        .living-ico {
          position: absolute;
          top: 0px;
          left: 0px;
          z-index: 10;
          padding: 0 10px;
          height: 20px;
          border-radius: 8px 0 10px;
          background-color: $theme-color-gold;
          color: white;
          text-align: center;
          font-size: 12px;
          line-height: 20px;
        }

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

      .desc {
        margin-top: 4px;
        font-size: 14px;

        @extend %singleEllipsis;
      }
    }

    .null {
      width: 100%;
      text-align: center;
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
