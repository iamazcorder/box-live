<template>
  <div class="center-search__container">
    <div class="center-search__bar">
      <form
        id="nav-searchform"
        class="nav-search-form"
        :class="{ 'is-focus': isFocused, 'is-actived': isActived }"
      >
        <div class="nav-search-content">
          <input
            v-model="query"
            class="nav-search-input"
            type="text"
            autocomplete="off"
            accesskey="s"
            maxlength="100"
            x-webkit-speech=""
            x-webkit-grammar="builtin:translate"
            placeholder="电吉他伴奏"
            title="电吉他伴奏"
            @focus="handleFocus"
            @blur="handleBlur"
            @mousedown="handleActive"
          />
          <!-- 清除按钮 -->
          <div
            class="nav-search-clean"
            v-if="query"
          >
            <svg
              @click="clearInput"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8 14.75C11.7279 14.75 14.75 11.7279 14.75 8C14.75 4.27208 11.7279 1.25 8 1.25C4.27208 1.25 1.25 4.27208 1.25 8C1.25 11.7279 4.27208 14.75 8 14.75ZM9.64999 5.64303C9.84525 5.44777 10.1618 5.44777 10.3571 5.64303C10.5524 5.83829 10.5524 6.15487 10.3571 6.35014L8.70718 8.00005L10.3571 9.64997C10.5524 9.84523 10.5524 10.1618 10.3571 10.3571C10.1618 10.5523 9.84525 10.5523 9.64999 10.3571L8.00007 8.70716L6.35016 10.3571C6.15489 10.5523 5.83831 10.5523 5.64305 10.3571C5.44779 10.1618 5.44779 9.84523 5.64305 9.64997L7.29296 8.00005L5.64305 6.35014C5.44779 6.15487 5.44779 5.83829 5.64305 5.64303C5.83831 5.44777 6.15489 5.44777 6.35016 5.64303L8.00007 7.29294L9.64999 5.64303Z"
                fill="#C9CCD0"
              ></path>
            </svg>
          </div>
        </div>
        <div
          class="nav-search-btn"
          @click="handleSearch"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M16.3451 15.2003C16.6377 15.4915 16.4752 15.772 16.1934 16.0632C16.15 16.1279 16.0958 16.1818 16.0525 16.2249C15.7707 16.473 15.4456 16.624 15.1854 16.3652L11.6848 12.8815C10.4709 13.8198 8.97529 14.3267 7.44714 14.3267C3.62134 14.3267 0.5 11.2314 0.5 7.41337C0.5 3.60616 3.6105 0.5 7.44714 0.5C11.2729 0.5 14.3943 3.59538 14.3943 7.41337C14.3943 8.98802 13.8524 10.5087 12.8661 11.7383L16.3451 15.2003ZM2.13647 7.4026C2.13647 10.3146 4.52083 12.6766 7.43624 12.6766C10.3517 12.6766 12.736 10.3146 12.736 7.4026C12.736 4.49058 10.3517 2.1286 7.43624 2.1286C4.50999 2.1286 2.13647 4.50136 2.13647 7.4026Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </form>
      <div
        class="search-panel"
        v-if="showSearchPanel"
        @mousedown.stop
      >
        <div class="history">
          <div class="header">
            <div class="title">搜索历史</div>
            <div
              class="clear"
              @click="clearHistory"
            >
              清空
            </div>
          </div>
          <div class="histories-wrap">
            <!-- 显示当前可见的历史记录 -->
            <div class="histories">
              <div
                class="history-item"
                v-for="(item, index) in visibleHistory"
                :key="index"
              >
                <div class="text">{{ item }}</div>
                <div
                  class="close"
                  @click="removeHistory(item)"
                >
                  <svg
                    viewBox="0 0 1024 1024"
                    width="14"
                    height="14"
                  >
                    <path
                      d="M512 64.303538c-247.25636 0-447.696462 200.440102-447.696462 447.696462
                0 247.254314 200.440102 447.696462 447.696462 447.696462s447.696462-200.440102
                447.696462-447.696462S759.25636 64.303538 512 64.303538zM710.491727 665.266709c12.491499
                12.491499 12.489452 32.729425-0.002047 45.220924-6.246261 6.246261-14.429641 9.370415-22.611997
                9.370415s-16.363689-3.121084-22.60995-9.366322L512 557.222971 358.730221 710.491727
                c-6.246261 6.246261-14.429641 9.366322-22.611997 9.366322s-16.365736-3.125177-22.611997-9.370415
                c-12.491499-12.491499-12.491499-32.729425 0-45.220924l153.268756-153.266709L313.50725 358.730221
                c-12.491499-12.491499-12.489452-32.729425 0.002047-45.220924s32.729425-12.495592 45.220924-0.004093
                l153.268756 153.268756 153.268756-153.268756c12.491499-12.491499 32.729425-12.487406 45.220924
                0.004093s12.493545 32.729425 0.002047 45.220924L557.225017 512 710.491727 665.266709z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
            <!-- 折叠/展开按钮 -->
            <div
              class="history-fold-wrap"
              v-if="searchHistory.length > maxVisible"
            >
              <div
                class="fold-text"
                @click="toggleFold"
              >
                {{ isFolded ? '展开更多' : '收起' }}
              </div>
              <svg
                class="fold-icon"
                :style="{
                  transform: isFolded ? 'rotate(0deg)' : 'rotate(180deg)',
                }"
                viewBox="0 0 12 12"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M5.46967 9.17678C5.76256 9.46967 6.23744 9.46967 6.53033 9.17678L10.7286 4.97855C10.9238 4.78329 10.9238 4.46671 10.7286 4.27145C10.5333 4.07618 10.2167 4.07618 10.0214 4.27145L6 8.29289L1.97855 4.27145C1.78329 4.07618 1.46671 4.07618 1.27145 4.27145C1.07618 4.46671 1.07618 4.78329 1.27145 4.97855L5.46967 9.17678Z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import router, { routerName } from '@/router';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

// 搜索框的绑定数据
const query = ref('');
const showSearchPanel = ref(false); // 控制搜索面板显示

// 是否hover和focus状态
const isHovered = ref(false);
const isFocused = ref(false);
const isActived = ref(false); // 添加 isActived 状态，用于标记是否激活

// 输入框事件
const handleFocus = () => {
  isFocused.value = true;
  showSearchPanel.value = true;
};
const handleBlur = () => {
  isFocused.value = false;
  isActived.value = false;
  // showSearchPanel.value = false;
};
// 输入框被点击（mousedown）时触发激活
const handleActive = () => {
  isActived.value = true; // 点击激活
  showSearchPanel.value = true;
};

// 清空输入框内容
const clearInput = () => {
  query.value = '';
  isActived.value = false; // 清除内容后取消激活状态
};

const handleSearch = () => {
  if (query) {
    router.push({
      name: routerName.search,
      params: { keyword: query.value },
    });
  }
};

// 搜索历史数据
const searchHistory = ref([
  'docker安装redis',
  '矩阵范数m1',
  '矩阵范数',
  '极大似然估计',
  '连续型随机变量',
  '矩阵范数',
  '极大似然估计',
  '连续型随机变量',
  '矩阵范数',
  '极大似然估计',
  '连续型随机变量',
]);

// 清空搜索历史
const clearHistory = () => {
  searchHistory.value = [];
};

// 删除特定的搜索历史项
const removeHistory = (item: string) => {
  searchHistory.value = searchHistory.value.filter((i) => i !== item);
};

// 最大显示的历史记录数
const maxVisible = 6;

// 折叠/展开状态
const isFolded = ref(true);
// 根据折叠状态计算显示的历史记录
const visibleHistory = computed(() =>
  isFolded.value
    ? searchHistory.value.slice(0, maxVisible)
    : searchHistory.value
);

// 切换折叠/展开状态
const toggleFold = () => {
  isFolded.value = !isFolded.value;
};
// 点击外部关闭搜索面板
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (
    !target.closest('.nav-search-content') &&
    !target.closest('.search-panel')
  ) {
    showSearchPanel.value = false;
  }
};

// 添加和移除全局事件监听器
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>
<style lang="scss" scoped>
.center-search-container {
  flex: 1 auto;
  height: 38px;
}

.center-search__bar {
  position: relative;
  margin: 0 auto;
  min-width: 350px;
  max-width: 500px;
}

#nav-searchform {
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 48px 0 4px;
  /* 内边距设置，右边48px，左边4px */
  position: relative;
  z-index: 1;
  overflow: hidden;
  /* 防止溢出 */
  line-height: 38px;
  /* 行高，保证输入框内容居中 */
  border: 1px solid #e3e5e7;
  /* 边框颜色 */
  height: 40px;
  /* 固定高度 */
  background-color: #f1f2f3;
  /* 背景颜色 */
  opacity: 0.9;
  /* 设置透明度 */
  transition: background-color 0.3s;
  /* 背景颜色变化的过渡效果 */
}

.center-search__bar.is-focus {
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

#nav-searchform.is-focus {
  border: 1px solid #e3e5e7;
  border-bottom: none;
  background: #ffffff;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

#nav-searchform.is-actived .nav-search-content,
#nav-searchform.is-focus .nav-search-content {
  background-color: #e3e5e7;
  /* transition: background-color 0.3s; */
  color: #18191c;
}

#nav-searchform:hover {
  background-color: #fff;
}

.nav-search-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 0 8px;
  width: 100%;
  height: 32px;
  border: 2px solid transparent;
  border-radius: 6px;
}

.nav-search-input {
  /* flex: 1; */
  /* 让输入框扩展填满可用空间 */
  overflow: hidden;
  /* 确保文本不会溢出 */
  padding-right: 8px;
  /* 右侧内边距，确保输入框文本和清除按钮之间有间距 */
  border: none;
  /* 去掉默认边框 */
  background-color: transparent;
  /* 背景透明 */
  box-shadow: none;
  /* 去除阴影 */
  color: #61666d;
  /* 设置文本颜色为全局文本颜色变量 */
  font-size: 15px;
  /* 字体大小 */
  line-height: 20px;
  /* 行高，确保文本居中 */
  outline: none;
  /* 去除输入框获得焦点时的外边框 */
  /* transition: background-color 0.3s; */
  /* 输入框焦点时的平滑过渡 */
}

.nav-search-input:focus {
  border-color: #4caf50;
  background-color: #e3e5e7;
}

.nav-search-clean {
  /* width: 16px;
    height: 16px;
    right: 10px;
    cursor: pointer;
    visibility: hidden; */
  cursor: pointer;
  position: absolute;
  right: 8px;
  top: 60%;
  transform: translateY(-50%);
}

.nav-search-btn {
  position: absolute;
  top: 4px;
  right: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  color: #18191c;
  /* 使用全局文本颜色变量 */
  line-height: 32px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f0f0f0;
    /* hover时的背景颜色 */
  }
}

.search-panel {
  position: absolute;
  width: 99.4%;
  max-height: 612px;
  overflow-y: auto;
  background: #ffffff;
  border: 1px solid #e3e5e7;
  border-top: none;
  border-radius: 0 0 8px 8px;
  padding: 13px 0 16px;
  -webkit-font-smoothing: antialiased;
}

.history {
  max-width: 100%;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;

    .title {
      height: 24px;
      font-size: 16px;
      line-height: 24px;
      font-family:
        PingFang SC,
        HarmonyOS_Medium,
        Helvetica Neue,
        Microsoft YaHei,
        sans-serif;
      font-weight: 500;
    }

    .clear {
      font-size: 12px;
      line-height: 15px;
      height: 15px;
      color: #9499a0;
      cursor: pointer;
    }
  }

  .histories-wrap {
    padding: 0 16px;
    overflow: hidden;
    transition: max-height 0.3s ease;

    .histories {
      display: flex;
      flex-wrap: wrap;
      margin-top: 12px;
      margin-right: -10px;
      margin-bottom: 4px;
    }
  }
}

.history-item {
  position: relative;
  box-sizing: border-box;
  height: 30px;
  padding: 7px 10px 8px;
  font-size: 12px;
  line-height: 15px;
  background: #f6f7f8;
  border-radius: 4px;
  margin-right: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}

.history-item .text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 96px;

  &:hover {
    color: #ffd700;
  }
}

.history-item .close {
  display: none;
  box-sizing: border-box;
  position: absolute;
  width: 16px;
  height: 16px;
  top: -6px;
  right: -6px;
  padding: 2px;
}

.history-item:hover .close {
  display: block;
  box-sizing: border-box;
  position: absolute;
  width: 16px;
  height: 16px;
  top: -6px;
  right: -6px;
  padding: 2px;

  svg {
    width: 14px;
    height: 14px;
    fill: #ccc;
  }
}

.history-item:hover {
  background-color: #f9f9f9;
}

.history-fold-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  margin: 0 auto 14px;
}

.fold-text {
  font-size: 12px;
  line-height: 15px;
  height: 15px;
  color: #9499a0;
  cursor: pointer;
}

.fold-icon {
  width: 12px;
  height: 12px;
  fill: #9499a0;
  cursor: pointer;
  transform: rotate(180deg);
  margin-left: 2px;
}
</style>
