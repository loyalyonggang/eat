<script setup lang="ts">
import type { StoryContentResponse, StoryEgg } from '~/types'
import { marked } from 'marked'

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

// 配置 marked
marked.setOptions({
  breaks: true, // 支持 GFM 换行
  gfm: true, // 启用 GitHub Flavored Markdown
})

// 渲染 Markdown 内容
const renderedContent = computed(() => {
  if (!story.value?.content)
    return ''
  return marked(story.value.content)
})

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
        <div class="story-content mb-8" v-html="renderedContent" />

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

/* 故事内容样式 - 优化阅读体验 */
.story-content {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei',
    'Source Han Sans CN', sans-serif;
  font-size: 17px;
  line-height: 2;
  letter-spacing: 0.05em;
  color: #333;
}

/* 深色模式 */
.dark .story-content {
  color: #e5e5e5;
}

/* 标题样式 */
.story-content :deep(h1) {
  font-size: 28px;
  font-weight: 700;
  margin: 2em 0 1em;
  line-height: 1.4;
  color: #1a1a1a;
  text-align: center;
}

.dark .story-content :deep(h1) {
  color: #f5f5f5;
}

.story-content :deep(h2) {
  font-size: 22px;
  font-weight: 600;
  margin: 1.8em 0 0.8em;
  line-height: 1.5;
  color: #2a2a2a;
}

.dark .story-content :deep(h2) {
  color: #e5e5e5;
}

.story-content :deep(h3) {
  font-size: 19px;
  font-weight: 600;
  margin: 1.5em 0 0.6em;
  line-height: 1.6;
  color: #3a3a3a;
}

.dark .story-content :deep(h3) {
  color: #d5d5d5;
}

/* 段落样式 */
.story-content :deep(p) {
  margin: 1.5em 0;
  text-indent: 2em;
  text-align: justify;
}

/* 第一段不缩进 */
.story-content :deep(h1 + p),
.story-content :deep(h2 + p),
.story-content :deep(h3 + p) {
  text-indent: 0;
}

/* 加粗文本 */
.story-content :deep(strong) {
  font-weight: 600;
  color: #000;
}

.dark .story-content :deep(strong) {
  color: #fff;
}

/* 斜体 */
.story-content :deep(em) {
  font-style: italic;
  color: #555;
}

.dark .story-content :deep(em) {
  color: #aaa;
}

/* 图片样式 */
.story-content :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 2.5em auto;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: block;
}

.dark .story-content :deep(img) {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* 引用块 */
.story-content :deep(blockquote) {
  margin: 1.5em 0;
  padding: 1em 1.5em;
  border-left: 4px solid #10b981;
  background: #f0fdf4;
  border-radius: 0 8px 8px 0;
  font-style: italic;
  color: #166534;
}

.dark .story-content :deep(blockquote) {
  background: #064e3b20;
  color: #6ee7b7;
}

/* 列表样式 */
.story-content :deep(ul),
.story-content :deep(ol) {
  margin: 1.5em 0;
  padding-left: 2em;
}

.story-content :deep(li) {
  margin: 0.5em 0;
  line-height: 1.8;
}

/* 水平分隔线 */
.story-content :deep(hr) {
  margin: 3em 0;
  border: none;
  border-top: 2px solid #e5e7eb;
}

.dark .story-content :deep(hr) {
  border-top-color: #374151;
}

/* 代码块 */
.story-content :deep(code) {
  padding: 0.2em 0.4em;
  background: #f3f4f6;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.9em;
}

.dark .story-content :deep(code) {
  background: #374151;
}

.story-content :deep(pre) {
  margin: 1.5em 0;
  padding: 1em;
  background: #f3f4f6;
  border-radius: 8px;
  overflow-x: auto;
}

.dark .story-content :deep(pre) {
  background: #1f2937;
}

.story-content :deep(pre code) {
  padding: 0;
  background: transparent;
}

/* 链接样式 */
.story-content :deep(a) {
  color: #10b981;
  text-decoration: underline;
  text-decoration-color: #10b98140;
  transition: all 0.2s;
}

.story-content :deep(a:hover) {
  color: #059669;
  text-decoration-color: #059669;
}

.dark .story-content :deep(a) {
  color: #6ee7b7;
}

.dark .story-content :deep(a:hover) {
  color: #a7f3d0;
}

/* 表格样式 */
.story-content :deep(table) {
  width: 100%;
  margin: 1.5em 0;
  border-collapse: collapse;
}

.story-content :deep(th),
.story-content :deep(td) {
  padding: 0.75em 1em;
  border: 1px solid #e5e7eb;
  text-align: left;
}

.dark .story-content :deep(th),
.dark .story-content :deep(td) {
  border-color: #374151;
}

.story-content :deep(th) {
  background: #f9fafb;
  font-weight: 600;
}

.dark .story-content :deep(th) {
  background: #1f2937;
}
</style>
```
