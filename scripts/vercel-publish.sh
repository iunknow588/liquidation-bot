#!/bin/bash
# 强制部署到 Vercel

echo "════════════════════════════════════════════════════════"
echo "🚀 强制部署到 Vercel"
echo "════════════════════════════════════════════════════════"
echo ""

# 检查是否登录
echo "🔐 检查 Vercel 登录状态..."
if ! vercel whoami &> /dev/null; then
    echo "❌ 未登录 Vercel"
    echo "请运行: vercel login"
    exit 1
fi

echo "✅ 已登录: $(vercel whoami)"
echo ""

# 切换到项目目录
cd "$(dirname "$0")/.."
echo "📂 当前目录: $(pwd)"
echo ""

# 确保依赖已安装
echo "📦 检查依赖..."
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules 不存在，安装依赖中..."
    npm install
fi
echo "✅ 依赖已就绪"
echo ""

# 生成环境变量
echo "⚙️  同步配置..."
if [ -f "sync-config.sh" ]; then
    ./sync-config.sh
else
    echo "⚠️  sync-config.sh 不存在，跳过配置同步"
fi
echo ""

# 构建测试
echo "🏗️  测试构建..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 构建失败，请检查错误"
    exit 1
fi
echo "✅ 构建成功"
echo ""

# 清理旧部署缓存（强制）
echo "🧹 清理 Vercel 缓存..."
rm -rf .vercel
echo "✅ 缓存已清理"
echo ""

# 强制部署到生产环境
echo "🚀 开始强制部署到生产环境..."
echo "────────────────────────────────────────────"
echo ""

# 使用 --force 强制重新部署
# --yes 跳过所有确认
# --prod 部署到生产环境
vercel --prod --yes --force

echo ""
echo "════════════════════════════════════════════════════════"
echo "✅ 部署完成！"
echo "════════════════════════════════════════════════════════"
echo ""
echo "📊 部署信息:"
echo "  🌍 环境: Production"
echo "  🌐 URL: https://sbot.cdao.online/"
echo "  ⚡ 模式: 前端直连 RPC"
echo ""
echo "🔍 验证清单:"
echo "  1. 访问 https://sbot.cdao.online/"
echo "  2. 检查标题是否显示版本号"
echo "  3. 点击\"开始扫描\"测试功能"
echo "  4. 按 Ctrl+Shift+R 强制刷新浏览器"
echo ""
echo "💡 提示:"
echo "  • 部署后可能需要 1-2 分钟生效"
echo "  • 如果还是看到旧版本，清除浏览器缓存"
echo "  • CDN 可能需要时间同步"
echo ""
echo "════════════════════════════════════════════════════════"

