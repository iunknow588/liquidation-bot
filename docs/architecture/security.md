# 🔒 安全架构指南

## 📋 概述

本指南详细说明 Solana 清算机器人的安全架构设计，包括安全措施、风险控制和最佳实践。

## 🎯 安全设计原则

- **最小权限原则**: 只授予必要的权限
- **深度防御**: 多层安全防护
- **零信任架构**: 不信任任何内部或外部实体
- **安全默认**: 默认采用最安全配置

## 🔒 核心安全特性

| 特性 | 状态 | 说明 |
|------|------|------|
| API Key 隐藏 | ✅ | 只在服务器端，不暴露给前端 |
| API 路由代理 | ✅ | `/api/scan` 代理所有 RPC 请求 |
| 访问限流 | ✅ | 10 次/分钟，防止滥用 |
| 服务器端环境变量 | ✅ | 无 `NEXT_PUBLIC_` 前缀 |
| IP 追踪 | ✅ | 记录请求来源 |
| 输入验证 | ✅ | 验证所有输入参数 |
| 错误处理 | ✅ | 不泄露敏感信息 |

## 🏗️ 安全架构设计

### 整体安全架构

```
┌─────────────────────────────────────────────────────────────┐
│                         用户浏览器                           │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  前端 JavaScript                                     │   │
│  │  ❌ 没有 API Key                                    │   │
│  │  ❌ 没有 RPC 端点                                   │   │
│  │  ✅ 只调用自己的 API                                │   │
│  └──────────────┬──────────────────────────────────────┘   │
│                 │                                           │
│                 │ POST /api/scan                            │
│                 │                                           │
└─────────────────┼───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│              Vercel Edge Network (服务器端)                  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  API Route: /app/api/scan/route.ts                    │ │
│  │  🔒 环境变量: HELIUS_API_KEY (服务器端专用)         │ │
│  │  ✅ IP 限流                                           │ │
│  │  ✅ 访问日志                                          │ │
│  │  ✅ 输入验证                                          │ │
│  └───────────────┬───────────────────────────────────────┘ │
│                  │                                          │
│                  │ 使用服务器端 API Key                      │
│                  │                                          │
└──────────────────┼──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│              Solana RPC (Helius)                            │
│  https://mainnet.helius-rpc.com/?api-key=xxx               │
└─────────────────────────────────────────────────────────────┘
```

### 安全层次

1. **前端安全层**
   - 输入验证和清理
   - XSS 防护
   - CSRF 防护
   - 内容安全策略 (CSP)

2. **API 安全层**
   - 身份验证
   - 授权控制
   - 速率限制
   - 输入验证

3. **数据安全层**
   - 敏感数据加密
   - 安全存储
   - 传输加密

4. **基础设施安全层**
   - 网络安全
   - 访问控制
   - 监控和日志

## 🔐 环境变量安全

### 客户端 vs 服务器端

#### 客户端环境变量 (NEXT_PUBLIC_*)
```bash
# 前端可见，用户能看到
NEXT_PUBLIC_VERSION_MAJOR=1
NEXT_PUBLIC_VERSION_MINOR=0
NEXT_PUBLIC_VERSION_COMMIT_TIME=10-28 21:30
```

**特点**:
- 必须有 `NEXT_PUBLIC_` 前缀
- 构建时嵌入到 JavaScript 代码中
- 浏览器可以访问
- 用于非敏感信息（版本号、公开配置）

#### 服务器端环境变量 (无前缀)
```bash
# 服务器专用，用户看不到
HELIUS_API_KEY=08108945-f5b2-4aa4-8453-58e16774c9ba
SOLANA_CLUSTER=mainnet
DATABASE_URL=postgresql://...
```

**特点**:
- **没有** `NEXT_PUBLIC_` 前缀
- 只在服务器端可用
- 浏览器完全访问不到
- 用于敏感信息（API Key、密码、密钥）

### 安全配置示例

#### 安全的环境变量配置
```bash
# public.env (公开配置)
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

## 🛡️ API 安全设计

### API 路由安全

```typescript
// app/api/scan/route.ts
export async function POST(request: Request) {
  try {
    // 1. 输入验证
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // 2. 速率限制
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(clientIP)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    // 3. 使用服务器端环境变量
    const apiKey = process.env.HELIUS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // 4. 代理请求到 Solana RPC
    const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    // 5. 返回结果（不暴露 API Key）
    return NextResponse.json(await response.json());
  } catch (error) {
    // 6. 安全错误处理
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### 速率限制实现

```typescript
// 简单的内存速率限制
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // 每分钟 10 次
const WINDOW_MS = 60 * 1000; // 1 分钟

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return false;
  }

  if (record.count >= RATE_LIMIT) {
    return true;
  }

  record.count++;
  return false;
}
```

## 🔍 安全验证

### 部署前验证

```bash
# 1. 检查环境变量
cat public.env | grep -v "NEXT_PUBLIC"
# ✅ 应该看到 HELIUS_API_KEY=xxx
# ❌ 不应该看到 NEXT_PUBLIC_HELIUS_API_KEY

# 2. 检查 API Key 未泄露
npm run build && grep -r "08108945" .next/
# ✅ 应该没有输出

# 3. 检查 .gitignore
cat .gitignore | grep public.env
# ✅ 应该不包含 public.env（允许上传）
```

### 部署后验证

#### 1. API Key 不可见
```javascript
// 在浏览器控制台执行
console.log(process.env.NEXT_PUBLIC_HELIUS_API_KEY);
// ✅ 应该输出: undefined
```

#### 2. 网络请求检查
- 打开 DevTools → Network
- 点击"开始扫描"
- 查看请求：
  ```
  ✅ 应该只看到: POST /api/scan
  ❌ 不应该看到: https://mainnet.helius-rpc.com/?api-key=...
  ```

#### 3. 源代码检查
```bash
# 部署后，查看前端代码
curl https://your-app.vercel.app/_next/static/chunks/app/page.js

# ✅ 不应该包含 API Key
# ✅ 不应该包含 "08108945"
```

## ⚠️ 常见安全错误

### 错误 1: API Key 仍然暴露

**症状**:
```javascript
console.log(process.env.NEXT_PUBLIC_HELIUS_API_KEY);
// 输出: "08108945-..."  ❌ 不应该有输出
```

**原因**: 使用了 `NEXT_PUBLIC_` 前缀

**修复**:
```bash
# 1. 编辑 public.env，确保使用正确的配置
# public.env 应该包含 NEXT_PUBLIC_ 前缀的公开配置

# 2. 清除构建缓存
rm -rf .next

# 3. 重新构建
npm run build
```

### 错误 2: Vercel 部署后 API 失败

**症状**:
```
Error: API Key not configured
```

**原因**: 没有在 Vercel 配置环境变量

**修复**:
1. 访问 Vercel 项目设置
2. 添加 `HELIUS_API_KEY` 环境变量
3. 重新部署

### 错误 3: 限流触发太快

**症状**:
```
请求过于频繁，请稍后再试
```

**原因**: 限流设置太严格（10次/分钟）

**修复**:
编辑 `app/api/scan/route.ts`:
```typescript
const RATE_LIMIT = 30; // 改为 30 次/分钟
```

## 🔐 安全最佳实践

### 1. 绝对不要

- ❌ 不要在前端代码中硬编码 API Key
- ❌ 不要给敏感信息加 `NEXT_PUBLIC_` 前缀
- ❌ 不要提交包含敏感信息的 `.env.local` 到 Git
- ❌ 不要在公开场合分享 API Key
- ❌ 不要在错误信息中泄露敏感信息

### 2. 务必要

- ✅ 使用服务器端环境变量存储 API Key
- ✅ 通过 API Routes 代理敏感请求
- ✅ `public.env` 可以安全上传到 Git
- ✅ 定期轮换 API Key
- ✅ 实施输入验证和清理
- ✅ 使用 HTTPS 传输
- ✅ 记录和监控安全事件

### 3. 项目结构安全

```
前端 (app/page.tsx)
  ↓ 调用
API Route (app/api/scan/route.ts)
  ↓ 使用服务器端环境变量
  ↓ API Key 不暴露给用户
Solana RPC (Helius)
```

## 📊 安全监控

### 日志记录

```typescript
// 安全事件日志
console.log(`[SECURITY] 扫描请求来自: ${clientIP}`);
console.log(`[SECURITY] 使用 RPC: ${rpcUrl}`);
console.log(`[SECURITY] 获取到 ${accountCount} 个账户`);
```

### 监控指标

- API 调用频率
- 错误率
- 响应时间
- 异常访问模式

### 告警设置

- 异常高频访问
- 大量错误请求
- 可疑 IP 地址
- API Key 使用异常

## 🔄 安全更新流程

### 更新 API Key

1. 更新 Rust 后端配置:
   ```bash
   vim /home/lc/luckee_dao/solana-liquidation-bot/env/.info
   # 修改或添加 API Key
   ```

2. 重新同步:
   ```bash
   cd /home/lc/luckee_dao/solana-liquidation-dashboard
   ./sync-config.sh
   ```

3. 更新 Vercel 环境变量:
   - Vercel Dashboard → Settings → Environment Variables
   - 更新 `HELIUS_API_KEY`
   - 重新部署

### 安全补丁

1. 定期更新依赖包
2. 检查安全漏洞
3. 应用安全补丁
4. 重新测试和部署

## 📚 相关文档

- [系统架构设计](system-architecture.md)
- [技术栈说明](tech-stack.md)
- [数据流设计](data-flow.md)
- [部署安全指南](../deployment/vercel.md)

---

**文档版本**: v2.0.0  
**最后更新**: 2025-01-29  
**审核状态**: ✅ 已审核
