# 🔧 Vercel 环境变量配置指南

## 🎯 问题说明

**症状**: 
- ✅ 本地 `npm run dev` 显示：`v1.0.0 (10-28 21:30)`
- ❌ Vercel 线上显示：`v?.?.?` 或 `v1.0.0` (无时间)

**原因**: 
Vercel 环境变量未配置。Next.js 在构建时需要 `NEXT_PUBLIC_*` 环境变量，但 Vercel 上没有这些变量。

---

## ✅ 解决方案：手动配置 Vercel 环境变量

### 步骤 1: 访问 Vercel Dashboard

1. 打开浏览器，访问：https://vercel.com/dashboard
2. 登录您的 Vercel 账号
3. 找到项目：`solana-liquidation-dashboard` 或 `liquidation-bot`
4. 点击进入项目

### 步骤 2: 进入环境变量设置

```
Project → Settings → Environment Variables
```

或直接访问（替换项目名称）：
```
https://vercel.com/[你的用户名]/[项目名]/settings/environment-variables
```

### 步骤 3: 添加环境变量

**重要**: 每个变量都要添加到 **3 个环境**：
- ✅ Production
- ✅ Preview  
- ✅ Development

#### 需要添加的变量（共 10 个）

##### 1. 版本信息（前端可见，必须有 NEXT_PUBLIC_ 前缀）

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NEXT_PUBLIC_VERSION_MAJOR` | `1` | 主版本号 |
| `NEXT_PUBLIC_VERSION_MINOR` | `0` | 次版本号 |
| `NEXT_PUBLIC_VERSION_PATCH` | `0` | 补丁号 |
| `NEXT_PUBLIC_VERSION_PREFIX` | `v` | 版本前缀 |
| `NEXT_PUBLIC_VERSION_COMMIT_TIME` | `10-28 21:30` | ⭐ 提交时间（关键） |

##### 2. Solana 配置（服务器端）

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `SOLANA_CLUSTER` | `mainnet` | 当前集群 |
| `SOLANA_MAINNET_RPC` | `https://api.mainnet-beta.solana.com` | Mainnet RPC |
| `SOLANA_DEVNET_RPC` | `https://api.devnet.solana.com` | Devnet RPC |
| `SOLANA_TESTNET_RPC` | `https://api.testnet.solana.com` | Testnet RPC |

##### 3. API 密钥（服务器端，私密）

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `HELIUS_API_KEY` | `08108945-f5b2-4aa4-8453-58e16774c9ba` | Helius API Key |

### 步骤 4: 详细添加步骤（以第一个变量为例）

1. 点击 **"Add New"** 按钮

2. 填写表单：
   ```
   Name (变量名):
   NEXT_PUBLIC_VERSION_MAJOR
   
   Value (值):
   1
   
   Environments (环境):
   ☑ Production
   ☑ Preview
   ☑ Development
   ```

3. 点击 **"Save"** 保存

4. 重复以上步骤，添加所有 10 个变量

### 步骤 5: 验证环境变量

添加完成后，在 Environment Variables 页面应该看到：

```
✅ NEXT_PUBLIC_VERSION_MAJOR        1                    Production, Preview, Development
✅ NEXT_PUBLIC_VERSION_MINOR        0                    Production, Preview, Development
✅ NEXT_PUBLIC_VERSION_PATCH        0                    Production, Preview, Development
✅ NEXT_PUBLIC_VERSION_PREFIX       v                    Production, Preview, Development
✅ NEXT_PUBLIC_VERSION_COMMIT_TIME  10-28 21:30         Production, Preview, Development
✅ SOLANA_CLUSTER                   mainnet              Production, Preview, Development
✅ SOLANA_MAINNET_RPC               https://api...       Production, Preview, Development
✅ SOLANA_DEVNET_RPC                https://api...       Production, Preview, Development
✅ SOLANA_TESTNET_RPC               https://api...       Production, Preview, Development
✅ HELIUS_API_KEY                   081089...           Production, Preview, Development
```

### 步骤 6: 触发重新部署

**重要**: 添加环境变量后必须重新部署！

#### 方式 1: 通过 Vercel Dashboard（推荐）

1. 回到项目主页
2. 进入 **"Deployments"** 标签
3. 找到最新的部署记录
4. 点击右侧的 **"..." (三个点)** 菜单
5. 选择 **"Redeploy"**
6. 确认 **"Redeploy"**

#### 方式 2: 通过 Git 推送

```bash
cd /home/lc/luckee_dao/solana-liquidation-dashboard

# 创建一个空提交触发部署
git commit --allow-empty -m "chore: 触发重新部署以应用环境变量"
git push origin master
```

#### 方式 3: 通过 Vercel CLI

```bash
cd /home/lc/luckee_dao/solana-liquidation-dashboard
vercel --prod --yes
```

### 步骤 7: 等待部署完成

1. 查看部署状态：
   - Dashboard → Deployments
   - 等待状态变为 **"Ready"** (通常 2-3 分钟)

2. 查看部署日志：
   - 点击部署记录
   - 查看 **"Building"** 和 **"Deployment"** 日志
   - 确认无错误

### 步骤 8: 验证结果

#### 8.1 访问调试页面

```
https://sbot.cdao.online/debug
```

**预期结果**：
```json
{
  "VERSION_MAJOR": "1",
  "VERSION_MINOR": "0", 
  "VERSION_PATCH": "0",
  "VERSION_PREFIX": "v",
  "VERSION_COMMIT_TIME": "10-28 21:30"
}

组合版本号: v1.0.0 (10-28 21:30)
```

如果显示 `"?"` 或 `undefined`，说明环境变量还没生效，需要重新部署。

#### 8.2 访问主页

```
https://sbot.cdao.online/
```

**预期结果**：
```
标题显示: 🚀 Solana 清算机器人 [ v1.0.0 (10-28 21:30) ]
                                     ↑              ↑
                                  版本号        提交时间
```

---

## ⚠️ 常见问题和解决方案

### Q1: 添加变量后还是显示 v?.?.?

**原因**: 没有重新部署，或部署还在进行中

**解决**:
1. 确认已触发重新部署
2. 等待部署完成（2-3 分钟）
3. 清除浏览器缓存（Ctrl+Shift+R 或 Cmd+Shift+R）
4. 访问 /debug 页面验证

### Q2: 部署成功但还是不显示

**原因**: 环境变量没有添加到 Production 环境

**解决**:
1. 返回 Environment Variables 页面
2. 检查每个变量是否勾选了 **"Production"**
3. 如果没有，点击变量右侧的 **"Edit"**
4. 勾选 **"Production"**
5. 保存并重新部署

### Q3: 只显示版本号，不显示时间

**原因**: `NEXT_PUBLIC_VERSION_COMMIT_TIME` 变量未添加或值为空

**解决**:
1. 检查该变量是否存在
2. 确认值为 `10-28 21:30` (注意格式，不要有引号)
3. 确认勾选了所有 3 个环境
4. 重新部署

### Q4: 如何检查变量是否正确设置？

**方法 1**: 访问 /debug 页面
```
https://sbot.cdao.online/debug
```

**方法 2**: 查看 Vercel 构建日志
```
Dashboard → Deployments → [最新部署] → Building
```
查找包含环境变量的日志行

**方法 3**: 使用 Vercel CLI
```bash
vercel env ls
```

---

## 📋 快速配置清单

使用此清单确保所有步骤完成：

- [ ] 访问 Vercel Dashboard
- [ ] 进入项目 → Settings → Environment Variables
- [ ] 添加 `NEXT_PUBLIC_VERSION_MAJOR` (值: `1`)
- [ ] 添加 `NEXT_PUBLIC_VERSION_MINOR` (值: `0`)
- [ ] 添加 `NEXT_PUBLIC_VERSION_PATCH` (值: `0`)
- [ ] 添加 `NEXT_PUBLIC_VERSION_PREFIX` (值: `v`)
- [ ] 添加 `NEXT_PUBLIC_VERSION_COMMIT_TIME` (值: `10-28 21:30`) ⭐
- [ ] 添加 `SOLANA_CLUSTER` (值: `mainnet`)
- [ ] 添加 `SOLANA_MAINNET_RPC`
- [ ] 添加 `SOLANA_DEVNET_RPC`
- [ ] 添加 `SOLANA_TESTNET_RPC`
- [ ] 添加 `HELIUS_API_KEY`
- [ ] 确认每个变量都勾选了 3 个环境
- [ ] 触发重新部署
- [ ] 等待部署完成 (2-3 分钟)
- [ ] 访问 https://sbot.cdao.online/debug 验证
- [ ] 访问 https://sbot.cdao.online/ 查看标题

---

## 🎯 关键要点

### 1. NEXT_PUBLIC_ 前缀很重要
```
❌ VERSION_MAJOR=1              (前端读不到)
✅ NEXT_PUBLIC_VERSION_MAJOR=1  (前端可以读取)
```

### 2. 必须添加到 3 个环境
```
☑ Production   (生产环境，必须)
☑ Preview      (预览环境，推荐)
☑ Development  (开发环境，推荐)
```

### 3. 添加变量后必须重新部署
```
添加变量 → 不会自动生效
添加变量 → 重新部署 → 才会生效
```

### 4. 时间格式要正确
```
✅ 10-28 21:30  (正确)
❌ 10-28-21:30  (错误，多了一个-)
❌ 2025-10-28 21:30  (错误，包含年份)
```

---

## 🔄 环境变量更新流程

当需要更新版本时：

```bash
# 1. 修改本地配置
vim solana-liquidation-bot/env/.info
# 更新 commit_time=10-29 15:45

# 2. 同步到前端
cd solana-liquidation-dashboard
./sync-config.sh

# 3. 更新 Vercel 环境变量
# 访问 Dashboard → Settings → Environment Variables
# 找到 NEXT_PUBLIC_VERSION_COMMIT_TIME
# 点击 Edit → 修改值为 10-29 15:45 → Save

# 4. 重新部署
git commit --allow-empty -m "chore: 更新版本"
git push origin master

# 或直接
vercel --prod --yes
```

---

## 📞 需要帮助？

如果按照上述步骤仍无法解决：

1. **截图检查**：
   - Environment Variables 页面截图
   - /debug 页面显示截图
   - 主页标题截图

2. **日志检查**：
   - Vercel Deployment logs
   - 浏览器 Console (F12)

3. **确认事项**：
   - 是否所有 10 个变量都已添加
   - 是否都勾选了 Production
   - 是否已重新部署
   - 部署是否成功完成

---

**立即执行**: 访问 https://vercel.com/dashboard 开始配置环境变量！

