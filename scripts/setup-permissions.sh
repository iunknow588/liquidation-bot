#!/bin/bash
# 设置脚本执行权限

echo "════════════════════════════════════════════════════════"
echo "🔧 设置脚本执行权限"
echo "════════════════════════════════════════════════════════"
echo ""

# 设置所有脚本的执行权限
chmod +x /home/lc/luckee_dao/solana-liquidation-dashboard/scripts/*.sh

echo "✅ 所有脚本权限已设置"
echo ""

# 验证权限
echo "📋 脚本权限状态:"
ls -la /home/lc/luckee_dao/solana-liquidation-dashboard/scripts/*.sh | while read line; do
    echo "  $line"
done

echo ""
echo "🎉 权限设置完成！"
echo ""
echo "现在可以运行脚本了："
echo "  ./scripts/sync-config.sh"
echo "  ./scripts/verify-security.sh"
echo "  ./scripts/setup-env.sh"
echo "  ./scripts/upload-github.sh"
echo "  ./scripts/deploy.sh"
echo "  ./scripts/full-deploy.sh"
echo ""
echo "════════════════════════════════════════════════════════"
