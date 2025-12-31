<script setup lang="ts">
import type { StoryListItem, StoryListResponse } from '~/types'

useHead({
  title: 'Una 的故事',
})

const page = ref(1)
const limit = 8
const stories = ref<StoryListItem[]>([])
const total = ref(0)
const loading = ref(false)

// 加载故事列表
async function loadStories() {
  loading.value = true
  try {
    const response = await $fetch<StoryListResponse>('/api/stories', {
      query: {
        page: page.value,
        limit,
        published: true,
      },
    })
    stories.value = response.stories
    total.value = response.total
  }
  catch (error) {
    console.error('加载故事列表失败:', error)
  }
  finally {
    loading.value = false
  }
}

// 计算总页数
const totalPages = computed(() => Math.ceil(total.value / limit))

// 上一页
function prevPage() {
  if (page.value > 1) {
    page.value--
    loadStories()
  }
}

// 下一页
function nextPage() {
  if (page.value < totalPages.value) {
    page.value++
    loadStories()
  }
}

// 进入故事
function enterStory(story: StoryListItem) {
  navigateTo(`/tabs/apps/stories/${story.id}/password`)
}

// 初始加载
onMounted(() => {
  loadStories()
})
</script>

<template>
  <ion-page>
    <CustomHeader title="Una 的故事" />

    <ion-content class="custom-content bg-gray-50 dark:bg-black">
      <div class="p-4">
        <!-- 加载中 -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <ion-spinner name="crescent" class="text-emerald-500" />
        </div>

        <!-- 空状态 -->
        <div v-else-if="stories.length === 0" class="flex flex-col items-center justify-center py-20">
          <div class="mb-4 text-6xl">
            📖
          </div>
          <p class="text-gray-500">
            暂时还没有故事哦
          </p>
        </div>

        <!-- 故事列表 -->
        <div v-else class="grid gap-4">
          <div
            v-for="story in stories"
            :key="story.id"
            class="relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition-transform active:scale-98 dark:bg-gray-800"
            @click="enterStory(story)"
          >
            <!-- 封面图片 -->
            <div v-if="story.cover" class="h-40 w-full overflow-hidden from-emerald-100 to-cyan-100 bg-gradient-to-br dark:from-emerald-900/20 dark:to-cyan-900/20">
              <img :src="story.cover" :alt="story.title" class="h-full w-full object-cover">
            </div>
            <div v-else class="h-40 w-full flex items-center justify-center from-emerald-100 to-cyan-100 bg-gradient-to-br dark:from-emerald-900/20 dark:to-cyan-900/20">
              <div class="text-6xl">
                📖
              </div>
            </div>

            <!-- 故事信息 -->
            <div class="p-4">
              <div class="mb-2 flex items-center justify-between">
                <h3 class="text-lg text-gray-800 font-bold dark:text-gray-100">
                  {{ story.title }}
                </h3>
                <div v-if="story.hasPassword" class="text-emerald-500">
                  <div i-ri-lock-line class="text-xl" />
                </div>
              </div>
              <p class="text-xs text-gray-500">
                {{ new Date(story.createdAt).toLocaleDateString('zh-CN') }}
              </p>
            </div>

            <!-- 右箭头 -->
            <div class="absolute right-4 top-1/2 text-gray-300 -translate-y-1/2 dark:text-gray-600">
              <div i-ri-arrow-right-s-line class="text-3xl" />
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="totalPages > 1" class="mt-6 flex items-center justify-center gap-4">
          <button
            class="h-10 w-10 flex items-center justify-center rounded-full bg-white text-emerald-500 shadow-sm transition-all dark:bg-gray-800 disabled:opacity-30"
            :disabled="page === 1"
            @click="prevPage"
          >
            <div i-ri-arrow-left-s-line class="text-xl" />
          </button>

          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ page }} / {{ totalPages }}
          </span>

          <button
            class="h-10 w-10 flex items-center justify-center rounded-full bg-white text-emerald-500 shadow-sm transition-all dark:bg-gray-800 disabled:opacity-30"
            :disabled="page === totalPages"
            @click="nextPage"
          >
            <div i-ri-arrow-right-s-line class="text-xl" />
          </button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.custom-content {
  --padding-top: 0;
  --padding-bottom: 0;
}
</style>
