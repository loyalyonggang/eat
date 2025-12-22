<script lang="ts" setup>
import { isClient } from '@vueuse/core'
import pkg from '~/../package.json'
import { icp } from '../constants'

const displayICP = ref(true)

const date = import.meta.env.VITE_APP_BUILD_DATE
const buildDate = (new Date(date)).toLocaleDateString()

onBeforeMount(() => {
  if (isClient)
    displayICP.value = ['cook.yunyoujun.cn', 'localhost', '127.0.0.1'].includes(window.location.hostname)
})
</script>

<template>
  <ion-list :inset="true">
    <ion-item>
      <ion-label>当前版本</ion-label>
      <ion-text>v{{ pkg.version }} (Una Special Edition)</ion-text>
    </ion-item>

    <ion-item>
      <ion-label>构建时间</ion-label>
      <ion-text>{{ buildDate }}</ion-text>
    </ion-item>
  </ion-list>

  <ion-list :inset="true">
    <ion-item>
      <ion-label>为谁而作</ion-label>
      <ion-text class="inline-flex items-center justify-center">
        Una ❤️
      </ion-text>
    </ion-item>

    <ion-item>
      <ion-label>制作人</ion-label>
      <ion-text class="inline-flex items-center justify-center">
        爱你的男朋友
      </ion-text>
    </ion-item>
  </ion-list>
</template>
