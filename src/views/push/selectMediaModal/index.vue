<template>
  <div class="select-media-wrap">
    <Modal
      title="选择直播素材"
      :mask-closable="false"
      @close="emits('close')"
      :width="'450px'"
    >
      <div class="btn-wrap">
        <div
          class="material-item"
          v-for="(item, index) in allMediaTypeList"
          :key="index"
        >
          <div
            class="material-kind-icon"
            :class="allMediaTypeMap[item.type]"
            @click="emits('ok', item.type)"
          ></div>
          <span class="material-name">{{ item.txt }}</span>
        </div>
        <!-- <div class="btn" v-for="(item, index) in allMediaTypeList" :key="index">
          <n-button @click="emits('ok', item.type)">
            {{ item.txt }}
          </n-button>
        </div> -->
      </div>

      <template #footer></template>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { useRTCParams } from '@/hooks/use-rtcParams';
import { MediaTypeEnum } from '@/interface';

withDefaults(
  defineProps<{
    allMediaTypeList: {
      [index: string]: {
        type: MediaTypeEnum;
        txt: string;
      };
    };
  }>(),
  {}
);
const { allMediaTypeMap } = useRTCParams();
const emits = defineEmits(['close', 'ok']);
</script>

<style lang="scss" scoped>
.select-media-wrap {
  .btn-wrap {
    display: flex;
    flex-wrap: wrap;

    .material-item {
      align-items: center;
      color: #18191c;
      cursor: pointer;
      flex-direction: column;
      margin-top: 15px;
      width: 80px;
      display: flex;
      justify-content: space-between;

      .material-kind-icon {
        background-size: contain;
        height: 40px;
        width: 40px;
      }

      .material-name {
        display: inline-block;
        margin-top: 5px;

        &:hover {
          color: #ffd700;
        }
      }

      .camera {
        background-image: url(https://s1.hdslb.com/bfs/static/blive/web-hime/static/camera.bf243922.svg);
      }

      .audio {
        height: 35px;
        width: 35px;
        background-image: url(https://s1.hdslb.com/bfs/static/blive/web-hime/static/micphone.ef9c234d.svg);
      }

      .screen {
        background-image: url(https://s1.hdslb.com/bfs/static/blive/web-hime/static/screen.4c751419.svg);
      }

      .image {
        background-image: url(https://s1.hdslb.com/bfs/static/blive/web-hime/static/image.e5b0792b.svg);
      }

      .text {
        background-image: url(https://s1.hdslb.com/bfs/static/blive/web-hime/static/text.9be04d0d.svg);
      }

      .media {
        background-image: url(https://s1.hdslb.com/bfs/static/blive/web-hime/static/media.5ad11a59.svg);
      }

      .album {
        background-image: url(https://s1.hdslb.com/bfs/static/blive/web-hime/static/album.343428b2.svg);
      }
    }

    .btn {
      margin-right: 12px;
      margin-bottom: 12px;
    }
  }
}
</style>
