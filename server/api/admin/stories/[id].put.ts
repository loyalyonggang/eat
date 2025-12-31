import type { CreateStoryRequest } from '~/types'
import { updateStory } from '../../../utils/stories-store'

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
    // 使用 Netlify Blobs 更新故事
    const updatedStory = await updateStory(id, {
      title: body.title,
      cover: body.cover,
      content: body.content,
      password: body.password,
      eggs: body.eggs || [],
      isPublished: body.isPublished,
    })

    if (!updatedStory) {
      throw createError({
        statusCode: 404,
        message: '故事不存在',
      })
    }

    return {
      success: true,
      story: updatedStory,
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
