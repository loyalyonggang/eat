<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

definePageMeta({
  alias: ['/apps/christmas-tree'],
})

useHead({
  title: 'Una和花不缺相恋几天',
})

const startDate = new Date('2025-12-13')
const currentDate = ref(new Date())
const daysPassed = ref(0)
const audioRef = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const showMusicButton = ref(false)
const volume = ref(0.7) // 默认音量70%

// 音乐列表
const musicList = [
  {
    id: 1,
    title: '二零二五的冬天',
    file: '/二零二五的冬天.mp3',
  },
  {
    id: 2,
    title: '冬藏',
    file: '/冬藏.wav',
  },
  {
    id: 3,
    title: '私有频段',
    file: '/私有频段.mp3',
  },
]

const currentMusicIndex = ref(0)
const showMusicSelector = ref(false)

// 获取当前音乐
const currentMusic = computed(() => musicList[currentMusicIndex.value] || musicList[0])

// 计算相识天数
function calculateDays() {
  const now = new Date()
  const timeDiff = now.getTime() - startDate.getTime()
  daysPassed.value = Math.floor(timeDiff / (1000 * 3600 * 24))
  currentDate.value = now
}

// 切换音乐选择器
function toggleMusicSelector() {
  showMusicSelector.value = !showMusicSelector.value
}

// 选择音乐
function selectMusic(index: number) {
  if (currentMusicIndex.value !== index) {
    const wasPlaying = isPlaying.value

    // 停止当前音乐
    if (audioRef.value) {
      audioRef.value.pause()
      isPlaying.value = false
    }

    // 切换到新音乐
    currentMusicIndex.value = index

    // 等待下一帧后重新加载音频
    nextTick(() => {
      if (audioRef.value && wasPlaying) {
        audioRef.value.load()
        audioRef.value.volume = volume.value
        audioRef.value.play().then(() => {
          isPlaying.value = true
        }).catch(console.error)
      }
    })
  }

  showMusicSelector.value = false
}
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

// 设置音量
function setVolume(newVolume: number) {
  volume.value = newVolume
  if (audioRef.value) {
    audioRef.value.volume = newVolume
  }
}

// 自动播放音乐
function autoPlayMusic() {
  if (audioRef.value) {
    // 设置初始音量
    audioRef.value.volume = volume.value

    // 总是显示音乐按钮
    showMusicButton.value = true

    // 尝试自动播放，如果失败则显示播放按钮
    audioRef.value.play().then(() => {
      isPlaying.value = true
    }).catch(() => {
      // 自动播放失败，用户需要手动点击
      isPlaying.value = false
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
  const elements = ['💕', '✨']
  floatingElements.value = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    animationDelay: Math.random() * 5,
    animationDuration: 6 + Math.random() * 4,
    size: 0.8 + Math.random() * 0.6,
    emoji: elements[Math.floor(Math.random() * elements.length)] || '💕',
  }))
}

let timer: NodeJS.Timeout

onMounted(() => {
  calculateDays()
  generateFloatingElements()

  // 每秒更新时间
  timer = setInterval(calculateDays, 1000)

  // 立即显示音乐按钮
  showMusicButton.value = true

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
      title="Una和花不缺相恋几天"
      :show-back-button="true"
      back-href="/apps"
    >
      <template #end-buttons>
        <!-- 播放/暂停按钮 -->
        <ion-button
          fill="clear"
          class="header-button"
          @click="toggleMusic"
        >
          <ion-icon
            :icon="isPlaying ? ioniconsPause : ioniconsPlay"
            class="text-xl"
          />
        </ion-button>
      </template>
    </CustomHeader>

    <ion-content class="relative overflow-hidden">
      <!-- 背景视频 -->
      <video
        class="absolute inset-0 h-full w-full object-cover"
        autoplay
        muted
        loop
        playsinline
        preload="auto"
      >
        <source src="/mv.mp4" type="video/mp4">
        您的浏览器不支持视频播放。
      </video>

      <!-- 视频遮罩层 -->
      <div class="absolute inset-0 bg-black/20" />

      <!-- 背景音乐 -->
      <audio
        ref="audioRef"
        loop
        preload="auto"
        @play="isPlaying = true"
        @pause="isPlaying = false"
      >
        <source :src="currentMusic?.file" type="audio/mpeg">
        <source :src="currentMusic?.file" type="audio/wav">
        您的浏览器不支持音频播放。
      </audio>

      <!-- 音乐选择器弹窗 -->
      <ion-modal :is-open="showMusicSelector" @did-dismiss="showMusicSelector = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>选择音乐</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="showMusicSelector = false">
                <ion-icon :icon="ioniconsClose" />
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="music-selector-content">
          <div class="p-4 space-y-3">
            <div
              v-for="(music, index) in musicList"
              :key="music.id"
              class="music-item"
              :class="{ active: currentMusicIndex === index }"
              @click="selectMusic(index)"
            >
              <div class="flex cursor-pointer items-center justify-between rounded-xl bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/20">
                <div class="flex items-center space-x-3">
                  <ion-icon
                    :icon="currentMusicIndex === index && isPlaying ? ioniconsVolumeHighOutline : ioniconsMusicalNotesOutline"
                    class="text-xl"
                    :class="currentMusicIndex === index ? 'text-pink-400' : 'text-white/70'"
                  />
                  <span
                    class="text-base font-medium"
                    :class="currentMusicIndex === index ? 'text-pink-200' : 'text-white/90'"
                  >
                    {{ music.title }}
                  </span>
                </div>
                <ion-icon
                  v-if="currentMusicIndex === index"
                  :icon="ioniconsCheckmarkCircle"
                  class="text-xl text-pink-400"
                />
              </div>
            </div>
          </div>
        </ion-content>
      </ion-modal>

      <!-- 简化背景装饰 -->
      <div class="absolute inset-0 z-10">
        <div class="animate-twinkle absolute left-10 top-10 text-lg text-pink-300/30">
          💕
        </div>
        <div class="animate-twinkle absolute right-16 top-20 text-base text-pink-300/20" style="animation-delay: 1s;">
          ✨
        </div>
        <div class="animate-twinkle absolute bottom-32 left-8 text-base text-pink-300/20" style="animation-delay: 2s;">
          💕
        </div>
        <div class="animate-twinkle absolute bottom-40 right-12 text-sm text-pink-300/30" style="animation-delay: 3s;">
          ✨
        </div>
      </div>

      <!-- 浮动元素动画 -->
      <div class="pointer-events-none absolute inset-0 z-10">
        <div
          v-for="element in floatingElements"
          :key="element.id"
          class="animate-snowfall absolute text-pink-300/60"
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

      <!-- 主要内容 - 使用flex布局确保在一屏内 -->
      <div class="relative z-20 h-full flex flex-col items-center justify-between p-4 text-center">
        <!-- 顶部区域：主要内容 -->
        <div class="flex flex-col items-center">
          <!-- 主要装饰 -->
          <div class="animate-float relative mb-4">
            <div class="animate-glow-pulse text-6xl">
              💕
            </div>
            <div class="animate-twinkle absolute left-1/2 transform text-xl text-pink-300 -top-2 -translate-x-1/2">
              ✨
            </div>
          </div>

          <!-- 标题文字 -->
          <div class="mb-4 text-white">
            <h1 class="animate-glow-pulse mb-2 flex items-center justify-center text-xl text-white font-bold drop-shadow-2xl space-x-2">
              <ion-icon :icon="ioniconsPeopleOutline" class="text-pink-300 drop-shadow-lg" />
              <span class="rounded-lg bg-black/30 px-3 py-1 backdrop-blur-sm">Una和花不缺相恋已经</span>
            </h1>
            <div class="animate-heartbeat mb-2 inline-block rounded-xl bg-black/30 px-4 py-2 text-5xl text-yellow-300 font-bold backdrop-blur-sm drop-shadow-2xl">
              {{ daysPassed }}
            </div>
            <h2 class="animate-glow-pulse flex items-center justify-center text-xl text-white font-bold">
              <span class="rounded-lg bg-black/30 px-3 py-1 backdrop-blur-sm">天</span>
            </h2>
          </div>
        </div>

        <!-- 中间区域：浪漫文字 -->
        <div class="mx-auto max-w-md text-center text-white space-y-3">
          <p class="animate-float flex items-center justify-center text-base font-light italic space-x-2">
            <ion-icon :icon="ioniconsHeartOutline" class="text-pink-300 drop-shadow-lg" />
            <span class="rounded-lg bg-black/40 px-3 py-2 backdrop-blur-sm">"时间记录着我们的每一个美好瞬间"</span>
            <ion-icon :icon="ioniconsHeartOutline" class="text-pink-300 drop-shadow-lg" />
          </p>
          <p class="animate-float flex items-center justify-center text-sm text-white space-x-1">
            <ion-icon :icon="ioniconsCalendarOutline" class="text-purple-300 drop-shadow-lg" />
            <span class="rounded-lg bg-black/40 px-3 py-1 backdrop-blur-sm">从 2025年12月13日 开始</span>
          </p>
          <p class="animate-float flex items-center justify-center text-sm text-white space-x-1">
            <ion-icon :icon="ioniconsSparklesOutline" class="text-yellow-300 drop-shadow-lg" />
            <span class="rounded-lg bg-black/40 px-3 py-1 backdrop-blur-sm">每一天都是新的回忆</span>
          </p>
        </div>

        <!-- 音乐控制区域 -->
        <div class="flex flex-col items-center rounded-2xl bg-black/30 p-4 backdrop-blur-sm space-y-3">
          <!-- 音乐状态显示 -->
          <div class="animate-float text-center">
            <div class="mb-1 flex items-center justify-center text-base text-white font-medium space-x-2">
              <ion-icon :icon="ioniconsMusicalNotesOutline" class="text-lg text-pink-300 drop-shadow-lg" />
              <span class="drop-shadow-lg">{{ currentMusic?.title }}</span>
            </div>
            <div class="flex items-center justify-center text-xs text-white/80 space-x-1">
              <ion-icon
                :icon="isPlaying ? ioniconsRadio : ioniconsRadioOutline"
                class="text-sm drop-shadow-lg"
                :class="isPlaying ? 'text-green-400' : 'text-gray-300'"
              />
              <span class="drop-shadow-lg">{{ isPlaying ? '正在播放' : '已暂停' }}</span>
            </div>
          </div>

          <!-- 歌曲选择按钮 -->
          <div class="flex justify-center">
            <button
              class="flex items-center rounded-full from-indigo-500 to-purple-600 bg-gradient-to-r px-6 py-3 text-white shadow-xl transition-all duration-300 active:scale-95 hover:scale-105 space-x-2"
              @click="toggleMusicSelector"
            >
              <ion-icon :icon="ioniconsMusicalNotesOutline" class="text-lg" />
              <span class="text-sm font-medium">选择歌曲</span>
              <ion-icon :icon="ioniconsChevronDownOutline" class="text-sm" />
            </button>
          </div>

          <!-- 音乐控制按钮 -->
          <div class="flex items-center space-x-4">
            <!-- 音量减小按钮 -->
            <button
              class="h-10 w-10 flex items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-300 active:scale-95 hover:bg-white/30"
              @click="setVolume(Math.max(0, volume - 0.1))"
            >
              <ion-icon :icon="ioniconsVolumeLowOutline" class="text-base" />
            </button>

            <!-- 播放/暂停按钮 -->
            <button
              class="h-12 w-12 flex items-center justify-center rounded-full from-pink-500 to-purple-600 bg-gradient-to-r text-white shadow-xl transition-all duration-300 active:scale-95 hover:scale-110"
              @click="toggleMusic"
            >
              <ion-icon
                :icon="isPlaying ? ioniconsPause : ioniconsPlay"
                class="text-xl"
              />
            </button>

            <!-- 音量增大按钮 -->
            <button
              class="h-10 w-10 flex items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-300 active:scale-95 hover:bg-white/30"
              @click="setVolume(Math.min(1, volume + 0.1))"
            >
              <ion-icon :icon="ioniconsVolumeHighOutline" class="text-base" />
            </button>
          </div>

          <!-- 音量指示器 -->
          <div class="flex items-center space-x-2">
            <ion-icon :icon="ioniconsVolumeLowOutline" class="text-xs text-white/40" />
            <div class="h-1.5 w-16 overflow-hidden rounded-full bg-white/20">
              <div
                class="h-full from-pink-400 to-purple-500 bg-gradient-to-r transition-all duration-300"
                :style="{ width: `${volume * 100}%` }"
              />
            </div>
            <ion-icon :icon="ioniconsVolumeHighOutline" class="text-xs text-white/40" />
          </div>

          <!-- 音乐进度指示器 -->
          <div v-if="isPlaying" class="flex items-center text-white/40 space-x-1">
            <div class="h-0.5 w-0.5 animate-pulse rounded-full bg-pink-400" />
            <div class="h-0.5 w-0.5 animate-pulse rounded-full bg-purple-400" style="animation-delay: 0.2s;" />
            <div class="h-0.5 w-0.5 animate-pulse rounded-full bg-pink-400" style="animation-delay: 0.4s;" />
            <div class="h-0.5 w-0.5 animate-pulse rounded-full bg-purple-400" style="animation-delay: 0.6s;" />
            <div class="h-0.5 w-0.5 animate-pulse rounded-full bg-pink-400" style="animation-delay: 0.8s;" />
          </div>
        </div>

        <!-- 底部区域：装饰爱心和时间 -->
        <div class="flex flex-col items-center space-y-2">
          <!-- 装饰爱心 -->
          <div class="flex justify-center text-lg space-x-4">
            <span class="animate-heartbeat text-pink-400">💕</span>
            <span class="animate-twinkle text-pink-400" style="animation-delay: 0.6s;">✨</span>
            <span class="animate-heartbeat text-pink-400" style="animation-delay: 1.2s;">💕</span>
          </div>

          <!-- 当前时间 -->
          <div class="animate-float flex items-center justify-center text-xs text-white/70 space-x-1">
            <ion-icon :icon="ioniconsTimeOutline" class="text-xs drop-shadow-lg" />
            <span class="rounded bg-black/30 px-2 py-1 backdrop-blur-sm drop-shadow-lg">{{ currentDate.toLocaleString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }) }}</span>
          </div>
        </div>
      </div>
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

.header-button {
  --color: #6b7280;
  --color-hover: #ec4899;
  margin-right: 8px;
}

.header-button:hover {
  --color: #ec4899;
}

@media (prefers-color-scheme: dark) {
  .header-button {
    --color: #9ca3af;
  }

  .header-button:hover {
    --color: #ec4899;
  }
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

/* 音乐选择器样式 */
.music-selector-content {
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.music-item.active .music-item-content {
  background: rgba(236, 72, 153, 0.2);
  border: 1px solid rgba(236, 72, 153, 0.3);
}
</style>
