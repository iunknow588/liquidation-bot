#!/bin/bash
# 配置 Vercel 环境变量

echo "════════════════════════════════════════════════════════"
echo "🔧 Vercel 环境变量配置"
echo "════════════════════════════════════════════════════════"
echo ""

# 检查 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI 未安装"
    echo "请运行: npm i -g vercel"
    exit 1
fi

# 检查是否已登录
if ! vercel whoami &> /dev/null; then
    echo "❌ 未登录 Vercel"
    echo "请运行: vercel login"
    exit 1
fi

echo "✅ Vercel CLI: $(vercel --version)"
echo "✅ 已登录: $(vercel whoami)"
echo ""

# 读取配置
CONFIG_FILE="../solana-liquidation-bot/env/.info"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ 配置文件不存在: $CONFIG_FILE"
    exit 1
fi

# 解析版本信息
VERSION_MAJOR=$(grep -E "^major=" "$CONFIG_FILE" | cut -d '=' -f2)
VERSION_MINOR=$(grep -E "^minor=" "$CONFIG_FILE" | cut -d '=' -f2)
VERSION_PATCH=$(grep -E "^patch=" "$CONFIG_FILE" | cut -d '=' -f2)
VERSION_PREFIX=$(grep -E "^prefix=" "$CONFIG_FILE" | cut -d '=' -f2)
VERSION_COMMIT_TIME=$(grep -E "^commit_time=" "$CONFIG_FILE" | cut -d '=' -f2)

echo "📊 当前版本配置:"
echo "  版本号: ${VERSION_PREFIX}${VERSION_MAJOR}.${VERSION_MINOR}.${VERSION_PATCH}"
echo "  提交时间: ${VERSION_COMMIT_TIME}"
echo ""

# 解析 Solana 配置
source "$CONFIG_FILE"

echo "📡 Solana 配置:"
echo "  集群: ${SOLANA_CLUSTER:-mainnet}"
echo ""

# 设置环境变量
echo "🔧 设置 Vercel 环境变量..."
echo ""

# 版本信息（公开，前端可用）
echo "设置版本信息..."
vercel env add NEXT_PUBLIC_VERSION_MAJOR production <<< "$VERSION_MAJOR"
vercel env add NEXT_PUBLIC_VERSION_MINOR production <<< "$VERSION_MINOR"
vercel env add NEXT_PUBLIC_VERSION_PATCH production <<< "$VERSION_PATCH"
vercel env add NEXT_PUBLIC_VERSION_PREFIX production <<< "$VERSION_PREFIX"
vercel env add NEXT_PUBLIC_VERSION_COMMIT_TIME production <<< "$VERSION_COMMIT_TIME"

# Solana 配置（服务器端）
echo "设置 Solana 配置..."
vercel env add SOLANA_CLUSTER production <<< "${SOLANA_CLUSTER:-mainnet}"
vercel env add SOLANA_MAINNET_RPC production <<< "$SOLANA_MAINNET_RPC"
vercel env add SOLANA_DEVNET_RPC production <<< "$SOLANA_DEVNET_RPC"
vercel env add SOLANA_TESTNET_RPC production <<< "$SOLANA_TESTNET_RPC"

# API Key（服务器端，私密）
HELIUS_API_KEY="08108945-f5b2-4aa4-8453-58e16774c9ba"
echo "设置 API Key..."
vercel env add HELIUS_API_KEY production <<< "$HELIUS_API_KEY"

echo ""
echo "✅ 环境变量配置完成！"
echo ""
echo "📝 下一步:"
echo "  1. 运行 vercel --prod 重新部署"
echo "  2. 访问 https://sbot.cdao.online/ 验证"
echo "  3. 访问 https://sbot.cdao.online/debug 查看环境变量"
echo ""
echo "════════════════════════════════════════════════════════"

