#!/bin/bash

echo "🧪 快速测试脚本功能"
echo "===================="

# 1. 检查基本文件
echo "1. 检查基本文件..."
[ -f "package.json" ] && echo "   ✅ package.json" || echo "   ❌ package.json"
[ -f "public.env" ] && echo "   ✅ public.env" || echo "   ❌ public.env"
[ -f ".gitignore" ] && echo "   ✅ .gitignore" || echo "   ❌ .gitignore"

# 2. 检查脚本文件
echo "2. 检查脚本文件..."
[ -f "scripts/sync-config.sh" ] && echo "   ✅ sync-config.sh" || echo "   ❌ sync-config.sh"
[ -f "scripts/verify-security.sh" ] && echo "   ✅ verify-security.sh" || echo "   ❌ verify-security.sh"
[ -f "scripts/upload-github.sh" ] && echo "   ✅ upload-github.sh" || echo "   ❌ upload-github.sh"
[ -f "scripts/deploy.sh" ] && echo "   ✅ deploy.sh" || echo "   ❌ deploy.sh"

# 3. 检查 public.env 内容
echo "3. 检查 public.env 内容..."
if [ -f "public.env" ]; then
    echo "   文件内容:"
    head -5 public.env | sed 's/^/     /'
    echo "   ..."
    echo "   总行数: $(wc -l < public.env)"
else
    echo "   ❌ public.env 不存在"
fi

# 4. 检查 Git 状态
echo "4. 检查 Git 状态..."
if [ -d ".git" ]; then
    echo "   ✅ Git 已初始化"
    echo "   分支: $(git branch --show-current 2>/dev/null || echo 'unknown')"
else
    echo "   ⚠️  Git 未初始化"
fi

# 5. 检查环境
echo "5. 检查环境..."
command -v node >/dev/null && echo "   ✅ Node.js: $(node -v)" || echo "   ❌ Node.js"
command -v npm >/dev/null && echo "   ✅ npm: $(npm -v)" || echo "   ❌ npm"
command -v vercel >/dev/null && echo "   ✅ Vercel CLI: $(vercel --version)" || echo "   ❌ Vercel CLI"

echo ""
echo "🎯 测试完成！"
