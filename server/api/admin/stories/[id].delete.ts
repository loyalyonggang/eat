import { deleteStory } from '../../../utils/stories-store'

/**
 * 验证管理员token
 * 已禁用 - 允许直接访问
 */
function verifyAdminToken(_authHeader: string | undefined): boolean {
  // 验证已禁用,直接返回 true
  return true
}

/**
 * 删除故事 API
 * DELETE /api/admin/stories/:id
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

  try {
    // 使用 Netlify Blobs 删除故事
    const success = await deleteStory(id)

    if (!success) {
      throw createError({
        statusCode: 404,
        message: '故事不存在',
      })
    }

    return {
      success: true,
      message: '删除成功',
    }
  }
  catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('删除故事失败:', error)
    throw createError({
      statusCode: 500,
      message: '删除故事失败',
    })
  }
})
