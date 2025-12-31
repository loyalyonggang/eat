import type { CreateStoryRequest } from '~/types'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * 验证管理员token
 * 已禁用 - 允许直接访问
 */
function verifyAdminToken(_authHeader: string | undefined): boolean {
  // 验证已禁用,直接返回 true
  return true
}

/**
 * 更新故事 API
 * PUT /api/admin/stories/:id
 */
export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  const id = getRouterParam(event, 'id')

  // 验证管理员权限
  if (!verifyAdminToken(authHeader)) {
    throw createError({
      statusCode: 401,
      message: '未授权访问',
    })
  }

  if (!id) {
    throw createError({
      statusCode: 400,
      message: '故事ID不能为空',
    })
  }

  const body = await readBody<CreateStoryRequest>(event)

  if (!body || !body.title || !body.content || !body.password) {
    throw createError({
      statusCode: 400,
      message: '标题、内容和密码不能为空',
    })
  }

  try {
    // 读取故事数据
    const dataPath = join(process.cwd(), 'server', 'data', 'stories.json')
    const data = JSON.parse(readFileSync(dataPath, 'utf-8'))
    const storyIndex = data.stories.findIndex((s: any) => s.id === id)

    if (storyIndex === -1) {
      throw createError({
        statusCode: 404,
        message: '故事不存在',
      })
    }

    const story = data.stories[storyIndex]
    const now = new Date().toISOString()

    // 更新故事
    data.stories[storyIndex] = {
      ...story,
      title: body.title,
      cover: body.cover,
      content: body.content,
      password: body.password,
      eggs: body.eggs || [],
      updatedAt: now,
      publishedAt: body.isPublished && !story.isPublished ? now : story.publishedAt,
      isPublished: body.isPublished,
    }

    // 保存
    writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8')

    return {
      success: true,
      story: data.stories[storyIndex],
    }
  }
  catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('更新故事失败:', error)
    throw createError({
      statusCode: 500,
      message: '更新故事失败',
    })
  }
})
