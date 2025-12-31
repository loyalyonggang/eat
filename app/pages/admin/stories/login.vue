<script setup lang="ts">
import type { AdminLoginRequest, AdminLoginResponse } from '~/types'

definePageMeta({
  layout: false,
})

useHead({
  title: '管理员登录',
})

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

// 登录
async function login() {
  if (!username.value || !password.value) {
    error.value = '请输入用户名和密码'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await $fetch<AdminLoginResponse>('/api/admin/login', {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value,
      } as AdminLoginRequest,
    })

    if (response.success && response.token) {
      if (import.meta.client) {
        localStorage.setItem('admin-token', response.token)
      }
      navigateTo('/admin/stories')
    }
    else {
      error.value = response.message || '登录失败'
    }
  }
  catch (err) {
    console.error('登录失败:', err)
    error.value = '登录失败,请重试'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>管理员登录</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif;">
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%); padding: 1rem;">
        <div style="width: 100%; max-width: 28rem; background: white; border-radius: 1.5rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); overflow: hidden;">
          <!-- 头部 -->
          <div style="background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); padding: 3rem 2rem; text-align: center;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">🔐</div>
            <h1 style="color: white; font-size: 1.875rem; font-weight: bold; margin: 0 0 0.5rem 0;">故事管理后台</h1>
            <p style="color: rgba(255, 255, 255, 0.8); font-size: 0.875rem; margin: 0;">Una 的秘密花园</p>
          </div>

          <!-- 表单 -->
          <div style="padding: 2rem;">
            <form @submit.prevent="login">
              <!-- 用户名 -->
              <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; color: #374151;">用户名</label>
                <input
                  v-model="username"
                  type="text"
                  placeholder="请输入用户名"
                  autocomplete="username"
                  style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.75rem; font-size: 1rem; outline: none; box-sizing: border-box; transition: all 0.2s;"
                  @focus="(e) => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)'; }"
                  @blur="(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }"
                >
              </div>

              <!-- 密码 -->
              <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; color: #374151;">密码</label>
                <input
                  v-model="password"
                  type="password"
                  placeholder="请输入密码"
                  autocomplete="current-password"
                  style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.75rem; font-size: 1rem; outline: none; box-sizing: border-box; transition: all 0.2s;"
                  @focus="(e) => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)'; }"
                  @blur="(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }"
                >
              </div>

              <!-- 错误提示 -->
              <div v-if="error" style="margin-bottom: 1rem; padding: 0.75rem 1rem; background: #fef2f2; border-radius: 0.75rem; color: #dc2626; font-size: 0.875rem;">
                {{ error }}
              </div>

              <!-- 登录按钮 -->
              <button
                type="submit"
                :disabled="loading"
                style="width: 100%; padding: 0.75rem; background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); color: white; font-weight: bold; border: none; border-radius: 0.75rem; font-size: 1rem; cursor: pointer; transition: transform 0.2s; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);"
                @mousedown="(e) => e.target.style.transform = 'scale(0.98)'"
                @mouseup="(e) => e.target.style.transform = 'scale(1)'"
                @mouseleave="(e) => e.target.style.transform = 'scale(1)'"
              >
                {{ loading ? '登录中...' : '登录' }}
              </button>

              <!-- 返回首页 -->
              <a
                href="/"
                style="display: block; margin-top: 1rem; text-align: center; font-size: 0.875rem; color: #6b7280; text-decoration: none; transition: color 0.2s;"
                @mouseenter="(e) => e.target.style.color = '#10b981'"
                @mouseleave="(e) => e.target.style.color = '#6b7280'"
              >
                返回首页
              </a>
            </form>
          </div>
        </div>
      </div>
    </body>
  </html>
</template>
