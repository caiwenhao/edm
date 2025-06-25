#!/bin/bash

# EDM Frontend - Netlify 部署脚本

echo "🚀 开始部署 EDM Frontend 到 Netlify..."

# 检查是否安装了 Netlify CLI
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI 未安装"
    echo "请运行: npm install -g netlify-cli"
    exit 1
fi

# 检查是否已登录 Netlify
if ! netlify status &> /dev/null; then
    echo "❌ 未登录 Netlify"
    echo "请运行: netlify login"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建项目
echo "🔨 构建项目..."
npm run build

# 检查构建是否成功
if [ ! -d "out" ]; then
    echo "❌ 构建失败，未找到 out 目录"
    exit 1
fi

echo "✅ 构建成功！"

# 部署到 Netlify
echo "🌐 部署到 Netlify..."
netlify deploy --prod --dir=out

echo "🎉 部署完成！"
echo "📝 请查看 Netlify 控制台获取部署 URL"
