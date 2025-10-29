# 🔧 环境配置指南

## 📋 概述

本指南详细说明如何配置 Solana 清算机器人的环境变量，包括本地开发环境和 Vercel 生产环境的配置。

## 🎯 环境变量分类

### 1. 客户端环境变量 (NEXT_PUBLIC_*)
- **特点**: 前端可见，用户能看到
- **用途**: 版本号显示、公开配置项
- **安全级别**: 低（非敏感信息）

### 2. 服务器端环境变量 (无前缀)
- **特点**: 服务器专用，用户看不到
- **用途**: API 密钥、数据库连接、私密配置
- **安全级别**: 高（敏感信息）

## 🔧 本地开发环境配置

### 1. 创建环境变量文件
```bash
# 复制环境变量模板
cp env.example public.env
```

### 2. 配置内容
```bash
# public.env
# ============================================
# 客户端环境变量 (前端可见)
# ============================================
NEXT_PUBLIC_VERSION_MAJOR=1
NEXT_PUBLIC_VERSION_MINOR=0
NEXT_PUBLIC_VERSION_PATCH=0
NEXT_PUBLIC_VERSION_PREFIX=v
NEXT_PUBLIC_VERSION_COMMIT_TIME=10-28 21:30

# ============================================
# 服务器端环境变量 (私密)
# ============================================
HELIUS_API_KEY=08108945-f5b2-4aa4-8453-58e16774c9ba
SOLANA_CLUSTER=mainnet
SOLANA_MAINNET_RPC=https://api.mainnet-beta.solana.com
SOLANA_DEVNET_RPC=https://api.devnet.solana.com
SOLANA_TESTNET_RPC=https://api.testnet.solana.com
```

### 3. 验证配置
```bash
# 启动开发服务器
npm run dev

# 访问调试页面
# http://localhost:3000/debug
```

## 🚀 Vercel 生产环境配置

### 方法一：Vercel Dashboard 配置（推荐）

#### 步骤 1: 访问 Vercel Dashboard
1. 访问 https://vercel.com/dashboard
2. 登录您的 Vercel 账号
3. 找到项目：`solana-liquidation-dashboard`
4. 点击进入项目

#### 步骤 2: 进入环境变量设置
```
Project → Settings → Environment Variables
```

#### 步骤 3: 添加环境变量

**客户端变量（5个）** - 必须有 `NEXT_PUBLIC_` 前缀：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `NEXT_PUBLIC_VERSION_MAJOR` | `1` | ☑ Production ☑ Preview ☑ Development |
| `NEXT_PUBLIC_VERSION_MINOR` | `0` | ☑ Production ☑ Preview ☑ Development |
| `NEXT_PUBLIC_VERSION_PATCH` | `0` | ☑ Production ☑ Preview ☑ Development |
| `NEXT_PUBLIC_VERSION_PREFIX` | `v` | ☑ Production ☑ Preview ☑ Development |
| `NEXT_PUBLIC_VERSION_COMMIT_TIME` | `10-28 21:30` | ☑ Production ☑ Preview ☑ Development |

**服务器端变量（5个）** - 不能有 `NEXT_PUBLIC_` 前缀：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `HELIUS_API_KEY` | `08108945-f5b2-4aa4-8453-58e16774c9ba` | ☑ Production ☑ Preview ☑ Development |
| `SOLANA_CLUSTER` | `mainnet` | ☑ Production ☑ Preview ☑ Development |
| `SOLANA_MAINNET_RPC` | `https://api.mainnet-beta.solana.com` | ☑ Production ☑ Preview ☑ Development |
| `SOLANA_DEVNET_RPC` | `https://api.devnet.solana.com` | ☑ Production ☑ Preview ☑ Development |
| `SOLANA_TESTNET_RPC` | `https://api.testnet.solana.com` | ☑ Production ☑ Preview ☑ Development |

#### 步骤 4: 触发重新部署
```bash
# 方式 1: Git 推送触发
git commit --allow-empty -m "chore: 触发部署以应用环境变量"
git push origin master

# 方式 2: Vercel CLI
vercel --prod --yes

# 方式 3: Dashboard 手动 Redeploy
```

### 方法二：Vercel CLI 配置

#### 安装 Vercel CLI
```bash
npm install -g vercel
```

#### 登录
```bash
vercel login
```

#### 设置环境变量
```bash
cd /home/lc/luckee_dao/solana-liquidation-dashboard

# 客户端变量
vercel env add NEXT_PUBLIC_VERSION_MAJOR production <<< "1"
vercel env add NEXT_PUBLIC_VERSION_MINOR production <<< "0"
vercel env add NEXT_PUBLIC_VERSION_PATCH production <<< "0"
vercel env add NEXT_PUBLIC_VERSION_PREFIX production <<< "v"
vercel env add NEXT_PUBLIC_VERSION_COMMIT_TIME production <<< "10-28 21:30"

# 服务器端变量
vercel env add HELIUS_API_KEY production <<< "08108945-f5b2-4aa4-8453-58e16774c9ba"
vercel env add SOLANA_CLUSTER production <<< "mainnet"
vercel env add SOLANA_MAINNET_RPC production <<< "https://api.mainnet-beta.solana.com"
vercel env add SOLANA_DEVNET_RPC production <<< "https://api.devnet.solana.com"
vercel env add SOLANA_TESTNET_RPC production <<< "https://api.testnet.solana.com"
```

## 🔍 环境变量验证

### 本地验证
```bash
# 检查环境变量文件
cat public.env

# 启动开发服务器
npm run dev

# 访问调试页面
# http://localhost:3000/debug
```

**预期结果**:
```json
{
  "VERSION_MAJOR": "1",
  "VERSION_MINOR": "0",
  "VERSION_PATCH": "0",
  "VERSION_PREFIX": "v",
  "VERSION_COMMIT_TIME": "10-28 21:30"
}
```

### 生产环境验证
```bash
# 访问调试页面
# https://your-app.vercel.app/debug

# 访问主页
# https://your-app.vercel.app/
```

**预期结果**:
- 标题显示：`🚀 Solana 清算机器人 [ v1.0.0 (10-28 21:30) ]`
- 调试页面显示所有环境变量
- 扫描功能正常工作

## ⚠️ 常见问题

### 问题 1: 版本号显示为 v?.?.?
**原因**: 客户端环境变量未配置或前缀错误

**解决方案**:
1. 确认变量名有 `NEXT_PUBLIC_` 前缀
2. 确认变量已添加到 Production 环境
3. 重新部署
4. 清除浏览器缓存

### 问题 2: 扫描功能无响应
**原因**: 服务器端环境变量未配置

**解决方案**:
1. 确认 `HELIUS_API_KEY` 已添加
2. 确认没有 `NEXT_PUBLIC_` 前缀
3. 检查 API Key 值是否正确
4. 重新部署

### 问题 3: API Key 在浏览器中可见
**原因**: 使用了 `NEXT_PUBLIC_` 前缀

**解决方案**:
1. 删除 `NEXT_PUBLIC_HELIUS_API_KEY`
2. 添加 `HELIUS_API_KEY`（无前缀）
3. 重新部署

### 问题 4: 添加变量后不生效
**原因**: 没有重新部署

**解决方案**:
```
添加环境变量后必须重新部署！
环境变量在构建时读取，不是运行时。
```

## 🔐 安全最佳实践

### 1. 环境变量安全
- ✅ 使用服务器端环境变量存储 API Key
- ✅ 通过 API Routes 代理敏感请求
- ✅ `public.env` 可以安全上传到 Git
- ✅ 定期轮换 API Key

### 2. 绝对不要
- ❌ 不要在前端代码中硬编码 API Key
- ❌ 不要给敏感信息加 `NEXT_PUBLIC_` 前缀
- ❌ 不要提交包含敏感信息的 `.env.local` 到 Git
- ❌ 不要在公开场合分享 API Key

### 3. 项目结构
```
前端 (app/page.tsx)
  ↓ 调用
API Route (app/api/scan/route.ts)
  ↓ 使用服务器端环境变量
  ↓ API Key 不暴露给用户
Solana RPC (Helius)
```

## 📋 配置清单

### 本地开发环境
- [ ] 创建 `public.env` 文件
- [ ] 配置客户端环境变量（5个）
- [ ] 配置服务器端环境变量（5个）
- [ ] 验证本地调试页面
- [ ] 确认 `public.env` 可以安全上传

### Vercel 生产环境
- [ ] 访问 Vercel Dashboard
- [ ] 进入项目设置
- [ ] 添加客户端环境变量（5个）
- [ ] 添加服务器端环境变量（5个）
- [ ] 确认所有变量都勾选了 3 个环境
- [ ] 触发重新部署
- [ ] 等待部署完成
- [ ] 验证生产环境功能

## 🔄 环境变量更新流程

### 更新版本信息
```bash
# 1. 修改本地配置
vim ../solana-liquidation-bot/env/.info
# 更新 commit_time=10-29 15:45

# 2. 同步到前端
cd /home/lc/luckee_dao/solana-liquidation-dashboard
./sync-config.sh

# 3. 更新 Vercel 环境变量
# 访问 Dashboard → Settings → Environment Variables
# 找到 NEXT_PUBLIC_VERSION_COMMIT_TIME
# 点击 Edit → 修改值为 10-29 15:45 → Save

# 4. 重新部署
git commit --allow-empty -m "chore: 更新版本"
git push origin master
```

### 更新 API Key
```bash
# 1. 更新 Rust 后端配置
vim ../solana-liquidation-bot/env/.info
# 修改或添加 API Key

# 2. 重新同步
cd /home/lc/luckee_dao/solana-liquidation-dashboard
./sync-config.sh

# 3. 更新 Vercel 环境变量
# Vercel Dashboard → Settings → Environment Variables
# 更新 HELIUS_API_KEY
# 重新部署
```

## 📚 相关文档

- [Vercel 部署指南](vercel.md)
- [部署概览](overview.md)
- [监控运维](monitoring.md)
- [故障排除](../user-guide/troubleshooting.md)

---

**文档版本**: v2.0.0  
**最后更新**: 2025-01-29  
**审核状态**: ✅ 已审核
