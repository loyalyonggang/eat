<script setup lang="ts">
import { onMounted, ref } from 'vue'

const showUpdatePrompt = ref(false)
const updateSW = ref<(() => Promise<void>) | null>(null)

// 检查PWA更新
function checkForUpdates() {
  // 监听PWA更新事件
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // 服务工作者已更新，刷新页面
      window.location.reload()
    })
  }
}

// 更新PWA
async function updatePWA() {
  if (updateSW.value) {
    await updateSW.value()
    showUpdatePrompt.value = false
  }
}

// 稍后更新
function dismissUpdate() {
  showUpdatePrompt.value = false
}

onMounted(() => {
  checkForUpdates()

  // 监听PWA更新事件（如果使用vite-plugin-pwa）
  if (typeof window !== 'undefined') {
    window.addEventListener('sw:update-available', () => {
      showUpdatePrompt.value = true
    })
  }
})
</script>

<template>
  <!-- PWA更新提示 -->
  <ion-toast
    :is-open="showUpdatePrompt"
    message="发现新版本，是否立即更新？"
    :duration="0"
    position="top"
    color="primary"
    :buttons="[
      {
        text: '更新',
        role: 'confirm',
        handler: updatePWA,
      },
      {
        text: '稍后',
        role: 'cancel',
        handler: dismissUpdate,
      },
    ]"
  />
</template>
