<script setup lang="ts">
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { Delete, Moon, Sunny, UploadFilled } from "@element-plus/icons-vue";
import { computed, ref, watch } from "vue";
import type { UploadUserFile } from "element-plus";
import { imageColoring } from "./utils/image-coloring.ts";
import { useDark } from "@vueuse/core";

defineOptions({ name: "App" });

const list = ref<UploadUserFile[]>([]);

const currentFile = computed(() => {
  if (list.value && list.value.length > 0) {
    return window.URL.createObjectURL(list.value[0].raw!);
  }
  return "";
});

const deleteFile = () => {
  list.value = [];
};

const color = ref<string>("#ff0000");

const changeColor = async (color: string) => {
  if (color && currentFile.value) {
    loading.value = true;
    result.value = await imageColoring(currentFile.value, color);
    loading.value = false;
  } else {
    result.value = undefined;
  }
};

const result = ref<string>();

const loading = ref<boolean>(false);

watch(
  () => currentFile.value,
  async (value) => {
    if (value && color.value) {
      loading.value = true;
      result.value = await imageColoring(value, color.value);
      loading.value = false;
    } else {
      result.value = undefined;
    }
  },
);

const isDark = useDark();
</script>

<template>
  <el-config-provider :locale="zhCn">
    <div class="app-box" v-loading="loading">
      <el-switch
        class="app-theme-switch"
        v-model="isDark"
        :active-action-icon="Moon"
        :inactive-action-icon="Sunny"
      />
      <h1 class="app-title">图片填色工具</h1>
      <div class="app-content">
        <div class="uploaded-box" v-if="currentFile">
          <el-image :src="currentFile" fit="contain" />
          <el-icon color="#fff" size="64px" @click="deleteFile"
            ><Delete
          /></el-icon>
        </div>
        <el-upload
          class="file-upload-box"
          v-else
          :show-file-list="false"
          drag
          accept=".png"
          v-model:file-list="list"
          :auto-upload="false"
          :limit="1"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">将文件拖放到此处或<em>单击上传</em></div>
        </el-upload>
        <el-color-picker
          class="color-picker-box"
          v-model="color"
          size="large"
          @change="changeColor"
        />
        <div class="coloring-results-box">
          <img v-if="result" :src="result" alt="绘制结果" />
        </div>
      </div>
    </div>
  </el-config-provider>
</template>

<style scoped lang="scss">
.app-box {
  width: 100vw;
  height: 100vh;
  position: relative;

  .app-theme-switch {
    position: absolute;
    top: 16px;
    right: 32px;
  }

  .app-title {
    padding-top: 100px;
    margin: 0;
    text-align: center;
  }

  .app-content {
    height: calc(100vh - 145px);
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: relative;

    & > div {
      width: 40%;
      height: 50%;
    }

    .uploaded-box {
      position: relative;

      :deep(.el-image) {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      :deep(.el-icon) {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: none;
        cursor: pointer;
        z-index: 1;
      }

      &:hover {
        &::after {
          content: "";
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          background-color: rgba(0, 0, 0, 0.6);
        }

        :deep(.el-icon) {
          display: block;
        }
      }
    }

    .file-upload-box {
      :deep(.el-upload) {
        width: 100%;
        height: 100%;

        .el-upload-dragger {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      }
    }

    .coloring-results-box {
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
}
</style>
