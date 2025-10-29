# 🚀 Solana 清算机器人 Web Dashboard

一个基于 Next.js 的 Solana 清算机器人 Web 应用，实时扫描 Solend 协议的清算机会。

## ✨ 功能特性

- ✅ 实时扫描 Solana Mainnet 上的 Solend 账户
- ✅ 可视化展示清算机会
- ✅ 健康因子计算和风险评估
- ✅ 响应式设计，支持移动端
- ✅ 部署到 Vercel，完全免费运行

## 🛠️ 技术栈

- **框架**: Next.js 14 (React 18)
- **语言**: TypeScript
- **样式**: TailwindCSS
- **区块链**: Solana Web3.js
- **RPC**: Helius API
- **部署**: Vercel

## 📦 安装

```bash
# 安装依赖
npm install

# 或使用 yarn
yarn install
```

## 🚀 运行

```bash
# 开发模式
npm run dev

# 生产构建
npm run build
npm run start
```

访问 http://localhost:3000

## 📊 使用说明

1. 打开页面
2. 点击"开始扫描"按钮
3. 等待扫描完成（通常 2-5 秒）
4. 查看账户列表和清算机会

## 🌐 部署到 Vercel

### 方法 1: 命令行部署

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel

# 生产环境部署
vercel --prod
```

### 方法 2: GitHub 集成

1. 将代码推送到 GitHub
2. 访问 [vercel.com](https://vercel.com)
3. 导入 GitHub 仓库
4. 点击 Deploy
5. 完成！

部署完成后，您将获得一个公网 URL，例如：
`https://solana-liquidation-dashboard.vercel.app`

## 📝 配置

### 环境变量

创建 `public.env` 文件（可选）:

```env
NEXT_PUBLIC_HELIUS_API_KEY=your-api-key-here
NEXT_PUBLIC_RPC_ENDPOINT=https://mainnet.helius-rpc.com
```

当前已内置 Helius API Key，可直接使用。

## 🎯 功能说明

### 统计卡片
- **总账户数**: Solend 程序上的 Obligation 账户总数
- **可清算账户**: 健康因子 < 1.05 的账户
- **健康账户**: 健康因子 >= 1.05 的账户
- **总盈利潜力**: 所有可清算账户的预估盈利总和

### 账户列表
- **账户地址**: Solana 公钥地址
- **抵押品**: 抵押资产价值（USD）
- **借款**: 借出资产价值（USD）
- **抵押率**: 抵押品/借款 × 100%
- **健康因子**: 抵押品价值/借款价值
- **状态**: 可清算/健康
- **潜在盈利**: 清算奖励（5%）

## 🎨 自定义

### 修改颜色主题

编辑 `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
    }
  }
}
```

### 修改扫描逻辑

编辑 `lib/solend.ts` 中的 `scanSolendAccounts` 函数。

### 添加新协议

1. 在 `lib/` 创建新文件（如 `mango.ts`）
2. 实现扫描逻辑
3. 在 `app/page.tsx` 中集成

## 🔧 故障排除

### 扫描失败

1. 检查网络连接
2. 确认 Helius API Key 有效
3. 查看浏览器控制台日志

### 部署失败

1. 确保 `package.json` 配置正确
2. 检查 Next.js 版本兼容性
3. 查看 Vercel 部署日志

## 📱 移动端支持

应用已针对移动端优化，支持：
- 📱 iOS Safari
- 📱 Android Chrome
- 📱 响应式布局

## 🌟 未来计划

- [ ] 添加更多协议支持（Mango、Kamino）
- [ ] 实时数据刷新
- [ ] 清算历史记录
- [ ] 钱包连接和一键清算
- [ ] 数据导出功能
- [ ] 价格图表可视化

## 📄 许可证

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系

如有问题，请提交 Issue。

---

**创建时间**: 2025-10-28  
**版本**: 1.0.0  
**状态**: ✅ 可用

