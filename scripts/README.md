# Script Usage Guide

## Overview

This directory contains all automation scripts for the Solana Liquidation Bot project, organized by functional domain to ensure only one effective script per domain.

## Script List

| Script Name | Domain | Description | Use Case |
|-------------|--------|-------------|----------|
| `sync-config.sh` | Configuration | Sync backend config to frontend | Development setup |
| `verify-security.sh` | Security | Verify project security | Pre-deployment check |
| `setup-env.sh` | Environment | Configure Vercel environment variables | Production setup |
| `upload-github.sh` | Code Management | Upload code to GitHub | Version control |
| `deploy.sh` | Deployment | Deploy to Vercel | Application deployment |
| `full-deploy.sh` | Complete Flow | Complete deployment process | One-click deployment |

## 🔧 脚本详细说明

### 1. 配置管理类

#### `sync-config.sh` - 配置同步脚本

**功能**: 同步 Rust 后端的配置到 Next.js 前端

**使用方法**:
```bash
cd /home/lc/luckee_dao/solana-liquidation-dashboard
./scripts/sync-config.sh
```

**作用**:
- 读取 `../solana-liquidation-bot/env/.info` 配置文件
- 生成 `public.env` 公开配置文件
- 同步版本信息和 RPC 配置

**输出**:
- 创建 `public.env` 文件
- 显示当前配置信息
- 提供下一步操作建议

### 2. 安全验证类

#### `verify-security.sh` - 安全验证脚本

**功能**: 验证项目安全性，确保可以安全部署

**使用方法**:
```bash
cd /home/lc/luckee_dao/solana-liquidation-dashboard
./scripts/verify-security.sh
```

**检查项目**:
- ✅ `public.env` 文件存在
- ✅ 没有 `NEXT_PUBLIC_` 敏感变量
- ✅ API Key 已配置（服务器端）
- ✅ `.gitignore` 包含敏感文件
- ✅ API Route 存在
- ✅ 前端不直接使用 Solana Connection
- ✅ 构建文件中无 API Key 泄露

**输出**:
- 通过/失败状态
- 详细检查结果
- 修复建议

### 3. 环境配置类

#### `setup-env.sh` - 环境变量配置脚本

**功能**: 配置 Vercel 环境变量

**使用方法**:
```bash
cd /home/lc/luckee_dao/solana-liquidation-dashboard
./scripts/setup-env.sh
```

**配置内容**:
- 版本信息（前端可见）
- Solana 配置（前端可见）
- API Key（服务器端，私密）

**前置条件**:
- 已安装 Vercel CLI
- 已登录 Vercel 账号

### 4. 代码管理类

#### `upload-github.sh` - GitHub 上传脚本

**功能**: 上传代码到 GitHub 仓库

**使用方法**:
```bash
cd /home/lc/luckee_dao/solana-liquidation-dashboard
./scripts/upload-github.sh
```

**安全特性**:
- 自动排除敏感文件
- 验证 `.gitignore` 配置
- 清理已追踪的敏感文件
- 检查 API Key 保护

**输出**:
- 仓库信息
- 安全状态
- 下一步操作建议

### 5. 部署管理类

#### `deploy.sh` - Vercel 部署脚本

**功能**: 部署应用到 Vercel

**使用方法**:
```bash
cd /home/lc/luckee_dao/solana-liquidation-dashboard
./scripts/deploy.sh
```

**部署流程**:
1. 前置检查（Node.js、npm、Vercel CLI）
2. 安全验证
3. 依赖安装
4. 构建测试
5. 环境变量准备
6. Vercel 认证
7. 选择部署环境
8. 执行部署
9. 部署后验证

**部署选项**:
- Preview 环境（测试）
- Production 环境（正式）

### 6. 完整流程类

#### `full-deploy.sh` - 完整部署流程脚本

**功能**: 一键完成完整部署流程

**使用方法**:
```bash
cd /home/lc/luckee_dao/solana-liquidation-dashboard
./scripts/full-deploy.sh
```

**执行流程**:
1. 安全验证
2. GitHub 上传
3. Vercel 部署
4. 验证部署结果

**特点**:
- 自动化完整流程
- 彩色输出界面
- 详细进度显示
- 错误处理和恢复

## 🎯 使用场景

### 开发环境设置

```bash
# 1. 同步配置
./scripts/sync-config.sh

# 2. 验证安全
./scripts/verify-security.sh

# 3. 启动开发服务器
npm run dev
```

### 生产环境部署

```bash
# 方法 1: 完整部署流程（推荐）
./scripts/full-deploy.sh

# 方法 2: 分步部署
./scripts/upload-github.sh
./scripts/setup-env.sh
./scripts/deploy.sh
```

### 环境变量配置

```bash
# 配置 Vercel 环境变量
./scripts/setup-env.sh
```

### 安全验证

```bash
# 验证项目安全性
./scripts/verify-security.sh
```

## ⚙️ 配置要求

### 环境依赖

- **Node.js**: 18+ 版本
- **npm**: 最新版本
- **Vercel CLI**: 已安装并登录
- **Git**: 已配置 SSH 密钥

### 文件依赖

- `../solana-liquidation-bot/env/.info` - 后端配置文件
- `.gitignore` - Git 忽略规则
- `package.json` - 项目配置

### 权限设置

```bash
# 添加执行权限
chmod +x scripts/*.sh
```

## 🔒 安全注意事项

### 1. 敏感文件保护

确保以下文件在 `.gitignore` 中：
- `public.env` (公开配置文件)
- `安全*.md`
- `配置*.md`
- `*deploy*.sh`

### 2. API Key 保护

- 不要使用 `NEXT_PUBLIC_` 前缀
- 在 Vercel Dashboard 手动配置
- 定期轮换 API Key

### 3. 部署前验证

- 运行 `verify-security.sh`
- 检查构建文件无泄露
- 验证环境变量配置

## 🐛 故障排除

### 常见问题

#### 1. 权限错误
```bash
# 解决方案
chmod +x scripts/*.sh
```

#### 2. Vercel 未登录
```bash
# 解决方案
vercel login
```

#### 3. Git 配置错误
```bash
# 检查 SSH 密钥
ssh -T git@github.com

# 检查远程仓库
git remote -v
```

#### 4. 构建失败
```bash
# 检查依赖
npm install

# 检查代码
npm run build
```

### 调试方法

#### 1. 查看详细日志
```bash
# 安全验证日志
./scripts/verify-security.sh > security.log 2>&1

# 构建日志
npm run build > build.log 2>&1
```

#### 2. 检查环境变量
```bash
# 查看本地环境变量
cat public.env

# 查看 Vercel 环境变量
vercel env ls
```

#### 3. 验证部署状态
```bash
# 查看 Vercel 部署
vercel ls

# 查看部署日志
vercel logs
```

## 📚 相关文档

- [项目文档](../docs/README.md)
- [部署指南](../docs/deployment/vercel.md)
- [环境配置](../docs/deployment/environment.md)
- [安全指南](../docs/architecture/security.md)

## 🔄 脚本维护

### 更新脚本

1. 修改脚本内容
2. 测试脚本功能
3. 更新文档说明
4. 提交到 Git

### 添加新脚本

1. 确定功能领域
2. 编写脚本代码
3. 添加使用说明
4. 更新 README.md

### 删除废弃脚本

1. 确认脚本已废弃
2. 删除脚本文件
3. 更新文档
4. 提交更改

## 🎉 最佳实践

### 1. 脚本命名规范

- 使用小写字母和连字符
- 功能描述清晰
- 避免重复命名

### 2. 错误处理

- 使用 `set -e` 遇到错误立即退出
- 提供清晰的错误信息
- 包含修复建议

### 3. 用户友好

- 彩色输出界面
- 进度显示
- 详细的操作说明

### 4. 安全性

- 验证敏感文件保护
- 检查 API Key 泄露
- 提供安全建议

---

**文档版本**: v2.0.0  
**最后更新**: 2025-01-29  
**维护者**: 开发团队