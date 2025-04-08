<template>
  <div class="title">数据总览</div>
  <VerifyCard
    :audit_info="userStore.auditInfo"
    v-if="userStore.auditInfo?.status !== 1"
  />
  <div
    class="content-container"
    v-else
  >
    <div class="header">
      <div class="subtitle">核心数据</div>
      <div class="time-selector">
        <span
          class="selected-time"
          @click="toggleDropdown"
          >时间选择 | {{ selectedTime }}</span
        >
        <div
          v-if="dropdownVisible"
          class="dropdown"
        >
          <div
            v-for="option in timeOptions"
            :key="option"
            class="dropdown-item"
            :class="{ active: selectedTime === option }"
            @click="selectTime(option)"
          >
            {{ option }}
          </div>
        </div>
        <div
          class="ico downArrow"
          v-if="!dropdownVisible"
        ></div>
        <div
          class="ico upArrow"
          v-if="dropdownVisible"
        ></div>
      </div>
    </div>
    <!-- 主数据卡片 -->
    <div class="data-card-wrap">
      <div
        class="data-card"
        v-for="item in parentData"
        :key="item.key"
        :class="{ 'data-card-active': activeKey === item.key }"
        @click="handleCardClick(item.key)"
      >
        <div class="name">{{ item.name }}</div>
        <div class="value">
          <!-- <div class="num">{{ cardData[item.key] }}</div> -->
          <div class="num">XXXX</div>
          <div class="unit">{{ item.unit }}</div>
        </div>
      </div>
    </div>

    <div class="data-chart-wrap">
      <!-- 子Tab 切换 -->
      <div
        class="sub-tab-wrap"
        v-if="subTabs[activeKey]"
      >
        <div
          v-for="subTab in subTabs[activeKey]"
          :key="subTab.key"
          class="sub-tab"
          :class="{ 'sub-tab-active': activeSubKeys[activeKey] === subTab.key }"
          @click="handleSubTabClick(activeKey, subTab.key)"
        >
          {{ subTab.name }}
        </div>
      </div>

      <!-- 折线图 -->
      <LineChart
        :option="chartOptionRef"
        width="850px"
        height="400px"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import LineChart from '@/components/LineChart/index.vue';
import { useUserStore } from '@/store/user';
import type { EChartsOption } from 'echarts';
import { computed, ref, watchEffect } from 'vue';

const userStore = useUserStore();

const timeOptions = ['前7日', '前30日'];
const selectedTime = ref('前7日');
const dropdownVisible = ref(false);

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value;
};

const selectTime = (option) => {
  selectedTime.value = option;
  dropdownVisible.value = false;
};

// 主数据类别
const parentData = ref([
  { name: '收益', key: 'income', unit: '元' },
  { name: '开播时长', key: 'liveDuration', unit: '分钟' },
  { name: '观众人数', key: 'viewers', unit: '人' },
  { name: '净增粉丝', key: 'newFans', unit: '人' },
]);

// 子Tab 数据
const subTabs = ref({
  income: [
    { name: '直播收益', key: 'liveIncome' },
    { name: '送礼人数', key: 'giftCount' },
  ],
  liveDuration: [{ name: '开播时长', key: 'liveDuration' }],
  viewers: [
    { name: '观众人数', key: 'viewers' },
    { name: '平均观看时长', key: 'avgWatchTime' },
    { name: '弹幕人数', key: 'barrageUsers' },
    { name: '弹幕条数', key: 'barrageCount' },
  ],
  newFans: [
    { name: '净增粉丝', key: 'newFans' },
    { name: '总粉丝', key: 'totalFans' },
  ],
});

// 默认子Tab
const activeSubKeys = ref({
  income: 'liveIncome',
  liveDuration: 'liveDuration',
  viewers: 'viewers',
  newFans: 'newFans',
});

// 数据映射，每个 `card` 独立维护自己的 `subTab` 数据
const dataMap = ref({
  income: {
    subTabs: {
      liveIncome: {
        value: 2567,
        chartData: [1000, 1800, 2500, 2100, 2300, 2000, 2567],
      },
      giftCount: { value: 800, chartData: [200, 300, 500, 600, 700, 750, 800] },
    },
  },
  liveDuration: {
    subTabs: {
      liveDuration: { value: 32, chartData: [10, 15, 18, 22, 25, 28, 32] },
    },
  },
  viewers: {
    subTabs: {
      viewers: {
        value: 8723,
        chartData: [4000, 5000, 6000, 7000, 8000, 8500, 8723],
      },
      avgWatchTime: { value: 15, chartData: [5, 8, 10, 12, 14, 15, 15] },
      barrageUsers: {
        value: 3200,
        chartData: [1200, 1500, 2000, 2500, 2800, 3000, 3200],
      },
      barrageCount: {
        value: 12345,
        chartData: [8000, 9000, 10000, 11000, 12000, 12345, 12345],
      },
    },
  },
  newFans: {
    subTabs: {
      newFans: { value: 450, chartData: [100, 150, 200, 250, 300, 350, 450] },
      totalFans: {
        value: 10500,
        chartData: [8000, 8500, 9000, 9500, 10000, 10300, 10500],
      },
    },
  },
});

// **计算 `data-card` 显示的数值**
const cardData = computed(() => {
  const result: any = {};
  for (const key in dataMap.value) {
    const subKey = subTabs.value[key]?.[0].key;
    const maxData = Math.max(...dataMap.value[key].subTabs[subKey].chartData);
    result[key] = maxData;
  }
  return result;
});

// 选中的 `card`
const activeKey = ref('income');

// 折线图配置
const chartOptionRef = ref<EChartsOption>({
  color: ['#f69'],
  tooltip: { trigger: 'axis' },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  yAxis: { type: 'value' },
  series: [
    {
      name: '直播收益',
      type: 'line',
      data: dataMap.value['income'].subTabs['liveIncome'].chartData,
      lineStyle: { color: '#f69' }, // 修改折线颜色
      itemStyle: { color: '#f69' }, // 修改数据点颜色
      emphasis: { itemStyle: { color: '#f69' } }, // 鼠标悬停时的颜色
    },
  ],
});

// 监听 `activeSubKeys` 变化，动态更新折线图
watchEffect(() => {
  const subKey = activeSubKeys.value[activeKey.value];
  chartOptionRef.value = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: subTabs.value[activeKey.value]?.find((d) => d.key === subKey)
          ?.name,
        type: 'line',
        data: dataMap.value[activeKey.value].subTabs[subKey].chartData,
        lineStyle: { color: '#f69' }, // 修改折线颜色
        itemStyle: { color: '#f69' }, // 修改数据点颜色
        emphasis: { itemStyle: { color: '#f69' } }, // 鼠标悬停时的颜色
      },
    ],
  };
});

// 处理 `card` 点击事件
const handleCardClick = (key: string) => {
  activeKey.value = key;
};

// 处理 `subTab` 点击事件
const handleSubTabClick = (key: string, subKey: string) => {
  activeSubKeys.value[key] = subKey;
};
</script>
<style lang="scss" scoped>
.title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.content-container {
  background: #fff;
  border: 1px solid #e3e8ec;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 20px;
  min-height: 620px;
}

.ico {
  width: 15px;
  height: 15px;
  opacity: 0.9;

  &.upArrow {
    @include setBackground('@/assets/img/upArrow.png');
  }

  &.downArrow {
    @include setBackground('@/assets/img/downArrow.png');
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .subtitle {
    font-size: 18px;
    color: #18191c;
  }

  .time-selector {
    position: relative;
    cursor: pointer;
    font-size: 12px;
    color: #61666d;
    display: flex;
  }

  .dropdown {
    position: absolute;
    top: 20px;
    right: 0;
    background: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    overflow: hidden;
  }

  .dropdown-item {
    padding: 10px;
    font-size: 12px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .dropdown-item:hover,
  .dropdown-item.active {
    background: #f0f0f0;
    color: #f69;
  }
}

.data-card-wrap {
  display: flex;
  justify-content: flex-start;
  margin-top: 24px;
}

.data-card {
  min-width: 160px;
  height: 60px;
  border-radius: 12px;
  background-color: #f6f7f8;
  padding: 12px 20px;
  cursor: pointer;
  margin-right: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &.data-card-active {
    background-color: #f69;
    color: #fff;

    .name {
      color: #fff;
    }

    .value {
      .num {
        color: #fff;
      }

      .unit {
        color: #fff;
      }
    }
  }

  .name {
    color: #61666d;
    font-size: 14px;
  }

  .value {
    margin-top: 10px;
    display: flex;
    align-items: flex-end;

    .num {
      font-size: 20px;
      color: #18191c;
    }

    .unit {
      font-size: 14px;
      color: #999;
      margin-left: 5px;
    }
  }
}

.data-chart-wrap {
  margin-top: 24px;
  /* padding-right: 24px; */
  border: 1px solid #f1f2f3;
  border-radius: 8px;
  font-size: 12px;
}

.sub-tab-wrap {
  display: flex;
  padding: 24px 0 24px 24px;
}

.sub-tab {
  margin-right: 24px;
  cursor: pointer;
  color: #646c7a;

  &.sub-tab-active {
    /* background-color: #00aeec; */
    color: #f69;
    position: relative;

    &::before {
      position: absolute;
      width: 16px;
      height: 3px;
      border-radius: 100px;
      content: '';
      background: #f69;
      bottom: -4px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
