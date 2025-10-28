# 🚀 Vercel 部署说明

**参考项目**: dd_3d_lottery_frontend  
**框架**: Next.js 14  
**部署平台**: Vercel

---

## 📋 部署方式（3种方法）

### 方法 1: Vercel Dashboard 部署（推荐）⭐⭐⭐⭐⭐

**步骤**:

1. **访问 Vercel Dashboard** (用手机或有网络的设备)
   ```
   https://vercel.com/dashboard
   ```

2. **连接 GitHub 仓库**
   - 点击 "Add New Project"
   - 选择 "Import Git Repository"
   - 选择: `iunknow588/liquidation-bot`
   - 点击 "Import"

3. **配置项目**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build (自动检测)
   Output Directory: .next (自动检测)
   Install Command: npm install (自动检测)
   ```

4. **配置环境变量**
   
   点击 "Environment Variables"，添加:
   ```
   名称: SOLANA_CLUSTER
   值: mainnet
   环境: Production, Preview, Development
   ```
   
   **可选** (如果使用 Helius):
   ```
   名称: HELIUS_API_KEY
   值: your-api-key
   环境: Production, Preview, Development
   ```

5. **开始部署**
   - 点击 "Deploy"
   - 等待 1-2 分钟
   - 部署完成！

6. **自动部署**
   - 以后每次 `git push`，Vercel 自动重新部署
   - 无需手动操作

---

### 方法 2: Vercel CLI 部署（本地网络受限时不可用）

**前提**: 需要能访问 Vercel

```bash
# 1. 安装 Vercel CLI (如果未安装)
npm install -g vercel

# 2. 登录
vercel login

# 3. 部署到预览环境
vercel

# 4. 部署到生产环境
vercel --prod
```

**注意**: 本地网络受限时此方法不可用！

---

### 方法 3: Git Push 自动部署（最简单）⭐⭐⭐⭐⭐

一旦在 Vercel Dashboard 连接了 GitHub 仓库：

```bash
# 1. 提交代码
git add .
git commit -m "更新代码"

# 2. 推送到 GitHub
git push origin master

# 3. Vercel 自动检测并部署 ✅
```

**优势**:
- ✅ 完全自动化
- ✅ 无需手动操作
- ✅ 不受本地网络限制
- ✅ 可以在任何能访问 GitHub 的环境推送

---

## 📊 部署配置对比

### dd_3d_lottery 项目 (Vite)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Solana 清算机器人 (Next.js)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

**差异**:
- 输出目录: `dist` vs `.next`
- 框架: Vite vs Next.js
- 路由: 手动配置 vs 自动处理

---

## 🔧 package.json 脚本

**参考 dd_3d_lottery**:
```json
{
  "scripts": {
    "deploy": "npm run build && vercel --prod",
    "deploy:preview": "npm run build && vercel",
    "vercel:build": "npm run build"
  }
}
```

**Solana 清算机器人**:
```json
{
  "scripts": {
    "build": "next build",
    "dev": "next dev",
    "start": "next start"
  }
}
```

Next.js 不需要额外的部署脚本，Vercel 自动处理。

---

## ⚙️ 环境变量配置

### 在 Vercel Dashboard 配置

**路径**: Settings → Environment Variables

**推荐配置** (使用公开节点):
```
SOLANA_CLUSTER = mainnet
（不设置 HELIUS_API_KEY）
```

**可选配置** (使用 Helius):
```
SOLANA_CLUSTER = mainnet
HELIUS_API_KEY = your-key-here
```

**说明**:
- 不需要 `NEXT_PUBLIC_` 前缀（服务器端变量）
- 所有环境都设置：Production + Preview + Development
- 保存后需要重新部署

---

## 📁 项目结构

```
solana-liquidation-dashboard/
├── app/                    # Next.js 应用目录
│   ├── api/               # API Routes
│   ├── page.tsx           # 主页
│   └── layout.tsx         # 布局
├── lib/                   # 库文件
├── public/                # 静态资源
├── package.json           # 依赖配置
├── next.config.js         # Next.js 配置
├── vercel.json            # Vercel 配置 ✅
└── .gitignore             # Git 忽略文件
```

---

## 🚀 完整部署流程

### 首次部署

```
1. 代码推送到 GitHub ✅ (已完成)
   git push origin master

2. 访问 Vercel Dashboard
   https://vercel.com/dashboard

3. 导入 GitHub 仓库
   Import Project → Select Repository

4. 配置环境变量
   Settings → Environment Variables

5. 点击 Deploy
   等待 1-2 分钟

6. 完成！✅
   访问: https://your-app.vercel.app
```

### 后续更新

```
1. 修改代码

2. 提交并推送
   git add .
   git commit -m "更新"
   git push origin master

3. Vercel 自动部署 ✅
   无需其他操作

4. 查看部署状态
   Vercel Dashboard → Deployments
```

---

## 📊 部署状态检查

### 在 Vercel Dashboard 查看

**URL**: https://vercel.com/iunknow588s-projects/solana-liquidation-dashboard

**查看内容**:
1. **Deployments 标签**
   - 部署历史
   - 当前状态
   - 构建日志

2. **Functions 标签**
   - API Routes 日志
   - 请求统计
   - 错误信息

3. **Analytics 标签**
   - 访问统计
   - 性能指标
   - 地理分布

---

## ✅ 部署成功标志

### 在 Vercel Dashboard

```
✅ Status: Ready
✅ Domain: your-app.vercel.app
✅ Branch: master
✅ Last Deployed: [最近时间]
```

### 访问应用

**主页**: https://your-app.vercel.app
```
✅ 页面正常加载
✅ 显示 "Solana 清算机器人"
✅ 显示集群和 RPC 信息
```

**API**: https://your-app.vercel.app/api/scan
```json
{
  "status": "ok",
  "cluster": "mainnet",
  "provider": "Solana 公开节点 (Mainnet)",
  "usingPublicRpc": true
}
```

---

## ⚠️ 注意事项

### 1. 环境变量

- ✅ 在 Vercel Dashboard 配置
- ❌ 不要在代码中硬编码
- ❌ 不要使用 `NEXT_PUBLIC_` 前缀（API Key 会暴露）

### 2. Git 配置

```gitignore
# .gitignore (已配置)
.env.local
.env
.vercel
```

### 3. 自动部署

- ✅ GitHub 连接后自动启用
- ✅ 每次 push 触发部署
- ⚠️  可以在 Settings 中禁用

### 4. 域名配置

- 自动域名: `your-app.vercel.app`
- 可以绑定自定义域名
- 在 Settings → Domains 配置

---

## 🎯 推荐部署方式

**最佳实践** (参考 dd_3d_lottery):

```
1. 使用 Vercel Dashboard 首次部署 ✅
   - 简单直观
   - 图形界面
   - 适合非技术用户

2. 后续使用 Git Push 自动部署 ✅
   - 完全自动化
   - 无需手动操作
   - 不受网络限制

3. 环境变量在 Dashboard 配置 ✅
   - 安全
   - 集中管理
   - 易于修改
```

**避免**:
- ❌ 使用 Vercel CLI（网络受限时不可用）
- ❌ 在代码中硬编码配置
- ❌ 提交敏感文件到 Git

---

## 📚 相关文档

- **Vercel 官方文档**: https://vercel.com/docs
- **Next.js 部署文档**: https://nextjs.org/docs/deployment
- **参考项目**: `/home/lc/luckee_dao/dd_3d_lottery/dd_3d_lottery_frontend`

---

## 🎉 总结

**参考 dd_3d_lottery 的经验**:

| 特性 | dd_3d_lottery | Solana 清算机器人 |
|------|---------------|-------------------|
| **部署平台** | Vercel | Vercel |
| **部署方式** | Dashboard + Git | Dashboard + Git |
| **自动部署** | ✅ 是 | ✅ 是 |
| **配置文件** | vercel.json | vercel.json |
| **环境变量** | Dashboard | Dashboard |
| **网络要求** | 首次需要 | 首次需要 |
| **后续更新** | Git Push | Git Push |

**结论**: 使用相同的部署方式，简单可靠！✅

---

**当前状态**:
- ✅ 代码已推送到 GitHub
- ✅ vercel.json 已创建
- ⏳ 等待在 Vercel Dashboard 导入项目

**下一步**: 用手机访问 Vercel Dashboard 导入项目即可！

