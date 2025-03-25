<template>
  <div class="title">直播收益</div>

  <!-- 收益记录 -->
  <div class="content-container">
    <div class="subtitle">收益记录</div>
    <table class="custom-table">
      <thead>
        <tr>
          <th>送礼时间</th>
          <th>礼物名称</th>
          <th>价值 (元)</th>
          <th>送礼人</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(record, index) in giftRecords"
          :key="index"
        >
          <td>{{ record.time }}</td>
          <td>{{ record.giftName }}</td>
          <td>{{ record.value }}</td>
          <td>{{ record.sender }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- 提现记录 -->
  <div class="content-container">
    <div class="subtitle">提现记录</div>
    <table class="custom-table">
      <thead>
        <tr>
          <th>提现时间</th>
          <th>提现金额 (元)</th>
          <th>提现状态</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(record, index) in withdrawRecords"
          :key="index"
        >
          <td>{{ record.time }}</td>
          <td>{{ record.value }}</td>
          <td>{{ record.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 收益提现 -->
  <div class="content-container">
    <div class="subtitle">收益提现</div>
    <div class="withdraw-container">
      <div class="balance-info">
        <span>当前收益：</span>
        <strong class="balance">{{ totalEarnings }} 元</strong>
      </div>
      <button
        class="withdraw-btn"
        :disabled="totalEarnings < 10"
        @click="handleWithdraw"
      >
        提现
      </button>
      <p
        v-if="totalEarnings < 10"
        class="withdraw-tip"
      >
        满 10 元可提现
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 模拟送礼记录数据
const giftRecords = ref([
  { time: '03-02 16:37', giftName: '小花花', value: 1, sender: 'zxyy' },
  { time: '03-02 16:37', giftName: '草莓蛋糕', value: 1, sender: 'zxyy' },
  { time: '03-02 16:37', giftName: '心愿水晶球', value: 1, sender: 'zxyy' },
  {
    time: '02-08 16:46',
    giftName: '棒棒糖',
    value: 100,
    sender: 'OwO不吃香菜',
  },
  {
    time: '02-08 16:46',
    giftName: '心愿水晶球',
    value: 500,
    sender: '杰克小兔',
  },
  { time: '02-06 15:11', giftName: '爱心雨', value: 5, sender: '为什么叫QQ' },
]);

const withdrawRecords = ref([
  { time: '03-02 16:37', value: 1, status: '提现中' },
  { time: '03-02 16:37', value: 1, status: '提现成功' },
  { time: '03-02 16:37', value: 1, status: '提现成功' },
  { time: '02-08 16:46', value: 100, status: '提现成功' },
  { time: '02-08 16:46', value: 500, status: '提现失败' },
  { time: '02-06 15:11', value: 5, status: '提现成功' },
]);

// 计算总收益
const totalEarnings = ref(
  giftRecords.value.reduce((sum, record) => sum + record.value, 0)
);

// 提现逻辑
const handleWithdraw = () => {
  if (totalEarnings.value >= 10) {
    alert('提现成功！');
    totalEarnings.value = 0; // 假设提现成功后余额清零
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
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 20px;
  min-height: 300px;
}

.subtitle {
  font-size: 18px;
  margin-bottom: 16px;
  color: #18191c;
}

/* 自定义表格样式 */
.custom-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
  text-align: left;
  font-size: 14px;
}

.custom-table thead {
  background-color: #f6f7f8;
}

.custom-table th,
.custom-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e3e8ec;
}

.custom-table tbody tr:hover {
  background-color: #f1f2f3;
}

/* 提现部分 */
.withdraw-container {
  margin-top: 20px;
  display: flex;
  /* align-items: center; */
  justify-content: center;
}

.balance-info {
  font-size: 18px;
  margin-bottom: 10px;
}

.balance {
  font-size: 22px;
  color: #f69;
}

.withdraw-btn {
  background-color: #f69;
  color: #fff;
  border: none;
  width: 60px;
  height: 30px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 6px;
  transition: 0.3s;
  margin-left: 10px;
}

.withdraw-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.withdraw-tip {
  color: #888;
  font-size: 14px;
  margin-top: 10px;
}
</style>
