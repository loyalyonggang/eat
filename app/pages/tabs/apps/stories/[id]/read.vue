<script setup lang="ts">
import type { StoryContentResponse, StoryEgg } from '~/types'

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

useHead({
  title: '阅读故事',
})

const story = ref<StoryContentResponse | null>(null)
const loading = ref(true)
const error = ref('')
const scrolledToBottom = ref(false)
const currentEgg = ref<StoryEgg | null>(null)
const showEgg = ref(false)
const foundEggs = ref<Set<string>>(new Set())

// 加载故事内容
async function loadStory() {
  loading.value = true
  error.value = ''

  try {
    // 从 sessionStorage 获取 token
    const token = import.meta.client ? sessionStorage.getItem(`story-${id}-token`) : null

    if (!token) {
      // 没有 token,跳转到密码页面
      router.push(`/tabs/apps/stories/${id}/password`)
      return
    }

    const response = await $fetch<StoryContentResponse>(`/api/stories/${id}/content`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    story.value = response
  }
  catch (err: any) {
    console.error('加载故事内容失败:', err)
    if (err.statusCode === 401) {
      // token 无效,跳转到密码页面
      if (import.meta.client) {
        sessionStorage.removeItem(`story-${id}-token`)
      }
      router.push(`/tabs/apps/stories/${id}/password`)
    }
    else {
      error.value = '加载故事失败,请重试'
    }
  }
  finally {
    loading.value = false
  }
}

// 监听滚动,检测是否到达底部
function handleScroll(event: any) {
  const target = event.target
  const scrollTop = target.scrollTop
  const scrollHeight = target.scrollHeight
  const clientHeight = target.clientHeight

  // 判断是否滚动到底部(留一点余量)
  if (scrollHeight - scrollTop - clientHeight < 50) {
    scrolledToBottom.value = true
  }
}

// 触发彩蛋
function triggerEgg(egg: StoryEgg) {
  if (foundEggs.value.has(egg.id)) {
    return // 已经触发过了
  }

  currentEgg.value = egg
  showEgg.value = true
  foundEggs.value.add(egg.id)
}

// 关闭彩蛋
function closeEgg() {
  showEgg.value = false
  setTimeout(() => {
    currentEgg.value = null
  }, 300)
}

// 返回列表
function goBack() {
  router.push('/tabs/apps/stories')
}

// 初始加载
onMounted(() => {
  loadStory()
})
</script>

<template>
  <ion-page>
    <CustomHeader title="阅读故事" />

    <ion-content class="custom-content bg-gray-50 dark:bg-black" @ion-scroll="handleScroll">
      <!-- 加载中 -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <ion-spinner name="crescent" class="text-emerald-500" />
      </div>

      <!-- 错误提示 -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-20">
        <div class="mb-4 text-6xl">
          😢
        </div>
        <p class="mb-6 text-gray-500">
          {{ error }}
        </p>
        <button
          class="rounded-2xl from-emerald-500 to-cyan-500 bg-gradient-to-r px-8 py-3 text-white font-bold shadow-lg transition-transform active:scale-98"
          @click="loadStory"
        >
          重试
        </button>
      </div>

      <!-- 故事内容 -->
      <div v-else-if="story" class="mx-auto max-w-2xl p-6">
        <!-- 封面 -->
        <div v-if="story.cover" class="mb-6 overflow-hidden rounded-2xl">
          <img :src="story.cover" :alt="story.title" class="w-full">
        </div>

        <!-- 标题 -->
        <h1 class="mb-6 text-center text-3xl text-gray-800 font-bold dark:text-gray-100">
          {{ story.title }}
        </h1>

        <!-- 内容 -->
        <div class="mb-8 text-gray-700 leading-relaxed prose prose-lg dark:text-gray-300 dark:prose-invert" v-html="story.content" />

        <!-- 故事结束 -->
        <div v-if="scrolledToBottom" class="relative mb-8 rounded-2xl from-emerald-100 to-cyan-100 bg-gradient-to-br p-8 text-center dark:from-emerald-900/20 dark:to-cyan-900/20">
          <div class="mb-4 text-4xl">
            ✨
          </div>
          <p class="text-lg text-gray-700 font-bold dark:text-gray-300">
            故事结束
          </p>
          <p class="mt-2 text-sm text-gray-500">
            寻找隐藏的彩蛋吧 🎁
          </p>

          <!-- 隐藏的彩蛋按钮 -->
          <div v-if="story.eggs && story.eggs.length > 0" class="relative mt-6">
            <div
              v-for="(egg, index) in story.eggs"
              :key="egg.id"
              class="absolute cursor-pointer text-2xl transition-transform active:scale-95 hover:scale-110"
              :class="{
                'left-4 top-0': egg.buttonConfig?.position === 'top-left',
                'right-4 top-0': egg.buttonConfig?.position === 'top-right',
                'bottom-0 left-4': egg.buttonConfig?.position === 'bottom-left',
                'bottom-0 right-4': egg.buttonConfig?.position === 'bottom-right',
                'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2': egg.buttonConfig?.position === 'center',
                'opacity-30': !foundEggs.has(egg.id),
                'opacity-100': foundEggs.has(egg.id),
              }"
              :style="{
                left: !egg.buttonConfig?.position ? `${20 + index * 30}%` : undefined,
                top: !egg.buttonConfig?.position ? '50%' : undefined,
                transform: !egg.buttonConfig?.position ? 'translateY(-50%)' : undefined,
              }"
              :title="egg.buttonConfig?.hint || '点击发现彩蛋'"
              @click="triggerEgg(egg)"
            >
              {{ egg.buttonConfig?.icon || '⭐' }}
            </div>
          </div>
        </div>

        <!-- 返回按钮 -->
        <button
          class="w-full rounded-2xl bg-gray-200 py-4 text-gray-700 font-bold transition-transform active:scale-98 dark:bg-gray-700 dark:text-gray-300"
          @click="goBack"
        >
          返回故事列表
        </button>
      </div>
    </ion-content>

    <!-- 彩蛋弹窗 -->
    <StoryEgg v-if="currentEgg" :egg="currentEgg" :visible="showEgg" @close="closeEgg" />
  </ion-page>
</template>

<style scoped>
.custom-content {
  --padding-top: 0;
  --padding-bottom: 0;
}

/* Markdown 样式 */
:deep(.prose) {
  max-width: none;
}

:deep(.prose p) {
  margin-bottom: 1em;
}

:deep(.prose h1),
:deep(.prose h2),
:deep(.prose h3) {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: bold;
}

:deep(.prose img) {
  border-radius: 1rem;
  margin: 1.5em 0;
}
</style>
