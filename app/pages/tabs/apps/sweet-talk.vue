<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

definePageMeta({
  alias: ['/apps/sweet-talk'],
})

useHead({
  title: '土味情话 - Una和花不缺',
})

// 当前卡片索引
const currentIndex = ref(0)
const isAnimating = ref(false)

// 用户喜好记录
const preferences = ref<Record<number, 'like' | 'dislike'>>({})

// 100条土味情话
const sweetTalks = [
  '你知道你和星星有什么区别吗？星星在天上，你在我心里。',
  '我觉得你特别像一款游戏，什么游戏？我的世界。',
  '你知道我最喜欢什么神吗？你的眼神。',
  '你知道我为什么感冒了吗？因为我对你完全没有抵抗力。',
  '你知道我想成为什么吗？成为你的人。',
  '你知道我最大的缺点是什么吗？缺点你。',
  '你知道我喜欢什么季节吗？有你的季节。',
  '你知道我喜欢喝什么吗？呵护你。',
  '你知道我想吃什么吗？痴痴地望着你。',
  '你知道我最喜欢什么动物吗？你这只小猪猪。',
  '你知道我为什么这么高吗？因为天塌下来我要替你顶着。',
  '你知道我喜欢什么天气吗？和你在一起的天气。',
  '你知道我最怕什么吗？怕失去你。',
  '你知道我最想去哪里吗？去你心里。',
  '你知道我最想做什么吗？做你的小宝贝。',
  '你知道我为什么要学游泳吗？因为我要游到你心里。',
  '你知道我为什么不吃糖吗？因为你太甜了。',
  '你知道我为什么这么笨吗？因为我被你迷住了。',
  '你知道我最喜欢什么颜色吗？你的脸红色。',
  '你知道我最想要什么超能力吗？看穿你的心思。',
  '你知道我最喜欢什么花吗？有钱花，和你一起花。',
  '你知道我最想学什么吗？学会照顾你。',
  '你知道我最怕什么鬼吗？怕你这个小鬼。',
  '你知道我最想变成什么吗？变成你的心跳。',
  '你知道我最想听什么歌吗？你的心跳声。',
  '你知道我最想看什么电影吗？你的一生。',
  '你知道我最想去什么地方旅行吗？你的心房。',
  '你知道我最想要什么礼物吗？你的拥抱。',
  '你知道我最想实现什么愿望吗？和你在一起。',
  '你知道我最想说什么话吗？我爱你。',
  '你知道我最想做什么梦吗？梦见你。',
  '你知道我最想要什么吗？要你一辈子开心。',
  '你知道我最想成为什么吗？成为你的依靠。',
  '你知道我最想拥有什么吗？拥有你的心。',
  '你知道我最想保护什么吗？保护你的笑容。',
  '你知道我最想珍惜什么吗？珍惜和你的每一刻。',
  '你知道我最想记住什么吗？记住你的样子。',
  '你知道我最想忘记什么吗？忘记没有你的日子。',
  '你知道我最想重复什么吗？重复说我爱你。',
  '你知道我最想停止什么吗？停止想你，但是做不到。',
  '你是我的小呀小苹果，怎么爱你都不嫌多。',
  '你是电，李四光，你是唯一的神话。',
  '你是风儿我是沙，缠缠绵绵到天涯。',
  '你是我的优乐美，我可以捧你在手心吗？',
  '你是麦当劳，我是肯德基，你是我的爱人，我是你的甜心。',
  '你是太阳我是向日葵，我永远会向着你。',
  '你是我的小确幸，也是我的大满足。',
  '你是我见过最美的意外，也是我最想要的未来。',
  '你是我的软肋，也是我的铠甲。',
  '你是我的例外，也是我的偏爱。',
  '我想你一定很忙，所以只看前三个字就好了。',
  '我怀疑你是碳酸饮料，为什么我一见到你就开心得冒泡。',
  '我觉得你今天有点怪，怪好看的。',
  '我发现你是个骗子，因为你比照片还要好看。',
  '我想我是中毒了，中了你的毒。',
  '我想对你说一句话，但是我不敢，我怕你生气。算了还是说吧：我爱你。',
  '我想和你一起看日出日落，看春夏秋冬。',
  '我想和你虚度时光，比如低头看鱼，比如把茶杯留在桌子上离开。',
  '我想把世界上最好的都给你，却发现世界上最好的就是你。',
  '我想要和你一起慢慢变老，然后对你说：原来你也这么好看。',
  '我想要两颗糖，一颗是你给我的，一颗是我给你的。',
  '我想要的很简单，时光还在，你还在。',
  '我想牵你的手，从心动到古稀。',
  '我想陪你从新鲜感走到归属感和安全感。',
  '我想做你的小朋友，不分手的那种。',
  '我想做你的心脏，至少我不跳你就得死。',
  '我想做你的枕头，每天都能抱着你。',
  '我想做你的被子，每天都能温暖你。',
  '我想做你的手机，这样你就会天天捧着我。',
  '我想做你的影子，这样就能时刻陪着你。',
  '我想做你的空气，这样你就离不开我了。',
  '我想做你的阳光，每天都能照亮你。',
  '我想做你的月亮，每晚都能陪伴你。',
  '我想做你的星星，为你点亮夜空。',
  '我想做你的彩虹，在你难过时出现。',
  '我想做你的雨伞，为你遮风挡雨。',
  '我想做你的外套，时刻保护着你。',
  '我想做你的围巾，紧紧拥抱着你。',
  '我想做你的手套，牵着你的手。',
  '我想做你的鞋子，陪你走遍天涯。',
  '我想做你的眼镜，让你看清我的心。',
  '我想做你的口红，每天都能亲吻你。',
  '我想做你的项链，贴近你的心脏。',
  '我想做你的戒指，套牢你的心。',
  '我想做你的手表，记录我们的时光。',
  '我想做你的钱包，装满我们的回忆。',
  '我想做你的钥匙，打开你的心门。',
  '我想做你的充电器，给你满满的能量。',
  '我想做你的WiFi，让你时刻连接我。',
  '我想做你的闹钟，每天叫醒你。',
  '我想做你的床，让你每晚都想着我。',
  '我想做你的梦，在你睡觉时陪伴你。',
  '我想做你的早餐，每天都能滋养你。',
  '我想做你的晚餐，结束你一天的疲惫。',
  '我想做你的茶，温暖你的心房。',
  '我想做你的咖啡，提神醒脑想着我。',
  '我想做你的糖，甜蜜你的生活。',
  '我想做你的盐，调味你的人生。',
  '我想做你的维生素，让你健康快乐。',
  '我想做你的创可贴，治愈你的伤痛。',
  '我想做你的药，治好你的相思病。',
  '我想做你的医生，照顾你一辈子。',
  '我想做你的老师，教你如何爱我。',
  '我想做你的学生，向你学习如何可爱。',
  '我想做你的同桌，和你一起成长。',
  '我想做你的室友，和你朝夕相处。',
  '我想做你的邻居，就住在你心里。',
  '我想做你的家人，陪你到老。',
  '我想做你的朋友，永远不分离。',
  '我想做你的恋人，给你全部的爱。',
]

// 当前显示的情话
const currentTalk = computed(() => sweetTalks[currentIndex.value])

// 进度
const progress = computed(() => ((currentIndex.value + 1) / sweetTalks.length) * 100)

// 浮动爱心
const floatingHearts = ref<Array<{
  id: number
  left: number
  animationDelay: number
  animationDuration: number
  size: number
  emoji: string
}>>([])

// 生成浮动爱心
function generateFloatingHearts() {
  const hearts = ['💕', '💖', '💗', '💝', '💘', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤍', '🖤', '🤎']
  floatingHearts.value = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    animationDelay: Math.random() * 3,
    animationDuration: 4 + Math.random() * 3,
    size: 0.8 + Math.random() * 0.8,
    emoji: hearts[Math.floor(Math.random() * hearts.length)],
  }))
}

// 下一张卡片
function nextCard() {
  if (isAnimating.value || currentIndex.value >= sweetTalks.length - 1)
    return

  isAnimating.value = true
  currentIndex.value++

  setTimeout(() => {
    isAnimating.value = false
  }, 300)
}

// 上一张卡片
function prevCard() {
  if (isAnimating.value || currentIndex.value <= 0)
    return

  isAnimating.value = true
  currentIndex.value--

  setTimeout(() => {
    isAnimating.value = false
  }, 300)
}

// 喜欢
function likeTalk() {
  preferences.value[currentIndex.value] = 'like'
  // 添加喜欢动画效果
  generateFloatingHearts()
  nextCard()
}

// 不喜欢
function dislikeTalk() {
  preferences.value[currentIndex.value] = 'dislike'
  nextCard()
}

// 重置到第一张
function resetCards() {
  currentIndex.value = 0
  preferences.value = {}
}

// 触摸滑动支持
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

  // 只有水平滑动距离大于垂直滑动距离时才触发
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
    if (diffX > 0) {
      // 向左滑动，下一张
      nextCard()
    }
    else {
      // 向右滑动，上一张
      prevCard()
    }
  }
}

onMounted(() => {
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
          土味情话
        </ion-title>
        <ion-buttons slot="end">
          <ion-button
            fill="clear"
            color="light"
            @click="resetCards"
          >
            <ion-icon name="refresh" class="text-xl text-white" />
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
          class="animate-snowfall absolute text-white/20"
          :style="{
            left: `${heart.left}%`,
            animationDelay: `${heart.animationDelay}s`,
            animationDuration: `${heart.animationDuration}s`,
            fontSize: `${heart.size}rem`,
          }"
        >
          {{ heart.emoji }}
        </div>
      </div>

      <!-- 进度条 -->
      <div class="relative z-10 p-4">
        <div class="mb-2 h-2 rounded-full bg-white/20">
          <div
            class="h-2 rounded-full bg-white transition-all duration-300"
            :style="{ width: `${progress}%` }"
          />
        </div>
        <div class="text-center text-sm text-white/80">
          {{ currentIndex + 1 }} / {{ sweetTalks.length }}
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="relative z-10 flex flex-1 flex-col items-center justify-center p-6">
        <!-- 卡片容器 -->
        <div
          class="relative mx-auto max-w-sm w-full"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
        >
          <!-- 主卡片 -->
          <div
            class="min-h-[400px] flex flex-col transform justify-center rounded-3xl bg-white/95 p-8 shadow-2xl backdrop-blur-sm transition-all duration-300"
            :class="{ 'scale-95': isAnimating }"
          >
            <!-- 卡片头部 -->
            <div class="mb-6 text-center">
              <div class="animate-heartbeat mb-4 text-4xl">
                💌
              </div>
              <h2 class="mb-2 text-lg text-gray-800 font-bold">
                第 {{ currentIndex + 1 }} 条情话
              </h2>
            </div>

            <!-- 情话内容 -->
            <div class="flex flex-1 items-center justify-center">
              <p class="text-center text-xl text-gray-700 font-medium leading-relaxed">
                {{ currentTalk }}
              </p>
            </div>

            <!-- 用户选择状态 -->
            <div v-if="preferences[currentIndex]" class="mt-4 text-center">
              <div v-if="preferences[currentIndex] === 'like'" class="text-pink-500 font-bold">
                💕 你喜欢这条情话
              </div>
              <div v-else class="text-gray-500 font-bold">
                😅 你觉得这条太土了
              </div>
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
            class="flex items-center gap-2 rounded-full bg-gray-500 px-6 py-4 text-white font-bold shadow-lg transition-all duration-300 hover:bg-gray-600 disabled:opacity-50"
            @click="dislikeTalk"
          >
            <span class="text-xl">😅</span>
            <span>太土了</span>
          </button>

          <!-- 滑动提示 -->
          <div class="text-center text-sm text-white/70">
            <div class="mb-1">
              👈 滑动切换 👉
            </div>
            <div class="text-xs">
              或点击按钮选择
            </div>
          </div>

          <!-- 喜欢按钮 -->
          <button
            :disabled="isAnimating"
            class="flex items-center gap-2 rounded-full bg-pink-500 px-6 py-4 text-white font-bold shadow-lg transition-all duration-300 hover:bg-pink-600 disabled:opacity-50"
            @click="likeTalk"
          >
            <span class="text-xl">💕</span>
            <span>喜欢</span>
          </button>
        </div>

        <!-- 导航按钮 -->
        <div class="mt-6 flex justify-center gap-4">
          <button
            :disabled="currentIndex === 0 || isAnimating"
            class="rounded-full bg-white/20 px-4 py-2 text-white font-bold transition-all duration-300 hover:bg-white/30 disabled:opacity-30"
            @click="prevCard"
          >
            ← 上一条
          </button>

          <button
            :disabled="currentIndex === sweetTalks.length - 1 || isAnimating"
            class="rounded-full bg-white/20 px-4 py-2 text-white font-bold transition-all duration-300 hover:bg-white/30 disabled:opacity-30"
            @click="nextCard"
          >
            下一条 →
          </button>
        </div>

        <!-- 完成提示 -->
        <div v-if="currentIndex === sweetTalks.length - 1" class="mt-6 text-center">
          <div class="rounded-2xl bg-white/20 p-4 text-white backdrop-blur-sm">
            <div class="mb-2 text-2xl">
              🎉
            </div>
            <p class="font-bold">
              恭喜你看完了所有情话！
            </p>
            <p class="mt-1 text-sm">
              点击右上角刷新按钮重新开始
            </p>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
/* 使用已有的动画类 */
.animate-snowfall {
  animation: snowfall linear infinite;
}

.animate-heartbeat {
  animation: heartbeat 2s ease-in-out infinite;
}

/* 本地动画定义 */
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

/* 卡片层次效果 */
.card-stack {
  position: relative;
}

.card-stack::before,
.card-stack::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 1.5rem;
  z-index: -1;
}

.card-stack::before {
  transform: rotate(1deg);
}

.card-stack::after {
  transform: rotate(2deg);
  background: rgba(255, 255, 255, 0.15);
  z-index: -2;
}
</style>
