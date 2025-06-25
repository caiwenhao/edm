# EDM Frontend - Netlify 部署指南

## 项目概述
这是一个基于 Next.js 的 EDM（电子邮件营销）系统前端应用，使用 TypeScript、Tailwind CSS 和现代 React 组件库构建。

## 技术栈
- **框架**: Next.js 15.3.4
- **语言**: TypeScript
- **样式**: Tailwind CSS 4.0
- **UI组件**: Radix UI
- **图表**: Recharts
- **状态管理**: 本地状态 + SWR
- **动画**: Framer Motion

## 部署到 Netlify

### 方法一：通过 Netlify CLI（推荐）

1. **安装 Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **登录 Netlify**
   ```bash
   netlify login
   ```

3. **在项目目录中初始化**
   ```bash
   cd edm-frontend
   netlify init
   ```

4. **构建和部署**
   ```bash
   npm run build
   netlify deploy --prod
   ```

### 方法二：通过 Git 集成

1. **将代码推送到 Git 仓库**（GitHub、GitLab 或 Bitbucket）

2. **在 Netlify 控制台中**：
   - 点击 "New site from Git"
   - 选择你的 Git 提供商
   - 选择仓库
   - 配置构建设置：
     - **Build command**: `npm run build`
     - **Publish directory**: `out`
     - **Base directory**: `edm-frontend`

3. **部署**
   - Netlify 会自动构建和部署
   - 每次推送到主分支都会触发自动部署

### 方法三：手动上传

1. **本地构建**
   ```bash
   cd edm-frontend
   npm install
   npm run build
   ```

2. **上传到 Netlify**
   - 在 Netlify 控制台中选择 "Deploy manually"
   - 将 `out` 文件夹拖拽到部署区域

## 环境变量配置

如果需要配置环境变量，在 Netlify 控制台中：
1. 进入 Site settings > Environment variables
2. 添加所需的环境变量（参考 `.env.example`）

## 自定义域名

1. 在 Netlify 控制台中进入 Domain settings
2. 添加自定义域名
3. 配置 DNS 记录指向 Netlify

## 性能优化

项目已包含以下优化：
- 静态资源缓存配置
- 图片优化设置
- 代码分割
- 安全头部设置

## 故障排除

### 构建失败
- 检查 Node.js 版本（推荐 18+）
- 确保所有依赖都已安装
- 检查 TypeScript 类型错误

### 路由问题
- 确保 `netlify.toml` 中的重定向规则正确
- 检查 Next.js 配置中的 `trailingSlash` 设置

### 样式问题
- 确保 Tailwind CSS 配置正确
- 检查 PostCSS 配置

## 监控和分析

部署后可以：
- 在 Netlify 控制台查看部署日志
- 配置表单处理（如果需要）
- 设置分析和监控

## 支持

如有问题，请检查：
1. Netlify 部署日志
2. 浏览器控制台错误
3. Next.js 文档
4. Netlify 文档
