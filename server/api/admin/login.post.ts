import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { AdminLoginRequest, AdminLoginResponse } from '~/types'

/**
 * 管理员登录 API
 * POST /api/admin/login
 */
export default defineEventHandler(async (event): Promise<AdminLoginResponse> => {
  const body = await readBody<AdminLoginRequest>(event)

  if (!body || !body.username || !body.password) {
    throw createError({
      statusCode: 400,
      message: '用户名和密码不能为空',
    })
  }

  try {
    // 读取管理员配置
    const dataPath = join(process.cwd(), 'server', 'data', 'stories.json')
    const data = JSON.parse(readFileSync(dataPath, 'utf-8'))
    const admin = data.admin

    // 验证账号密码
    if (body.username !== admin.username || body.password !== admin.password) {
      return {
        success: false,
        message: '用户名或密码错误',
      }
    }

    // 生成管理员token
    const token = Buffer.from(`admin:${Date.now()}`).toString('base64')

    return {
      success: true,
      token,
    }
  }
  catch (error) {
    console.error('管理员登录失败:', error)
    throw createError({
      statusCode: 500,
      message: '登录失败',
    })
  }
})
