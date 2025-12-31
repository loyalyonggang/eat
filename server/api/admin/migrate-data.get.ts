/**
 * 数据迁移脚本
 * 将现有的 stories.json 数据迁移到 Netlify Blobs
 * 
 * 使用方法:
 * 1. 确保已部署到 Netlify
 * 2. 在 Netlify Functions 中运行此脚本
 * 3. 或者在本地使用 netlify dev 运行
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { saveAllStoriesData } from '../utils/stories-store'
import type { StoriesData } from '../utils/stories-store'

export default defineEventHandler(async () => {
  try {
    // 读取现有的 stories.json 文件
    const dataPath = join(process.cwd(), 'server', 'data', 'stories.json')
    const data: StoriesData = JSON.parse(readFileSync(dataPath, 'utf-8'))

    console.log(`准备迁移 ${data.stories.length} 个故事到 Netlify Blobs...`)

    // 保存到 Netlify Blobs
    await saveAllStoriesData(data)

    console.log('数据迁移成功!')

    return {
      success: true,
      message: `成功迁移 ${data.stories.length} 个故事到 Netlify Blobs`,
      storiesCount: data.stories.length,
    }
  }
  catch (error: any) {
    console.error('数据迁移失败:', error)
    return {
      success: false,
      message: '数据迁移失败',
      error: error.message,
    }
  }
})
