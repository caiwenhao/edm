#!/bin/bash

# EDM Frontend - 构建验证脚本

echo "🔍 验证 EDM Frontend 构建..."

# 检查 Node.js 版本
echo "📋 检查 Node.js 版本..."
node_version=$(node -v)
echo "Node.js 版本: $node_version"

# 检查 npm 版本
npm_version=$(npm -v)
echo "npm 版本: $npm_version"

# 清理之前的构建
echo "🧹 清理之前的构建..."
rm -rf .next out

# 安装依赖
echo "📦 安装依赖..."
npm install

# 运行 lint 检查
echo "🔍 运行代码检查..."
npm run lint

# 构建项目
echo "🔨 构建项目..."
npm run build

# 验证构建结果
echo "✅ 验证构建结果..."

if [ ! -d "out" ]; then
    echo "❌ 构建失败：未找到 out 目录"
    exit 1
fi

if [ ! -f "out/index.html" ]; then
    echo "❌ 构建失败：未找到 index.html"
    exit 1
fi

# 检查关键文件
echo "📁 检查关键文件..."
key_files=(
    "out/index.html"
    "out/dashboard/index.html"
    "out/login/index.html"
    "out/api-keys/index.html"
    "out/domains/index.html"
    "out/campaigns/index.html"
    "out/_next/static"
)

for file in "${key_files[@]}"; do
    if [ -e "out/$file" ] || [ -e "$file" ]; then
        echo "✅ $file 存在"
    else
        echo "⚠️  $file 不存在"
    fi
done

# 计算构建大小
echo "📊 构建统计..."
out_size=$(du -sh out 2>/dev/null | cut -f1)
echo "构建大小: $out_size"

file_count=$(find out -type f | wc -l)
echo "文件数量: $file_count"

echo ""
echo "🎉 构建验证完成！"
echo "📁 静态文件已生成在 out/ 目录"
echo "🌐 可以部署到任何静态托管服务"
echo ""
echo "部署命令："
echo "  Netlify: netlify deploy --prod --dir=out"
echo "  Vercel:  vercel --prod out"
echo "  GitHub Pages: 将 out/ 目录内容推送到 gh-pages 分支"
