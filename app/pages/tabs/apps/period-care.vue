<script setup lang="ts">
import { onUnmounted, ref } from 'vue'

definePageMeta({
  alias: ['/apps/period-care'],
})

useHead({
  title: 'Una 有肚子不疼偏方吗',
})

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
  isFullscreen.value = true

  // 进入全屏模式
  try {
    if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen()
    }
  }
  catch (error) {
    console.error('全屏模式失败:', error)
  }

  // 开始播放音乐
  if (audioRef.value) {
    try {
      await audioRef.value.play()
      isPlaying.value = true
    }
    catch (error) {
      console.error('音乐播放失败:', error)
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
    if (document.fullscreenElement && document.exitFullscreen) {
      await document.exitFullscreen()
    }
  }
  catch (error) {
    console.error('退出全屏失败:', error)
  }

  // 停止音乐
  if (audioRef.value) {
    audioRef.value.pause()
    isPlaying.value = false
  }

  // 停止震动
  stopVibration()
}

// 开始震动
function startVibration() {
  // 检查是否支持震动
  if ('vibrate' in navigator) {
    // 持续震动模式：震动1000ms，停止500ms，循环
    const vibratePattern = () => {
      navigator.vibrate(1000)
    }

    // 立即开始第一次震动
    vibratePattern()

    // 设置定时器持续震动
    vibrationInterval.value = setInterval(vibratePattern, 1500)
  }
  else {
    // 设备不支持震动功能
  }
}

// 停止震动
function stopVibration() {
  if (vibrationInterval.value) {
    clearInterval(vibrationInterval.value)
    vibrationInterval.value = null
  }

  // 停止当前震动
  if ('vibrate' in navigator) {
    navigator.vibrate(0)
  }
}

// 组件卸载时清理
onUnmounted(() => {
  stopComfort()
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
        <div class="relative z-10 h-full flex flex-col items-center justify-center">
          <!-- 不疼大字 -->
          <div class="mb-8 text-center">
            <h1 class="animate-pulse text-8xl text-white font-bold drop-shadow-2xl md:text-9xl">
              不疼
            </h1>
          </div>

          <!-- 温暖的话语 -->
          <div class="mb-16 px-8 text-center">
            <p class="text-sm text-white/80 leading-relaxed italic drop-shadow-lg md:text-base">
              "你的不舒服，我都想替你承受。虽然不能在你身边，但希望这份温暖能陪伴你。"
            </p>
          </div>

          <!-- 小的停止按钮 -->
          <button
            class="absolute right-8 top-8 h-16 w-16 flex items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/30"
            @click="stopComfort"
          >
            <span class="text-2xl">⏹️</span>
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

          <!-- 状态显示 -->
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
  z-index: 9999;
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
</style>
