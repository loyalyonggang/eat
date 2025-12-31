<script setup lang="ts">
import type { CreateStoryRequest, Story, StoryEgg } from '~/types'

definePageMeta({
  middleware: 'admin-auth',
})

const route = useRoute()
const router = useRouter()
const storyId = computed(() => {
  // @ts-expect-error - route.params.id 类型在运行时是正确的
  const id = String(route.params.id || '')
  if (!id || id === 'new') {
    return null
  }
  return id
})
const isNew = computed(() => !storyId.value)

useHead({
  title: isNew.value ? '新建故事' : '编辑故事',
})

// 表单数据
const form = ref({
  title: '',
  cover: '',
  content: '',
  password: '',
  isPublished: false,
  eggs: [] as StoryEgg[],
})

const loading = ref(false)
const saving = ref(false)

// 加载故事数据(编辑模式)
async function loadStory() {
  if (isNew.value)
    return

  loading.value = true
  try {
    const token = import.meta.client ? localStorage.getItem('admin-token') : null

    const response = await $fetch<Story>(`/api/admin/stories/${storyId.value}`, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    })

    form.value = {
      title: response.title,
      cover: response.cover || '',
      content: response.content,
      password: response.password,
      isPublished: response.isPublished,
      eggs: (response.eggs || []).map(egg => ({
        ...egg,
        buttonConfig: egg.buttonConfig || {
          icon: '⭐',
          position: 'top-left',
          hint: '点击发现彩蛋',
        },
      })),
    }
  }
  catch (error) {
    console.error('加载故事失败:', error)
    alert('加载故事失败')
    router.push('/admin/stories')
  }
  finally {
    loading.value = false
  }
}

// 添加彩蛋
function addEgg() {
  form.value.eggs.push({
    id: `egg-${Date.now()}`,
    title: '',
    content: '',
    icon: '⭐',
    triggerType: 'hidden-button',
    buttonConfig: {
      icon: '⭐',
      position: 'top-left',
      hint: '点击发现彩蛋',
    },
  })
}

// 删除彩蛋
function removeEgg(index: number) {
  form.value.eggs.splice(index, 1)
}

// 保存故事
async function saveStory() {
  // 验证
  if (!form.value.title) {
    alert('请输入故事标题')
    return
  }
  if (!form.value.content) {
    alert('请输入故事内容')
    return
  }
  if (!form.value.password) {
    alert('请设置访问密码')
    return
  }

  saving.value = true

  try {
    const token = import.meta.client ? localStorage.getItem('admin-token') : null

    const body: CreateStoryRequest = {
      title: form.value.title,
      cover: form.value.cover || undefined,
      content: form.value.content,
      password: form.value.password,
      eggs: form.value.eggs,
      isPublished: form.value.isPublished,
    }

    if (isNew.value) {
      // 创建新故事
      await $fetch('/api/admin/stories', {
        method: 'POST',
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
        body,
      })
    }
    else {
      // 更新故事
      await $fetch(`/api/admin/stories/${storyId.value}`, {
        method: 'PUT',
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
        body,
      })
    }

    alert('保存成功!')
    router.push('/admin/stories')
  }
  catch (error) {
    console.error('保存故事失败:', error)
    alert('保存失败,请重试')
  }
  finally {
    saving.value = false
  }
}

// 取消编辑
function cancel() {
  router.push('/admin/stories')
}

// 初始加载
onMounted(() => {
  loadStory()
})
</script>

<template>
  <div style="min-height: 100vh; background-color: #f9fafb; padding: 20px;">
    <!-- 头部 -->
    <div style="background-color: white; border-bottom: 1px solid #e5e7eb; padding: 20px; margin-bottom: 20px;">
      <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
        <h1 style="font-size: 24px; font-weight: bold; color: #1f2937;">
          {{ isNew ? '新建故事' : '编辑故事' }}
        </h1>
        <div style="display: flex; gap: 10px;">
          <button
            type="button"
            style="background-color: #e5e7eb; color: #374151; padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; font-weight: bold;"
            @click="cancel"
          >
            取消
          </button>
          <button
            type="button"
            style="background: linear-gradient(to right, #10b981, #06b6d4); color: white; padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; font-weight: bold;"
            :disabled="saving"
            @click="saveStory"
          >
            {{ saving ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 表单 -->
    <div style="max-width: 1200px; margin: 0 auto;">
      <div v-if="loading" style="text-align: center; padding: 80px 0;">
        <div style="color: #10b981;">
          加载中...
        </div>
      </div>

      <div v-else style="display: flex; flex-direction: column; gap: 20px;">
        <!-- 基本信息 -->
        <div style="background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 20px;">
            基本信息
          </h2>

          <div style="display: flex; flex-direction: column; gap: 20px;">
            <!-- 标题 -->
            <div>
              <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #374151;">
                故事标题 *
              </label>
              <input
                v-model="form.title"
                type="text"
                placeholder="请输入故事标题"
                style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; outline: none;"
              >
            </div>

            <!-- 封面 -->
            <div>
              <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #374151;">
                封面图片 URL
              </label>
              <input
                v-model="form.cover"
                type="text"
                placeholder="https://example.com/cover.jpg"
                style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; outline: none;"
              >
              <p style="margin-top: 4px; font-size: 12px; color: #6b7280;">
                可选,留空则显示默认图标
              </p>
            </div>

            <!-- 密码 -->
            <div>
              <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #374151;">
                访问密码 *
              </label>
              <input
                v-model="form.password"
                type="text"
                placeholder="请设置访问密码"
                style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; outline: none;"
              >
            </div>

            <!-- 发布状态 -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <input
                id="published"
                v-model="form.isPublished"
                type="checkbox"
                style="width: 18px; height: 18px; cursor: pointer;"
              >
              <label for="published" style="font-size: 14px; font-weight: 500; color: #374151; cursor: pointer;">
                发布故事(取消勾选则保存为草稿)
              </label>
            </div>
          </div>
        </div>

        <!-- 故事内容 -->
        <div style="background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 20px;">
            故事内容 *
          </h2>
          <textarea
            v-model="form.content"
            rows="15"
            placeholder="在这里编写故事内容,支持 Markdown 格式..."
            style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; font-family: monospace; outline: none; resize: vertical;"
          />
          <p style="margin-top: 8px; font-size: 12px; color: #6b7280;">
            支持 Markdown 格式:标题、粗体、斜体、图片等
          </p>
        </div>

        <!-- 彩蛋设置 -->
        <div style="background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="font-size: 18px; font-weight: bold; color: #1f2937;">
              彩蛋设置
            </h2>
            <button
              type="button"
              style="background-color: #d1fae5; color: #059669; padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; font-size: 14px; font-weight: 500;"
              :style="{ opacity: form.eggs.length >= 2 ? 0.5 : 1, cursor: form.eggs.length >= 2 ? 'not-allowed' : 'pointer' }"
              :disabled="form.eggs.length >= 2"
              @click="addEgg"
            >
              + 添加彩蛋
            </button>
          </div>

          <p style="margin-bottom: 20px; font-size: 14px; color: #6b7280;">
            最多可以添加 2 个彩蛋,读者需要在故事结束后点击隐藏按钮来发现彩蛋
          </p>

          <div v-if="form.eggs.length === 0" style="background-color: #f9fafb; padding: 40px; border-radius: 8px; text-align: center; font-size: 14px; color: #6b7280;">
            还没有彩蛋,点击"添加彩蛋"开始设置
          </div>

          <div v-else style="display: flex; flex-direction: column; gap: 16px;">
            <div
              v-for="(egg, index) in form.eggs"
              :key="egg.id"
              style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;"
            >
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h3 style="font-size: 14px; font-weight: 500; color: #374151;">
                  彩蛋 {{ index + 1 }}
                </h3>
                <button
                  type="button"
                  style="color: #dc2626; font-size: 14px; background: none; border: none; cursor: pointer;"
                  @click="removeEgg(index)"
                >
                  删除
                </button>
              </div>

              <div style="display: flex; flex-direction: column; gap: 12px;">
                <!-- 彩蛋标题 -->
                <div>
                  <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #4b5563;">彩蛋标题</label>
                  <input
                    v-model="egg.title"
                    type="text"
                    placeholder="例如:惊喜彩蛋"
                    style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; outline: none;"
                  >
                </div>

                <!-- 彩蛋内容 -->
                <div>
                  <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #4b5563;">彩蛋内容</label>
                  <textarea
                    v-model="egg.content"
                    rows="3"
                    placeholder="彩蛋的具体内容..."
                    style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; outline: none; resize: vertical;"
                  />
                </div>

                <!-- 按钮图标 -->
                <div>
                  <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #4b5563;">按钮图标(emoji)</label>
                  <input
                    v-model="egg.buttonConfig!.icon"
                    type="text"
                    placeholder="⭐"
                    style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; outline: none;"
                  >
                </div>

                <!-- 按钮位置 -->
                <div>
                  <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #4b5563;">按钮位置</label>
                  <select
                    v-model="egg.buttonConfig!.position"
                    style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; outline: none; background-color: white;"
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

                <!-- 提示文字 -->
                <div>
                  <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #4b5563;">提示文字</label>
                  <input
                    v-model="egg.buttonConfig!.hint"
                    type="text"
                    placeholder="点击发现彩蛋"
                    style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; outline: none;"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
