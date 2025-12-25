<script setup lang="ts">
import { nextTick, onUnmounted, ref } from 'vue'

definePageMeta({
  alias: ['/apps/period-care'],
})

useHead({
  title: 'Una 有肚子不疼偏方吗',
})

const { heavyImpact } = useHaptics()

const isVibrating = ref(false)
const audioRef = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const showInstructions = ref(false)
const vibrationInterval = ref<NodeJS.Timeout | null>(null)
const isFullscreen = ref(false)

// 开始不疼功能
async function startComfort() {
  showInstructions.value = true
  isVibrating.value = true

  // 等待DOM更新
  await nextTick()

  // 进入全屏模式
  try {
    const element = document.documentElement
    if (element.requestFullscreen) {
      await element.requestFullscreen()
      isFullscreen.value = true
    }
    else if ((element as any).webkitRequestFullscreen) {
      // Safari支持
      await (element as any).webkitRequestFullscreen()
      isFullscreen.value = true
    }
    else if ((element as any).msRequestFullscreen) {
      // IE支持
      await (element as any).msRequestFullscreen()
      isFullscreen.value = true
    }
    else {
      // 浏览器不支持全屏，使用伪全屏
      isFullscreen.value = true
    }
  }
  catch (error) {
    console.error('全屏模式失败:', error)
    // 即使全屏失败，也显示全屏界面
    isFullscreen.value = true
  }

  // 开始播放音乐
  if (audioRef.value) {
    try {
      audioRef.value.currentTime = 0
      await audioRef.value.play()
      isPlaying.value = true
    }
    catch (error) {
      console.error('音乐播放失败:', error)
      // 尝试用户交互后再播放
      setTimeout(async () => {
        try {
          if (audioRef.value) {
            await audioRef.value.play()
            isPlaying.value = true
          }
        }
        catch (e) {
          console.error('延迟播放也失败:', e)
        }
      }, 1000)
    }
  }

  // 开始震动
  startVibration()
}

// 停止功能
async function stopComfort() {
  showInstructions.value = false
  isVibrating.value = false
  isFullscreen.value = false

  // 退出全屏模式
  try {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
      }
      else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen()
      }
      else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen()
      }
    }
  }
  catch (error) {
    console.error('退出全屏失败:', error)
  }

  // 停止音乐
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.currentTime = 0
    isPlaying.value = false
  }

  // 停止震动
  stopVibration()
}

// 开始震动 - 使用多种方式确保震动工作
async function startVibration() {
  // 方法1: 使用Capacitor Haptics (适用于原生应用)
  const capacitorVibrate = async () => {
    try {
      await heavyImpact()
    }
    catch (error) {
      console.error('Capacitor震动失败:', error)
    }
  }

  // 方法2: 使用浏览器Vibration API (适用于PWA)
  const browserVibrate = () => {
    if ('vibrate' in navigator) {
      try {
        // 强烈震动模式：震动1000ms
        navigator.vibrate(1000)
        return true
      }
      catch (error) {
        console.error('浏览器震动失败:', error)
        return false
      }
    }
    return false
  }

  // 立即开始震动
  await capacitorVibrate()
  browserVibrate()

  // 设置持续震动
  vibrationInterval.value = setInterval(async () => {
    await capacitorVibrate()
    browserVibrate()
  }, 1500) // 每1.5秒震动一次
}

// 停止震动
function stopVibration() {
  if (vibrationInterval.value) {
    clearInterval(vibrationInterval.value)
    vibrationInterval.value = null
  }

  // 停止浏览器震动
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(0)
    }
    catch (error) {
      console.error('停止震动失败:', error)
    }
  }
}

// 监听全屏状态变化
function handleFullscreenChange() {
  const isCurrentlyFullscreen = !!(
    document.fullscreenElement
    || (document as any).webkitFullscreenElement
    || (document as any).msFullscreenElement
  )

  if (!isCurrentlyFullscreen && isFullscreen.value) {
    // 用户手动退出了全屏，停止所有功能
    stopComfort()
  }
}

// 添加全屏监听器
onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.addEventListener('msfullscreenchange', handleFullscreenChange)
})

// 组件卸载时清理
onUnmounted(() => {
  stopComfort()
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('msfullscreenchange', handleFullscreenChange)
})
</script>

<template>
  <ion-page>
    <CustomHeader
      title="Una 有肚子不疼偏方吗"
      :show-back-button="true"
      back-href="/apps"
    />

    <ion-content class="period-care-content">
      <!-- 背景音乐 -->
      <audio
        ref="audioRef"
        loop
        preload="auto"
      >
        <source src="/二零二五的冬天.mp3" type="audio/mpeg">
        您的浏览器不支持音频播放。
      </audio>

      <!-- 全屏模式 -->
      <div v-if="isFullscreen" class="fullscreen-mode">
        <!-- 粉红色背景 -->
        <div class="absolute inset-0 from-pink-400 via-rose-400 to-pink-500 bg-gradient-to-br" />

        <!-- 浮动装饰 -->
        <div class="pointer-events-none absolute inset-0 overflow-hidden">
          <div class="animate-float absolute left-10 top-20 text-4xl text-white/20">
            🌸
          </div>
          <div class="animate-float absolute right-16 top-32 text-3xl text-white/30" style="animation-delay: 1s;">
            💖
          </div>
          <div class="animate-float absolute bottom-32 left-1/4 text-2xl text-white/20" style="animation-delay: 2s;">
            🌺
          </div>
          <div class="animate-float absolute bottom-20 right-1/3 text-3xl text-white/30" style="animation-delay: 3s;">
            💕
          </div>
          <div class="animate-float absolute left-1/2 top-1/4 text-xl text-white/15" style="animation-delay: 4s;">
            ✨
          </div>
          <div class="animate-float absolute right-1/4 top-3/4 text-2xl text-white/25" style="animation-delay: 5s;">
            🌸
          </div>
        </div>

        <!-- 主要内容 -->
        <div class="relative z-10 h-full flex flex-col items-center justify-center px-4">
          <!-- 不疼大字 -->
          <div class="mb-8 text-center">
            <h1 class="animate-pulse text-6xl text-white font-bold drop-shadow-2xl md:text-9xl sm:text-8xl">
              不疼
            </h1>
          </div>

          <!-- 温暖的话语 -->
          <div class="mb-16 max-w-md px-4 text-center">
            <p class="text-sm text-white/90 leading-relaxed italic drop-shadow-lg sm:text-base">
              "你的不舒服，我都想替你承受。虽然不能在你身边，但希望这份温暖能陪伴你。"
            </p>
          </div>

          <!-- 状态指示 -->
          <div class="mb-8 text-center space-y-3">
            <div v-if="isPlaying" class="animate-pulse text-white/80">
              <div class="flex items-center justify-center space-x-2">
                <span class="text-lg">🎵</span>
                <span class="text-sm">舒缓音乐播放中</span>
              </div>
            </div>
            <div v-if="isVibrating" class="animate-bounce text-white/80">
              <div class="flex items-center justify-center space-x-2">
                <span class="text-lg">📱</span>
                <span class="text-sm">温柔按摩进行中</span>
              </div>
            </div>
            <div class="text-xs text-white/70">
              请将手机轻放在肚子上
            </div>
          </div>

          <!-- 小的停止按钮 -->
          <button
            class="fixed right-4 top-4 h-12 w-12 flex items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-300 sm:right-8 sm:top-8 sm:h-16 sm:w-16 active:scale-95 hover:bg-white/30"
            @click="stopComfort"
          >
            <span class="text-lg sm:text-2xl">⏹️</span>
          </button>
        </div>
      </div>

      <!-- 正常模式 -->
      <div v-else class="min-h-full flex flex-col items-center justify-center p-6 text-center">
        <!-- 温暖的背景 -->
        <div class="absolute inset-0 from-pink-100 via-rose-50 to-red-50 bg-gradient-to-br" />

        <!-- 浮动装饰 -->
        <div class="pointer-events-none absolute inset-0 overflow-hidden">
          <div class="animate-float absolute left-10 top-20 text-2xl text-pink-300/30">
            🌸
          </div>
          <div class="animate-float absolute right-16 top-32 text-xl text-rose-300/40" style="animation-delay: 1s;">
            💖
          </div>
          <div class="animate-float absolute bottom-32 left-1/4 text-lg text-pink-400/30" style="animation-delay: 2s;">
            🌺
          </div>
          <div class="animate-float absolute bottom-20 right-1/3 text-xl text-rose-400/40" style="animation-delay: 3s;">
            💕
          </div>
        </div>

        <!-- 主要内容区域 -->
        <div class="relative z-10 max-w-md w-full space-y-8">
          <!-- 标题区域 -->
          <div class="text-center space-y-4">
            <div class="animate-pulse text-6xl">
              🤗
            </div>
            <h1 class="text-2xl text-gray-800 font-bold">
              温暖的陪伴
            </h1>
            <p class="text-gray-600">
              让我用最温柔的方式陪伴你度过不舒服的时光
            </p>
          </div>

          <!-- 功能说明 -->
          <div class="border border-pink-200/50 rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
            <div class="space-y-4">
              <div class="flex items-center space-x-3">
                <div class="h-8 w-8 flex items-center justify-center rounded-full bg-pink-100">
                  <span class="text-sm text-pink-600">1</span>
                </div>
                <p class="text-sm text-gray-700">
                  点击"开始不疼"按钮
                </p>
              </div>
              <div class="flex items-center space-x-3">
                <div class="h-8 w-8 flex items-center justify-center rounded-full bg-pink-100">
                  <span class="text-sm text-pink-600">2</span>
                </div>
                <p class="text-sm text-gray-700">
                  将手机轻轻放在肚子上
                </p>
              </div>
              <div class="flex items-center space-x-3">
                <div class="h-8 w-8 flex items-center justify-center rounded-full bg-pink-100">
                  <span class="text-sm text-pink-600">3</span>
                </div>
                <p class="text-sm text-gray-700">
                  享受温暖的震动按摩和舒缓音乐
                </p>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="space-y-4">
            <button
              v-if="!isVibrating"
              class="w-full transform rounded-2xl from-pink-500 to-rose-500 bg-gradient-to-r px-6 py-4 text-white font-bold shadow-lg transition-all duration-300 active:scale-95 hover:scale-105"
              @click="startComfort"
            >
              <div class="flex items-center justify-center space-x-2">
                <span class="text-xl">🌸</span>
                <span>开始不疼</span>
              </div>
            </button>

            <button
              v-if="isVibrating"
              class="w-full transform rounded-2xl from-gray-500 to-gray-600 bg-gradient-to-r px-6 py-4 text-white font-bold shadow-lg transition-all duration-300 active:scale-95 hover:scale-105"
              @click="stopComfort"
            >
              <div class="flex items-center justify-center space-x-2">
                <span class="text-xl">⏹️</span>
                <span>停止</span>
              </div>
            </button>
          </div>

          <!-- 使用提示 -->
          <div v-if="showInstructions" class="animate-fade-in border border-pink-200 rounded-2xl bg-pink-50 p-4">
            <div class="mb-2 flex items-center space-x-2">
              <span class="text-lg text-pink-500">💝</span>
              <h3 class="text-pink-800 font-semibold">
                温馨提示
              </h3>
            </div>
            <p class="text-sm text-pink-700 leading-relaxed">
              请将手机轻轻放在肚子上，让温和的震动帮助缓解不适。同时播放的舒缓音乐会帮助你放松心情。记得多喝温水，注意保暖哦~ 💕
            </p>
          </div>

          <!-- 功能状态显示 -->
          <div v-if="isVibrating" class="text-center space-y-2">
            <div class="animate-pulse text-pink-500">
              <div class="flex items-center justify-center space-x-2">
                <span class="text-lg">🎵</span>
                <span class="text-sm">{{ isPlaying ? '正在播放舒缓音乐' : '音乐准备中...' }}</span>
              </div>
            </div>
            <div class="animate-bounce text-pink-600">
              <div class="flex items-center justify-center space-x-2">
                <span class="text-lg">📱</span>
                <span class="text-sm">震动按摩进行中</span>
              </div>
            </div>
            <div class="mt-2 text-xs text-gray-500">
              全屏状态: {{ isFullscreen ? '已启用' : '未启用' }}
            </div>
          </div>

          <!-- 设备兼容性提示 -->
          <div class="border border-blue-100 rounded-2xl from-blue-50 to-indigo-50 bg-gradient-to-r p-4 text-xs text-gray-600">
            <div class="space-y-1">
              <div>🔊 音频支持: {{ audioRef ? '✅' : '❌' }}</div>
              <div>📳 震动支持: {{ 'vibrate' in navigator ? '✅' : '❌' }}</div>
              <div>🖥️ 全屏支持: {{ 'requestFullscreen' in document.documentElement ? '✅' : '❌' }}</div>
              <div class="mt-2 text-xs text-gray-500">
                如果功能不工作，请尝试：<br>
                1. 确保使用HTTPS访问<br>
                2. 在手机浏览器中打开<br>
                3. 允许音频和震动权限
              </div>
            </div>
          </div>

          <!-- 贴心话语 -->
          <div class="border border-pink-100 rounded-2xl from-pink-50 to-rose-50 bg-gradient-to-r p-4">
            <div class="text-center space-y-2">
              <span class="text-2xl">💕</span>
              <p class="text-sm text-gray-700 italic">
                "你的不舒服，我都想替你承受。虽然不能在你身边，但希望这份温暖能陪伴你。"
              </p>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.period-care-content {
  --background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%);
}

.fullscreen-mode {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh; /* 动态视口高度，更好的移动端支持 */
  z-index: 9999;
  background: linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #ec4899 100%);
}

/* 确保全屏模式覆盖所有内容 */
.fullscreen-mode::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  z-index: -1;
}

/* 移动端优化 */
@media (max-width: 640px) {
  .fullscreen-mode {
    /* 确保在移动端完全覆盖 */
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    min-height: 100vh;
    min-height: 100dvh;
  }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 隐藏浏览器UI元素在全屏时 */
.fullscreen-mode {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* PWA全屏支持 */
@media (display-mode: fullscreen) {
  .fullscreen-mode {
    height: 100vh;
    height: 100dvh;
  }
}

@media (display-mode: standalone) {
  .fullscreen-mode {
    height: 100vh;
    height: 100dvh;
  }
}
</style>
