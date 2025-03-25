<template>
  <div
    v-if="isVisible"
    class="overlay"
    @click="handleOverlayClick"
  >
    <div
      class="modal"
      @click.stop
    >
      <!-- 标题和关闭按钮 -->
      <div class="modal-header">
        <span class="modal-title">直播分类</span>
        <button
          class="close-btn"
          @click="close"
        >
          ×
        </button>
      </div>
      <div class="modal-body">
        <div class="parent-wrap">
          <div
            v-for="item in appStore.areaList"
            class="parent-item"
            :class="`${
              curParentCategory?.id === item.id ? 'parent-item-active' : ''
            }`"
            @click="curParentCategory = item"
          >
            {{ item.name }}
          </div>
        </div>
        <!-- 搜索栏 -->
        <div class="search-bar">
          <input
            type="text"
            v-model="searchQuery"
            @keyup.enter="performSearch"
            size="20"
          />
          <div class="input-placeholder">
            <span>输入拼音首字母或全称，快速搜索</span>
          </div>
          <div
            class="ico search"
            @click="performSearch"
          ></div>
        </div>
        <div class="child-wrap">
          <div class="child-wrap-wraper">
            <div
              v-for="item in curParentCategory?.children"
              class="child-item"
              :class="`${
                curChildCategory?.id === item?.id ? 'child-item-active' : ''
              }`"
              @click="handleCategorySelect(item)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app';
import { onMounted, ref, watch } from 'vue';

const appStore = useAppStore();
const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
});

const curParentCategory = ref();
const curChildCategory = ref();
// 搜索内容
const searchQuery = ref('');

watch(
  () => appStore.areaList?.length,
  () => {
    updateCurParentId();
  }
);

onMounted(() => {
  updateCurParentId();
});

const updateCurParentId = () => {
  if (appStore.areaList?.length > 0) {
    curParentCategory.value = appStore.areaList?.[0];
  }
};

const emit = defineEmits(['update:isVisible']); // 用于控制弹窗的显示/隐藏

// 当 isVisible 改变时，更新父组件状态
watch(
  () => props.isVisible,
  (newVal) => {
    if (!newVal) {
      emit('update:isVisible', {
        showModal: false,
        curParentCategory: curParentCategory.value,
        curChildCategory: curChildCategory.value,
      });
    }
  }
);

// 关闭弹窗的方法
const close = () => {
  emit('update:isVisible', {
    showModal: false,
    curParentCategory: curParentCategory.value,
    curChildCategory: curChildCategory.value,
  });
};

// 点击遮罩层关闭弹窗
const handleOverlayClick = () => {
  close();
};

// 搜索功能
const performSearch = async () => {
  console.log('搜索内容：', searchQuery.value);
  // if (route.params.id && searchQuery.value.trim()) {
  //     const res = await searchUserFollowing({
  //         userId: route.params.id,
  //         keyword: searchQuery.value.trim(),
  //     });
  //     if (res.code === 200) {
  //         followings.value = res.data;  // 更新关注列表为搜索结果
  //     } else {
  //         // 处理搜索失败的情况
  //         followings.value = [];
  //         window.$message.error('搜索失败，请重试');
  //     }
  // } else {
  //     // 如果搜索框为空，重新加载全部关注列表
  //     requestFollowingList(route.params.id);
  // }
};

const handleCategorySelect = (value) => {
  curChildCategory.value = value;
  close();
};
</script>

<style lang="scss" scoped>
/* 遮罩层 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* 半透明黑色遮罩 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* 弹窗 */
.modal {
  position: relative;
  background-color: white;
  border-radius: 8px;
  width: 400px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 标题和关闭按钮 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  margin-bottom: 10px;
}

.modal-title {
  font-weight: bold;
  /* color: #ffd700; */
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #aaa;

  &:hover {
    color: #333;
  }
}

/* 弹窗内容区域 */
.modal-body {
  padding: 10px 0;

  .parent-wrap {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;

    .parent-item {
      padding: 0px 6px;
      font-size: 12px;
      line-height: 1;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      &-active {
        color: #ffd700;
      }

      &:hover {
        color: #ffd700;
      }
    }
  }

  .search-bar {
    position: relative;
    display: flex;
    align-items: center;
    width: 95%;
    height: 34px;
    border: 1px solid #dcdcdc;
    border-radius: 4px;
    padding: 0 10px;
    margin-bottom: 15px;

    &:focus-within {
      border-color: #ffd700;
    }

    input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 14px;
    }

    .input-placeholder {
      pointer-events: none;
      position: absolute;
      left: 12px;
      top: 0;
      bottom: 0;
      overflow: hidden;
      color: rgba(194, 194, 194, 1);
      white-space: nowrap;
      display: flex;
      align-items: center;
      font-size: 14px;

      span {
        width: 100%;
        display: inline-block;
      }
    }

    .ico.search {
      width: 20px;
      height: 20px;
      background: url('@/assets/img/search.png') no-repeat center center;
      background-size: contain;
      cursor: pointer;
    }
  }

  .child-wrap {
    display: flex;
    flex-wrap: wrap;
    width: 420px;
    position: relative;
    overflow-y: hidden;
    margin-left: -6px;
    height: 168px;

    &-wraper {
      width: 2100px;
      transform: translateX(0px);
      overflow-y: hidden;
      box-sizing: border-box;
    }

    .child-item {
      border-radius: 12px;
      height: 22px;
      display: inline-block;
      font-size: 12px;
      line-height: 1;
      margin: 3px 6px;
      padding: 4px 12px;
      cursor: pointer;
      border: 1px solid #e5e7eb;
      box-sizing: border-box;

      &:hover {
        color: #ffd700;
        border: 1px solid #ffd700;
      }

      &-active {
        color: #ffd700;
        border: 1px solid #ffd700;
      }
    }
  }
}
</style>
