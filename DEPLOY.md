# 部署指南 - Una 的食用手册

## 🚀 使用 Vercel 部署

### 方法一：通过 Vercel 网站部署（推荐）

1. **访问 Vercel**
   - 打开 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New..." → "Project"
   - 选择你的 GitHub 仓库：`loyalyonggang/eat`
   - 点击 "Import"

3. **配置项目**
   - **Framework Preset**: 自动检测为 Nuxt.js
   - **Root Directory**: 留空（项目已在根目录）
   - **Build Command**: `pnpm run convert && pnpm run generate`
   - **Output Directory**: `.output/public`
   - **Install Command**: `pnpm install`

4. **配置环境变量**
   点击 "Environment Variables"，添加以下变量：

   ```
   VITE_SILICONFLOW_API_KEY=你的API密钥
   VITE_SILICONFLOW_MODEL=Qwen/Qwen2.5-7B-Instruct
   ```

5. **部署**
   - 点击 "Deploy" 按钮
   - 等待 2-3 分钟，部署完成
   - 你会获得一个 `.vercel.app` 域名

### 方法二：使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 在项目目录下运行
cd c:\Users\xzgg5577\Documents\WindsurfCode\whattoeat\cook
vercel

# 按照提示操作：
# - 登录 Vercel 账号
# - 选择项目设置
# - 确认部署
```

## 🔧 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

| 变量名                     | 说明                 | 示例值                     |
| -------------------------- | -------------------- | -------------------------- |
| `VITE_SILICONFLOW_API_KEY` | SiliconFlow API 密钥 | `sk-xxxxx`                 |
| `VITE_SILICONFLOW_MODEL`   | AI 模型名称          | `Qwen/Qwen2.5-7B-Instruct` |

## 📱 自定义域名（可选）

1. 在 Vercel 项目设置中选择 "Domains"
2. 添加你的自定义域名
3. 按照提示配置 DNS 记录

## 🔄 自动部署

配置完成后，每次推送代码到 GitHub 的 `main` 分支，Vercel 会自动：

- 检测代码变更
- 运行构建
- 自动部署新版本

## ⚠️ 注意事项

1. **API 密钥安全**：不要将 API 密钥提交到 Git 仓库
2. **构建时间**：首次部署可能需要 3-5 分钟
3. **Node 版本**：确保使用 Node.js 20+ 或 22+
4. **包管理器**：项目使用 pnpm，但 Vercel 会自动处理

## 🎉 部署成功后

访问你的 Vercel 提供的 URL，例如：

- `https://your-project.vercel.app`

Una 就可以通过这个链接访问应用了！

## 🐛 常见问题

### 部署后出现 404 错误

**症状**: 访问部署的网站显示 "404: NOT_FOUND"

**原因**:

- `vercel.json` 配置错误（`framework: null` 或输出目录不正确）
- 构建命令不正确
- 输出目录设置为 `dist` 而不是 `.output/public`

**解决方案**:

1. 确保 `vercel.json` 配置正确：

   ```json
   {
     "buildCommand": "pnpm run convert && pnpm run generate",
     "outputDirectory": ".output/public",
     "installCommand": "pnpm install"
   }
   ```

2. 在 Vercel 项目设置中检查：
   - Settings → General → Build & Development Settings
   - 确认 Output Directory 为 `.output/public`
   - 确认 Build Command 为 `pnpm run convert && pnpm run generate`

3. 重新部署项目

### 构建失败

- 检查 Node.js 版本是否符合要求
- 查看 Vercel 构建日志
- 确认所有依赖都已正确安装

### 聊天功能不工作

- 检查环境变量是否正确配置
- 确认 API 密钥有效
- 查看浏览器控制台错误信息

### 页面加载慢

- Vercel 免费版在全球有 CDN 加速
- 首次访问可能需要冷启动
- 考虑升级到 Pro 版本获得更好性能
