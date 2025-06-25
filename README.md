# EDM智能投递网关

<div align="center">

![EDM Logo](https://img.shields.io/badge/EDM-智能投递网关-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/version-v1.1-green?style=for-the-badge)
![Status](https://img.shields.io/badge/status-开发中-orange?style=for-the-badge)

**专业的邮件投递服务平台，为开发者和企业提供稳定、高效、可追踪的邮件发送能力**

[功能特性](#-核心功能) • [快速开始](#-快速开始) • [技术架构](#-技术架构) • [API文档](#-api设计) • [部署指南](#-部署指南)

</div>

---

## 📋 项目概述

EDM智能投递网关是一个专业的SaaS平台，定位为开发者和企业提供更上层的**"智能邮件投递网关"**服务。它并非简单的邮件发送工具，而是通过建立**预置资源池**和**智能调度层**，为用户屏蔽底层供应商的复杂性，提供统一、稳定、高送达率的邮件发送解决方案。

### 🎯 解决的核心痛点

- **供应商限制**: 单一供应商的账号存在发送额度、频率限制
- **多账号管理复杂**: 为规避限制而开设多个账号，管理维护成本高
- **账号"养护"成本**: 新账号需要时间建立信誉度
- **数据孤岛**: 不同账号、供应商间数据割裂，难以形成统一洞察

### 🏆 产品价值

- 🚀 **智能调度**: 根据资源池情况智能选择最佳投递通道
- 📊 **统一数据**: 提供完整的邮件投递数据分析和可视化
- 🔒 **安全可靠**: 企业级安全标准，API驱动的稳定服务
- 🎨 **简单易用**: 极简设计，开发者友好的集成体验

---

## ✨ 核心功能

### 🔐 用户与账户体系
- **邮箱注册/登录**: 安全的用户认证系统
- **免费额度**: 新用户自动获得100封免费邮件额度
- **额度管理**: 实时额度监控和用量提醒
- **套餐升级**: 灵活的套餐购买和升级机制

### 🔑 API密钥管理
- **密钥创建**: 支持自定义名称的API密钥生成
- **完整显示**: 密钥完整可见，一键复制功能
- **使用追踪**: 密钥使用状态和最后使用时间
- **安全管理**: 随时删除不需要的密钥

### 🌐 域名与发信身份管理
- **域名验证**: 支持多域名添加和自动验证
- **DNS配置**: 自动生成完整DNS记录（SPF/DKIM/DMARC/MX/所有权验证）
- **发信邮箱**: 自动化发信邮箱创建和SMTP配置
- **状态监控**: 实时域名和邮箱状态追踪

### 📈 活动管理（混合模式）
- **手动创建**: 后台手动创建营销活动，获取活动ID
- **API自动发现**: API调用时自动创建不存在的活动
- **统一管理**: 手动和自动创建的活动统一展示
- **生命周期**: 完整的活动编辑、删除功能

### 📊 数据分析与报告
- **仪表盘**: 核心指标总览（发送量、送达率、打开率、点击率）
- **转化漏斗**: 直观的邮件转化流程可视化
- **活动报告**: 详细的活动数据分析和对比
- **数据导出**: 支持CSV格式数据导出

### 🚀 核心API服务
- **异步发送**: 高性能的异步邮件发送接口
- **批量发送**: 支持批量邮件发送
- **智能投递**: 自动选择最佳投递通道
- **追踪注入**: 自动注入打开追踪和点击追踪

---

## 🛠 技术架构

### 前端技术栈
- **框架**: Next.js 15 + TypeScript
- **样式**: Tailwind CSS 4 + ShadCN UI
- **组件库**: Radix UI（无障碍性完全支持）
- **状态管理**: SWR + Redux Toolkit
- **图表**: Recharts
- **动画**: Framer Motion
- **图标**: Lucide React
- **通知**: Sonner

### 项目结构
```
edm/
├── README.md                 # 项目说明文档
├── edm-frontend/            # 前端应用
│   ├── src/
│   │   ├── app/            # Next.js App Router
│   │   ├── components/     # 可复用组件
│   │   │   ├── ui/        # 基础UI组件
│   │   │   ├── charts/    # 图表组件
│   │   │   └── layout/    # 布局组件
│   │   ├── lib/           # 工具函数和配置
│   │   ├── hooks/         # 自定义Hooks
│   │   ├── types/         # TypeScript类型定义
│   │   └── data/          # 模拟数据和常量
│   ├── package.json
│   └── ...
├── edm-fm.md               # 产品功能矩阵
├── edm-prd.md              # 产品需求规格说明书
├── edm-ts.md               # 技术架构指南
└── rdm-bp.md               # 核心业务流程
```

---

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装和运行

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd edm
   ```

2. **安装前端依赖**
   ```bash
   cd edm-frontend
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **访问应用**
   打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 演示账户
- **邮箱**: liming@mycompany.com
- **密码**: password123

---

## 📱 功能模块

### 页面结构
```
/                    # 首页（自动重定向到仪表盘）
├── /login          # 登录页面
├── /register       # 注册页面
├── /dashboard      # 仪表盘 - 数据总览
├── /api-keys       # API密钥管理
├── /domains        # 域名管理
├── /campaigns      # 活动报告
├── /settings       # 账户设置
└── /help           # 帮助文档
```

### 核心组件
- **DashboardLayout**: 主要布局容器
- **Sidebar**: 侧边导航栏
- **Header**: 顶部导航栏（用户头像菜单）
- **ProtectedRoute**: 路由保护
- **AuthProvider**: 认证状态管理

---

## 🔌 API设计

### 认证方式
```http
Authorization: Bearer {api_key}
```

### 核心接口

#### 邮件发送
```http
POST /api/v1/send
Content-Type: application/json

{
  "to": ["user@example.com"],
  "subject": "邮件主题",
  "html": "<h1>邮件内容</h1>",
  "from": "service@mycompany.com",
  "campaign_id": "optional_campaign_id"
}
```

#### 批量发送
```http
POST /api/v1/send/batch
Content-Type: application/json

{
  "emails": [
    {
      "to": ["user1@example.com"],
      "subject": "邮件主题1",
      "html": "<h1>邮件内容1</h1>",
      "from": "service@mycompany.com"
    }
  ],
  "campaign_id": "batch_campaign_id"
}
```

#### 数据分析
```http
GET /api/analytics/overview        # 获取总览数据
GET /api/analytics/campaigns       # 获取活动列表
GET /api/analytics/campaigns/{id}  # 获取单个活动详情
```

---

## 🚀 部署指南

### Netlify部署（推荐）

1. **构建项目**
   ```bash
   cd edm-frontend
   npm run build
   ```

2. **使用Netlify CLI部署**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify init
   netlify deploy --prod
   ```

### 手动部署

1. **构建静态文件**
   ```bash
   npm run build
   ```

2. **部署out目录**
   将生成的`out`目录部署到任何静态文件托管服务

详细部署说明请参考：[DEPLOYMENT.md](./edm-frontend/DEPLOYMENT.md)

---

## 💻 开发说明

### Mock数据
- 项目使用完整的Mock数据模拟真实场景
- 所有数据存储在浏览器localStorage中
- 支持完整的CRUD操作演示
- API调用包含真实的延迟模拟

### 开发特性
- 🔥 **热重载**: 支持Turbopack快速开发
- 🎨 **组件库**: 基于ShadCN UI的一致性设计
- 📱 **响应式**: 完全适配桌面和移动设备
- ♿ **无障碍**: 完整的a11y支持
- 🌙 **主题**: 支持明暗主题切换

### 代码规范
- **TypeScript**: 完整的类型安全
- **ESLint**: 代码质量检查
- **组件设计**: 单一职责、可复用、可测试

---

## 📚 相关文档

| 文档 | 描述 | 状态 |
|------|------|------|
| [产品功能矩阵](./edm-fm.md) | 完整的功能点和优先级规划 | ✅ 最新 |
| [产品需求规格](./edm-prd.md) | 详细的产品需求说明书 | ✅ v1.1 |
| [技术架构指南](./edm-ts.md) | 前端技术选型和架构说明 | ✅ 最新 |
| [核心业务流程](./rdm-bp.md) | 关键业务流程说明 | ✅ 最新 |
| [部署指南](./edm-frontend/DEPLOYMENT.md) | Netlify部署详细说明 | ✅ 最新 |

---

## 🎯 版本信息

### v1.1 主要更新（当前版本）
- ✅ **发信邮箱管理**: 完整的发信邮箱生命周期管理
- ✅ **混合活动管理**: 支持手动创建和API自动发现
- ✅ **增强数据可视化**: 转化漏斗图和活动对比图表
- ✅ **DNS记录完整性**: 包含所有权验证、SPF、DKIM、DMARC、MX记录
- ✅ **API发信验证**: 强制使用已验证的发信邮箱地址

### 开发状态
- 🟢 **前端演示**: 完整功能演示版本
- 🟡 **后端API**: 开发中
- 🟡 **生产部署**: 准备中

---

## 📞 技术支持

这是一个基于产品需求文档构建的EDM智能投递网关项目。

### 联系方式
- 📧 **邮箱**: 技术支持邮箱
- 📱 **微信**: 技术支持微信
- 🌐 **官网**: 产品官方网站

---

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

<div align="center">

**🚀 EDM智能投递网关 - 让邮件投递更智能、更简单、更可靠**

Made with ❤️ by EDM Team

</div>