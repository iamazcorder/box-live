<template>
  <div class="title">场次数据</div>
  <VerifyCard
    :audit_info="userStore.auditInfo"
    v-if="userStore.auditInfo?.status !== 1"
  />
  <div
    class="content-container"
    v-else
  >
    <table class="custom-table">
      <thead>
        <tr>
          <th>开播时间</th>
          <th>开播分区</th>
          <th>直播时长</th>
          <th>评论条数</th>
          <th>收益</th>
          <th>净增粉丝</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in sessionData"
          :key="index"
        >
          <td>{{ row.time }}</td>
          <td>{{ row.category }}</td>
          <!-- <td>{{ formatDuration(row.duration) }}</td> -->
          <td>{{ row.duration }}</td>
          <td>{{ row.danmuCount }}</td>
          <td>{{ row.income }}</td>
          <td>{{ row.newFans }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user';
import { ref } from 'vue';

const userStore = useUserStore();

// 模拟直播场次数据
const sessionData = ref([
  {
    time: 'XXXX',
    category: 'XXXX',
    duration: 'XXXX',
    danmuCount: 'XXXX',
    income: 'XXXX',
    newFans: 'XXXX',
  },
  {
    time: 'XXXX',
    category: 'XXXX',
    duration: 'XXXX',
    danmuCount: 'XXXX',
    income: 'XXXX',
    newFans: 'XXXX',
  },
  // {
  //   time: '03-02 16:37~16:37',
  //   category: '自习室',
  //   duration: 10000,
  //   danmuCount: 120,
  //   income: 70,
  //   newFans: 4,
  // },
  // {
  //   time: '02-08 16:46~16:46',
  //   category: '主机游戏',
  //   duration: 3000,
  //   danmuCount: 64,
  //   income: 34,
  //   newFans: 6,
  // },
  // {
  //   time: '02-08 16:46~16:46',
  //   category: '无畏契约',
  //   duration: 1000,
  //   danmuCount: 37,
  //   income: 56,
  //   newFans: 2,
  // },
  // {
  //   time: '02-08 16:46~16:46',
  //   category: '英雄联盟',
  //   duration: 6000,
  //   danmuCount: 70,
  //   income: 12,
  //   newFans: 0,
  // },
  // {
  //   time: '02-06 15:11~15:11',
  //   category: '生活杂谈',
  //   duration: 7500,
  //   danmuCount: 90,
  //   income: 58,
  //   newFans: 5,
  // },
]);

// 处理查看明细点击事件
const viewDetail = (row: any) => {
  alert(`查看明细：\n开播时间：${row.time}\n开播分区：${row.category}`);
};
// 格式化直播时长
const formatDuration = (seconds: number) => {
  if (seconds < 60) {
    return `${seconds} 秒`;
  } else if (seconds < 3600) {
    return `${Math.round(seconds / 60)} 分钟`;
  } else {
    return `${Math.round(seconds / 3600)} 小时`;
  }
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
  border-radius: 4px;
  margin-bottom: 20px;
  overflow-x: auto;
  min-height: 630px;
}

/* 自定义表格样式 */
.custom-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  text-align: left;
}

.custom-table thead {
  background-color: #f6f7f8;
}

.custom-table th {
  font-weight: 400;
  color: #333;
}

.custom-table th,
.custom-table td {
  padding: 15px 16px;
  border-bottom: 1px solid #e3e8ec;
  white-space: nowrap;
}

.custom-table td {
  color: rgba(0, 0, 0, 0.65);
  font-size: 12px;
}

.custom-table tbody tr:hover {
  background-color: #f1f2f3;
}

/* 右侧按钮 */
.detail-btn {
  color: #007bff;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.detail-btn:hover {
  text-decoration: underline;
}
</style>
