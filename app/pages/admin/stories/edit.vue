<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const id = route.query.id as string

useHead({
  title: id === 'new' ? '新建故事' : '编辑故事',
})

const story = ref({
  title: '',
  content: '',
  password: '',
  isPublished: false,
  eggs: [] as any[],
})

const loading = ref(false)
const saving = ref(false)

// 加载故事
async function loadStory() {
  // 如果没有 ID 参数,跳转到列表页
  if (!id) {
    router.push('/admin/stories')
    return
  }

  if (id === 'new')
    return

  try {
    loading.value = true
    const data = await $fetch(`/api/admin/stories/${id}`)
    story.value = data
  }
  catch (error) {
    console.error('加载故事失败:', error)
    alert('加载失败')
    router.push('/admin/stories')
  }
  finally {
    loading.value = false
  }
}

// 保存故事
async function saveStory() {
  if (!story.value.title.trim()) {
    alert('请输入故事标题')
    return
  }

  if (!story.value.content.trim()) {
    alert('请输入故事内容')
    return
  }

  try {
    saving.value = true

    if (id === 'new') {
      // 创建新故事
      await $fetch('/api/admin/stories', {
        method: 'POST',
        body: story.value,
      })
    }
    else {
      // 更新故事
      await $fetch(`/api/admin/stories/${id}`, {
        method: 'PUT',
        body: story.value,
      })
    }

    alert('保存成功!')
    router.push('/admin/stories')
  }
  catch (error) {
    console.error('保存失败:', error)
    alert('保存失败,请重试')
  }
  finally {
    saving.value = false
  }
}

// 添加彩蛋
function addEgg() {
  story.value.eggs.push({
    id: `egg-${Date.now()}`,
    title: '',
    content: '',
    icon: '🎁',
    triggerType: 'hidden-button',
    buttonConfig: {
      icon: '🎁',
      position: 'bottom-right',
      hint: '点击发现隐藏彩蛋',
    },
  })
}

// 删除彩蛋
function removeEgg(index: number) {
  story.value.eggs.splice(index, 1)
}

onMounted(() => {
  loadStory()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <div class="border-b border-gray-200 bg-white">
      <div class="mx-auto max-w-4xl px-4 py-6">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl text-gray-900 font-bold">
            {{ id === 'new' ? '新建故事' : '编辑故事' }}
          </h1>
          <div class="flex gap-2">
            <button
              class="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 font-medium transition hover:bg-gray-200"
              @click="router.push('/admin/stories')"
            >
              取消
            </button>
            <button
              class="rounded-lg from-emerald-500 to-cyan-500 bg-gradient-to-r px-6 py-2 text-white font-semibold transition hover:opacity-90"
              :disabled="saving"
              @click="saveStory"
            >
              {{ saving ? '保存中...' : '保存' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 表单 -->
    <div v-if="!loading" class="mx-auto max-w-4xl px-4 py-8">
      <div class="rounded-xl bg-white p-6 shadow-sm space-y-6">
        <!-- 标题 -->
        <div>
          <label class="mb-2 block text-sm text-gray-700 font-medium">故事标题</label>
          <input
            v-model="story.title"
            type="text"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none"
            placeholder="输入故事标题"
          >
        </div>

        <!-- 内容 -->
        <div>
          <label class="mb-2 block text-sm text-gray-700 font-medium">故事内容 (支持 Markdown)</label>
          <textarea
            v-model="story.content"
            rows="15"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm font-mono focus:border-emerald-500 focus:outline-none"
            placeholder="输入故事内容,支持 Markdown 格式..."
          />
        </div>

        <!-- 密码 -->
        <div>
          <label class="mb-2 block text-sm text-gray-700 font-medium">阅读密码</label>
          <input
            v-model="story.password"
            type="text"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none"
            placeholder="设置阅读密码"
          >
        </div>

        <!-- 发布状态 -->
        <div class="flex items-center gap-3">
          <input
            id="published"
            v-model="story.isPublished"
            type="checkbox"
            class="h-4 w-4 border-gray-300 rounded text-emerald-600 focus:ring-emerald-500"
          >
          <label for="published" class="text-sm text-gray-700 font-medium">
            发布故事
          </label>
        </div>

        <!-- 彩蛋设置 -->
        <div class="border-t border-gray-200 pt-6">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg text-gray-900 font-bold">
              彩蛋设置
            </h3>
            <button
              class="rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-600 font-medium transition hover:bg-emerald-100"
              @click="addEgg"
            >
              + 添加彩蛋
            </button>
          </div>

          <div v-if="story.eggs.length === 0" class="py-8 text-center text-gray-500">
            还没有彩蛋,点击"添加彩蛋"创建一个吧!
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="(egg, index) in story.eggs"
              :key="egg.id"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="mb-4 flex items-center justify-between">
                <h4 class="text-gray-900 font-medium">
                  彩蛋 {{ index + 1 }}
                </h4>
                <button
                  class="text-sm text-red-600 hover:text-red-700"
                  @click="removeEgg(index)"
                >
                  删除
                </button>
              </div>

              <div class="space-y-3">
                <div>
                  <label class="mb-1 block text-sm text-gray-600">彩蛋标题</label>
                  <input
                    v-model="egg.title"
                    type="text"
                    class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                    placeholder="彩蛋标题"
                  >
                </div>

                <div>
                  <label class="mb-1 block text-sm text-gray-600">彩蛋内容</label>
                  <textarea
                    v-model="egg.content"
                    rows="5"
                    class="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono focus:border-emerald-500 focus:outline-none"
                    placeholder="彩蛋内容..."
                  />
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="mb-1 block text-sm text-gray-600">图标</label>
                    <input
                      v-model="egg.icon"
                      type="text"
                      class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                      placeholder="🎁"
                    >
                  </div>

                  <div>
                    <label class="mb-1 block text-sm text-gray-600">按钮位置</label>
                    <select
                      v-model="egg.buttonConfig.position"
                      class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="top-left">
                        左上角
                      </option>
                      <option value="top-right">
                        右上角
                      </option>
                      <option value="bottom-left">
                        左下角
                      </option>
                      <option value="bottom-right">
                        右下角
                      </option>
                      <option value="center">
                        中心
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
