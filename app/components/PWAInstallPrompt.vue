<script setup lang="ts">
import { onMounted, ref } from 'vue'

const showInstallPrompt = ref(false)
const deferredPrompt = ref<any>(null)
const isIOS = ref(false)
const isStandalone = ref(false)

// 检测设备类型和安装状态
function detectDevice() {
  // 检测是否为iOS设备
  isIOS.value = /iPad|iPhone|iPod/.test(navigator.userAgent)

  // 检测是否已经安装为PWA
  isStandalone.value = window.matchMedia('(display-mode: standalone)').matches
    || (window.navigator as any).standalone === true
}

// 检查是否应该显示安装提示
function shouldShowInstallPrompt() {
  // 如果已经安装，不显示提示
  if (isStandalone.value)
    return false

  // 检查用户是否已经拒绝过安装提示
  const hasDeclined = localStorage.getItem('pwa-install-declined')
  if (hasDeclined)
    return false

  // 检查是否是首次访问
  const hasVisited = localStorage.getItem('pwa-has-visited')
  if (!hasVisited) {
    localStorage.setItem('pwa-has-visited', 'true')
    return true
  }

  return false
}

// 安装PWA
async function installPWA() {
  if (deferredPrompt.value) {
    // 显示安装提示
    deferredPrompt.value.prompt()

    // 等待用户响应
    const { outcome } = await deferredPrompt.value.userChoice

    if (outcome === 'accepted') {
      console.warn('用户接受了PWA安装')
    }
    else {
      console.warn('用户拒绝了PWA安装')
    }

    deferredPrompt.value = null
  }

  hideInstallPrompt()
}

// 隐藏安装提示
function hideInstallPrompt() {
  showInstallPrompt.value = false
}

// 拒绝安装
function declineInstall() {
  localStorage.setItem('pwa-install-declined', 'true')
  hideInstallPrompt()
}

// 监听beforeinstallprompt事件
function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    // 阻止默认的安装提示
    e.preventDefault()

    // 保存事件以便后续使用
    deferredPrompt.value = e

    // 显示自定义安装提示
    if (shouldShowInstallPrompt()) {
      showInstallPrompt.value = true
    }
  })

  // 监听安装完成事件
  window.addEventListener('appinstalled', () => {
    console.warn('PWA安装成功')
    hideInstallPrompt()
  })
}

onMounted(() => {
  detectDevice()
  setupInstallPrompt()

  // 对于iOS设备，延迟显示安装提示
  if (isIOS.value && shouldShowInstallPrompt()) {
    setTimeout(() => {
      showInstallPrompt.value = true
    }, 3000) // 3秒后显示
  }
})
</script>

<template>
  <!-- PWA安装提示弹窗 -->
  <ion-modal
    :is-open="showInstallPrompt"
    :backdrop-dismiss="false"
    class="pwa-install-modal"
  >
    <div class="min-h-full flex items-center justify-center p-4">
      <div class="max-w-sm w-full overflow-hidden rounded-3xl bg-white shadow-2xl">
        <!-- 头部图标 -->
        <div class="from-pink-500 to-purple-600 bg-gradient-to-br px-6 py-8 text-center text-white">
          <div class="mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <ion-icon name="download" class="text-3xl" />
          </div>
          <h2 class="text-xl font-bold">
            安装到桌面
          </h2>
          <p class="mt-2 text-sm text-white/90">
            获得更好的使用体验
          </p>
        </div>

        <!-- 内容区域 -->
        <div class="p-6">
          <!-- iOS安装说明 -->
          <div v-if="isIOS" class="mb-6 space-y-4">
            <div class="flex items-start space-x-3">
              <div class="mt-1 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <span class="text-sm font-bold">1</span>
              </div>
              <div class="flex-1">
                <p class="text-sm text-gray-700">
                  点击浏览器底部的
                  <ion-icon name="share" class="mx-1 text-blue-500" />
                  <strong>分享</strong> 按钮
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div class="mt-1 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <span class="text-sm font-bold">2</span>
              </div>
              <div class="flex-1">
                <p class="text-sm text-gray-700">
                  选择
                  <ion-icon name="add" class="mx-1 text-blue-500" />
                  <strong>添加到主屏幕</strong>
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div class="mt-1 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <span class="text-sm font-bold">3</span>
              </div>
              <div class="flex-1">
                <p class="text-sm text-gray-700">
                  点击右上角的 <strong>添加</strong> 完成安装
                </p>
              </div>
            </div>
          </div>

          <!-- Android安装说明 -->
          <div v-else class="mb-6">
            <p class="mb-4 text-center text-sm text-gray-600">
              点击下方按钮，将应用安装到桌面，享受原生应用般的体验
            </p>

            <div class="text-xs text-gray-500 space-y-2">
              <div class="flex items-center space-x-2">
                <ion-icon name="checkmark-circle" class="text-green-500" />
                <span>离线使用</span>
              </div>
              <div class="flex items-center space-x-2">
                <ion-icon name="checkmark-circle" class="text-green-500" />
                <span>快速启动</span>
              </div>
              <div class="flex items-center space-x-2">
                <ion-icon name="checkmark-circle" class="text-green-500" />
                <span>全屏体验</span>
              </div>
            </div>
          </div>

          <!-- 按钮区域 -->
          <div class="space-y-3">
            <!-- Android安装按钮 -->
            <button
              v-if="!isIOS && deferredPrompt"
              class="w-full rounded-2xl from-pink-500 to-purple-600 bg-gradient-to-r py-3 text-white font-medium shadow-lg transition-all duration-300 active:scale-95"
              @click="installPWA"
            >
              <ion-icon name="download" class="mr-2" />
              立即安装
            </button>

            <!-- iOS知道了按钮 -->
            <button
              v-if="isIOS"
              class="w-full rounded-2xl from-pink-500 to-purple-600 bg-gradient-to-r py-3 text-white font-medium shadow-lg transition-all duration-300 active:scale-95"
              @click="hideInstallPrompt"
            >
              知道了
            </button>

            <!-- 稍后再说按钮 -->
            <button
              class="w-full border border-gray-200 rounded-2xl py-3 text-gray-600 font-medium transition-all duration-300 active:scale-95"
              @click="declineInstall"
            >
              稍后再说
            </button>
          </div>
        </div>
      </div>
    </div>
  </ion-modal>
</template>

<style scoped>
.pwa-install-modal {
  --backdrop-opacity: 0.6;
}

.pwa-install-modal ion-modal {
  --border-radius: 24px;
}
</style>
