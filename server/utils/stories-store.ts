import type { Story, StoryEgg } from '~/types'
import { getStore } from '@netlify/blobs'

export interface StoriesData {
  stories: Story[]
  admin: {
    username: string
    password: string
  }
}

/**
 * 获取 Netlify Blobs 存储实例
 */
export function getStoriesStore() {
  return getStore({
    name: 'stories',
    consistency: 'strong', // 强一致性
  })
}

/**
 * 获取所有故事数据
 */
export async function getAllStoriesData(): Promise<StoriesData> {
  const store = getStoriesStore()

  try {
    const data = await store.get('stories-data', { type: 'json' })

    if (data) {
      return data as StoriesData
    }
  }
  catch (error) {
    console.error('从 Blobs 读取数据失败:', error)
  }

  // 如果没有数据,返回默认值
  return {
    stories: [],
    admin: {
      username: 'admin',
      password: 'una2025',
    },
  }
}

/**
 * 保存所有故事数据
 */
export async function saveAllStoriesData(data: StoriesData): Promise<void> {
  const store = getStoriesStore()

  try {
    await store.setJSON('stories-data', data)
  }
  catch (error) {
    console.error('保存数据到 Blobs 失败:', error)
    throw error
  }
}

/**
 * 获取单个故事
 */
export async function getStoryById(id: string): Promise<Story | null> {
  const data = await getAllStoriesData()
  return data.stories.find(s => s.id === id) || null
}

/**
 * 创建故事
 */
export async function createStory(story: Omit<Story, 'id' | 'createdAt' | 'updatedAt'>): Promise<Story> {
  const data = await getAllStoriesData()

  const newStory: Story = {
    ...story,
    id: `story-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: story.isPublished ? new Date().toISOString() : undefined,
  }

  data.stories.push(newStory)
  await saveAllStoriesData(data)

  return newStory
}

/**
 * 更新故事
 */
export async function updateStory(id: string, updates: Partial<Story>): Promise<Story | null> {
  const data = await getAllStoriesData()
  const index = data.stories.findIndex(s => s.id === id)

  if (index === -1) {
    return null
  }

  const updatedStory: Story = {
    ...data.stories[index],
    ...updates,
    id, // 确保 ID 不被修改
    updatedAt: new Date().toISOString(),
  }

  // 如果发布状态改变,更新 publishedAt
  if (updates.isPublished && !data.stories[index].isPublished) {
    updatedStory.publishedAt = new Date().toISOString()
  }

  data.stories[index] = updatedStory
  await saveAllStoriesData(data)

  return updatedStory
}

/**
 * 删除故事
 */
export async function deleteStory(id: string): Promise<boolean> {
  const data = await getAllStoriesData()
  const index = data.stories.findIndex(s => s.id === id)

  if (index === -1) {
    return false
  }

  data.stories.splice(index, 1)
  await saveAllStoriesData(data)

  return true
}

/**
 * 验证管理员密码
 */
export async function verifyAdminPassword(username: string, password: string): Promise<boolean> {
  const data = await getAllStoriesData()
  return data.admin.username === username && data.admin.password === password
}
