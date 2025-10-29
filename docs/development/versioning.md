# 📋 版本管理指南

## 📋 概述

本指南详细说明 Solana 清算机器人的版本管理策略，包括版本号规则、更新流程和自动化脚本。

## 🎯 版本信息配置

版本信息存储在后端配置文件中，并同步到前端显示。

## 📍 配置文件位置

**后端配置文件**:
```
/home/lc/luckee_dao/solana-liquidation-bot/env/.info
```

## 📝 版本配置格式

```ini
# ============================================
# Version Configuration
# ============================================
[version]
major=1
minor=0
patch=0
prefix=v
commit_time=10-28 21:30
# Format: prefix + major.minor.patch + commit_time
# Example: v1.0.0 (10-28 21:30)
```

### 字段说明

| 字段 | 说明 | 示例 |
|------|------|------|
| `major` | 主版本号（重大更新） | `1` |
| `minor` | 次版本号（功能更新） | `0` |
| `patch` | 补丁版本号（Bug修复） | `0` |
| `prefix` | 版本前缀 | `v` |
| `commit_time` | 提交时间（月-日 时:分） | `10-28 21:30` |

### 完整版本号组成

```
prefix + major.minor.patch (commit_time)
```

**显示格式**: `v1.0.0 (10-28 21:30)`

**示例**:
- `v1.0.0 (10-28 21:30)` - 初始版本，10月28日21:30提交
- `v1.1.0 (10-29 14:15)` - 添加新功能，10月29日14:15提交
- `v1.1.1 (10-29 16:45)` - Bug 修复，10月29日16:45提交
- `v2.0.0 (11-01 09:00)` - 重大更新，11月1日9:00提交

**优势**: 通过提交时间可以准确区分不同版本，避免混淆

## 🔄 版本更新流程

### 步骤 1: 修改配置文件

编辑 `/home/lc/luckee_dao/solana-liquidation-bot/env/.info`:

```ini
[version]
major=1
minor=1
patch=0
prefix=v
# Last updated: 10-29 15:45  ← 更新时间
```

### 步骤 2: 同步到前端

```bash
cd /home/lc/luckee_dao/solana-liquidation-dashboard
./sync-config.sh
```

### 步骤 3: 重新构建部署

```bash
npm run build
vercel --prod --yes
```

## 🎨 前端显示效果

### 页面标题

```
🚀 Solana 清算机器人  [ v1.0.0 ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
实时扫描 Solend 协议的清算机会

🌐 集群: DEVNET
📡 RPC: Helius ✓
🔒 安全模式
🕐 更新: 10-28 21:30
```

### 显示位置

- **版本号**: 标题右侧，彩色徽章
- **更新时间**: 状态栏最右侧

## 📊 版本号规则

### 语义化版本 (Semantic Versioning)

```
major.minor.patch
```

### 何时更新

1. **Major (主版本号)**
   - 不兼容的重大更改
   - 架构重构
   - 示例: `1.0.0` → `2.0.0`

2. **Minor (次版本号)**
   - 向后兼容的功能添加
   - 协议支持扩展
   - 示例: `1.0.0` → `1.1.0`

3. **Patch (补丁版本号)**
   - 向后兼容的 Bug 修复
   - 性能优化
   - 示例: `1.0.0` → `1.0.1`

## 🕐 时间格式

### 格式说明

```
月-日 时:分
```

### 示例

- `10-28 21:30` - 10月28日 21点30分
- `11-01 09:15` - 11月1日 9点15分
- `12-25 18:00` - 12月25日 18点

### 注意事项

- ✅ 不包括年份（简洁）
- ✅ 使用 24 小时制
- ✅ 月份不补零（10，不是 010）
- ✅ 日期不补零（1，不是 01）
- ✅ 时间补零（09:15，不是 9:15）

## 🔧 自动化脚本

### 更新版本脚本

创建 `update-version.sh`:

```bash
#!/bin/bash
# 快速更新版本号

INFO_FILE="../solana-liquidation-bot/env/.info"

echo "当前版本信息:"
grep -A 5 "\[version\]" "$INFO_FILE"
echo ""

read -p "新的 major: " MAJOR
read -p "新的 minor: " MINOR
read -p "新的 patch: " PATCH

# 获取当前时间（月-日 时:分）
UPDATED=$(date "+%-m-%-d %H:%M")

echo ""
echo "将更新为: v${MAJOR}.${MINOR}.${PATCH} (${UPDATED})"
read -p "确认? (y/n): " CONFIRM

if [ "$CONFIRM" = "y" ]; then
    sed -i "s/^major=.*/major=${MAJOR}/" "$INFO_FILE"
    sed -i "s/^minor=.*/minor=${MINOR}/" "$INFO_FILE"
    sed -i "s/^patch=.*/patch=${PATCH}/" "$INFO_FILE"
    sed -i "s/^# Last updated:.*/# Last updated: ${UPDATED}/" "$INFO_FILE"
    
    echo "✅ 版本已更新！"
    echo ""
    echo "下一步:"
    echo "1. cd /home/lc/luckee_dao/solana-liquidation-dashboard"
    echo "2. ./sync-config.sh"
    echo "3. npm run build && vercel --prod --yes"
else
    echo "❌ 取消更新"
fi
```

### 使用方法

```bash
chmod +x update-version.sh
./update-version.sh
```

## 📚 示例场景

### 场景 1: 修复 Bug

```ini
# 修改前
major=1
minor=0
patch=0
# Last updated: 10-28 21:30

# 修改后
major=1
minor=0
patch=1
# Last updated: 10-29 09:15
```

**显示**: `v1.0.1` (10-29 09:15)

### 场景 2: 添加新功能

```ini
# 修改前
major=1
minor=0
patch=1
# Last updated: 10-29 09:15

# 修改后
major=1
minor=1
patch=0
# Last updated: 10-30 14:30
```

**显示**: `v1.1.0` (10-30 14:30)

### 场景 3: 重大更新

```ini
# 修改前
major=1
minor=5
patch=3
# Last updated: 11-15 10:00

# 修改后
major=2
minor=0
patch=0
# Last updated: 11-20 16:45
```

**显示**: `v2.0.0` (11-20 16:45)

## 🎯 最佳实践

### 1. 每次部署前更新

```bash
# 在部署前
1. 更新版本号
2. 运行 sync-config.sh
3. 提交到 Git
4. 部署到 Vercel
```

### 2. 版本号与 Git Tag 对应

```bash
git tag v1.0.0
git push origin v1.0.0
```

### 3. 记录变更日志

在提交信息中说明版本更新内容：

```bash
git commit -m "🔖 v1.1.0: 添加 RPC 连接验证功能

- 新增 getSlot() 连接测试
- 显示当前区块高度
- 优化错误处理
"
```

## 🔍 验证版本显示

### 本地验证

```bash
cd /home/lc/luckee_dao/solana-liquidation-dashboard
npm run dev
# 访问 http://localhost:3000
# 查看标题处的版本号
```

### 生产环境验证

```bash
# 访问 https://your-app.vercel.app/
# 查看标题: 🚀 Solana 清算机器人 [ v1.0.0 ]
```

## 📝 版本历史示例

```
v1.0.0 (10-28 21:30) - 初始发布
  ✅ 基础框架
  ✅ Solend 协议支持
  ✅ 前端 Dashboard

v1.0.1 (10-28 22:15) - Bug 修复
  🐛 修复 RPC 连接问题
  🐛 优化账户查询

v1.1.0 (10-29 10:00) - 功能更新
  ✨ 添加版本显示
  ✨ 优化 UI 布局
  ✨ 增强错误提示

v2.0.0 (11-01 15:00) - 重大更新
  🚀 支持多协议
  🚀 Flash Loan 集成
  🚀 自动清算执行
```

## 🎉 总结

✅ 版本信息集中管理  
✅ 自动同步到前端  
✅ 清晰的显示效果  
✅ 语义化版本规则  
✅ 包含更新时间  
✅ 易于维护和追踪  

---

**文档版本**: v2.0.0  
**最后更新**: 2025-01-29  
**审核状态**: ✅ 已审核
