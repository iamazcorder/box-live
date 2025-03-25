<template>
  <div
    ref="chartRef"
    class="chart-container"
  ></div>
</template>

<script lang="ts" setup>
import type { EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

interface Props {
  option: EChartsOption;
  width?: string;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '100%',
});

const chartRef = ref<HTMLDivElement | null>(null);
let myChart: echarts.ECharts | null = null;

// 初始化 ECharts
const initChart = () => {
  if (chartRef.value) {
    myChart = echarts.init(chartRef.value);
    myChart.setOption(props.option);
  }
};

// 监听窗口变化，自适应尺寸
const handleResize = () => {
  if (myChart) {
    myChart.resize();
  }
};

onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

// 监听 option 变化，更新图表
watch(
  () => props.option,
  (newOption) => {
    if (myChart) {
      myChart.setOption(newOption);
    }
  },
  { deep: true }
);

onBeforeUnmount(() => {
  if (myChart) {
    myChart.dispose();
  }
  window.removeEventListener('resize', handleResize);
});
</script>

<style lang="scss" scoped>
.chart-container {
  width: v-bind(width);
  height: v-bind(height);
}
</style>
