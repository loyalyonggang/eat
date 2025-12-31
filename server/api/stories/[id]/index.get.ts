import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * 获取故事详情 API(不包含内容)
 * GET /api/stories/:id
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: '故事ID不能为空',
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

    // 返回基本信息(不包含内容、密码和彩蛋)
    return {
      id: story.id,
      title: story.title,
      cover: story.cover,
      hasPassword: !!story.password,
      createdAt: story.createdAt,
      isPublished: story.isPublished,
    }
  }
  catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('获取故事详情失败:', error)
    throw createError({
      statusCode: 500,
      message: '获取故事详情失败',
    })
  }
})
