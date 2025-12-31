/**
 * 故事彩蛋类型定义
 */
export interface StoryEgg {
  /** 彩蛋唯一ID */
  id: string
  /** 彩蛋标题 */
  title: string
  /** 彩蛋内容(支持Markdown) */
  content: string
  /** 彩蛋图标(emoji) */
  icon?: string
  /** 触发方式 */
  triggerType: 'hidden-button'
  /** 隐藏按钮的位置配置 */
  buttonConfig?: {
    /** 按钮图标 */
    icon: string
    /** 按钮位置(相对于故事结束区域) */
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
    /** 提示文字(可选) */
    hint?: string
  }
}

/**
 * 故事类型定义
 */
export interface Story {
  /** 故事唯一ID */
  id: string
  /** 故事标题 */
  title: string
  /** 封面图片URL */
  cover?: string
  /** 故事内容(支持Markdown) */
  content: string
  /** 访问密码 */
  password: string
  /** 彩蛋列表(最多2个) */
  eggs: StoryEgg[]
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
  /** 发布时间 */
  publishedAt?: string
  /** 是否发布 */
  isPublished: boolean
}

/**
 * 故事列表项(不包含内容和密码)
 */
export interface StoryListItem {
  id: string
  title: string
  cover?: string
  createdAt: string
  isPublished: boolean
  hasPassword: boolean
}

/**
 * 故事列表响应
 */
export interface StoryListResponse {
  stories: StoryListItem[]
  total: number
  page: number
  limit: number
}

/**
 * 密码验证请求
 */
export interface VerifyPasswordRequest {
  password: string
}

/**
 * 密码验证响应
 */
export interface VerifyPasswordResponse {
  success: boolean
  message?: string
  token?: string
}

/**
 * 故事内容响应(需要token)
 */
export interface StoryContentResponse {
  id: string
  title: string
  cover?: string
  content: string
  eggs: StoryEgg[]
}

/**
 * 管理员登录请求
 */
export interface AdminLoginRequest {
  username: string
  password: string
}

/**
 * 管理员登录响应
 */
export interface AdminLoginResponse {
  success: boolean
  message?: string
  token?: string
}

/**
 * 创建/更新故事请求
 */
export interface CreateStoryRequest {
  title: string
  cover?: string
  content: string
  password: string
  eggs: StoryEgg[]
  isPublished: boolean
}
