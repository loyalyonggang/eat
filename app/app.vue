<script setup lang="ts">
import { isClient } from '@vueuse/core'
import { useIndexedDB } from '~/composables/db'
import { appName } from '~/constants'
import { installPrompt } from './utils/pwa'

// https://nuxt.com/docs/api/composables/use-head
useHead({
  title: appName,
  meta: [
    {
      name: 'description',
      content: '好的，今天我们来做菜！',
    },
  ],
})

const indexedDB = useIndexedDB()
const { isDark, setDarkMode, setLightMode } = useDarkMode()

onMounted(() => {
  // init dark mode
  if (isClient) {
    if (isDark.value) {
      setDarkMode()
    }
    else {
      setLightMode()
    }

    indexedDB.init()
  }

  installPrompt()
})
</script>

<template>
  <VitePwaManifest />
  <!-- https://ionic.nuxtjs.org/cookbook/customising-app-vue -->
  <!-- <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout> -->
  <ion-app>
    <ion-router-outlet />
    <!-- PWA安装提示组件 -->
    <PWAInstallPrompt />
    <!-- PWA更新提示组件 -->
    <PWAUpdatePrompt />
  </ion-app>
</template>
