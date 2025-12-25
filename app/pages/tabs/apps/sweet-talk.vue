<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

definePageMeta({
  alias: ['/apps/sweet-talk'],
})

useHead({
  title: '土味情话',
})

// 当前卡片索引
const currentIndex = ref(0)
const isAnimating = ref(false)
const showLikedPage = ref(false)

// 用户喜好记录 - 使用localStorage持久化
const likedTalks = ref<string[]>([])

// 精简的土味情话（减少字数，更简洁）
const allTalks = [
  '你知道你和星星的区别吗？星星在天上，你在我心里',
  '我觉得你像游戏，什么游戏？我的世界',
  '你知道我最喜欢什么神吗？你的眼神',
  '我感冒了，因为对你没有抵抗力',
  '你知道我想成为什么吗？你的人',
  '我最大的缺点是什么？缺点你',
  '你知道我喜欢什么季节吗？有你的季节',
  '你知道我想吃什么吗？痴痴地望着你',
  '你知道我为什么这么高吗？天塌下来我替你顶着',
  '你知道我最怕什么吗？怕失去你',
  '你知道我最想去哪里吗？去你心里',
  '你知道我为什么要学游泳吗？游到你心里',
  '你知道我为什么不吃糖吗？因为你太甜了',
  '你知道我最喜欢什么颜色吗？你的脸红色',
  '你知道我最想要什么超能力吗？看穿你的心思',
  '你知道我最喜欢什么花吗？有钱花，和你一起花',
  '你知道我最怕什么鬼吗？怕你这个小鬼',
  '你知道我最想变成什么吗？变成你的心跳',
  '你知道我最想听什么歌吗？你的心跳声',
  '你知道我最想看什么电影吗？你的一生',
  '你是我的小苹果，怎么爱你都不嫌多',
  '你是电，李四光，你是唯一的神话',
  '你是风儿我是沙，缠缠绵绵到天涯',
  '你是我的优乐美，我可以捧你在手心吗？',
  '你是太阳我是向日葵，永远向着你',
  '你是我的小确幸，也是我的大满足',
  '你是我见过最美的意外，最想要的未来',
  '你是我的软肋，也是我的铠甲',
  '你是我的例外，也是我的偏爱',
  '我想你一定很忙，所以只看前三个字就好',
  '我怀疑你是碳酸饮料，见到你就冒泡',
  '我觉得你今天有点怪，怪好看的',
  '我发现你是个骗子，比照片还好看',
  '我想我是中毒了，中了你的毒',
  '我想和你一起看日出日落，看春夏秋冬',
  '我想把世界最好的给你，发现最好的就是你',
  '我想要两颗糖，你给我的，我给你的',
  '我想牵你的手，从心动到古稀',
  '我想陪你从新鲜感到归属感',
  '我想做你的小朋友，不分手的那种',
  '我想做你的心脏，我不跳你就得死',
  '我想做你的手机，你就会天天捧着我',
  '我想做你的影子，时刻陪着你',
  '我想做你的空气，你就离不开我了',
  '我想做你的阳光，每天照亮你',
  '我想做你的月亮，每晚陪伴你',
  '我想做你的彩虹，在你难过时出现',
  '我想做你的外套，时刻保护你',
  '我想做你的围巾，紧紧拥抱你',
  '我想做你的戒指，套牢你的心',
]

// 随机打乱的情话数组
const shuffledTalks = ref<string[]>([])

// 当前显示的情话
const currentTalk = computed(() => shuffledTalks.value[currentIndex.value] || '')

// 浮动爱心
const floatingHearts = ref<Array<{
  id: number
  left: number
  top: number
  animationDelay: number
  animationDuration: number
  size: number
  emoji: string
}>>([])

// 卡片动画状态
const cardAnimation = ref('')

// 打乱数组
function shuffleArray(array: string[]) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// 生成浮动爱心
function generateFloatingHearts() {
  const hearts = ['💕', '💖', '💗', '💝', '💘', '❤️']
  floatingHearts.value = Array.from({ length: 8 }, (_, i) => ({
    id: Date.now() + i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    animationDelay: Math.random() * 2,
    animationDuration: 2 + Math.random() * 2,
    size: 0.8 + Math.random() * 0.6,
    emoji: hearts[Math.floor(Math.random() * hearts.length)],
  }))
}

// 下一张卡片
function nextCard() {
  if (isAnimating.value)
    return

  isAnimating.value = true
  cardAnimation.value = 'slide-out-left'

  setTimeout(() => {
    currentIndex.value = (currentIndex.value + 1) % shuffledTalks.value.length
    cardAnimation.value = 'slide-in-right'

    setTimeout(() => {
      cardAnimation.value = ''
      isAnimating.value = false
    }, 300)
  }, 150)
}

// 喜欢动画
function likeTalk() {
  if (isAnimating.value)
    return

  const talk = currentTalk.value
  if (talk && !likedTalks.value.includes(talk)) {
    likedTalks.value.push(talk)
    saveLikedTalks()
  }

  // 爱心爆炸效果
  generateFloatingHearts()
  cardAnimation.value = 'like-animation'

  setTimeout(() => {
    nextCard()
  }, 600)
}

// 不喜欢动画
function dislikeTalk() {
  if (isAnimating.value)
    return

  cardAnimation.value = 'dislike-animation'

  setTimeout(() => {
    nextCard()
  }, 400)
}

// 保存喜欢的情话到localStorage
function saveLikedTalks() {
  if (import.meta.client) {
    localStorage.setItem('likedTalks', JSON.stringify(likedTalks.value))
  }
}

// 加载喜欢的情话
function loadLikedTalks() {
  if (import.meta.client) {
    const saved = localStorage.getItem('likedTalks')
    if (saved) {
      likedTalks.value = JSON.parse(saved)
    }
  }
}

// 删除喜欢的情话
function removeLikedTalk(talk: string) {
  const index = likedTalks.value.indexOf(talk)
  if (index > -1) {
    likedTalks.value.splice(index, 1)
    saveLikedTalks()
  }
}

// 触摸滑动
let startX = 0
let startY = 0

function handleTouchStart(e: TouchEvent) {
  startX = e.touches[0].clientX
  startY = e.touches[0].clientY
}

function handleTouchEnd(e: TouchEvent) {
  if (isAnimating.value)
    return

  const endX = e.changedTouches[0].clientX
  const endY = e.changedTouches[0].clientY
  const diffX = startX - endX
  const diffY = startY - endY

  // 水平滑动
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 80) {
    if (diffX > 0) {
      // 向左滑动 - 不喜欢
      dislikeTalk()
    }
    else {
      // 向右滑动 - 喜欢
      likeTalk()
    }
  }
  // 向上滑动 - 下一张
  else if (diffY > 80) {
    nextCard()
  }
}

onMounted(() => {
  loadLikedTalks()
  shuffledTalks.value = shuffleArray(allTalks)
  generateFloatingHearts()
})
</script>

<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="bg-transparent">
        <ion-buttons slot="start">
          <ion-back-button default-href="/apps" color="light" />
        </ion-buttons>
        <ion-title class="text-white font-bold">
          {{ showLikedPage ? '我的喜欢' : '土味情话' }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button
            fill="clear"
            color="light"
            @click="showLikedPage = !showLikedPage"
          >
            <ion-icon :name="showLikedPage ? 'heart-outline' : 'heart'" class="text-xl text-white" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="relative overflow-hidden">
      <!-- 背景渐变 -->
      <div class="absolute inset-0 from-purple-600 via-pink-500 to-rose-500 bg-gradient-to-br" />

      <!-- 浮动爱心动画 -->
      <div class="pointer-events-none absolute inset-0">
        <div
          v-for="heart in floatingHearts"
          :key="heart.id"
          class="animate-float-heart absolute text-white/30"
          :style="{
            left: `${heart.left}%`,
            top: `${heart.top}%`,
            animationDelay: `${heart.animationDelay}s`,
            animationDuration: `${heart.animationDuration}s`,
            fontSize: `${heart.size}rem`,
          }"
        >
          {{ heart.emoji }}
        </div>
      </div>

      <!-- 主卡片页面 -->
      <div v-if="!showLikedPage" class="relative z-10 min-h-full flex flex-col items-center justify-center p-6">
        <!-- 卡片容器 -->
        <div
          class="relative mx-auto max-w-sm w-full"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
        >
          <!-- 主卡片 -->
          <div
            class="relative min-h-[350px] flex flex-col transform justify-center overflow-hidden rounded-3xl bg-white/95 p-8 shadow-2xl backdrop-blur-sm transition-all duration-300"
            :class="{
              'animate-slide-out-left': cardAnimation === 'slide-out-left',
              'animate-slide-in-right': cardAnimation === 'slide-in-right',
              'animate-like': cardAnimation === 'like-animation',
              'animate-dislike': cardAnimation === 'dislike-animation',
            }"
          >
            <!-- 卡片头部 -->
            <div class="mb-6 text-center">
              <div class="animate-heartbeat mb-4 text-4xl">
                💌
              </div>
            </div>

            <!-- 情话内容 -->
            <div class="flex flex-1 items-center justify-center">
              <p class="text-center text-lg text-gray-700 font-medium leading-relaxed">
                {{ currentTalk }}
              </p>
            </div>
          </div>

          <!-- 背景卡片（营造层次感） -->
          <div class="absolute inset-0 rotate-1 transform rounded-3xl bg-white/60 -z-10" />
          <div class="absolute inset-0 rotate-2 transform rounded-3xl bg-white/30 -z-20" />
        </div>

        <!-- 操作按钮 -->
        <div class="mx-auto mt-8 max-w-sm w-full flex items-center justify-between">
          <!-- 不喜欢按钮 -->
          <button
            :disabled="isAnimating"
            class="flex items-center gap-2 rounded-full bg-gray-500/80 px-5 py-3 text-white font-bold shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-gray-600 disabled:opacity-50"
            @click="dislikeTalk"
          >
            <span class="text-xl">😅</span>
          </button>

          <!-- 喜欢按钮 -->
          <button
            :disabled="isAnimating"
            class="flex items-center gap-2 rounded-full bg-pink-500/80 px-5 py-3 text-white font-bold shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-pink-600 disabled:opacity-50"
            @click="likeTalk"
          >
            <span class="text-xl">💕</span>
          </button>
        </div>

        <!-- 滑动提示 -->
        <div class="mt-4 text-center text-sm text-white/60">
          👈 左滑不喜欢 · 右滑喜欢 👉
        </div>
      </div>

      <!-- 喜欢的情话页面 -->
      <div v-else class="relative z-10 p-6">
        <div v-if="likedTalks.length === 0" class="mt-20 text-center text-white/80">
          <div class="mb-4 text-6xl">
            💔
          </div>
          <p class="text-lg">
            还没有喜欢的情话哦
          </p>
          <p class="mt-2 text-sm">
            去看看情话，给喜欢的点个心吧~
          </p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="(talk, index) in likedTalks"
            :key="index"
            class="rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur-sm"
          >
            <div class="flex items-start justify-between">
              <p class="flex-1 pr-2 text-gray-700 leading-relaxed">
                {{ talk }}
              </p>
              <button
                class="p-1 text-red-400 transition-colors hover:text-red-600"
                @click="removeLikedTalk(talk)"
              >
                <ion-icon name="heart-dislike" class="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
/* 卡片动画 */
@keyframes slide-out-left {
  0% {
    transform: translateX(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateX(-100%) rotate(-10deg);
    opacity: 0;
  }
}

@keyframes slide-in-right {
  0% {
    transform: translateX(100%) rotate(10deg);
    opacity: 0;
  }
  100% {
    transform: translateX(0) rotate(0deg);
    opacity: 1;
  }
}

@keyframes like-animation {
  0% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.1) rotate(5deg);
  }
  100% {
    transform: scale(1.2) rotate(10deg);
    opacity: 0;
  }
}

@keyframes dislike-animation {
  0% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(0.9) rotate(-5deg);
  }
  100% {
    transform: scale(0.8) rotate(-10deg);
    opacity: 0;
  }
}

@keyframes float-heart {
  0% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 1;
  }
  100% {
    transform: translateY(-40px) rotate(360deg);
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

.animate-slide-out-left {
  animation: slide-out-left 0.3s ease-in-out forwards;
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-in-out forwards;
}

.animate-like {
  animation: like-animation 0.6s ease-in-out forwards;
}

.animate-dislike {
  animation: dislike-animation 0.4s ease-in-out forwards;
}

.animate-float-heart {
  animation: float-heart linear infinite;
}

.animate-heartbeat {
  animation: heartbeat 2s ease-in-out infinite;
}
</style>
