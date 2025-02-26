<template>
  <div class="live-follow-page">
    <div class="header">
      <div class="title">我的关注</div>
      <div class="live-count">{{ liveUsers?.length }}</div>
      <div class="live-person">人正在直播中</div>
    </div>

    <div class="content-box">
      <div class="history-list">
        <div
          class="favourite-card"
          v-for="(item, index) in liveUsers"
          :key="index"
        >
          <div class="avatar">
            <a
              href="//space.bilibili.com/50329118"
              target="_blank"
              class="avatar-pic"
            >
              <img
                :src="item.avatar"
                class="anchor-avatar pinkBorder"
              />
              <div class="pink-live">
                <div class="gif-icon">
                  <img
                    src="data:image/gif;base64,R0lGODlhGAAYAJECAP7+/v///wAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTI2NTYzMDc2RTNDMTFFREJENEJEMzUxOTQzQjMxMkQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTI2NTYzMDg2RTNDMTFFREJENEJEMzUxOTQzQjMxMkQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBMjY1NjMwNTZFM0MxMUVEQkQ0QkQzNTE5NDNCMzEyRCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBMjY1NjMwNjZFM0MxMUVEQkQ0QkQzNTE5NDNCMzEyRCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAkEAAIALAAAAAAYABgAAAI5lI+py+0Po2QhTFXrRdlu031gJgqhpI0pdJ4sacJv6j6trABeTOMcfFslgp7ar4fcDVcyX+kJjToKACH5BAkEAAIALAAAAAAYABgAAAI2lI+py+0Po5xUhFDRvdls3H0T522SaJkRikKs6qptAr+kYoOzJvc37dPBgKQco3YbdpbM5qQAACH5BAkEAAIALAAAAAAYABgAAAI3lI+py+0Po5y02hhykHqLzmkGiImfCZHkkh0qmrztOSuyt8bmzfC0Z9sJa7qZLwhEwS7MpnNSAAAh+QQJBAACACwAAAAAGAAYAAACPJSPqcvtD6OctJoQ7MFYC55dYQSKHcmZo3J+qdsmJRzO7DvbMs7HSN5b/YIqBvCkGyKJixds4/NIp1RHAQAh+QQJBAACACwAAAAAGAAYAAACOpSPqcvtD6OcLwSarMVHXy54YKhJIrmhn3K25eKmJ/vGa1bnKS3rN2IzzHC94q/jE754yNVyBI1KIQUAIfkECQQAAgAsAAAAABgAGAAAAjmUj6nL7Q+jnLSaEOzBePbLSVwmjGJYopCZfmnDxmoif6xSkzeN5ozfIuF6RBfPVhQeN66Z5gmNTgoAIfkECQQAAgAsAAAAABgAGAAAAjmUj6nL7Q+jnLRaETLSMnMfdJ4Bit8YlRgKqerauOibyCen2OGK1/Pf2wB3NOGNyPLteIfk5QmNTgoAIfkECQQAAgAsAAAAABgAGAAAAjeUj6nL7Q+jnCkEWu3FRm/uHdYUCiVUnk+qSewYvd/amrWKyF2t6DbcuwmBGZgv+OHxOMyms1kAACH5BAkEAAIALAAAAAAYABgAAAI5lI+py+0PowtBLkptwlUf7n1YaIBlF5kmpI6puz5t9tLxBLsCgCpzdxPZcjQfEajbFHVJkvMJtRQAACH5BAkEAAIALAAAAAAYABgAAAI1lI+py+0Po5wpBFrtxUZv7nGdJgqheJ5QSkasJb2bmsFmSyPyaCv73avNcC1fr1gsKZdMSAEAIfkECQQAAgAsAAAAABgAGAAAAjWUj6nL7Q+jnLRaEfI1Wd8ebKDYkR4WHqcyol7Llm4KJ+0tx69cI/i+8vGGQdUpl9sol0xIAQAh+QQJBAACACwAAAAAGAAYAAACNJSPqcvtD6OctNq7QsBCa+xtV9h8DJl5p5qaCtqJsZugNvuyN43sIlzTCXkHnJHISSqXiQIAIfkECQQAAgAsAAAAABgAGAAAAjKUj6nL7Q+jnLTai3MMPLDuLeDXkZwZKqNYsqebJqva0u86yy1e6/feQ9SGL43xiEwUAAAh+QQJBAACACwAAAAAGAAYAAACM5SPqcvtD6OctNp7Q8BCa+xtzDd6JamEp5iai2qgcEvCc2K7N5LXLi3qsXCy4pCDTCoXBQAh+QQJBAACACwAAAAAGAAYAAACNJSPqcvtD6OctNoYcrhC7+txIag1mVkuY/exp5qOayLHqVK/M5J/+9Ez/IQvF7DISSqXkAIAIfkEBQQAAgAsAAAAABgAGAAAAjKUj6nL7Q+jnFSEUNG92WzcfZ21jWJYRucJranyutwig2xSey+e5nQPnMGEMeHoiExCCgA7"
                  />
                </div>
                <div class="live-text"><span>直播中</span></div>
              </div>
            </a>
          </div>
          <div class="anchor-info">
            <div class="anchor">
              <a
                href="//space.bilibili.com/50329118"
                target="_blank"
                class="anchor-name"
                >{{ item.username }}</a
              >
              <div class="spot-mark">
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAF9SURBVHgB7da9SgNBFAXgc7NZsUyp3T6AxUYiNhbxCcwbODYSRHDzCHmDiAoBA46dnZZ2SRkUwrZ26xskXTA/17v+gMZUMwurMh8kZKYIJ8PckwUc558hZECpqAR/VgNzojvnPViwDqTUUUi+15VvKn1sJfwy2dW6ncBAAZZopXj7JUwqgF+MYMgqkKpHAcDB4j4R7cGQ3QmNMQTLaxHjGYasAmndGjKhie9hhuxNFAxlM2WHxzUiVNPPTNOWbptdaOdP8pARVa8H4cYO4rg/hoUMmlq6yJ9eSfdU0zUzNCZeI51AGMigqefdzzBva4JCcZpTU6d/qsuaukD7MGR9Qkvl2dRyaU7xI89Mw5D1lMWDh/vN8vZIxmNdlk8MbujLixs4Tk6yaOqSFOGJlGPExAnmuJMH/SYMWU9ZWKm0pQgj+WmrBFpLWzssb43iwWMfBqybelkrS6hf1tQW7Jua0FvcZ6ZrGLI+ISbvQN7fA8gDvtyjpu6cteA4OXkFQG91iIqGacYAAAAASUVORK5CYII="
                />
                <div class="isCancel">
                  <button
                    data-v-b145b4ae=""
                    class="bl-button attend-btn pointer ts-dot-2 bl-button--primary bl-button--size btn-default"
                  >
                    取消关注
                  </button>
                </div>
              </div>
            </div>
            <a
              href="//space.bilibili.com/50329118"
              target="_blank"
              class="title"
              >{{ item.liveRoomName }}
            </a>
            <!-- <div class="title">
              {{ item.lastTime }}直播了{{ item.area }}
            </div> -->
            <a class="live-detail">
              <img
                :src="item.liveRecord?.live_room?.cover_img"
                class="cover"
              />
              <div class="bottom-mask"></div>
              <div class="block-views">
                <div class="views">
                  <span>{{ item.views }}</span>
                </div>
              </div> </a
            ><!---->
          </div>
        </div>
        <div
          class="favourite-card"
          v-for="(item, index) in offlineUsers"
          :key="index"
        >
          <div class="avatar">
            <a
              href="//space.bilibili.com/50329118"
              target="_blank"
              class="avatar-pic"
            >
              <img
                :src="item.avatar"
                class="anchor-avatar"
              />
            </a>
          </div>
          <div class="anchor-info">
            <div class="anchor">
              <a
                href="//space.bilibili.com/50329118"
                target="_blank"
                class="anchor-name"
                >{{ item.username }}</a
              >
              <div class="spot-mark">
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAF9SURBVHgB7da9SgNBFAXgc7NZsUyp3T6AxUYiNhbxCcwbODYSRHDzCHmDiAoBA46dnZZ2SRkUwrZ26xskXTA/17v+gMZUMwurMh8kZKYIJ8PckwUc558hZECpqAR/VgNzojvnPViwDqTUUUi+15VvKn1sJfwy2dW6ncBAAZZopXj7JUwqgF+MYMgqkKpHAcDB4j4R7cGQ3QmNMQTLaxHjGYasAmndGjKhie9hhuxNFAxlM2WHxzUiVNPPTNOWbptdaOdP8pARVa8H4cYO4rg/hoUMmlq6yJ9eSfdU0zUzNCZeI51AGMigqefdzzBva4JCcZpTU6d/qsuaukD7MGR9Qkvl2dRyaU7xI89Mw5D1lMWDh/vN8vZIxmNdlk8MbujLixs4Tk6yaOqSFOGJlGPExAnmuJMH/SYMWU9ZWKm0pQgj+WmrBFpLWzssb43iwWMfBqybelkrS6hf1tQW7Jua0FvcZ6ZrGLI+ISbvQN7fA8gDvtyjpu6cteA4OXkFQG91iIqGacYAAAAASUVORK5CYII="
                />
                <div class="isCancel">
                  <button
                    data-v-b145b4ae=""
                    class="bl-button attend-btn pointer ts-dot-2 bl-button--primary bl-button--size btn-default"
                  >
                    取消关注
                  </button>
                </div>
              </div>
            </div>
            <div class="title">
              {{ timeAgo(item.lastLiveTime) }}直播了
              {{
                getChildCategoryName(
                  item.liveRecord?.live_room?.parent_category_id,
                  item.liveRecord?.live_room?.child_category_id
                )
              }}
            </div>
            <a class="live-detail">
              <img
                :src="item.liveRecord?.live_room?.cover_img"
                class="cover"
              />
              <div class="bottom-mask"></div>
              <div class="block-views">
                <div class="views">
                  <span>{{ item.views }}</span>
                </div>
              </div> </a
            ><!---->
          </div>
        </div>
        <div
          class="favourite-card"
          @click="handleFocusAll"
        >
          <div class="surplus-avatars">
            <div
              class="anchor"
              v-for="item in neverLiveList.slice(0, 3)"
            >
              <img :src="item.avatar" />
            </div>
            <!-- <div class="anchor">
              <img src="https://i1.hdslb.com/bfs/face/3f6fe87c5b0593d3a1260ab75f3c74adee4e1d30.jpg" />
            </div>
            <div class="anchor">
              <img src="https://i1.hdslb.com/bfs/face/ece79097541b2d3f4cbd5e2736ea961b955680b9.jpg" />
            </div> -->
          </div>
          <div class="unlive-anchor">
            {{ neverLiveList?.length || 0 }}个你关注的用户未开播过
          </div>
          <div class="all-follow">所有关注 &gt</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  getFollowedUsersWithLiveRecords,
  getUsersWhoNeverStreamed,
} from '@/api/user';
import router, { routerName } from '@/router';
import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import { timeAgo } from '@/utils';
import { onMounted, ref, watch } from 'vue';

const appStore = useAppStore();

const userStore = useUserStore();
const liveUsers = ref<any[]>([]);
const offlineUsers = ref<any[]>([]);

const neverLiveList = ref<any[]>([]);

// 假数据
const followList = ref([
  {
    avatar:
      'https://i2.hdslb.com/bfs/face/544c89e68f2b1f12ffcbb8b3c062a3328e8692d9.jpg',
    isLive: true,
    name: '英雄联盟赛事',
    title: '【预告】21号17点 EDG vs TT',
    cover:
      'https://i0.hdslb.com/bfs/live/aa9d857cddc000f040424f7a8bb14b06dea9cc07.jpg',
    views: '13.1万',
  },
  {
    avatar:
      'https://i2.hdslb.com/bfs/face/e3eb8f63060731343b3fdfa1e0a52f5133ccdfe9.jpg',
    isLive: false,
    name: '马登福叔',
    lastTime: '59分钟前',
    area: '时尚',
    cover:
      'https://i0.hdslb.com/bfs/live/new_room_cover/484ae1f5696f9d8221f477f773e6b506535d8089.jpg',
  },
  {
    avatar:
      'https://i2.hdslb.com/bfs/face/e3eb8f63060731343b3fdfa1e0a52f5133ccdfe9.jpg',
    isLive: false,
    name: '马登福叔',
    lastTime: '59分钟前',
    area: '时尚',
    cover:
      'https://i0.hdslb.com/bfs/live/new_room_cover/484ae1f5696f9d8221f477f773e6b506535d8089.jpg',
  },
]);

watch(
  () => userStore?.userInfo?.id,
  () => {
    if (userStore?.userInfo?.id) {
      getRecordList();
      getNeverLiveList();
    }
  }
);

onMounted(() => {
  if (userStore?.userInfo?.id) {
    getRecordList();
    getNeverLiveList();
  }
  console.log(appStore.areaList, '....');
});

const getRecordList = async () => {
  const res = await getFollowedUsersWithLiveRecords({
    userId: userStore?.userInfo?.id,
  });
  if (res?.code === 200) {
    liveUsers.value = res?.data?.liveUsers;
    offlineUsers.value = res?.data?.offlineUsers;
  }
};

const getNeverLiveList = async () => {
  const res = await getUsersWhoNeverStreamed({
    userId: userStore?.userInfo?.id,
  });
  if (res?.code === 200) {
    neverLiveList.value = res?.data?.noLiveUsers;
  }
};

const handleFocusAll = () => {
  router.push({
    name: routerName.follow,
    params: {
      id: userStore?.userInfo?.id,
    },
  });
};

const getChildCategoryName = (parent_id, child_id) => {
  // 遍历 areaList，查找父级ID
  for (let parent of appStore.areaList) {
    if (parent.id === parent_id) {
      // 找到父级，接着查找子级ID
      if (parent?.children && parent?.children?.length > 0) {
        for (let child of parent?.children) {
          if (child.id === child_id) {
            return child.name; // 返回子级名称
          }
        }
      }
    }
  }
  return null; // 如果没有找到，返回null
};
</script>

<style lang="scss" scoped>
.live-follow-page {
  background-color: #f5f6f9;
  min-height: 100vh;

  .header {
    display: flex;
    align-items: flex-end;
    margin-bottom: 20px;

    /* 页面标题 */
    .title {
      font-size: 24px;
      color: #333;
      margin-right: 20px;
    }

    .live-count {
      font-family: Microsoft YaHei;
      font-size: 16px;
      font-weight: 400;
      display: inline-block;
      vertical-align: bottom;
      color: #f69;
    }

    .live-person {
      color: #61666d;
    }
  }

  /* 白色内容框 */
  .content-box {
    /* background-color: #fff; */
    /* border: 1px solid #e3e8ec; */
    /* border-radius: 12px; */
    /* padding: 20px; */

    /* 历史记录列表 */
    .history-list {
      display: flex;
      flex-wrap: wrap;
    }

    /* 单个历史卡片 */
    .history-card {
      display: flex;
      flex-direction: column;
      width: 200px;
      background-color: #fff;
      border: 1px solid #e3e8ec;
      border-radius: 8px;
      overflow: hidden;

      .thumbnail {
        img {
          width: 100%;
          height: auto;
          object-fit: cover;
        }
      }

      .info {
        padding: 10px;

        .title {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 8px;

          .tag {
            font-size: 12px;
            color: #fff;
            background-color: #f56c6c;
            padding: 2px 8px;
            border-radius: 12px;
          }
        }

        .subtitle {
          font-size: 12px;
          color: #666;
          margin-bottom: 6px;
        }

        .creator {
          font-size: 12px;
          color: #999;
        }
      }
    }

    .favourite-card {
      width: 279px;
      height: 203px;
      margin: 0 20px 20px 0;
      border-radius: 12px;
      background-color: #fff;
      border: 1px solid #e9eaec;
      padding: 17px 18px 18px 15px;
      box-sizing: border-box;
      display: -ms-flexbox;
      display: flex;
      display: inline-block;
      position: relative;
      vertical-align: top;
      cursor: pointer;

      &:hover {
        box-shadow: 4px 4px 20px 0 rgba(205, 216, 228, 0.6);
      }

      .avatar {
        width: 53px;
        height: 100%;
        margin-right: 7px;
        position: relative;

        .avatar-pic {
          position: absolute;
          top: 0;
          width: 53px;
          height: 51px;
          display: -ms-flexbox;
          display: flex;
          -ms-flex-pack: center;
          justify-content: center;
          position: relative;
          text-decoration: none;

          .anchor-avatar {
            width: 39px;
            height: 41.79px;
            border-radius: 50px;
            position: absolute;
            top: 0;
            object-fit: cover;
          }

          .pinkBorder {
            border: 1px solid #f69;
            padding: 2px;
          }

          .pink-live {
            width: 53px;
            height: 15px;
            border-radius: 22px;
            background: linear-gradient(0deg, #f69, #f69),
              linear-gradient(0deg, #fff, #fff);
            border: 2px solid #fff;
            display: -ms-flexbox;
            display: flex;
            position: absolute;
            bottom: 0;
            left: -2px;
            right: 0;

            .gif-icon {
              width: 15.5px;
              height: 100%;
              padding: 2.83px 3px 2.83px 4.5px;
              box-sizing: border-box;

              img {
                margin-bottom: 2px;
                width: 10px;
                height: 11.33px;
              }
            }

            .live-text {
              width: 37.5px;
              height: 100%;
              display: -ms-flexbox;
              display: flex;
              -ms-flex-align: center;
              align-items: center;

              span {
                font-family: Microsoft YaHei;
                font-weight: 400;
                font-size: 10px;
                color: #fff;
                text-align: left;
              }
            }
          }
        }
      }

      .anchor-info {
        width: 180px;
        height: 90%;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-direction: column;
        flex-direction: column;
        position: absolute;
        top: 18px;
        left: 76px;

        .anchor {
          width: 176px;
          display: -ms-flexbox;
          display: flex;
          -ms-flex-align: center;
          align-items: center;
          position: relative;

          .anchor-name {
            text-decoration: none;
            font-family: PingFang SC;
            font-weight: 400;
            font-size: 16px;
            color: #333;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-right: 17px;
          }

          .spot-mark {
            width: 17.99px;
            height: 18px;
            position: absolute;
            right: 0;
            display: none;
            border-radius: 2px;

            img {
              width: 100%;
              height: 100%;
              border: 1px solid transparent;
            }

            .isCancel {
              width: 105px;
              height: 36px;
              background-color: #fff;
              border: 1px solid #e9eaec;
              border-radius: 4px;
              box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.059);
              display: -ms-flexbox;
              display: flex;
              -ms-flex-direction: column;
              flex-direction: column;
              -ms-flex-pack: center;
              justify-content: center;
              -ms-flex-align: center;
              align-items: center;
              position: absolute;
              right: -27px;
              top: 20px;
              z-index: -1;

              button {
                cursor: pointer;
                background-color: #fff;
                width: 105px;
                height: 36px;
                line-height: 36px;
                border: none;
                outline: none;
                font-family: PingFang SC;
                font-weight: 400;
                font-size: 14px;
                color: #000;
                text-align: center;
              }
            }
          }
        }

        .title {
          text-decoration: none;
          width: 100%;
          font-family: PingFang SC;
          font-weight: 400;
          font-size: 14px;
          color: #999;
          margin-top: 2px;
          margin-bottom: 11px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .live-detail {
          text-decoration: none;
          width: 182px;
          height: 112px;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
          border-radius: 4px;

          .cover {
            width: 100%;
            height: 100%;
            overflow-clip-margin: content-box;
            overflow: clip;
            object-fit: cover;
          }

          .bottom-mask {
            width: 100%;
            height: 37px;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 9;
            background: linear-gradient(180deg, transparent, #000);
          }

          .block-views {
            width: 100%;
            height: 37px;
            position: absolute;
            bottom: 0;
            right: 0;
            left: 0;
            display: -ms-flexbox;
            display: flex;
            -ms-flex-align: center;
            align-items: center;
            -ms-flex-pack: justify;
            justify-content: space-between;
            padding: 0 8px;
            box-sizing: border-box;
            z-index: 10;

            .block {
              width: 100px;
              overflow: hidden;
              white-space: nowrap;
              font-family: PingFang SC;
              font-weight: 400;
              font-size: 12px;
              color: #fff;
              z-index: 12;
            }

            .views {
              display: -ms-flexbox;
              display: flex;
              -ms-flex-align: center;
              align-items: center;
              -ms-flex-pack: center;
              justify-content: center;
              z-index: 12;

              span {
                font-family: PingFang HK;
                font-weight: 400;
                font-size: 12px;
                color: #fff;
              }
            }
          }
        }
      }

      .surplus-avatars {
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        -ms-flex-pack: center;
        /* justify-content: center; */
        width: 146px;
        height: 45px;
        position: absolute;
        top: 43.68px;
        left: 23px;

        .anchor {
          width: 56px;
          height: 45px;
          border-radius: 50px;
          display: -ms-flexbox;
          display: flex;
          -ms-flex-pack: center;
          justify-content: center;
          margin-left: -15px;

          img {
            width: 41.21px;
            height: 41.7px;
            border-radius: 50px;
          }

          &:first-child {
            z-index: 1;
          }

          &:nth-child(2) {
            margin-left: -25px;
            z-index: 2;
          }

          &:nth-child(3) {
            margin-left: -25px;
            z-index: 3;
          }
        }
      }

      .unlive-anchor {
        width: 239px;
        height: 22px;
        position: absolute;
        top: 105px;
        bottom: 76px;
        left: 17px;
        right: 16px;
        font-family: PingFang SC;
        font-size: 16px;
        font-weight: 400;
        color: #18191c;

        &:hover {
          color: #ffd700;
        }
      }

      .all-follow {
        position: absolute;
        top: 135.68px;
        left: 16px;
        /* width: 68px; */
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 400;
        color: #61666d;

        &:hover {
          color: #ffd700;
        }
      }
    }
  }
}
</style>
