import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { VerifyPasswordRequest, VerifyPasswordResponse } from '~/types'

/**
 * 验证故事密码 API
 * POST /api/stories/:id/verify
 */
export default defineEventHandler(async (event): Promise<VerifyPasswordResponse> => {
  const id = getRouterParam(event, 'id')
  const body = await readBody<VerifyPasswordRequest>(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: '故事ID不能为空',
    })
  }

  if (!body || !body.password) {
    throw createError({
      statusCode: 400,
      message: '密码不能为空',
    })
  }

  try {
    // 读取故事数据
    const dataPath = join(process.cwd(), 'server', 'data', 'stories.json')
    const data = JSON.parse(readFileSync(dataPath, 'utf-8'))
    const story = data.stories.find((s: any) => s.id === id)

    if (!story) {
      throw createError({
        statusCode: 404,
        message: '故事不存在',
      })
    }

    // 验证密码
    if (story.password !== body.password) {
      return {
        success: false,
        message: '密码错误',
      }
    }

    // 生成简单的token(实际项目中应该使用JWT)
    // 这里使用 base64 编码的 id + timestamp
    const token = Buffer.from(`${id}:${Date.now()}`).toString('base64')

    return {
      success: true,
      token,
    }
  }
  catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('验证密码失败:', error)
    throw createError({
      statusCode: 500,
      message: '验证密码失败',
    })
  }
})
