# 🚀 Solana 清算机器人 - 完整部署指南

**版本**: 1.0.0  
**更新时间**: 2025-10-28

---

## 📋 目录

1. [快速开始](#快速开始)
2. [前置要求](#前置要求)
3. [安全配置](#安全配置)
4. [GitHub 部署](#github-部署)
5. [Vercel 部署](#vercel-部署)
6. [验证部署](#验证部署)
7. [故障排除](#故障排除)

---

## 🎯 快速开始

### 一键部署（推荐）

```bash
cd /home/lc/luckee_dao/solana-liquidation-dashboard

# 完整部署流程
./scripts/full_deployment.sh
```

### 分步部署

```bash
# 1. 同步配置
./sync-config.sh

# 2. 安全验证
./verify-security.sh

# 3. GitHub 上传
./scripts/upload_to_github.sh

# 4. Vercel 部署
./scripts/deploy_to_vercel.sh
```

---

## 📦 前置要求

### 系统要求

- ✅ Node.js >= 18.0.0
- ✅ npm >= 9.0.0
- ✅ Git
- ✅ SSH 密钥（GitHub）
- ✅ Vercel 账号

### 检查环境

```bash
# 检查 Node.js
node -v

# 检查 npm
npm -v

# 检查 Git
git --version

# 检查 SSH
ssh -T git@github.com
```

### 安装 Vercel CLI

```bash
npm install -g vercel
vercel login
```

---

## 🔒 安全配置

### 1. 环境变量配置

创建 `.env.local` (不提交到 Git):

```bash
# 🔒 服务器端环境变量（不要用 NEXT_PUBLIC_）
HELIUS_API_KEY=08108945-f5b2-4aa4-8453-58e16774c9ba
SOLANA_CLUSTER=mainnet
```

### 2. .gitignore 配置

确保以下内容已添加到 `.gitignore`:

```bash
# 敏感文件
.env.local
.env
安全*.md
*密码*.md
配置*.md
*deploy*.sh
.vercel/
```

### 3. 安全验证

```bash
# 运行安全检查
./verify-security.sh

# 应该看到:
# ✅ 通过: 7/7
# ✅ 可以安全部署到 Vercel
```

---

## 📤 GitHub 部署

### 仓库信息

- **仓库地址**: `git@github.com:iunknow588/liquidation-bot.git`
- **主分支**: `main`

### 手动上传

```bash
./scripts/upload_to_github.sh
```

**脚本功能**:
1. ✅ 初始化 Git 仓库
2. ✅ 配置远程仓库
3. ✅ 验证敏感文件保护
4. ✅ 清理敏感文件缓存
5. ✅ 提交代码
6. ✅ 推送到 GitHub

### 验证上传

访问: https://github.com/iunknow588/liquidation-bot

检查:
- ✅ 代码已上传
- ✅ `.env.local` 不在仓库中
- ✅ 安全文档不在仓库中
- ✅ 部署脚本不在仓库中

---

## 🚀 Vercel 部署

### 方式 1: 使用脚本（推荐）

```bash
./scripts/deploy_to_vercel.sh
```

**部署流程**:
1. 前置检查
2. 安全验证
3. 依赖安装
4. 构建测试
5. 环境变量配置
6. 选择部署环境（Preview/Production）
7. 执行部署
8. 部署后验证

### 方式 2: 手动部署

```bash
# 1. 登录 Vercel
vercel login

# 2. 部署到 Preview
vercel

# 3. 部署到 Production
vercel --prod
```

### 配置环境变量

⚠️ **重要**: 必须在 Vercel Dashboard 手动配置环境变量

#### 步骤:

1. 访问 https://vercel.com/dashboard
2. 选择项目 `liquidation-bot`
3. 进入 **Settings** → **Environment Variables**
4. 添加以下变量（**不要**加 `NEXT_PUBLIC_` 前缀）:

| 名称 | 值 | 环境 |
|------|-----|------|
| `HELIUS_API_KEY` | `08108945-f5b2-4aa4-8453-58e16774c9ba` | Production, Preview, Development |
| `SOLANA_CLUSTER` | `mainnet` | Production, Preview, Development |

5. 点击 **Save**
6. 重新部署: `vercel --prod`

---

## ✅ 验证部署

### 1. 检查部署状态

```bash
# 访问 Vercel Dashboard
https://vercel.com/dashboard

# 查看部署列表
vercel ls
```

### 2. 访问应用

获取部署 URL 后访问应用。

### 3. 功能测试

1. **页面加载**
   - 访问主页
   - 检查页面显示

2. **扫描功能**
   - 点击"开始扫描"
   - 查看是否返回数据

3. **安全验证**
   - 按 `F12` 打开开发者工具
   - 在 Console 执行:
     ```javascript
     console.log(process.env.NEXT_PUBLIC_HELIUS_API_KEY);
     // ✅ 应该输出: undefined
     ```

4. **API 健康检查**
   ```bash
   curl https://your-app.vercel.app/api/scan
   # ✅ 应该返回: {"status":"ok",...}
   ```

### 4. 网络请求检查

- 打开 DevTools → Network
- 点击"开始扫描"
- 检查请求:
  - ✅ 只应该看到: `POST /api/scan`
  - ❌ 不应该看到包含 API Key 的请求

---

## 🐛 故障排除

### GitHub 上传失败

#### 问题 1: SSH 密钥未配置

```bash
# 生成 SSH 密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 添加到 ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 添加到 GitHub
cat ~/.ssh/id_ed25519.pub
# 复制输出，在 GitHub Settings → SSH Keys 中添加
```

#### 问题 2: 远程仓库不存在

```bash
# 检查远程仓库
git remote -v

# 更新远程仓库
git remote set-url origin git@github.com:iunknow588/liquidation-bot.git
```

#### 问题 3: 推送被拒绝

```bash
# 强制推送（谨慎使用）
git push -u origin main --force
```

### Vercel 部署失败

#### 问题 1: 未登录

```bash
# 登录 Vercel
vercel login

# 验证登录
vercel whoami
```

#### 问题 2: 构建失败

```bash
# 本地测试构建
npm run build

# 查看错误日志
cat /tmp/build.log
```

#### 问题 3: 环境变量未配置

1. 访问 Vercel Dashboard
2. 检查 Environment Variables
3. 确保变量名**没有** `NEXT_PUBLIC_` 前缀
4. 重新部署

#### 问题 4: API 返回 500

```bash
# 检查 Vercel 日志
vercel logs

# 检查环境变量
curl https://your-app.vercel.app/api/scan
```

### API Key 泄露

#### 检测泄露

```bash
# 检查构建文件
grep -r "08108945" .next/

# 检查环境变量
cat .env.local | grep NEXT_PUBLIC
```

#### 修复步骤

1. 停止使用泄露的 API Key
2. 在 Helius Dashboard 生成新的 API Key
3. 更新 `.env.local`:
   ```bash
   # ✅ 正确（服务器端）
   HELIUS_API_KEY=new-api-key
   
   # ❌ 错误（会暴露）
   NEXT_PUBLIC_HELIUS_API_KEY=new-api-key
   ```
4. 清除构建缓存:
   ```bash
   rm -rf .next
   npm run build
   ```
5. 重新部署

---

## 📊 部署清单

### 部署前

- [ ] 环境变量已配置（`.env.local`）
- [ ] 安全验证通过（`./verify-security.sh`）
- [ ] `.gitignore` 正确配置
- [ ] SSH 密钥已配置
- [ ] Vercel CLI 已安装
- [ ] 本地构建成功（`npm run build`）

### 部署后

- [ ] GitHub 代码已上传
- [ ] Vercel 部署成功
- [ ] 应用可以访问
- [ ] 扫描功能正常
- [ ] API Key 不可见（F12 控制台）
- [ ] Vercel 环境变量已配置
- [ ] API 健康检查通过

---

## 📚 相关资源

### 文档

- [README.md](./README.md) - 项目文档
- [安全部署指南.md](./安全部署指南.md) - 安全指南
- [scripts/README.md](./scripts/README.md) - 脚本说明

### 脚本

- `./sync-config.sh` - 同步配置
- `./verify-security.sh` - 安全验证
- `./scripts/upload_to_github.sh` - GitHub 上传
- `./scripts/deploy_to_vercel.sh` - Vercel 部署
- `./scripts/full_deployment.sh` - 完整部署

### 外部链接

- [GitHub 仓库](https://github.com/iunknow588/liquidation-bot)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Helius Dashboard](https://dashboard.helius.dev/)
- [Solana 文档](https://solana.com/zh/docs)

---

## 🎯 最佳实践

### 1. 版本控制

```bash
# 使用有意义的提交消息
git commit -m "✨ feat: 添加新功能"
git commit -m "🐛 fix: 修复 bug"
git commit -m "📝 docs: 更新文档"
```

### 2. 环境管理

- 开发: `.env.local`
- 预览: Vercel Preview 环境变量
- 生产: Vercel Production 环境变量

### 3. 安全实践

- ✅ 定期轮换 API Key
- ✅ 监控 API 使用量
- ✅ 启用访问日志
- ✅ 定期安全审计

### 4. 部署策略

1. **开发阶段**: 本地测试
2. **测试阶段**: Preview 部署
3. **生产阶段**: Production 部署

---

## 📞 支持

遇到问题？

1. 查看 [故障排除](#故障排除) 部分
2. 运行 `./verify-security.sh` 检查安全状态
3. 查看 Vercel 部署日志
4. 检查 GitHub Actions (如果配置了 CI/CD)

---

**祝部署顺利！** 🎉

