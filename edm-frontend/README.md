# EDM智能投递网关 - 前端演示

这是一个基于产品需求文档构建的EDM（电子邮件营销）智能投递网关前端快速演示模型。

## 🚀 项目概述

EDM智能投递网关是一个专业的邮件投递服务平台，为开发者和企业提供稳定、高效、可追踪的邮件发送能力。本项目是其前端界面的完整演示版本。

## ✨ 核心功能

### 🔐 用户认证系统
- 邮箱注册/登录
- 密码重置功能
- 新用户100封免费邮件额度

### 📊 仪表盘
- 账户额度实时显示
- 核心指标展示（发送量、送达率、打开率、点击率）
- 最近活动概览
- 数据可视化图表

### 🔑 API密钥管理
- 创建/删除API密钥
- 密钥完整显示和一键复制
- 使用状态追踪
- 集成说明文档

### 🌐 域名管理
- 添加发信域名
- DNS配置记录生成（SPF/DKIM/CNAME）
- 自动域名验证
- 配置状态实时追踪

### 📈 活动报告
- 自动生成活动列表
- 详细数据分析
- 数据可视化图表
- 搜索和筛选功能

## 🛠 技术栈

- **框架**: Next.js 14 + TypeScript
- **样式**: Tailwind CSS + ShadCN UI
- **状态管理**: SWR (模拟API调用)
- **图表**: Recharts
- **图标**: Lucide React
- **通知**: Sonner

## 🏃‍♂️ 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 演示账户
- **邮箱**: liming@mycompany.com
- **密码**: password123

## 📱 页面结构

```
/                    # 首页（自动重定向）
├── /login          # 登录页面
├── /register       # 注册页面
├── /dashboard      # 仪表盘
├── /api-keys       # API密钥管理
├── /domains        # 域名管理
└── /campaigns      # 活动报告
```

## 🎨 设计特色

- **极简设计**: 遵循产品文档中的"极简、清晰、工具化"设计原则
- **响应式布局**: 适配桌面和移动设备
- **数据驱动**: 重点展示关键数据和指标
- **用户友好**: 直观的操作流程和清晰的状态反馈

## 📊 Mock数据

项目使用完整的Mock数据模拟真实场景：
- 用户账户信息
- API密钥数据
- 域名配置状态
- 邮件活动统计
- 图表数据

所有数据存储在浏览器本地存储中，支持完整的CRUD操作演示。

## 🔧 主要组件

### 布局组件
- `DashboardLayout`: 主要布局容器
- `Sidebar`: 侧边导航栏
- `Header`: 顶部导航栏

### 功能组件
- `ProtectedRoute`: 路由保护
- `AuthProvider`: 认证状态管理

### UI组件
基于ShadCN UI构建的一致性组件库

## 📈 数据可视化

使用Recharts库实现：
- 柱状图：活动数据对比
- 饼图：数据分布展示
- 进度条：额度使用情况
- 趋势图：时间序列数据

## 🚀 部署

### 构建生产版本
```bash
npm run build
```

项目已配置为静态导出，构建后会在 `out` 目录生成静态文件。

### 部署到 Netlify

#### 方法一：使用部署脚本（推荐）
```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录 Netlify
netlify login

# 运行部署脚本
./deploy.sh
```

#### 方法二：手动部署
```bash
# 构建项目
npm run build

# 部署到 Netlify
netlify deploy --prod --dir=out
```

#### 方法三：Git 集成
1. 将代码推送到 Git 仓库（GitHub、GitLab 或 Bitbucket）
2. 在 Netlify 控制台中连接仓库
3. 配置构建设置：
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
   - **Base directory**: `edm-frontend`（如果在子目录中）

### 部署配置

项目包含以下部署配置文件：
- `netlify.toml`: Netlify 部署配置
- `next.config.ts`: Next.js 静态导出配置
- `deploy.sh`: 自动化部署脚本

详细部署说明请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)

### 启动生产服务器（本地测试）
```bash
npm start
```

## 📝 开发说明

- 所有API调用都是模拟的，使用延迟模拟真实网络请求
- 数据持久化使用localStorage
- 支持完整的用户交互流程
- 包含错误处理和加载状态

## 🎯 产品特色

1. **智能投递**: 模拟智能选择最佳投递通道
2. **数据追踪**: 完整的打开/点击追踪演示
3. **域名验证**: 自动DNS配置验证流程
4. **活动管理**: 基于campaign_id的自动活动分组

## 📞 技术支持

这是一个演示项目，基于以下产品文档构建：
- `edm-fm.md`: 功能矩阵
- `edm-prd.md`: 产品需求规格
- `edm-tga.md`: 技术架构建议

## 📄 许可证

本项目仅用于演示目的。
