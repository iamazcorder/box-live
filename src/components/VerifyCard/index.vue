<template>
  <div class="verify-card">
    <div
      class="not-host-text"
      v-if="props.audit_info?.status === 0"
    >
      直播间开通还在审核中哟～
    </div>
    <div
      class="not-host-text"
      v-if="props.audit_info?.status === 2"
    >
      直播间开通被拒绝了，请重新提交开通审核～
    </div>
    <div
      class="not-host-text"
      v-if="props.audit_info?.status === undefined"
    >
      你还没有开通直播间啦~
    </div>
    <div class="ico empty"></div>
    <button
      class="open-live-btn"
      @click="showIdNumberDialog"
      v-if="props.audit_info?.status !== 0"
    >
      立即开通直播间 >
    </button>
    <!-- 身份证号弹窗 -->
    <el-dialog
      v-model="showIdNumberModal"
      title="开通直播间"
      width="30%"
      center
    >
      <el-form>
        <el-form-item label="姓名">
          <el-input
            v-model="real_name"
            placeholder="请输入真实姓名"
          />
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input
            v-model="id_number"
            placeholder="请输入18位身份证号"
            maxlength="18"
            show-word-limit
            @input="handleIdNumberInput"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            @click="showIdNumberModal = false"
            class="cancel-btn"
            >取消</el-button
          >
          <el-button
            type="primary"
            @click="createAudit"
          >
            提交审核
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { createLiveAnchorAudit } from '@/api/user';
import { useUserStore } from '@/store/user';
import { ref } from 'vue';

const props = withDefaults(defineProps<{ audit_info: any }>(), {
  audit_info: {},
});

const userStore = useUserStore();

// 身份证号弹窗
const showIdNumberModal = ref(false);
// 身份证号
const id_number = ref('');
// 真实姓名
const real_name = ref('');

// const audit_info = ref();

// onMounted(() => {
//   getAudit();
// });

// watch(
//   () => userStore.userInfo?.id,
//   () => {
//     getAudit();
//   }
// );
// 身份证号输入处理
const handleIdNumberInput = (value: string) => {
  // 只保留数字
  id_number.value = value.replace(/[^\d]/g, '');
};

// 显示开通直播间弹窗
const showIdNumberDialog = () => {
  showIdNumberModal.value = true;
};

const createAudit = async () => {
  if (userStore.userInfo?.id && id_number && real_name) {
    const res = await createLiveAnchorAudit({
      user_id: userStore.userInfo?.id,
      id_number: id_number.value,
      real_name: real_name.value,
    });
    if (res && res.code === 200) {
      window.$message.success('开通直播间审核提交成功，请耐心等候～');
      showIdNumberModal.value = false;
    } else {
      window.$message.error('开通失败，请稍后重试～');
    }
  }
};
</script>

<style lang="scss" scoped>
.verify-card {
  background: #fff;
  border: 1px solid #e3e8ec;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* padding: 30px; */
  height: 400px;
  color: #666;
  flex-direction: column;

  .not-host-text {
    margin-bottom: 20px;
  }

  .open-live-btn {
    width: 185px;
    height: 54px;
    border-radius: 12px;
    /* margin-top: 34px; */
    /* line-height: 54px; */
    font-size: 18px;
    display: inline-block;
    vertical-align: middle;
    background-color: #ffd700;
    color: #fff;
    cursor: pointer;
    transition: all 0.15s;
  }

  .ico {
    width: 18px;
    height: 18px;
    opacity: 0.9;
    background-size: contain;
    background-repeat: no-repeat;
    &.empty {
      width: 80px;
      height: 80px;
      margin-bottom: 20px;
      background-image: url('@/assets/img/empty-data.png');
    }
  }

  input,
  select {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    margin-right: 10px;

    &:focus {
      border-color: #ffd700;
      outline: none;
    }
  }

  .cancel-btn {
    background-color: #ccc;
    &:hover {
      background-color: #e7e7e7;
    }
  }

  button {
    padding: 7px 20px;
    font-size: 14px;
    background: #ffd700;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background: #fbe043;
    }
  }
}
</style>
