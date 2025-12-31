<script setup lang="ts">
import type { VerifyPasswordRequest, VerifyPasswordResponse } from '~/types'

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

useHead({
  title: '输入密码',
})

const password = ref('')
const error = ref('')
const loading = ref(false)
const shakeError = ref(false)

// 验证密码
async function verifyPassword() {
  if (!password.value) {
    error.value = '请输入密码'
    shakeError.value = true
    setTimeout(() => {
      shakeError.value = false
    }, 500)
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await $fetch<VerifyPasswordResponse>(`/api/stories/${id}/verify`, {
      method: 'POST',
      body: {
        password: password.value,
      } as VerifyPasswordRequest,
    })

    if (response.success && response.token) {
      // 保存 token 到 sessionStorage
      if (import.meta.client) {
        sessionStorage.setItem(`story-${id}-token`, response.token)
      }
      // 跳转到阅读页面
      router.push(`/tabs/apps/stories/${id}/read`)
    }
    else {
      error.value = response.message || '密码错误'
      shakeError.value = true
      setTimeout(() => {
        shakeError.value = false
      }, 500)
    }
  }
  catch (err) {
    console.error('验证密码失败:', err)
    error.value = '验证失败,请重试'
    shakeError.value = true
    setTimeout(() => {
      shakeError.value = false
    }, 500)
  }
  finally {
    loading.value = false
  }
}

// 返回列表
function goBack() {
  router.back()
}
</script>

<template>
  <ion-page>
    <CustomHeader title="输入密码" />

    <ion-content class="custom-content bg-gray-50 dark:bg-black">
      <div class="min-h-full flex flex-col items-center justify-center p-6">
        <!-- 锁图标 -->
        <div class="mb-8 h-20 w-20 flex items-center justify-center rounded-full from-emerald-500 to-cyan-500 bg-gradient-to-br text-4xl text-white shadow-lg">
          🔒
        </div>

        <!-- 标题 -->
        <h2 class="mb-2 text-2xl text-gray-800 font-bold dark:text-gray-100">
          这是一个秘密故事
        </h2>
        <p class="mb-8 text-center text-sm text-gray-500">
          请输入密码解锁故事内容
        </p>

        <!-- 密码输入框 -->
        <div class="max-w-sm w-full">
          <div
            class="mb-4 overflow-hidden rounded-2xl bg-white shadow-sm transition-all dark:bg-gray-800"
            :class="{ 'animate-shake': shakeError }"
          >
            <input
              v-model="password"
              type="password"
              placeholder="请输入密码"
              class="w-full border-none bg-transparent px-6 py-4 text-center text-lg text-gray-800 outline-none dark:text-gray-100"
              @keyup.enter="verifyPassword"
            >
          </div>

          <!-- 错误提示 -->
          <div v-if="error" class="mb-4 text-center text-sm text-red-500">
            {{ error }}
          </div>

          <!-- 验证按钮 -->
          <button
            class="w-full rounded-2xl from-emerald-500 to-cyan-500 bg-gradient-to-r py-4 text-white font-bold shadow-lg transition-transform active:scale-98 disabled:opacity-50"
            :disabled="loading"
            @click="verifyPassword"
          >
            <span v-if="loading">验证中...</span>
            <span v-else>解锁故事</span>
          </button>

          <!-- 返回按钮 -->
          <button
            class="mt-4 w-full rounded-2xl bg-gray-200 py-4 text-gray-700 font-bold transition-transform active:scale-98 dark:bg-gray-700 dark:text-gray-300"
            @click="goBack"
          >
            返回列表
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

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-10px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(10px);
  }
}

.animate-shake {
  animation: shake 0.5s;
}
</style>
