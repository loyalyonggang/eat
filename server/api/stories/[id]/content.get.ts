import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { StoryContentResponse } from '~/types'

/**
 * 获取故事内容 API(需要token)
 * GET /api/stories/:id/content
 * 请求头: Authorization: Bearer <token>
 */
export default defineEventHandler(async (event): Promise<StoryContentResponse> => {
  const id = getRouterParam(event, 'id')
  const authHeader = getHeader(event, 'authorization')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: '故事ID不能为空',
    })
  }

  // 验证token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      message: '未授权访问',
    })
  }

  const token = authHeader.substring(7)

  try {
    // 解析token(简单验证)
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [tokenId] = decoded.split(':')

    if (tokenId !== id) {
      throw createError({
        statusCode: 401,
        message: 'Token无效',
      })
    }

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

    // 返回完整内容
    return {
      id: story.id,
      title: story.title,
      cover: story.cover,
      content: story.content,
      eggs: story.eggs || [],
    }
  }
  catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('获取故事内容失败:', error)
    throw createError({
      statusCode: 500,
      message: '获取故事内容失败',
    })
  }
})
