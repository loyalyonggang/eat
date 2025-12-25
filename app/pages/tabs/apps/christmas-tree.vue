<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

definePageMeta({
  alias: ['/apps/christmas-tree'],
})

useHead({
  title: 'Una和花不缺认识几天了',
})

const startDate = new Date('2025-12-13')
const currentDate = ref(new Date())
const daysPassed = ref(0)
const audioRef = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const showMusicButton = ref(false)

// 计算相识天数
function calculateDays() {
  const now = new Date()
  const timeDiff = now.getTime() - startDate.getTime()
  daysPassed.value = Math.floor(timeDiff / (1000 * 3600 * 24))
  currentDate.value = now
}

// 播放/暂停音乐
function toggleMusic() {
  if (audioRef.value) {
    if (isPlaying.value) {
      audioRef.value.pause()
      isPlaying.value = false
    }
    else {
      audioRef.value.play().catch(console.error)
      isPlaying.value = true
    }
  }
}

// 自动播放音乐
function autoPlayMusic() {
  if (audioRef.value) {
    // 尝试自动播放，如果失败则显示播放按钮
    audioRef.value.play().then(() => {
      isPlaying.value = true
    }).catch(() => {
      // 自动播放失败，显示播放按钮让用户手动点击
      showMusicButton.value = true
    })
  }
}

// 雪花和浪漫元素动画数据
const floatingElements = ref<Array<{
  id: number
  left: number
  animationDelay: number
  animationDuration: number
  size: number
  emoji: string
}>>([])

// 生成浮动元素
function generateFloatingElements() {
  const elements = ['❄️', '✨', '💫', '⭐', '🌟', '💕', '💖']
  floatingElements.value = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    animationDelay: Math.random() * 5,
    animationDuration: 4 + Math.random() * 6,
    size: 0.8 + Math.random() * 1.2,
    emoji: elements[Math.floor(Math.random() * elements.length)],
  }))
}

let timer: NodeJS.Timeout

onMounted(() => {
  calculateDays()
  generateFloatingElements()

  // 每秒更新时间
  timer = setInterval(calculateDays, 1000)

  // 延迟一秒后尝试自动播放音乐
  setTimeout(() => {
    autoPlayMusic()
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
  if (audioRef.value) {
    audioRef.value.pause()
  }
})
</script>

<template>
  <ion-page>
    <CustomHeader
      title="Una和花不缺认识几天了"
      :show-back-button="true"
      :transparent="true"
    >
      <template #end-buttons>
        <ion-button
          v-if="showMusicButton || isPlaying"
          fill="clear"
          color="light"
          @click="toggleMusic"
        >
          <ion-icon
            :name="isPlaying ? 'pause' : 'play'"
            class="text-xl text-white"
          />
        </ion-button>
      </template>
    </CustomHeader>

    <ion-content class="relative overflow-hidden">
      <ion-content class="relative overflow-hidden">
        <!-- 背景音乐 -->
        <audio
          ref="audioRef"
          loop
          preload="auto"
          @play="isPlaying = true"
          @pause="isPlaying = false"
        >
          <source src="/We-Wish-You-a-Merry-Christmas.mp3" type="audio/mpeg">
          您的浏览器不支持音频播放。
        </audio>

        <!-- 背景渐变 -->
        <div class="absolute inset-0 from-purple-900 via-pink-800 to-indigo-900 bg-gradient-to-b" />

        <!-- 星空背景 -->
        <div class="absolute inset-0">
          <div class="animate-twinkle absolute left-10 top-10 text-xl text-white/30">
            ⭐
          </div>
          <div class="animate-twinkle absolute right-16 top-20 text-lg text-white/20" style="animation-delay: 0.5s;">
            ✨
          </div>
          <div class="animate-twinkle absolute left-1/3 top-32 text-sm text-white/25" style="animation-delay: 1s;">
            🌟
          </div>
          <div class="animate-twinkle absolute right-1/4 top-40 text-base text-white/30" style="animation-delay: 1.5s;">
            💫
          </div>
          <div class="animate-twinkle absolute bottom-32 left-8 text-lg text-white/20" style="animation-delay: 2s;">
            ⭐
          </div>
          <div class="animate-twinkle absolute bottom-40 right-12 text-sm text-white/25" style="animation-delay: 2.5s;">
            ✨
          </div>
        </div>

        <!-- 浮动元素动画 -->
        <div class="pointer-events-none absolute inset-0">
          <div
            v-for="element in floatingElements"
            :key="element.id"
            class="animate-snowfall absolute text-white/60"
            :style="{
              left: `${element.left}%`,
              animationDelay: `${element.animationDelay}s`,
              animationDuration: `${element.animationDuration}s`,
              fontSize: `${element.size}rem`,
            }"
          >
            {{ element.emoji }}
          </div>
        </div>

        <!-- 主要内容 -->
        <div class="relative z-10 min-h-full flex flex-col items-center justify-center p-6 text-center">
          <!-- 圣诞树区域 -->
          <div class="animate-float relative mb-8">
            <div class="animate-glow-pulse text-9xl">
              🎄
            </div>

            <!-- 装饰星星 -->
            <div class="animate-twinkle absolute left-1/2 transform text-3xl text-yellow-300 -top-4 -translate-x-1/2">
              ⭐
            </div>

            <!-- 礼物盒 -->
            <div class="animate-heartbeat absolute text-3xl -bottom-6 -left-8">
              🎁
            </div>
            <div class="animate-heartbeat absolute text-3xl -bottom-6 -right-8" style="animation-delay: 1s;">
              🎁
            </div>

            <!-- 爱心装饰 -->
            <div class="animate-float absolute top-4 text-2xl text-pink-300 -left-12" style="animation-delay: 0.5s;">
              💕
            </div>
            <div class="animate-float absolute top-4 text-2xl text-pink-300 -right-12" style="animation-delay: 1.5s;">
              💖
            </div>
          </div>

          <!-- 倒计时文字 -->
          <div class="mb-8 text-white">
            <h1 class="animate-glow-pulse mb-6 text-3xl text-pink-200 font-bold">
              Una和花不缺相识已经
            </h1>

            <div class="relative">
              <div class="animate-heartbeat mb-6 text-7xl text-yellow-300 font-bold drop-shadow-2xl">
                {{ daysPassed }}
              </div>
              <!-- 数字周围的装饰 -->
              <div class="animate-twinkle absolute text-2xl -left-4 -top-2">
                ✨
              </div>
              <div class="animate-twinkle absolute text-2xl -right-4 -top-2" style="animation-delay: 0.5s;">
                ✨
              </div>
            </div>

            <h2 class="animate-glow-pulse text-3xl text-pink-200 font-bold" style="animation-delay: 1s;">
              天了
            </h2>
          </div>

          <!-- 浪漫文字 -->
          <div class="mx-auto mb-8 max-w-md text-center text-white/90 space-y-4">
            <p class="animate-float text-xl font-light italic">
              "时间记录着我们的每一个美好瞬间"
            </p>
            <p class="animate-float text-base text-white/70" style="animation-delay: 0.5s;">
              从 2025年12月13日 开始
            </p>
            <p class="animate-float text-base text-white/70" style="animation-delay: 1s;">
              每一天都是新的回忆 ✨
            </p>
          </div>

          <!-- 音乐提示 -->
          <div v-if="isPlaying" class="animate-float mb-4 text-sm text-white/60">
            🎵 正在播放: We Wish You a Merry Christmas 🎵
          </div>

          <!-- 手动播放音乐按钮 -->
          <div v-if="showMusicButton && !isPlaying" class="mb-6">
            <button
              class="animate-pulse rounded-full from-pink-500 to-purple-600 bg-gradient-to-r px-6 py-3 text-white shadow-lg transition-all duration-300 hover:shadow-xl"
              @click="toggleMusic"
            >
              🎵 点击播放圣诞音乐 🎵
            </button>
          </div>

          <!-- 装饰爱心 -->
          <div class="mb-6 flex justify-center text-3xl space-x-6">
            <span class="animate-heartbeat text-pink-400">💕</span>
            <span class="animate-twinkle text-yellow-300" style="animation-delay: 0.3s;">🌟</span>
            <span class="animate-heartbeat text-pink-400" style="animation-delay: 0.6s;">💖</span>
            <span class="animate-twinkle text-yellow-300" style="animation-delay: 0.9s;">✨</span>
            <span class="animate-heartbeat text-pink-400" style="animation-delay: 1.2s;">💕</span>
          </div>

          <!-- 当前时间 -->
          <div class="animate-float text-sm text-white/50" style="animation-delay: 2s;">
            {{ currentDate.toLocaleString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }) }}
          </div>
        </div>

        <!-- 底部渐变装饰 -->
        <div class="absolute bottom-0 left-0 right-0 h-24 from-black/20 to-transparent bg-gradient-to-t" />
      </ion-content>
    </ion-content>
  </ion-page>
</template>

<style scoped>
/* 确保动画类可以正常工作 */
.animate-snowfall {
  animation: snowfall linear infinite;
}

.animate-heartbeat {
  animation: heartbeat 2s ease-in-out infinite;
}

.animate-twinkle {
  animation: twinkle 1.5s ease-in-out infinite;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-glow-pulse {
  animation: glow-pulse 2s ease-in-out infinite;
}

/* 本地动画定义（以防全局样式未加载） */
@keyframes snowfall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

@keyframes heartbeat {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
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

@keyframes glow-pulse {
  0%,
  100% {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
  50% {
    text-shadow:
      0 0 25px rgba(255, 255, 255, 0.8),
      0 0 35px rgba(255, 255, 255, 0.6);
  }
}
</style>
