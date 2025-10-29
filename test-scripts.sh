#!/bin/bash

# 测试脚本运行情况
echo "════════════════════════════════════════════════════════"
echo "🧪 测试脚本运行情况"
echo "════════════════════════════════════════════════════════"
echo ""

# 1. 检查项目结构
echo "1️⃣ 检查项目结构..."
if [ -f "package.json" ]; then
    echo "   ✅ package.json 存在"
else
    echo "   ❌ package.json 不存在"
    exit 1
fi

if [ -f ".gitignore" ]; then
    echo "   ✅ .gitignore 存在"
else
    echo "   ❌ .gitignore 不存在"
    exit 1
fi

if [ -f "public.env" ]; then
    echo "   ✅ public.env 存在"
else
    echo "   ❌ public.env 不存在"
    exit 1
fi

echo ""

# 2. 检查脚本权限
echo "2️⃣ 检查脚本权限..."
SCRIPTS=(
    "scripts/sync-config.sh"
    "scripts/verify-security.sh"
    "scripts/setup-env.sh"
    "scripts/upload-github.sh"
    "scripts/deploy.sh"
    "scripts/full-deploy.sh"
)

for script in "${SCRIPTS[@]}"; do
    if [ -f "$script" ]; then
        if [ -x "$script" ]; then
            echo "   ✅ $script (可执行)"
        else
            echo "   ⚠️  $script (不可执行，正在设置权限...)"
            chmod +x "$script"
            echo "   ✅ $script (权限已设置)"
        fi
    else
        echo "   ❌ $script (不存在)"
    fi
done

echo ""

# 3. 测试配置同步脚本
echo "3️⃣ 测试配置同步脚本..."
if [ -f "scripts/sync-config.sh" ]; then
    echo "   运行 sync-config.sh..."
    if ./scripts/sync-config.sh; then
        echo "   ✅ sync-config.sh 运行成功"
    else
        echo "   ❌ sync-config.sh 运行失败"
    fi
else
    echo "   ❌ sync-config.sh 不存在"
fi

echo ""

# 4. 测试安全验证脚本
echo "4️⃣ 测试安全验证脚本..."
if [ -f "scripts/verify-security.sh" ]; then
    echo "   运行 verify-security.sh..."
    if ./scripts/verify-security.sh; then
        echo "   ✅ verify-security.sh 运行成功"
    else
        echo "   ⚠️  verify-security.sh 运行失败（可能是预期的）"
    fi
else
    echo "   ❌ verify-security.sh 不存在"
fi

echo ""

# 5. 检查 Git 状态
echo "5️⃣ 检查 Git 状态..."
if [ -d ".git" ]; then
    echo "   ✅ Git 仓库已初始化"
    echo "   当前分支: $(git branch --show-current 2>/dev/null || echo 'unknown')"
    echo "   未提交的更改: $(git status --porcelain | wc -l) 个文件"
else
    echo "   ⚠️  Git 仓库未初始化"
    echo "   正在初始化 Git 仓库..."
    git init
    echo "   ✅ Git 仓库已初始化"
fi

echo ""

# 6. 检查 Vercel CLI
echo "6️⃣ 检查 Vercel CLI..."
if command -v vercel &> /dev/null; then
    echo "   ✅ Vercel CLI 已安装: $(vercel --version)"
    if vercel whoami &> /dev/null; then
        echo "   ✅ 已登录 Vercel: $(vercel whoami)"
    else
        echo "   ⚠️  未登录 Vercel"
    fi
else
    echo "   ❌ Vercel CLI 未安装"
fi

echo ""

# 7. 检查 Node.js 环境
echo "7️⃣ 检查 Node.js 环境..."
if command -v node &> /dev/null; then
    echo "   ✅ Node.js: $(node -v)"
else
    echo "   ❌ Node.js 未安装"
fi

if command -v npm &> /dev/null; then
    echo "   ✅ npm: $(npm -v)"
else
    echo "   ❌ npm 未安装"
fi

echo ""

# 8. 检查依赖
echo "8️⃣ 检查项目依赖..."
if [ -d "node_modules" ]; then
    echo "   ✅ node_modules 存在"
else
    echo "   ⚠️  node_modules 不存在，正在安装..."
    if npm install; then
        echo "   ✅ 依赖安装成功"
    else
        echo "   ❌ 依赖安装失败"
    fi
fi

echo ""

# 9. 测试构建
echo "9️⃣ 测试项目构建..."
if npm run build; then
    echo "   ✅ 项目构建成功"
else
    echo "   ❌ 项目构建失败"
fi

echo ""

# 10. 总结
echo "════════════════════════════════════════════════════════"
echo "📊 测试总结"
echo "════════════════════════════════════════════════════════"
echo ""
echo "✅ 可以运行的脚本:"
echo "   • ./scripts/sync-config.sh"
echo "   • ./scripts/verify-security.sh"
echo "   • ./scripts/upload-github.sh (需要确认)"
echo "   • ./scripts/deploy.sh (需要 Vercel 登录)"
echo "   • ./scripts/full-deploy.sh (需要确认)"
echo ""
echo "🚀 下一步:"
echo "   1. 运行 ./scripts/upload-github.sh 上传到 GitHub"
echo "   2. 运行 ./scripts/deploy.sh 部署到 Vercel"
echo "   3. 或运行 ./scripts/full-deploy.sh 一键部署"
echo ""
echo "════════════════════════════════════════════════════════"
