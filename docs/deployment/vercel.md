# 🚀 Vercel 部署指南

## 📋 概述

本指南详细说明如何将 Solana 清算机器人部署到 Vercel 平台，整合了所有部署相关的文档内容。

## 🎯 部署优势

- **零配置**: 自动检测 Next.js 项目
- **全球 CDN**: 自动全球内容分发
- **自动 HTTPS**: 免费 SSL 证书
- **Git 集成**: 推送代码自动部署
- **预览环境**: 每个 PR 生成预览链接
- **完全免费**: 无需独立服务器

## 🔧 部署前准备

### 1. 项目准备
确保项目满足以下条件：
- ✅ 使用 Next.js 14 框架
- ✅ 配置正确的 `package.json`
- ✅ 设置环境变量
- ✅ 通过本地测试

### 2. 环境变量配置
创建 `public.env` 文件：
```bash
# RPC 配置
NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_NETWORK=mainnet

# Helius API (可选)
NEXT_PUBLIC_HELIUS_API_KEY=your-helius-api-key

# 调试模式
NEXT_PUBLIC_DEBUG=false
```

### 3. Vercel 配置
创建 `vercel.json` 文件：
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "functions": {
    "app/api/liquidation/route.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NEXT_PUBLIC_RPC_ENDPOINT": "https://api.mainnet-beta.solana.com"
  }
}
```

## 🚀 部署方法

### 方法一：Vercel CLI 部署 (推荐)

#### 1. 安装 Vercel CLI
```bash
npm install -g vercel
```

#### 2. 登录 Vercel
```bash
vercel login
```

#### 3. 初始化项目
```bash
cd /path/to/your/project
vercel
```

#### 4. 配置项目
按照提示配置项目：
- **项目名称**: solana-liquidation-dashboard
- **框架**: Next.js
- **根目录**: ./
- **构建命令**: npm run build
- **输出目录**: .next

#### 5. 部署到生产环境
```bash
vercel --prod
```

### 方法二：GitHub 集成部署

#### 1. 推送代码到 GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

#### 2. 连接 Vercel
1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 选择 GitHub 仓库
4. 点击 "Import"

#### 3. 配置环境变量
在 Vercel 控制台设置环境变量：
- `NEXT_PUBLIC_RPC_ENDPOINT`
- `NEXT_PUBLIC_NETWORK`
- `NEXT_PUBLIC_HELIUS_API_KEY`

#### 4. 自动部署
推送代码到 main 分支会自动触发部署。

### 方法三：手动上传部署

#### 1. 构建项目
```bash
npm run build
```

#### 2. 导出静态文件
```bash
npm run export
```

#### 3. 上传到 Vercel
将 `.next` 目录上传到 Vercel。

## ⚙️ 环境配置

### 开发环境
```bash
NEXT_PUBLIC_RPC_ENDPOINT=http://localhost:8899
NEXT_PUBLIC_NETWORK=devnet
NEXT_PUBLIC_DEBUG=true
```

### 预览环境
```bash
NEXT_PUBLIC_RPC_ENDPOINT=https://api.testnet.solana.com
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_DEBUG=true
```

### 生产环境
```bash
NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_DEBUG=false
NEXT_PUBLIC_HELIUS_API_KEY=your-production-api-key
```

## 🔐 安全配置

### 1. 环境变量安全
- 敏感信息使用环境变量
- 不在代码中硬编码密钥
- 定期轮换 API 密钥

### 2. 域名安全
- 启用 HTTPS 强制重定向
- 配置安全头
- 设置 CSP 策略

### 3. 访问控制
- 限制 API 访问频率
- 实现请求验证
- 监控异常访问

## 📊 监控配置

### 1. Vercel Analytics
```javascript
// 集成 Vercel Analytics
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

### 2. 错误监控
```javascript
// 集成 Sentry
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### 3. 性能监控
```javascript
// 自定义性能监控
export const trackPerformance = (metric) => {
  if (typeof window !== 'undefined') {
    // 发送性能数据
    analytics.track('performance', metric);
  }
};
```

## 🔄 持续部署

### 1. 自动部署配置
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### 2. 分支策略
- **main**: 生产环境
- **develop**: 开发环境
- **feature/***: 功能分支
- **hotfix/***: 热修复分支

### 3. 部署流程
1. 开发功能分支
2. 创建 Pull Request
3. 自动生成预览环境
4. 代码审查通过
5. 合并到 main 分支
6. 自动部署到生产环境

## 🐛 故障排除

### 常见问题

#### 1. 构建失败
**问题**: 构建过程中出现错误
**解决方案**:
- 检查 `package.json` 依赖
- 确保所有文件路径正确
- 检查 TypeScript 类型错误

#### 2. 环境变量未生效
**问题**: 环境变量在运行时未生效
**解决方案**:
- 确保变量名以 `NEXT_PUBLIC_` 开头
- 重新部署项目
- 检查 Vercel 控制台配置

#### 3. API 路由不工作
**问题**: API 路由返回 404
**解决方案**:
- 检查文件路径和命名
- 确保使用正确的 HTTP 方法
- 检查 Vercel 函数配置

#### 4. 静态资源加载失败
**问题**: 图片、CSS 等资源加载失败
**解决方案**:
- 检查资源路径
- 确保资源文件存在
- 检查 Next.js 配置

### 调试方法

#### 1. 查看构建日志
```bash
vercel logs
```

#### 2. 本地调试
```bash
vercel dev
```

#### 3. 检查部署状态
```bash
vercel ls
```

## 📈 性能优化

### 1. 构建优化
- 启用代码分割
- 优化图片加载
- 压缩静态资源
- 使用 CDN 加速

### 2. 运行时优化
- 实现缓存策略
- 优化 API 调用
- 减少重渲染
- 使用懒加载

### 3. 监控优化
- 监控 Core Web Vitals
- 跟踪用户行为
- 分析性能瓶颈
- 优化关键路径

## 🎯 最佳实践

### 1. 代码管理
- 使用语义化版本
- 编写清晰的提交信息
- 定期更新依赖
- 保持代码整洁

### 2. 部署管理
- 使用环境分支
- 配置自动回滚
- 监控部署状态
- 定期备份数据

### 3. 安全实践
- 定期安全扫描
- 更新安全补丁
- 监控异常访问
- 实施访问控制

## 📚 相关文档

- [部署概览](overview.md)
- [环境配置](environment.md)
- [监控运维](monitoring.md)
- [故障排除](../user-guide/troubleshooting.md)

---

**文档版本**: v2.0.0  
**最后更新**: 2025-01-29  
**审核状态**: ✅ 已审核
