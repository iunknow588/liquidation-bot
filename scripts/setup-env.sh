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
VERSION_MAJOR=$(grep -E "^major=" "$CONFIG_FILE" | cut -d '=' -f2 | tr -d ' ')
VERSION_MINOR=$(grep -E "^minor=" "$CONFIG_FILE" | cut -d '=' -f2 | tr -d ' ')
VERSION_PATCH=$(grep -E "^patch=" "$CONFIG_FILE" | cut -d '=' -f2 | tr -d ' ')
VERSION_PREFIX=$(grep -E "^prefix=" "$CONFIG_FILE" | cut -d '=' -f2 | tr -d ' ')
VERSION_COMMIT_TIME=$(grep -E "^commit_time=" "$CONFIG_FILE" | cut -d '=' -f2 | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//')

echo "📊 当前版本配置:"
echo "  版本号: ${VERSION_PREFIX}${VERSION_MAJOR}.${VERSION_MINOR}.${VERSION_PATCH}"
echo "  提交时间: ${VERSION_COMMIT_TIME}"
echo ""

# 解析 Solana 配置
SOLANA_CLUSTER=$(grep -E "^SOLANA_CLUSTER=" "$CONFIG_FILE" | cut -d '=' -f2 | tr -d ' ')
SOLANA_MAINNET_RPC=$(grep -E "^SOLANA_MAINNET_RPC=" "$CONFIG_FILE" | cut -d '=' -f2 | tr -d ' ')
SOLANA_DEVNET_RPC=$(grep -E "^SOLANA_DEVNET_RPC=" "$CONFIG_FILE" | cut -d '=' -f2 | tr -d ' ')
SOLANA_TESTNET_RPC=$(grep -E "^SOLANA_TESTNET_RPC=" "$CONFIG_FILE" | cut -d '=' -f2 | tr -d ' ')

echo "📡 Solana 配置:"
echo "  集群: ${SOLANA_CLUSTER:-devnet}"
echo "  Mainnet RPC: ${SOLANA_MAINNET_RPC}"
echo "  Devnet RPC: ${SOLANA_DEVNET_RPC}"
echo ""

# Helius API Key
HELIUS_API_KEY="08108945-f5b2-4aa4-8453-58e16774c9ba"

# 设置环境变量
echo "🔧 设置 Vercel 环境变量..."
echo ""

# 版本信息（前端可见）
echo "⚙️  配置版本信息（前端可见）..."
vercel env rm NEXT_PUBLIC_VERSION_MAJOR production -y 2>/dev/null || true
vercel env add NEXT_PUBLIC_VERSION_MAJOR production <<< "$VERSION_MAJOR"

vercel env rm NEXT_PUBLIC_VERSION_MINOR production -y 2>/dev/null || true
vercel env add NEXT_PUBLIC_VERSION_MINOR production <<< "$VERSION_MINOR"

vercel env rm NEXT_PUBLIC_VERSION_PATCH production -y 2>/dev/null || true
vercel env add NEXT_PUBLIC_VERSION_PATCH production <<< "$VERSION_PATCH"

vercel env rm NEXT_PUBLIC_VERSION_PREFIX production -y 2>/dev/null || true
vercel env add NEXT_PUBLIC_VERSION_PREFIX production <<< "$VERSION_PREFIX"

vercel env rm NEXT_PUBLIC_VERSION_COMMIT_TIME production -y 2>/dev/null || true
vercel env add NEXT_PUBLIC_VERSION_COMMIT_TIME production <<< "$VERSION_COMMIT_TIME"

# Solana 配置（前端可见）
echo "⚙️  配置 Solana 设置（前端可见）..."
vercel env rm NEXT_PUBLIC_SOLANA_CLUSTER production -y 2>/dev/null || true
vercel env add NEXT_PUBLIC_SOLANA_CLUSTER production <<< "${SOLANA_CLUSTER:-devnet}"

vercel env rm NEXT_PUBLIC_SOLANA_MAINNET_RPC production -y 2>/dev/null || true
vercel env add NEXT_PUBLIC_SOLANA_MAINNET_RPC production <<< "${SOLANA_MAINNET_RPC:-https://api.mainnet-beta.solana.com}"

vercel env rm NEXT_PUBLIC_SOLANA_DEVNET_RPC production -y 2>/dev/null || true
vercel env add NEXT_PUBLIC_SOLANA_DEVNET_RPC production <<< "${SOLANA_DEVNET_RPC:-https://api.devnet.solana.com}"

vercel env rm NEXT_PUBLIC_SOLANA_TESTNET_RPC production -y 2>/dev/null || true
vercel env add NEXT_PUBLIC_SOLANA_TESTNET_RPC production <<< "${SOLANA_TESTNET_RPC:-https://api.testnet.solana.com}"

# Helius API Key（服务器端，私密）
echo "⚙️  配置 Helius API Key（服务器端）..."
vercel env rm HELIUS_API_KEY production -y 2>/dev/null || true
vercel env add HELIUS_API_KEY production <<< "$HELIUS_API_KEY"

vercel env rm SOLANA_CLUSTER production -y 2>/dev/null || true
vercel env add SOLANA_CLUSTER production <<< "${SOLANA_CLUSTER:-mainnet}"

vercel env rm SOLANA_MAINNET_RPC production -y 2>/dev/null || true
vercel env add SOLANA_MAINNET_RPC production <<< "${SOLANA_MAINNET_RPC:-https://api.mainnet-beta.solana.com}"

vercel env rm SOLANA_DEVNET_RPC production -y 2>/dev/null || true
vercel env add SOLANA_DEVNET_RPC production <<< "${SOLANA_DEVNET_RPC:-https://api.devnet.solana.com}"

vercel env rm SOLANA_TESTNET_RPC production -y 2>/dev/null || true
vercel env add SOLANA_TESTNET_RPC production <<< "${SOLANA_TESTNET_RPC:-https://api.testnet.solana.com}"

echo ""
echo "✅ 环境变量配置完成！"
echo ""
echo "📊 已配置的变量:"
echo ""
echo "前端可见（NEXT_PUBLIC_ 前缀）:"
echo "  • NEXT_PUBLIC_VERSION_MAJOR = $VERSION_MAJOR"
echo "  • NEXT_PUBLIC_VERSION_MINOR = $VERSION_MINOR"
echo "  • NEXT_PUBLIC_VERSION_PATCH = $VERSION_PATCH"
echo "  • NEXT_PUBLIC_VERSION_PREFIX = $VERSION_PREFIX"
echo "  • NEXT_PUBLIC_VERSION_COMMIT_TIME = $VERSION_COMMIT_TIME"
echo "  • NEXT_PUBLIC_SOLANA_CLUSTER = ${SOLANA_CLUSTER:-devnet}"
echo "  • NEXT_PUBLIC_SOLANA_MAINNET_RPC = ${SOLANA_MAINNET_RPC}"
echo "  • NEXT_PUBLIC_SOLANA_DEVNET_RPC = ${SOLANA_DEVNET_RPC}"
echo "  • NEXT_PUBLIC_SOLANA_TESTNET_RPC = ${SOLANA_TESTNET_RPC}"
echo ""
echo "服务器端（无前缀，私密）:"
echo "  • HELIUS_API_KEY = [已设置]"
echo "  • SOLANA_CLUSTER = ${SOLANA_CLUSTER:-mainnet}"
echo "  • SOLANA_MAINNET_RPC = ${SOLANA_MAINNET_RPC}"
echo "  • SOLANA_DEVNET_RPC = ${SOLANA_DEVNET_RPC}"
echo "  • SOLANA_TESTNET_RPC = ${SOLANA_TESTNET_RPC}"
echo ""
echo "📝 下一步:"
echo "  1. 运行部署脚本: ./scripts/deploy.sh"
echo "  2. 或手动部署: vercel --prod"
echo "  3. 访问 https://your-app.vercel.app/ 验证"
echo "  4. 访问 https://your-app.vercel.app/debug 查看环境变量"
echo ""
echo "════════════════════════════════════════════════════════"
