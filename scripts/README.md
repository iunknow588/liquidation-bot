# 🚀 Solana 清算机器人 - 部署脚本

本目录包含项目的自动化部署脚本。

---

## 📁 脚本列表

| 脚本 | 说明 | 用途 |
|------|------|------|
| `upload_to_github.sh` | GitHub 上传脚本 | 提交代码到 GitHub |
| `deploy_to_vercel.sh` | Vercel 部署脚本 | 部署到 Vercel |
| `full_deployment.sh` | 完整部署流程 | 一键部署 |

---

## 🔧 使用方法

### 1. GitHub 上传

```bash
cd /home/lc/luckee_dao/solana-liquidation-dashboard
./scripts/upload_to_github.sh
```

**功能**:
- ✅ 自动初始化 Git 仓库
- ✅ 配置远程仓库
- ✅ 验证敏感文件保护
- ✅ 清理已追踪的敏感文件
- ✅ 提交并推送到 GitHub

**安全特性**:
- 🔒 自动排除 `.env.local`
- 🔒 排除安全文档（`安全*.md`）
- 🔒 排除部署脚本（`*deploy*.sh`）
- 🔒 排除配置说明（`配置*.md`）

### 2. Vercel 部署

```bash
cd /home/lc/luckee_dao/solana-liquidation-dashboard
./scripts/deploy_to_vercel.sh
```

**功能**:
- ✅ 前置检查（Node.js、npm、Vercel CLI）
- ✅ 安全验证
- ✅ 依赖安装
- ✅ 构建测试
- ✅ 环境变量配置
- ✅ 自动部署
- ✅ 部署后验证

**部署选项**:
1. **Preview 环境** - 测试部署
2. **Production 环境** - 正式部署

### 3. 完整部署流程

```bash
cd /home/lc/luckee_dao/solana-liquidation-dashboard
./scripts/full_deployment.sh
```

**流程**:
1. 上传到 GitHub
2. 部署到 Vercel
3. 保存部署信息

---

## ⚙️ 配置要求

### 环境变量

确保 `.env.local` 文件存在且包含：

```bash
# 🔒 服务器端环境变量（不要用 NEXT_PUBLIC_）
HELIUS_API_KEY=your-api-key-here
SOLANA_CLUSTER=mainnet
```

### 权限设置

```bash
# 添加执行权限
chmod +x scripts/*.sh
```

---

## 🔒 安全检查

### 上传前验证

脚本会自动检查以下内容：

1. ✅ `.env.local` 在 `.gitignore` 中
2. ✅ 安全文档未被追踪
3. ✅ 部署脚本未被追踪
4. ✅ API Key 未暴露

### 部署前验证

1. ✅ 运行 `verify-security.sh`
2. ✅ 检查构建文件中无 API Key
3. ✅ 验证环境变量配置
4. ✅ 确认无 `NEXT_PUBLIC_` 敏感变量

---

## 📊 部署信息

部署完成后，信息会保存到：
```
/home/lc/luckee_dao/env/liquidation_bot_deployment_info.json
```

**内容包括**:
- 部署类型（Preview/Production）
- 部署时间
- 部署 URL
- 环境配置
- 版本信息

---

## 🐛 故障排除

### GitHub 上传失败

```bash
# 检查 SSH 密钥
ssh -T git@github.com

# 检查远程仓库
git remote -v

# 手动推送
git push -u origin main
```

### Vercel 部署失败

```bash
# 检查 Vercel 登录
vercel whoami

# 重新登录
vercel login

# 查看构建日志
npm run build
```

### API Key 泄露

```bash
# 检查构建文件
grep -r "your-api-key" .next/

# 验证环境变量
cat .env.local | grep NEXT_PUBLIC

# 重新生成 .env.local
./sync-config.sh
```

---

## 📚 相关文档

- [安全部署指南](../安全部署指南.md)
- [配置同步说明](../配置同步说明.md)
- [README](../README.md)

---

## 🎯 快速开始

### 首次部署

```bash
# 1. 同步配置
./sync-config.sh

# 2. 验证安全
./verify-security.sh

# 3. 上传到 GitHub
./scripts/upload_to_github.sh

# 4. 部署到 Vercel
./scripts/deploy_to_vercel.sh
```

### 后续更新

```bash
# 1. 提交更改
./scripts/upload_to_github.sh

# 2. 重新部署
./scripts/deploy_to_vercel.sh
```

---

## ⚠️ 注意事项

1. **不要提交敏感文件**
   - `.env.local`
   - 安全文档
   - 部署脚本

2. **环境变量配置**
   - 不要使用 `NEXT_PUBLIC_` 前缀
   - 在 Vercel Dashboard 手动配置

3. **API Key 保护**
   - 定期轮换 API Key
   - 监控 API 使用量
   - 启用 IP 限流

4. **部署验证**
   - 检查部署 URL
   - 测试扫描功能
   - 验证 API Key 不可见

---

**创建时间**: 2025-10-28  
**版本**: 1.0.0

