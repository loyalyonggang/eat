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

    // 删除故事
    data.stories.splice(storyIndex, 1)

    // 保存
    writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8')

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
