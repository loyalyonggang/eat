<script setup lang="ts">
import type { Story, StoryListResponse } from '~/types'

definePageMeta({
  middleware: 'admin-auth',
})

useHead({
  title: '故事管理',
})

const stories = ref<Story[]>([])
const loading = ref(false)
const router = useRouter()

// 加载所有故事(包括未发布的)
async function loadStories() {
  loading.value = true
  try {
    const token = import.meta.client ? localStorage.getItem('admin-token') : null

    const response = await $fetch<StoryListResponse>('/api/stories', {
      query: {
        page: 1,
        limit: 100,
        published: false, // 加载所有故事
      },
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    })

    stories.value = response.stories as Story[]
  }
  catch (error) {
    console.error('加载故事列表失败:', error)
  }
  finally {
    loading.value = false
  }
}

// 创建新故事
function createStory() {
  router.push('/admin/stories/edit/new')
}

// 编辑故事
function editStory(id: string) {
  router.push(`/admin/stories/edit/${id}`)
}

// 删除故事
async function deleteStory(id: string) {
  if (!confirm('确定要删除这个故事吗?')) {
    return
  }

  try {
    const token = import.meta.client ? localStorage.getItem('admin-token') : null

    await $fetch(`/api/admin/stories/${id}`, {
      method: 'DELETE',
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    })

    // 重新加载列表
    loadStories()
  }
  catch (error) {
    console.error('删除故事失败:', error)
    alert('删除失败,请重试')
  }
}

// 退出登录
function logout() {
  if (import.meta.client) {
    localStorage.removeItem('admin-token')
  }
  router.push('/admin/stories/login')
}

// 初始加载
onMounted(() => {
  loadStories()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <div class="border-b bg-white shadow-sm">
      <div class="mx-auto max-w-6xl flex items-center justify-between px-4 py-3 sm:py-4">
        <h1 class="text-xl text-gray-800 font-bold sm:text-2xl">
          故事管理
        </h1>
        <div class="flex items-center gap-2 sm:gap-4">
          <button
            class="rounded-xl from-emerald-500 to-cyan-500 bg-gradient-to-r px-4 py-2 text-sm text-white font-bold shadow-sm transition-transform active:scale-98 sm:px-6 sm:text-base"
            @click="createStory"
          >
            + 新建
          </button>
          <button
            class="rounded-xl bg-gray-200 px-4 py-2 text-sm text-gray-700 font-bold transition-transform active:scale-98 sm:px-6 sm:text-base"
            @click="logout"
          >
            退出
          </button>
        </div>
      </div>
    </div>

    <!-- 内容 -->
    <div class="mx-auto max-w-6xl p-3 sm:p-4">
      <!-- 加载中 -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="text-emerald-500">
          加载中...
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="stories.length === 0" class="flex flex-col items-center justify-center py-20">
        <div class="mb-4 text-6xl">
          📖
        </div>
        <p class="text-gray-500">
          还没有故事,点击"新建"开始创作吧!
        </p>
      </div>

      <!-- 故事列表 -->
      <div v-else class="grid gap-3 sm:gap-4">
        <div
          v-for="story in stories"
          :key="story.id"
          class="overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
        >
          <div class="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
            <!-- 封面缩略图 -->
            <div class="h-32 w-full flex-shrink-0 overflow-hidden rounded-xl from-emerald-100 to-cyan-100 bg-gradient-to-br sm:h-20 sm:w-20">
              <img v-if="story.cover" :src="story.cover" :alt="story.title" class="h-full w-full object-cover">
              <div v-else class="h-full w-full flex items-center justify-center text-3xl sm:text-2xl">
                📖
              </div>
            </div>

            <!-- 故事信息 -->
            <div class="flex-1">
              <div class="mb-1 flex items-center gap-2">
                <h3 class="text-base text-gray-800 font-bold sm:text-lg">
                  {{ story.title }}
                </h3>
                <span
                  v-if="story.isPublished"
                  class="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-600 font-medium"
                >
                  已发布
                </span>
                <span
                  v-else
                  class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 font-medium"
                >
                  草稿
                </span>
              </div>
              <p class="text-xs text-gray-500 sm:text-sm">
                创建于 {{ new Date(story.createdAt).toLocaleString('zh-CN') }}
              </p>
            </div>

            <!-- 操作按钮 -->
            <div class="flex items-center gap-2">
              <button
                class="flex-1 rounded-xl bg-emerald-100 px-4 py-2 text-sm text-emerald-600 font-medium transition-transform sm:flex-none active:scale-95"
                @click="editStory(story.id)"
              >
                编辑
              </button>
              <button
                class="flex-1 rounded-xl bg-red-100 px-4 py-2 text-sm text-red-600 font-medium transition-transform sm:flex-none active:scale-95"
                @click="deleteStory(story.id)"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
