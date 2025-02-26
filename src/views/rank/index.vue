<template>
  <div class="rank-wrap">
    <div class="type-list">
      <div
        v-for="(item, index) in rankTypeList"
        :key="index"
        :class="{ item: 1, active: item.type === currRankType }"
        @click="changeCurrRankType(item.type)"
      >
        <!-- {{ t(item.label) }} -->
        <img
          v-if="item.type === RankTypeEnum.liveRoom"
          src="@/assets/img/popularRank_active.png"
          alt=""
          class="img_1"
        />
        <img
          v-if="item.type === RankTypeEnum.user"
          src="@/assets/img/userRank_active.png"
          alt=""
          class="img_2"
        />
      </div>
    </div>

    <div
      v-if="rankList.length"
      class="rank-list"
      v-loading="loading"
    >
      <div class="tip">
        <div v-if="currRankType === RankTypeEnum.liveRoom">
          <span class="tip-item">
            1.按用户的直播数据进行综合评定，数据在每自然月最后一日的23点59分59秒清零。</span
          >
          <span class="tip-item">
            2.系统根据用户的直播次数、观看人数、点赞数、直播评论数、粉丝数量以及获得的礼物数量等指标来进行排序。</span
          >
        </div>
        <div v-if="currRankType === RankTypeEnum.user">
          <span class="tip-item">
            1.按用户在平台上的活跃度进行综合评定，数据在每自然月最后一日的23点59分59秒清零。</span
          >
          <span class="tip-item">
            2.用户通过发送弹幕、观看直播、点赞直播、打赏礼物、每日签到等行为，可提升排名指标。</span
          >
        </div>
      </div>
      <div class="list-wrapper">
        <div class="top">
          <div
            v-for="(item, index) in [
              rankList[1],
              rankList[0],
              rankList[2],
            ].filter((v) => v !== undefined)"
            :key="currRankType + '-' + index"
            :class="{ item: 1, [`rank-${item.rank}`]: 1 }"
          >
            <div
              class="avatar"
              @click="
                currRankType !== RankTypeEnum.blog && handleJump(item.users[0])
              "
            >
              <Avatar
                :size="100"
                :url="item.users[0]?.avatar"
                :name="item.users[0]?.username"
                :living="!!item.live?.live"
              >
              </Avatar>
            </div>
            <div class="decorate"></div>
            <div class="username">{{ item.users[0]?.username }}</div>
            <div class="rank">
              <i>0{{ item.rank }}</i>
              <div
                v-if="item.live?.live && currRankType === RankTypeEnum.liveRoom"
                class="living"
                @click="handleJoin(item.live)"
              >
                {{ t('common.living') }}
              </div>
            </div>
            <div
              class="wallet"
              v-if="currRankType === RankTypeEnum.wallet"
            >
              <span>{{ t('common.wallet') }}: </span>
              <span>{{ formatMoney(item.balance) }}￥</span>
            </div>
            <div
              class="signin"
              v-if="currRankType === RankTypeEnum.signin"
            >
              <span>
                {{ t('rank.accumulatedSignin', { nums: item.signin_nums }) }}
              </span>
            </div>
          </div>
        </div>
        <div class="top50-list">
          <div
            v-for="(item, index) in rankList.filter(
              (item, index) => index >= 3
            )"
            :key="index"
            class="top50-item"
          >
            <div class="rank">
              <i>{{ item.rank >= 10 ? item.rank : '0' + item.rank }}</i>
            </div>
            <div
              class="left"
              @click="
                currRankType !== RankTypeEnum.blog && handleJump(item.users[0])
              "
            >
              <Avatar
                :size="28"
                :url="item.users[0]?.avatar"
                :name="item.users[0]?.username"
                :living="!!item.live?.live"
                disableLiving
              ></Avatar>
              <div class="username">{{ item.users[0]?.username }}</div>
              <div
                class="wallet"
                v-if="currRankType === RankTypeEnum.wallet"
              >
                <span>{{ t('common.wallet') }}: </span>
                <span>{{ formatMoney(item.balance) }}￥</span>
              </div>
              <div
                class="signin"
                v-if="currRankType === RankTypeEnum.signin"
              >
                <span>
                  （{{
                    t('rank.accumulatedSignin', { nums: item.signin_nums })
                  }}）
                </span>
              </div>
              <div
                v-if="item.live?.live && currRankType === RankTypeEnum.liveRoom"
                class="living-tag"
                @click.stop="handleJoin(item.live)"
              >
                {{ t('common.living') }}
              </div>
            </div>
            <div class="right"></div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="null"
      v-if="!rankList.length && !loading"
    >
      暂无数据
    </div>
  </div>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { fetchLiveRoomList } from '@/api/liveRoom';
import { fetchSigninList } from '@/api/signin';
import { fetchUserList } from '@/api/user';
import { fetchWalletList } from '@/api/wallet';
import { RankTypeEnum, SwitchEnum } from '@/interface';
import router, { routerName } from '@/router';
import { useUserStore } from '@/store/user';
import { ILiveRoom } from '@/types/ILiveRoom';
import { formatMoney } from '@/utils';

const userStore = useUserStore();
export interface IRankType {
  type: RankTypeEnum;
  label: string;
}

const rankTypeList = ref<IRankType[]>([
  {
    type: RankTypeEnum.liveRoom,
    label: 'rank.liveRank',
  },
  {
    type: RankTypeEnum.user,
    label: 'rank.userRank',
  },
  // {
  //   type: RankTypeEnum.blog,
  //   label: '博客用户',
  // },
]);

const mockDataNums = 4;

const pageParams = reactive({
  nowPage: 1,
  pageSize: 50,
});

const currRankType = ref(RankTypeEnum.liveRoom);
const { t } = useI18n();
const loading = ref(true);
const mockRank: {
  users: { id; username; avatar }[];
  rank: number;
  level: number;
  score: number;
  balance: number;
  signin_nums: number;
  live?: ILiveRoom;
}[] = [
  // {
  //   users: [
  //     {
  //       id: -1,
  //       username: '待上榜',
  //       avatar: '',
  //     },
  //   ],
  //   rank: 1,
  //   level: 0,
  //   score: 0,
  //   balance: 0,
  //   signin_nums: 0,
  //   live: undefined,
  // },
  // {
  //   users: [
  //     {
  //       id: -1,
  //       username: '待上榜',
  //       avatar: '',
  //     },
  //   ],
  //   rank: 2,
  //   level: 0,
  //   score: 0,
  //   balance: 0,
  //   signin_nums: 0,
  //   live: undefined,
  // },
  // {
  //   users: [
  //     {
  //       id: -1,
  //       username: '待上榜',
  //       avatar: '',
  //     },
  //   ],
  //   rank: 3,
  //   level: 0,
  //   score: 0,
  //   balance: 0,
  //   signin_nums: 0,
  //   live: undefined,
  // },
  // {
  //   users: [
  //     {
  //       id: -1,
  //       username: '待上榜',
  //       avatar: '',
  //     },
  //   ],
  //   rank: 4,
  //   level: 0,
  //   score: 0,
  //   balance: 0,
  //   signin_nums: 0,
  //   live: undefined,
  // },
];
const rankList = ref(mockRank);

function handleJump(item) {
  // if (userStore.userInfo?.id === item.id) {
  //   router.push({
  //     name: routerName.my,
  //   });
  // } else {
  //   router.push({
  //     name: routerName.user,
  //     params: { id: item.id },
  //   });
  // }
  if (item?.id) {
    router.push({
      name: routerName.user,
      params: { id: item.id },
    });
  }
}

function handleJoin(item) {
  const url = router.resolve({
    name: routerName.pull,
    params: { roomId: item.live.live_room_id },
  });
  openToTarget(url.href);
}

async function getWalletList() {
  try {
    loading.value = true;
    const res = await fetchWalletList({
      ...pageParams,
      orderName: 'balance',
      orderBy: 'desc',
    });
    if (res.code === 200) {
      const length = res.data.rows.length;
      rankList.value = res.data.rows.map((item, index) => {
        return {
          users: [
            {
              id: item.user?.id,
              username: item.user?.username,
              avatar: item.user?.avatar || '',
            },
          ],
          rank: index + 1,
          level: 0,
          score: 0,
          balance: item.balance || 0,
          signin_nums: 0,
        };
      });
      if (length < mockDataNums) {
        rankList.value.push(...mockRank.slice(length));
      }
    }
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
}

async function getLiveRoomList() {
  try {
    loading.value = true;
    const res = await fetchLiveRoomList({
      is_show: SwitchEnum.yes,
      orderName: 'updated_at',
      orderBy: 'desc',
      ...pageParams,
    });
    if (res.code === 200) {
      const length = res.data.rows.length;
      rankList.value = res.data.rows.map((item, index) => {
        return {
          users: [
            {
              id: item.users?.[0]?.id,
              username: item.users?.[0]?.username,
              avatar: item.users?.[0]?.avatar || '',
            },
          ],
          live: item,
          rank: index + 1,
          level: 0,
          score: 0,
          balance: 0,
          signin_nums: 0,
        };
      });
      if (length < mockDataNums) {
        rankList.value.push(...mockRank.slice(length));
      }
    }
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
}

async function getUserList() {
  try {
    loading.value = true;
    const res = await fetchUserList({
      orderName: 'updated_at',
      orderBy: 'desc',
      ...pageParams,
    });
    if (res.code === 200) {
      const length = res.data.rows.length;
      rankList.value = res.data.rows.map((item, index) => {
        return {
          users: [
            {
              id: item.id,
              username: item.username,
              avatar: item.avatar || '',
            },
          ],
          rank: index + 1,
          level: 0,
          score: 0,
          balance: 0,
          signin_nums: 0,
        };
      });
      if (length < mockDataNums) {
        rankList.value.push(...mockRank.slice(length));
      }
    }
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
}

async function getSigninList() {
  try {
    loading.value = true;
    const res = await fetchSigninList({
      ...pageParams,
      orderName: 'sum_nums,max_nums,recently_signin_time',
      orderBy: 'desc,desc,desc',
    });
    if (res.code === 200) {
      const length = res.data.rows.length;
      rankList.value = res.data.rows.map((item, index) => {
        return {
          users: [
            {
              id: item.user?.id,
              username: item.user?.username,
              avatar: item.user?.avatar || '',
            },
          ],
          rank: index + 1,
          level: 0,
          score: 0,
          balance: 0,
          signin_nums: item.sum_nums || 0,
        };
      });
      if (length < mockDataNums) {
        rankList.value.push(...mockRank.slice(length));
      }
    }
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
}

function changeCurrRankType(type: RankTypeEnum) {
  currRankType.value = type;
  switch (type) {
    case RankTypeEnum.liveRoom:
      getLiveRoomList();
      break;
    case RankTypeEnum.user:
      getUserList();
      break;
    case RankTypeEnum.signin:
      getSigninList();
      break;
    case RankTypeEnum.wallet:
      getWalletList();
      break;
    default:
      break;
  }
}

onMounted(() => {
  changeCurrRankType(currRankType.value);
});
</script>

<style lang="scss" scoped>
.rank-wrap {
  box-sizing: border-box;
  padding-top: 10px;
  height: 135vh;
  background-color: #f4f4f4;
  overflow-y: scroll;

  .type-list {
    display: flex;
    align-items: center;
    margin-left: 500px;
    margin-top: 20px;
    margin-bottom: 20px;

    .item {
      margin: 0 10px;
      text-align: center;
      font-weight: bold;
      font-size: 20px;
      line-height: 40px;
      filter: grayscale(1);
      cursor: pointer;

      &.active {
        filter: grayscale(0);
      }
    }

    .img_1 {
      width: 190px;
      height: 150px;
      margin-right: 20px;
    }

    .img_2 {
      width: 250px;
      height: 150px;
    }
  }

  .tip {
    width: 300px;
    background-color: #fff;
    border-radius: 16px;
    margin-left: 50px;
    display: inline-block;
    position: absolute;
    top: 300px;
    left: 100px;
    padding: 20px;

    &-item {
      display: block;
      padding: 9px 27px;
      border-radius: 8px;
      font-size: 12px;
      background: snow;
      color: #ff4c4c;

      &:first-child {
        margin-bottom: 10px;
      }
    }
  }

  .rank-list {
    /* display: flex; */
    width: 800px;
    /* justify-content: space-between; */

    .living-tag {
      display: inline-block;
      margin: 0 auto;
      padding: 2px 5px;
      width: 40px;
      border: 1px solid $theme-color-gold;
      border-radius: 10px;
      color: $theme-color-gold;
      text-align: center;
      font-size: 12px;
      line-height: 1.2;
      cursor: pointer;
    }

    .top {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      margin-top: 130px;
      width: 100%;
      /* margin-left: 500px; */

      .item {
        position: relative;
        margin: 0 20px;
        width: 200px;
        height: 160px;
        border-radius: 15px;
        background-color: white;
        text-align: center;

        &.rank-1 {
          height: 180px;
          border-color: #ff6744;
          color: #ff6744;

          .avatar {
            border: 2px solid #ff6744;
            border-radius: 50%;
          }

          .decorate {
            top: -100px;
            height: 105px;
            background: url(//s1.hdslb.com/bfs/static/blive/blfe-live-spa/static/img/first.39f7245.png)
              no-repeat top;
            width: 100%;
            position: absolute;
            content: '';
            display: block;
          }

          .rank {
            margin-top: 20px;
          }

          .avatar-wrap {
            .avatar {
              border: 2px solid #ff6744;
            }
          }
        }

        &.rank-2 {
          border-color: #44d6ff;
          color: #44d6ff;

          .avatar {
            border: 2px solid #44d6ff;
            border-radius: 50%;
          }

          .decorate {
            top: -100px;
            height: 105px;
            background: url(data:image/png;base64,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)
              no-repeat top;
            width: 100%;
            position: absolute;
            content: '';
            display: block;
          }

          .avatar-wrap {
            .avatar {
              border: 2px solid #44d6ff;
            }
          }
        }

        &.rank-3 {
          border-color: #ffb200;
          color: #ffb200;

          .avatar {
            border: 2px solid #ffb200;
            border-radius: 50%;
          }

          .avatar-wrap {
            .avatar {
              border: 2px solid #ffb200;
            }
          }
        }

        .avatar {
          display: inline-block;
          margin-top: -50px;
          cursor: pointer;
        }

        .username {
          margin-bottom: 10px;
          font-size: 22px;
        }

        .rank {
          position: relative;
          display: inline-block;
          padding: 0px 20px;
          border: 1px solid;
          border-radius: 20px;
          font-size: 20px;

          .living {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translate(-50%, 130%);

            @extend .living-tag;
          }
        }

        .wallet,
        .signin {
          margin-top: 10px;
        }
      }
    }

    .list-wrapper {
      position: absolute;
      top: 250px;
      right: 150px;
    }

    .top50-list {
      margin-top: 20px;
      border-radius: 10px;
      background-color: white;
      height: 440px;
      width: 100%;
      overflow-y: scroll;
      /* margin-left: 500px; */

      .top50-item {
        display: flex;
        align-items: center;
        padding: 0 10px;
        height: 40px;
        color: #666;

        &:nth-child(2n) {
          background-color: #fafbfc;
        }

        .rank {
          box-sizing: border-box;
          margin-right: 20px;
          width: 80px;
          border-radius: 40px;
          background-color: #84f9da;
          color: white;
          text-align: center;
          font-size: 20px;
        }

        .left {
          display: flex;
          align-items: center;
          font-size: 14px;
          cursor: pointer;

          .avatar {
            width: 28px;
            height: 28px;
            border-radius: 50%;
          }

          .username {
            margin-left: 10px;
            width: 100px;

            @extend %singleEllipsis;
          }

          .wallet,
          .signin {
            margin-left: 4px;
          }
        }
      }
    }
  }

  .null {
    width: 100%;
    text-align: center;
  }
}
</style>
