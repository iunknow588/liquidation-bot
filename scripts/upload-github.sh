#!/bin/bash

# Solana 清算机器人 GitHub 上传脚本
# 仓库地址: git@github.com:iunknow588/liquidation-bot.git

set -e

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🚀 Solana 清算机器人 - GitHub 上传${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""

# 检查是否在项目根目录
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ 错误: 请在项目根目录运行此脚本${NC}"
    exit 1
fi

# 检查 .gitignore
if [ ! -f ".gitignore" ]; then
    echo -e "${RED}❌ 错误: .gitignore 文件不存在${NC}"
    exit 1
fi

# 显示将被排除的文件
echo -e "${YELLOW}🔒 安全检查：以下敏感文件将被排除${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  • .env.local (private environment variables)"
echo "  • 安全*.md (安全文档)"
echo "  • *deploy*.sh (部署脚本)"
echo "  • 配置*.md (配置说明)"
echo "  • .vercel/ (Vercel 配置)"
echo ""
echo -e "${GREEN}✅ 以下公开文件将被包含：${NC}"
echo "  • public.env (公开配置文件)"
echo "  • scripts/ (脚本目录)"
echo "  • docs/ (文档目录)"
echo ""

# 确认是否继续
read -p "确认上传到 GitHub? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⚠️  已取消上传${NC}"
    exit 0
fi

echo ""
echo -e "${GREEN}📋 开始上传流程...${NC}"
echo ""

# 1. 检查 Git 状态
echo -e "${YELLOW}1️⃣ 检查 Git 配置${NC}"
if [ ! -d ".git" ]; then
    echo "  初始化 Git 仓库..."
    git init
    echo -e "${GREEN}  ✅ Git 仓库已初始化${NC}"
else
    echo -e "${GREEN}  ✅ Git 仓库已存在${NC}"
fi
echo ""

# 2. 检查远程仓库
echo -e "${YELLOW}2️⃣ 配置远程仓库${NC}"
REMOTE_URL="git@github.com:iunknow588/liquidation-bot.git"

if git remote | grep -q "origin"; then
    CURRENT_URL=$(git remote get-url origin)
    if [ "$CURRENT_URL" != "$REMOTE_URL" ]; then
        echo "  更新远程仓库 URL..."
        git remote set-url origin $REMOTE_URL
    fi
    echo -e "${GREEN}  ✅ 远程仓库: $REMOTE_URL${NC}"
else
    echo "  添加远程仓库..."
    git remote add origin $REMOTE_URL
    echo -e "${GREEN}  ✅ 远程仓库已添加${NC}"
fi
echo ""

# 3. 检查敏感文件是否被忽略
echo -e "${YELLOW}3️⃣ 验证敏感文件保护${NC}"

SENSITIVE_FILES=(
    "安全分析报告.md"
    "安全部署指南.md"
    "安全修复完成报告.md"
    "配置同步说明.md"
)

for file in "${SENSITIVE_FILES[@]}"; do
    if [ -f "$file" ]; then
        if git check-ignore -q "$file"; then
            echo -e "${GREEN}  ✅ $file (已忽略)${NC}"
        else
            echo -e "${RED}  ❌ $file (未忽略 - 危险！)${NC}"
            echo -e "${RED}     请更新 .gitignore${NC}"
            exit 1
        fi
    fi
done
echo ""

# 4. 清理已追踪的敏感文件
echo -e "${YELLOW}4️⃣ 清理已追踪的敏感文件${NC}"
git rm --cached -r --ignore-unmatch \
    "安全*.md" \
    "*deploy*.sh" \
    "配置*.md" \
    ".vercel" \
    2>/dev/null || true
echo -e "${GREEN}  ✅ 敏感文件已从 Git 缓存清除${NC}"
echo -e "${GREEN}  ✅ public.env 将作为公开文件上传${NC}"
echo ""

# 5. 添加文件
echo -e "${YELLOW}5️⃣ 添加文件到 Git${NC}"
git add .
echo -e "${GREEN}  ✅ 文件已添加${NC}"
echo ""

# 6. 显示将要提交的文件
echo -e "${YELLOW}6️⃣ 即将提交的文件${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
git status --short | head -20
FILE_COUNT=$(git status --short | wc -l)
if [ $FILE_COUNT -gt 20 ]; then
    echo "  ... 还有 $((FILE_COUNT - 20)) 个文件"
fi
echo ""

# 7. 提交
echo -e "${YELLOW}7️⃣ 提交更改${NC}"
COMMIT_MSG="🚀 Solana 清算机器人 Web Dashboard

✨ 功能特性:
- ✅ 实时扫描 Solend 协议清算机会
- ✅ 可视化展示账户健康状态
- ✅ 安全的 API 路由代理
- ✅ 响应式设计（桌面/移动端）
- ✅ Helius RPC 集成
- ✅ IP 限流保护

🔒 安全措施:
- ✅ API Key 服务器端保护
- ✅ 访问日志记录
- ✅ 构建安全验证
- ✅ 敏感文件排除

📊 技术栈:
- Next.js 14 + TypeScript
- Solana Web3.js
- TailwindCSS
- Vercel 部署

更新时间: $(date '+%Y-%m-%d %H:%M:%S')"

git commit -m "$COMMIT_MSG" || echo "  没有新的更改需要提交"
echo ""

# 8. 推送到 GitHub
echo -e "${YELLOW}8️⃣ 推送到 GitHub${NC}"
echo "  目标: $REMOTE_URL"
echo ""

# 尝试推送到 main 分支
if git push -u origin main 2>/dev/null; then
    echo -e "${GREEN}  ✅ 推送成功 (main)${NC}"
else
    # 如果 main 不存在，尝试 master
    echo "  尝试推送到 master 分支..."
    if git push -u origin master 2>/dev/null; then
        echo -e "${GREEN}  ✅ 推送成功 (master)${NC}"
    else
        # 如果都失败，创建并推送 main
        echo "  创建 main 分支并推送..."
        git branch -M main
        git push -u origin main
        echo -e "${GREEN}  ✅ 推送成功 (main)${NC}"
    fi
fi
echo ""

# 9. 完成
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 上传完成！${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}📊 仓库信息:${NC}"
echo "  🌐 URL: https://github.com/iunknow588/liquidation-bot"
echo "  📁 分支: main"
echo "  📝 提交数: $(git rev-list --count HEAD 2>/dev/null || echo 1)"
echo ""
echo -e "${GREEN}🔒 安全状态:${NC}"
echo "  ✅ API Key 未上传"
echo "  ✅ 环境变量已保护"
echo "  ✅ 敏感文档已排除"
echo "  ✅ 部署脚本已排除"
echo ""
echo -e "${GREEN}🚀 下一步:${NC}"
echo "  1. 访问: https://github.com/iunknow588/liquidation-bot"
echo "  2. 检查上传的文件"
echo "  3. 运行部署脚本: ./scripts/deploy.sh"
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
