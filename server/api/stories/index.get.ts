import type { StoryListResponse } from '~/types'
import { getAllStoriesData } from '../../utils/stories-store'

/**
 * 获取故事列表 API
 * GET /api/stories
 * 查询参数:
 * - page: 页码(默认1)
 * - limit: 每页数量(默认8)
 * - published: 是否只返回已发布的故事(默认true)
 */
export default defineEventHandler(async (event): Promise<StoryListResponse> => {
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 8
  const publishedOnly = query.published !== 'false'

  try {
    // 从 Netlify Blobs 读取故事数据
    const data = await getAllStoriesData()
    let stories = data.stories || []

    // 过滤已发布的故事
    if (publishedOnly) {
      stories = stories.filter((story: any) => story.isPublished)
    }

    // 排序(按创建时间倒序)
    stories.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // 分页
    const total = stories.length
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedStories = stories.slice(start, end)

    // 返回列表项(不包含内容和密码)
    const storyList = paginatedStories.map((story: any) => ({
      id: story.id,
      title: story.title,
      cover: story.cover,
      createdAt: story.createdAt,
      isPublished: story.isPublished,
      hasPassword: !!story.password,
    }))

    return {
      stories: storyList,
      total,
      page,
      limit,
    }
  }
  catch (error) {
    console.error('获取故事列表失败:', error)
    throw createError({
      statusCode: 500,
      message: '获取故事列表失败',
    })
  }
})
