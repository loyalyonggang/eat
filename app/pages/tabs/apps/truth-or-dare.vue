<script setup lang="ts">
import { onMounted, ref } from 'vue'

definePageMeta({
  alias: ['/apps/truth-or-dare'],
})

useHead({
  title: '真心话大冒险 - Una和花不缺',
})

// 游戏状态
const gameState = ref<'start' | 'choosing' | 'truth' | 'dare' | 'result'>('start')
const currentQuestion = ref('')
const currentDare = ref('')
const playerTurn = ref<'una' | 'huabuque'>('una')
const gameHistory = ref<Array<{
  player: string
  type: 'truth' | 'dare'
  content: string
  timestamp: Date
}>>([])

// 真心话问题库 - 情侣专用，增进感情
const truthQuestions = [
  '你最喜欢我身上的哪个特质？',
  '如果可以重新认识我，你还会选择和我在一起吗？',
  '你觉得我们第一次见面时，你对我的第一印象是什么？',
  '在我们的关系中，你最珍惜的一个瞬间是什么？',
  '你希望我们的未来是什么样子的？',
  '如果我们可以一起去世界上任何地方，你最想去哪里？',
  '你觉得我最可爱的习惯是什么？',
  '当你想我的时候，你会想起我们一起做过的什么事情？',
  '你觉得我们之间最特别的默契是什么？',
  '如果用一首歌来形容我们的感情，你会选择哪首？',
  '你最想和我一起学会什么新技能？',
  '在你心情不好的时候，我做什么能让你开心起来？',
  '你觉得我们性格上最互补的地方是什么？',
  '如果我们可以拥有一个超能力，你希望是什么？',
  '你最想收到我送给你的什么礼物？',
  '你觉得我们在一起最浪漫的时刻是什么时候？',
  '如果我们可以回到过去的某一天，你想回到哪一天？',
  '你希望我们可以一起养什么宠物？',
  '你觉得我做什么事情的时候最帅/最美？',
  '如果我们可以一起创造一个节日，你希望是什么节日？',
]

// 大冒险任务库 - 浪漫有趣，增进感情
const dareActions = [
  '给对方一个温柔的拥抱，持续30秒',
  '用最甜蜜的声音说\'我爱你\'三遍',
  '为对方唱一首歌（哪怕只有一句）',
  '模仿对方最可爱的表情或动作',
  '给对方按摩肩膀2分钟',
  '用手机给对方拍一张最美的照片',
  '闭着眼睛画出对方的样子',
  '用最肉麻的话夸奖对方1分钟',
  '学动物叫声，直到对方猜对你学的是什么动物',
  '为对方跳一段舞（自由发挥）',
  '用对方的手机给自己发一条甜蜜的消息',
  '模仿一个明星，让对方猜是谁',
  '给对方讲一个笑话，必须让对方笑出来',
  '用最温柔的方式叫对方的名字10遍',
  '做10个俯卧撑（如果做不到就做其他运动）',
  '为对方写一首小诗（哪怕只有四句）',
  '模仿对方说话的语气说一段话',
  '给对方一个公主抱（或者被公主抱）',
  '用最搞笑的方式表达\'我想你了\'',
  '闭着眼睛喂对方吃一口东西',
]

// 浮动爱心动画
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
  const hearts = ['💕', '💖', '💗', '💝', '💘', '❤️', '🧡', '💛', '💚', '💙', '💜']
  floatingHearts.value = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    animationDelay: Math.random() * 3,
    animationDuration: 3 + Math.random() * 4,
    size: 0.8 + Math.random() * 1,
    emoji: hearts[Math.floor(Math.random() * hearts.length)] || '💕',
  }))
}

// 开始游戏
function startGame() {
  gameState.value = 'choosing'
  generateFloatingHearts()
}

// 选择真心话
function chooseTruth() {
  const randomIndex = Math.floor(Math.random() * truthQuestions.length)
  const question = truthQuestions[randomIndex]
  if (question) {
    currentQuestion.value = question
    gameState.value = 'truth'

    // 记录到历史
    gameHistory.value.push({
      player: playerTurn.value === 'una' ? 'Una' : '花不缺',
      type: 'truth',
      content: question,
      timestamp: new Date(),
    })
  }
}

// 选择大冒险
function chooseDare() {
  const randomIndex = Math.floor(Math.random() * dareActions.length)
  const dare = dareActions[randomIndex]
  if (dare) {
    currentDare.value = dare
    gameState.value = 'dare'

    // 记录到历史
    gameHistory.value.push({
      player: playerTurn.value === 'una' ? 'Una' : '花不缺',
      type: 'dare',
      content: dare,
      timestamp: new Date(),
    })
  }
}

// 完成任务，切换玩家
function completeTask() {
  playerTurn.value = playerTurn.value === 'una' ? 'huabuque' : 'una'
  gameState.value = 'choosing'
  generateFloatingHearts() // 重新生成爱心动画
}

// 重新开始
function restartGame() {
  gameState.value = 'start'
  gameHistory.value = []
  playerTurn.value = 'una'
  currentQuestion.value = ''
  currentDare.value = ''
}

onMounted(() => {
  generateFloatingHearts()
})
</script>

<template>
  <ion-page>
    <CustomHeader
      title="真心话大冒险"
      :show-back-button="true"
      back-href="/apps"
    >
      <template #end-buttons>
        <ion-button
          v-if="gameState !== 'start'"
          fill="clear"
          class="header-button"
          @click="restartGame"
        >
          <ion-icon name="refresh" class="text-xl" />
        </ion-button>
      </template>
    </CustomHeader>

    <ion-content class="relative overflow-hidden">
      <!-- 背景渐变 -->
      <div class="absolute inset-0 from-pink-600 via-rose-500 to-red-600 bg-gradient-to-br" />

      <!-- 装饰性元素 -->
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute left-10 top-10 animate-pulse text-4xl text-white/20">
          💕
        </div>
        <div class="absolute right-16 top-20 animate-bounce text-3xl text-white/20">
          💖
        </div>
        <div class="absolute bottom-32 left-20 animate-pulse text-5xl text-white/20">
          ❤️
        </div>
        <div class="absolute bottom-20 right-10 animate-bounce text-3xl text-white/20">
          💝
        </div>
      </div>

      <!-- 浮动爱心动画 -->
      <div class="pointer-events-none absolute inset-0">
        <div
          v-for="heart in floatingHearts"
          :key="heart.id"
          class="animate-snowfall absolute text-white/30"
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

      <!-- 主要内容 -->
      <div class="relative z-10 min-h-full flex flex-col items-center justify-center p-6">
        <!-- 开始页面 -->
        <div v-if="gameState === 'start'" class="text-center">
          <div class="animate-float mb-8">
            <div class="mb-4 text-8xl">
              💕
            </div>
            <h1 class="animate-glow-pulse mb-4 text-4xl text-white font-bold">
              真心话大冒险
            </h1>
            <p class="mb-8 text-xl text-white/90">
              Una 和 花不缺 的浪漫游戏时光
            </p>
          </div>

          <div class="max-w-md space-y-4">
            <div class="rounded-2xl bg-white/10 p-6 text-white backdrop-blur-sm">
              <h3 class="mb-3 text-lg font-bold">
                游戏规则
              </h3>
              <ul class="text-left text-sm space-y-2">
                <li>• 轮流选择真心话或大冒险</li>
                <li>• 真心话要诚实回答问题</li>
                <li>• 大冒险要完成指定任务</li>
                <li>• 增进彼此了解，享受甜蜜时光</li>
              </ul>
            </div>

            <button
              class="w-full animate-pulse rounded-2xl bg-white px-8 py-4 text-pink-600 font-bold shadow-lg transition-all duration-300 hover:shadow-xl"
              @click="startGame"
            >
              🎯 开始游戏 🎯
            </button>
          </div>
        </div>

        <!-- 选择页面 -->
        <div v-if="gameState === 'choosing'" class="max-w-md w-full text-center">
          <div class="mb-8">
            <div class="animate-heartbeat mb-4 text-6xl">
              {{ playerTurn === 'una' ? '👩‍💼' : '👨‍💼' }}
            </div>
            <h2 class="mb-2 text-3xl text-white font-bold">
              {{ playerTurn === 'una' ? 'Una' : '花不缺' }} 的回合
            </h2>
            <p class="text-white/80">
              选择你的挑战吧！
            </p>
          </div>

          <div class="space-y-4">
            <button
              class="w-full transform rounded-2xl from-blue-500 to-purple-600 bg-gradient-to-r px-8 py-6 text-white font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              @click="chooseTruth"
            >
              <div class="mb-2 text-3xl">
                💭
              </div>
              <div class="text-xl">
                真心话
              </div>
              <div class="text-sm opacity-80">
                诚实回答问题
              </div>
            </button>

            <button
              class="w-full transform rounded-2xl from-orange-500 to-red-600 bg-gradient-to-r px-8 py-6 text-white font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              @click="chooseDare"
            >
              <div class="mb-2 text-3xl">
                🎯
              </div>
              <div class="text-xl">
                大冒险
              </div>
              <div class="text-sm opacity-80">
                完成挑战任务
              </div>
            </button>
          </div>
        </div>

        <!-- 真心话页面 -->
        <div v-if="gameState === 'truth'" class="max-w-lg w-full text-center">
          <div class="mb-8">
            <div class="animate-twinkle mb-4 text-6xl">
              💭
            </div>
            <h2 class="mb-6 text-2xl text-white font-bold">
              真心话时间
            </h2>

            <div class="mb-6 rounded-2xl bg-white/15 p-6 backdrop-blur-sm">
              <p class="text-xl text-white leading-relaxed">
                {{ currentQuestion }}
              </p>
            </div>

            <p class="mb-6 text-sm text-white/80">
              {{ playerTurn === 'una' ? 'Una' : '花不缺' }}，请诚实回答这个问题哦~ 💕
            </p>
          </div>

          <button
            class="rounded-2xl bg-white px-8 py-4 text-pink-600 font-bold shadow-lg transition-all duration-300 hover:shadow-xl"
            @click="completeTask"
          >
            ✅ 已回答，下一位
          </button>
        </div>

        <!-- 大冒险页面 -->
        <div v-if="gameState === 'dare'" class="max-w-lg w-full text-center">
          <div class="mb-8">
            <div class="mb-4 animate-bounce text-6xl">
              🎯
            </div>
            <h2 class="mb-6 text-2xl text-white font-bold">
              大冒险时间
            </h2>

            <div class="mb-6 rounded-2xl bg-white/15 p-6 backdrop-blur-sm">
              <p class="text-xl text-white leading-relaxed">
                {{ currentDare }}
              </p>
            </div>

            <p class="mb-6 text-sm text-white/80">
              {{ playerTurn === 'una' ? 'Una' : '花不缺' }}，勇敢接受挑战吧！ 🎪
            </p>
          </div>

          <button
            class="rounded-2xl bg-white px-8 py-4 text-pink-600 font-bold shadow-lg transition-all duration-300 hover:shadow-xl"
            @click="completeTask"
          >
            ✅ 已完成，下一位
          </button>
        </div>

        <!-- 游戏历史 -->
        <div v-if="gameHistory.length > 0 && gameState === 'choosing'" class="mt-8 max-w-md w-full">
          <h3 class="mb-4 text-center text-white font-bold">
            游戏记录
          </h3>
          <div class="max-h-40 overflow-y-auto space-y-2">
            <div
              v-for="(record, index) in gameHistory.slice(-3)"
              :key="index"
              class="rounded-lg bg-white/10 p-3 text-sm text-white backdrop-blur-sm"
            >
              <div class="mb-1 flex items-center justify-between">
                <span class="font-bold">{{ record.player }}</span>
                <span class="text-xs opacity-70">
                  {{ record.type === 'truth' ? '💭 真心话' : '🎯 大冒险' }}
                </span>
              </div>
              <p class="text-xs opacity-90">
                {{ record.content }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部装饰 -->
      <div class="absolute bottom-0 left-0 right-0 h-20 from-black/20 to-transparent bg-gradient-to-t" />
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

.animate-twinkle {
  animation: twinkle 1.5s ease-in-out infinite;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-glow-pulse {
  animation: glow-pulse 2s ease-in-out infinite;
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
    text-shadow: 0 0 10px rgba(236, 72, 153, 0.5);
  }
  50% {
    text-shadow:
      0 0 25px rgba(236, 72, 153, 0.8),
      0 0 35px rgba(236, 72, 153, 0.6);
  }
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
</style>
