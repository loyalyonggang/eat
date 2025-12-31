import type { CreateStoryRequest, Story } from '~/types'
import { createStory } from '../../../utils/stories-store'

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
    // 使用 Netlify Blobs 创建故事
    const newStory: Story = await createStory({
      title: body.title,
      cover: body.cover,
      content: body.content,
      password: body.password,
      eggs: body.eggs || [],
      isPublished: body.isPublished,
    })

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
