<script lang="ts" setup>
const { isDark, toggleDark } = useDarkMode()

const app = useAppStore()

// PWA相关状态
const isStandalone = ref(false)
const canInstall = computed(() => !!app.deferredPrompt)

// 检测PWA安装状态
function checkPWAStatus() {
  if (typeof window !== 'undefined') {
    isStandalone.value = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone === true
  }
}

// 手动触发PWA安装
async function installPWA() {
  if (app.deferredPrompt) {
    app.deferredPrompt.prompt()
    const { outcome } = await app.deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.warn('用户接受了PWA安装')
    }

    app.clearDeferredPrompt()
  }
}

onMounted(() => {
  checkPWAStatus()
})

definePageMeta({
  layout: 'child',
})
</script>

<template>
  <ion-page>
    <CustomHeader title="设置" :show-back-button="true" back-href="/my" />

    <ion-content>
      <ion-list-header>外观</ion-list-header>
      <ion-list :inset="true">
        <ion-item>
          <ion-toggle :checked="isDark" justify="space-between" @ion-change="toggleDark">
            暗色模式
          </ion-toggle>
        </ion-item>
      </ion-list>

      <ion-list-header>数据</ion-list-header>
      <ion-list :inset="true">
        <ion-item>
          <ion-toggle v-model:checked="app.settings.keepLocalData" justify="space-between">
            离开网页后保留选中数据
          </ion-toggle>
        </ion-item>
      </ion-list>

      <ion-list-header>应用</ion-list-header>
      <ion-list :inset="true">
        <ion-item v-if="isStandalone">
          <ion-icon slot="start" name="checkmark-circle" color="success" />
          <ion-label>
            <h3>已安装到桌面</h3>
            <p>应用已成功安装，享受原生体验</p>
          </ion-label>
        </ion-item>

        <ion-item v-else-if="canInstall" button @click="installPWA">
          <ion-icon slot="start" name="download" color="primary" />
          <ion-label>
            <h3>安装到桌面</h3>
            <p>获得更快的启动速度和离线使用体验</p>
          </ion-label>
        </ion-item>

        <ion-item v-else>
          <ion-icon slot="start" name="information-circle" color="medium" />
          <ion-label>
            <h3>桌面安装</h3>
            <p>当前浏览器不支持或已安装</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<style>
/* (Optional) This is added to prevent the flashing that happens when toggling between palettes */
ion-item {
  --transition: none;
}
</style>
