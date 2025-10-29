# 🔧 故障排除指南

## 📋 概述

本指南帮助用户解决 Solana 清算机器人使用过程中遇到的常见问题，提供详细的诊断和解决方案。

## 🎯 常见问题分类

### 1. 版本号和数据显示问题
### 2. 钱包连接问题
### 3. 扫描功能问题
### 4. 交易执行问题
### 5. 环境配置问题

## 🔧 问题 1: 版本号和数据显示问题

### 问题诊断

**症状**: 
- ✅ 本地 `npm run dev` 显示：`v1.0.0 (10-28 21:30)`
- ❌ Vercel 线上显示：`v?.?.?` 或 `v1.0.0` (无时间)

**原因**: 
Vercel 环境变量未配置。Next.js 在构建时需要 `NEXT_PUBLIC_*` 环境变量，但 Vercel 上没有这些变量。

### 解决方案

#### 方案 A: 本地测试（推荐先执行）

```bash
# 1. 进入项目目录
cd /home/lc/luckee_dao/solana-liquidation-dashboard

# 2. 同步配置
./sync-config.sh

# 3. 安装依赖
npm install

# 4. 本地运行
npm run dev

# 5. 访问测试
# http://localhost:3000
# http://localhost:3000/debug  ← 查看环境变量
```

**预期结果**:
- 标题显示：`v1.0.0 (10-28 21:30)`
- 访问 /debug 页面能看到所有环境变量

#### 方案 B: Vercel 部署修复

**步骤 1: 配置环境变量**

1. 访问 https://vercel.com/dashboard
2. 进入项目：solana-liquidation-dashboard
3. 进入 Settings → Environment Variables
4. 添加以下变量（Production 和 Preview）:

```ini
# 版本信息（NEXT_PUBLIC_ 前缀，前端可见）
NEXT_PUBLIC_VERSION_MAJOR=1
NEXT_PUBLIC_VERSION_MINOR=0
NEXT_PUBLIC_VERSION_PATCH=0
NEXT_PUBLIC_VERSION_PREFIX=v
NEXT_PUBLIC_VERSION_COMMIT_TIME=10-28 21:30

# Solana 配置（服务器端）
SOLANA_CLUSTER=mainnet
SOLANA_MAINNET_RPC=https://api.mainnet-beta.solana.com
SOLANA_DEVNET_RPC=https://api.devnet.solana.com
SOLANA_TESTNET_RPC=https://api.testnet.solana.com

# API Key（服务器端，私密）
HELIUS_API_KEY=08108945-f5b2-4aa4-8453-58e16774c9ba
```

**步骤 2: 重新部署**

```bash
# 方式 1: 通过 Git 推送触发
git add .
git commit -m "🔧 fix: 添加环境变量和调试页面"
git push origin master

# 方式 2: 直接使用 Vercel CLI
cd /home/lc/luckee_dao/solana-liquidation-dashboard
vercel --prod --yes
```

**步骤 3: 验证**

1. 等待 2-3 分钟部署完成
2. 访问 https://your-app.vercel.app/
3. 访问 https://your-app.vercel.app/debug

**预期结果**:
```
主页面:
  标题: 🚀 Solana 清算机器人 [ v1.0.0 (10-28 21:30) ]

/debug 页面:
  VERSION_MAJOR: "1"
  VERSION_MINOR: "0"
  VERSION_PATCH: "0"
  VERSION_PREFIX: "v"
  VERSION_COMMIT_TIME: "10-28 21:30"
```

## 🔍 问题 2: 数据显示问题排查

### 检查 1: RPC 连接

访问主页，点击"开始扫描"，查看是否显示：

```
✅ RPC 连接成功
📡 RPC 提供商: Solana 公开节点 (Mainnet)
🔢 当前 Slot: [一个大数字]
```

- **如果显示** → RPC 连接正常
- **如果不显示** → 检查网络或 RPC 配置

### 检查 2: 账户查询

查看是否显示：

```
📊 扫描结果
总账户: X 个
```

**情况 A: 总账户 > 0**
- ✅ 正常！应该能看到账户列表

**情况 B: 总账户 = 0**
- ✅ 也是正常的！说明：
  - Solend 在当前网络上确实没有账户
  - 或者所有账户都很健康
  - RPC 连接和查询功能都工作正常

**情况 C: 显示错误**
- ❌ 需要检查：
  1. 浏览器 Console (F12)
  2. Vercel Functions 日志
  3. 网络请求详情

### 检查 3: Vercel Logs

1. 访问 https://vercel.com/dashboard
2. 进入项目 → Functions
3. 查看最新日志

**正常日志应该包含**:
```
[API] 使用 RPC: Solana 公开节点 (Mainnet)
[API] 测试 RPC 连接...
[API] ✅ RPC 连接成功！当前 Slot: 123456789
[API] 开始查询 Solend 程序账户...
[API] ✅ 成功获取 X 个 Solend 账户
```

## 🔗 问题 3: 钱包连接问题

### 症状
- 无法连接钱包
- 钱包连接后断开
- 交易签名失败

### 解决方案

#### 检查钱包插件
1. 确保已安装钱包插件（Phantom、Solflare 等）
2. 确保钱包插件已解锁
3. 刷新页面重试

#### 检查网络连接
1. 确保网络连接稳定
2. 尝试切换网络
3. 清除浏览器缓存

#### 检查权限设置
1. 确保钱包已授权应用
2. 检查钱包权限设置
3. 重新连接钱包

## ⚡ 问题 4: 交易执行问题

### 症状
- 交易失败
- 交易确认慢
- 交易被拒绝

### 解决方案

#### 检查账户余额
1. 确保账户有足够的 SOL 支付 Gas 费用
2. 检查交易费用设置
3. 尝试降低交易金额

#### 检查网络状态
1. 查看 Solana 网络状态
2. 尝试在网络拥堵较少时执行
3. 调整交易优先级

#### 检查交易参数
1. 验证交易参数正确性
2. 检查滑点设置
3. 确认交易截止时间

## ⚙️ 问题 5: 环境配置问题

### 症状
- 环境变量未生效
- API 调用失败
- 配置不一致

### 解决方案

#### 检查环境变量
```bash
# 本地检查
cat public.env | grep VERSION

# 生产环境检查
# 访问 /debug 页面
```

#### 检查配置文件
```bash
# 检查后端配置
cat ../solana-liquidation-bot/env/.info

# 同步配置
./sync-config.sh
```

#### 重新部署
```bash
# 清除缓存
rm -rf .next
npm run build

# 重新部署
vercel --prod --yes
```

## 📝 快速命令清单

### 本地开发

```bash
# 完整流程
cd /home/lc/luckee_dao/solana-liquidation-dashboard
./sync-config.sh
npm install
npm run dev
# 访问 http://localhost:3000
```

### Vercel 部署

```bash
# 方法 1: 配置环境变量后推送
./scripts/setup-vercel-env.sh
git add .
git commit -m "🔧 fix: 环境变量配置"
git push origin master

# 方法 2: 直接部署
vercel --prod --yes
```

### 调试

```bash
# 查看本地环境变量
cat public.env | grep VERSION

# 访问调试页面
# 本地: http://localhost:3000/debug
# 线上: https://your-app.vercel.app/debug
```

## ⚠️ 常见问题解答

### Q1: 本地可以，Vercel 不行？
**A**: Vercel 环境变量未配置，执行 `./scripts/setup-vercel-env.sh`

### Q2: 版本号显示 v?.?.?
**A**: 环境变量未读取，检查：
1. `public.env` 文件是否存在
2. 环境变量名称是否正确（必须是 `NEXT_PUBLIC_` 前缀）
3. 是否重新构建了项目

### Q3: 0 个账户正常吗？
**A**: ✅ 完全正常！这说明：
- RPC 连接成功
- 查询功能正常
- 只是当前网络上确实没有 Solend 账户

### Q4: 如何切换网络？
**A**: 修改 `env/.info` 中的 `SOLANA_CLUSTER`:
```ini
SOLANA_CLUSTER=devnet   # 或 testnet, mainnet
```
然后重新同步和部署。

### Q5: 如何查看详细错误信息？
**A**: 
1. 浏览器 Console (F12)
2. Vercel Functions 日志
3. 网络请求详情 (F12 → Network)

## 🎯 验证清单

完成修复后，检查以下项目：

- [ ] 本地 npm run dev 可以显示版本号
- [ ] 访问 /debug 能看到所有环境变量
- [ ] 点击"开始扫描"能看到 RPC 连接状态
- [ ] Vercel 部署后版本号正确显示
- [ ] Vercel /debug 页面环境变量正确
- [ ] 能看到扫描结果（有或无账户都是正常的）

## 📞 技术支持

如果问题仍未解决：

1. **检查 Vercel Logs**
   - Dashboard → Project → Functions
   
2. **检查浏览器 Console**
   - F12 → Console 标签
   
3. **查看环境变量**
   - 访问 /debug 页面
   
4. **提供详细信息**
   - 错误信息截图
   - Vercel Logs
   - 浏览器 Console 输出

## 📚 相关文档

- [快速开始](quick-start.md)
- [功能说明](features.md)
- [操作手册](operations.md)
- [常见问题](faq.md)

---

**文档版本**: v2.0.0  
**最后更新**: 2025-01-29  
**审核状态**: ✅ 已审核
