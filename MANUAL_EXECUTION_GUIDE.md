# 手动执行脚本指南

## 概述

由于终端环境限制，无法直接执行脚本，但可以通过以下步骤手动验证和执行脚本功能。

## 执行步骤

### 1. 环境准备

```bash
# 切换到项目目录
cd /home/lc/luckee_dao/solana-liquidation-dashboard

# 设置脚本执行权限
chmod +x scripts/*.sh

# 检查权限
ls -la scripts/*.sh
```

### 2. 测试配置同步脚本

```bash
# 运行配置同步脚本
./scripts/sync-config.sh

# 预期结果:
# - 显示当前配置信息
# - 生成或更新 public.env 文件
# - 显示配置同步完成信息
```

### 3. 测试安全验证脚本

```bash
# 运行安全验证脚本
./scripts/verify-security.sh

# 预期结果:
# - 检查 public.env 文件存在
# - 验证公开配置内容
# - 检查版本信息配置
# - 验证 RPC 配置
# - 检查 API Route 存在
# - 验证前端代码安全性
# - 检查构建文件安全性
# - 显示通过/失败状态
```

### 4. 测试 GitHub 上传脚本

```bash
# 运行 GitHub 上传脚本
./scripts/upload-github.sh

# 预期结果:
# - 显示安全文件排除列表
# - 显示公开文件包含列表
# - 要求用户确认 (输入 y)
# - 检查 Git 配置
# - 验证敏感文件保护
# - 清理已追踪的敏感文件
# - 添加文件到 Git
# - 显示即将提交的文件
# - 提交更改
# - 推送到 GitHub
```

### 5. 测试 Vercel 部署脚本

```bash
# 运行 Vercel 部署脚本
./scripts/deploy.sh

# 预期结果:
# - 前置检查 (Node.js、npm、Vercel CLI)
# - 安全验证
# - 依赖安装
# - 构建测试
# - 环境变量准备
# - Vercel 认证
# - 选择部署环境 (输入 1 或 2)
# - 执行部署
# - 部署后验证
```

### 6. 测试完整部署脚本

```bash
# 运行完整部署脚本
./scripts/full-deploy.sh

# 预期结果:
# - 显示部署流程界面
# - 要求用户确认 (输入 y)
# - 安全验证
# - GitHub 上传
# - Vercel 部署
# - 验证部署结果
# - 显示部署信息
```

## 故障排除

### 1. 权限错误
```bash
# 解决方案
chmod +x scripts/*.sh
```

### 2. Git 未初始化
```bash
# 初始化 Git
git init

# 配置远程仓库
git remote add origin git@github.com:iunknow588/liquidation-bot.git
```

### 3. Vercel 未登录
```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login
```

### 4. 依赖未安装
```bash
# 安装项目依赖
npm install
```

### 5. 构建失败
```bash
# 检查代码
npm run build

# 查看错误信息
npm run build 2>&1 | tee build.log
```

## 验证步骤

### 1. 验证配置同步
```bash
# 检查 public.env 文件
cat public.env

# 应该看到:
# - 版本信息 (5个变量)
# - Solana 配置 (4个变量)
# - API Key (1个变量)
```

### 2. 验证安全配置
```bash
# 检查 .gitignore
cat .gitignore | grep -E "(\.env\.local|public\.env)"

# 应该看到:
# - .env.local 被忽略
# - public.env 不被忽略
```

### 3. 验证 Git 状态
```bash
# 检查 Git 状态
git status

# 应该看到:
# - public.env 被跟踪
# - .env.local 不被跟踪
```

### 4. 验证构建
```bash
# 构建项目
npm run build

# 应该成功完成
```

## 预期输出示例

### 配置同步脚本输出
```
════════════════════════════════════════════════════════
🔄 同步 RPC 配置
════════════════════════════════════════════════════════

📄 读取配置文件: ../solana-liquidation-bot/env/.info

📊 当前配置:
  版本: v1.0.0 (01-29 15:30)
  集群: mainnet
  Mainnet RPC: https://api.mainnet-beta.solana.com
  Devnet RPC: https://api.devnet.solana.com
  Testnet RPC: https://api.testnet.solana.com

📝 写入 public.env...
✅ 配置同步完成！

📋 公开配置文件已创建: public.env

🚀 下一步:
  1. 运行 npm run dev 启动开发服务器
  2. 或运行 npm run build 构建生产版本
```

### 安全验证脚本输出
```
════════════════════════════════════════════════════════
🔒 安全验证检查
════════════════════════════════════════════════════════

1️⃣ 检查公开配置文件...
   ✅ public.env 存在

2️⃣ 检查公开配置文件内容...
   ✅ 发现公开的 Demo API Key（这是安全的）

3️⃣ 检查版本信息配置...
   ✅ 版本信息已配置

4️⃣ 检查 RPC 配置...
   ✅ RPC 配置已设置

5️⃣ 检查 API Route...
   ✅ API Route 存在

6️⃣ 检查前端代码...
   ✅ 前端通过 API 调用

7️⃣ 检查构建安全性...
   正在构建...
   ✅ 构建成功
   ✅ API Key 未泄露到构建文件

════════════════════════════════════════════════════════
📊 检查结果
════════════════════════════════════════════════════════

   ✅ 通过: 7
   ❌ 失败: 0

🎉 恭喜！所有安全检查通过

✅ 可以安全部署到 Vercel
```

## 成功标准

### GitHub 上传成功
- ✅ 脚本运行无错误
- ✅ 文件成功添加到 Git
- ✅ 更改成功提交
- ✅ 代码成功推送到 GitHub

### Vercel 部署成功
- ✅ 脚本运行无错误
- ✅ 项目构建成功
- ✅ 安全验证通过
- ✅ 成功部署到 Vercel
- ✅ 获得部署 URL

### 完整部署成功
- ✅ GitHub 上传成功
- ✅ Vercel 部署成功
- ✅ 部署验证通过
- ✅ 显示部署信息

## 注意事项

1. **确认操作**: 脚本会要求用户确认，请仔细阅读提示
2. **环境变量**: 确保 Vercel 环境变量已正确配置
3. **API Key**: 确保使用正确的 API Key
4. **网络连接**: 确保网络连接正常
5. **权限设置**: 确保有足够的权限执行操作

---

**指南版本**: v1.0.0  
**创建日期**: 2025-01-29  
**适用脚本**: 所有 scripts/ 目录下的脚本
