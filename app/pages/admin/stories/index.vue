<script setup lang="ts">
useHead({
  title: '故事管理',
})

const stories = ref<any[]>([])
const loading = ref(true)

// 加载故事列表
async function loadStories() {
  try {
    loading.value = true
    const data = await $fetch('/api/stories?page=1&limit=100&published=false')
    stories.value = data.stories || []
  }
  catch (error) {
    console.error('加载故事失败:', error)
  }
  finally {
    loading.value = false
  }
}

// 删除故事
async function deleteStory(id: string) {
  if (!confirm('确定要删除这个故事吗?'))
    return

  try {
    await $fetch(`/api/admin/stories/${id}`, { method: 'DELETE' })
    await loadStories()
  }
  catch (error) {
    console.error('删除失败:', error)
    alert('删除失败,请重试')
  }
}

// 创建新故事
function createStory() {
  navigateTo('/admin/stories/edit?id=new')
}

// 编辑故事
function editStory(id: string) {
  navigateTo(`/admin/stories/edit?id=${id}`)
}

onMounted(() => {
  loadStories()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <div class="border-b border-gray-200 bg-white">
      <div class="mx-auto max-w-6xl px-4 py-6">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl text-gray-900 font-bold">
            故事管理
          </h1>
          <button
            class="rounded-lg from-emerald-500 to-cyan-500 bg-gradient-to-r px-6 py-2.5 text-white font-semibold transition hover:opacity-90"
            @click="createStory"
          >
            + 新建故事
          </button>
        </div>
      </div>
    </div>

    <!-- 内容 -->
    <div class="mx-auto max-w-6xl px-4 py-8">
      <!-- 加载中 -->
      <div v-if="loading" class="py-20 text-center text-emerald-600">
        加载中...
      </div>

      <!-- 空状态 -->
      <div v-else-if="stories.length === 0" class="py-20 text-center">
        <div class="mb-4 text-6xl">
          📖
        </div>
        <p class="text-gray-600">
          还没有故事,点击"新建故事"开始创作吧!
        </p>
      </div>

      <!-- 故事列表 -->
      <div v-else class="space-y-4">
        <div
          v-for="story in stories"
          :key="story.id"
          class="flex items-center justify-between rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <div class="flex-1">
            <h3 class="mb-2 text-lg text-gray-900 font-bold">
              {{ story.title }}
              <span
                class="ml-2 rounded-full px-3 py-1 text-xs font-medium"
                :class="story.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'"
              >
                {{ story.isPublished ? '已发布' : '草稿' }}
              </span>
            </h3>
            <p class="text-sm text-gray-500">
              创建于 {{ new Date(story.createdAt).toLocaleString('zh-CN') }}
            </p>
          </div>

          <div class="flex gap-2">
            <button
              class="rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-600 font-medium transition hover:bg-emerald-100"
              @click="editStory(story.id)"
            >
              编辑
            </button>
            <button
              class="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 font-medium transition hover:bg-red-100"
              @click="deleteStory(story.id)"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
