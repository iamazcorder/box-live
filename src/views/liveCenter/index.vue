<template>
  <div class="user-info-page">
    <!-- 左侧导航 -->
    <aside class="sidebar">
      <div
        class="menu-group"
        v-for="(menu, index) in menus"
        :key="index"
      >
        <!-- 一级菜单 -->
        <div
          class="menu-title"
          :class="{ active: selectedMenu === index }"
          @click="toggleMenu(index, menu.key)"
        >
          <div style="display: flex; align-items: center">
            <div
              :class="[
                'ico',
                `${menu.key}`,
                selectedMenu === index ? `${menu.key}_active` : '',
              ]"
            ></div>
            <span>{{ menu.title }}</span>
          </div>
          <div
            class="arrow"
            :class="{ up: selectedMenu === index }"
          ></div>
        </div>
        <!-- 二级菜单 -->
        <ul
          ref="submenus"
          :key="index"
          class="submenu"
          :style="{
            maxHeight:
              selectedMenu === index ? submenuHeights[index] + 10 + 'px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease',
          }"
        >
          <li
            v-for="(item, idx) in menu.submenu"
            :key="idx"
            :class="{ selected: selectedSubmenu === `${index}-${idx}` }"
            @click="selectSubmenu(index, idx, menu.key, item.path)"
          >
            {{ item.title }}
          </li>
        </ul>
      </div>
    </aside>

    <!-- 主内容 -->
    <main class="content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 定义菜单数据类型
interface SubMenuItem {
  title: string;
  path: string;
}
interface MenuItem {
  title: string;
  key: string;
  submenu: SubMenuItem[];
}

// 定义菜单列表
const menus = ref<MenuItem[]>([
  {
    title: '用户中心',
    key: 'userCenter',
    submenu: [
      { title: '个人信息', path: 'myInfo' },
      { title: '个人收益', path: 'income' },
      { title: '观看历史', path: 'viewHistory' },
    ],
  },
  {
    title: '我的直播间',
    key: 'myRoom',
    submenu: [
      { title: '开播设置', path: 'startLive' },
      { title: '禁言设置', path: 'silentSetting' },
      { title: '屏蔽词设置', path: 'shieldKeywordSetting' },
    ],
  },
  {
    title: '直播数据',
    key: 'liveData',
    submenu: [
      { title: '数据总览', path: 'overview' },
      { title: '场次数据', path: 'record' },
    ],
  },
]);

// 当前选中的一级菜单索引
const selectedMenu = ref<number>(0); // 默认选中第一个菜单

// 当前选中的二级菜单（用 "一级菜单索引-二级菜单索引" 的形式存储）
const selectedSubmenu = ref<string>('0-0');

// 子菜单高度数组，用于动态设置 max-height
const submenuHeights = ref<number[]>([]);

// 引用所有子菜单的 DOM 元素
const submenus = ref<HTMLUListElement[]>([]);

// 计算子菜单的实际高度
const calculateSubmenuHeights = () => {
  submenuHeights.value = submenus.value.map(
    (submenu) => submenu.scrollHeight || 0
  );
};

// 在组件挂载后计算子菜单高度
onMounted(() => {
  nextTick(() => {
    calculateSubmenuHeights();
    updateSelectedMenuByRoute(); // 初始化时根据路由设置选中状态
  });
});

// 根据路由动态设置选中状态
const updateSelectedMenuByRoute = () => {
  const currentPath = route.path; // 当前路由路径
  menus.value.forEach((menu, menuIndex) => {
    menu.submenu.forEach((submenu, submenuIndex) => {
      const fullPath = `/liveCenter/${menu.key}/${submenu.path}`;
      if (currentPath === fullPath) {
        selectedMenu.value = menuIndex;
        selectedSubmenu.value = `${menuIndex}-${submenuIndex}`;
      }
    });
  });
};

// 切换一级菜单展开
const toggleMenu = (index: number, menuKey: string) => {
  if (selectedMenu.value !== index) {
    selectedMenu.value = index; // 展开新菜单
    selectedSubmenu.value = `${index}-0`; // 自动选中第一个二级菜单

    // 跳转到第一个二级菜单路由
    const firstSubmenu = menus.value[index].submenu[0];
    router.push({ path: `/liveCenter/${menuKey}/${firstSubmenu.path}` });
  }
};

// 选中二级菜单
const selectSubmenu = (
  menuIndex: number,
  submenuIndex: number,
  menuKey: string,
  submenuPath: string
) => {
  selectedSubmenu.value = `${menuIndex}-${submenuIndex}`;
  router.push({ path: `/liveCenter/${menuKey}/${submenuPath}` });
};

// 监听路由变化，根据路由动态更新选中状态
watch(
  () => route.path,
  () => {
    updateSelectedMenuByRoute();
  }
);
</script>

<style lang="scss" scoped>
/* 整体页面样式 */
.user-info-page {
  display: flex;
  background-color: #f5f6f9;
  min-height: 87vh;
  font-family: Arial, sans-serif;
  padding: 20px 130px;
  /* 为整个页面设置间距 */
}

.ico {
  /* margin: 0 auto; */
  width: 25px;
  height: 25px;
  opacity: 0.9;
  margin-right: 8px;

  @extend %containBg;

  &.userCenter {
    @include setBackground('@/assets/img/userCenter.png');
  }

  &.userCenter_active {
    @include setBackground('@/assets/img/userCenter_active.png');
  }

  &.myRoom {
    @include setBackground('@/assets/img/myRoom.png');
  }

  &.myRoom_active {
    @include setBackground('@/assets/img/myRoom_active.png');
  }

  &.liveData {
    @include setBackground('@/assets/img/liveData.png');
  }

  &.liveData_active {
    @include setBackground('@/assets/img/liveData_active.png');
  }
}

/* 左侧导航栏样式 */
.sidebar {
  width: 200px;
  background-color: #ffffff;
  border: 1px solid #e6e6e6;
  border-radius: 12px;
  /* 圆角边框 */
  padding: 20px 0;
  margin-right: 5px;
  /* 导航栏与主内容的间距 */
  position: relative;
  overflow-y: auto;

  .menu-group {
    margin-bottom: 10px;

    .menu-title {
      font-size: 14px;
      color: #333;
      padding: 10px 20px;
      cursor: pointer;
      /* border-radius: 5px; */
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: background-color 0.3s;
      border-bottom: 1px solid #e3e8ec;

      &.active {
        color: #ffd700;
        /* 选中文字颜色 */
      }

      &:hover {
        color: #ffd700;
      }

      .arrow {
        width: 12px;
        height: 12px;
        @include setBackground('@/assets/img/downArrow.png');
        /* 默认箭头向下 */

        &.up {
          @include setBackground('@/assets/img/upArrow.png');
          /* 展开时箭头向上 */
          transition: transform 0.3s;
        }
      }
    }

    .submenu {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        font-size: 12px;
        color: #666;
        padding: 10px 0 10px 50px;
        cursor: pointer;
        transition:
          background-color 0.2s,
          color 0.2s;
        border-radius: 5px;

        &.selected {
          color: #ffd700;
          /* 选中文字颜色 */
        }

        &:hover {
          color: #ffd700;
        }
      }
    }
  }
}

/* 主内容样式 */
.content {
  flex: 1;
  padding: 0 20px;

  .header {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
  }

  .section {
    background-color: #ffffff;
    border-radius: 10px;
    /* 圆角边框 */
    padding: 20px;
    border: 1px solid #e6e6e6;

    h1 {
      font-size: 20px;
      margin-bottom: 10px;
    }

    p {
      font-size: 14px;
      color: #666;
      line-height: 1.6;
    }
  }
}
</style>
