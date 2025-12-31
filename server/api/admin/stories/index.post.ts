import type { CreateStoryRequest, Story } from '~/types'
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
 * 创建故事 API
 * POST /api/admin/stories
 */
export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')

  // 验证管理员权限
  if (!verifyAdminToken(authHeader)) {
    throw createError({
      statusCode: 401,
      message: '未授权访问',
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

    // 生成新故事ID
    const id = `story-${Date.now()}`
    const now = new Date().toISOString()

    const newStory: Story = {
      id,
      title: body.title,
      cover: body.cover,
      content: body.content,
      password: body.password,
      eggs: body.eggs || [],
      createdAt: now,
      updatedAt: now,
      publishedAt: body.isPublished ? now : undefined,
      isPublished: body.isPublished,
    }

    // 添加到列表
    data.stories.push(newStory)

    // 保存
    writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8')

    return {
      success: true,
      story: newStory,
    }
  }
  catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('创建故事失败:', error)
    throw createError({
      statusCode: 500,
      message: '创建故事失败',
    })
  }
})
