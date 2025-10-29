# 🛠️ 开发环境搭建

## 📋 概述

本指南将帮助开发者快速搭建 Solana 清算机器人的开发环境，整合了所有开发相关的文档内容。

## 🎯 系统要求

### 硬件要求
- **CPU**: 2 核心以上
- **内存**: 8GB 以上
- **存储**: 10GB 可用空间
- **网络**: 稳定的互联网连接

### 软件要求
- **Node.js**: 18.x 或更高版本
- **npm**: 9.x 或更高版本
- **Git**: 2.x 或更高版本
- **浏览器**: Chrome 88+, Firefox 85+, Safari 14+

## 🔧 环境安装

### 1. 安装 Node.js
```bash
# 使用 nvm 安装 Node.js (推荐)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# 或直接下载安装
# 访问 https://nodejs.org 下载 LTS 版本
```

### 2. 验证安装
```bash
node --version  # 应该显示 v18.x.x
npm --version   # 应该显示 9.x.x
```

### 3. 安装 Git
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install git

# macOS
brew install git

# Windows
# 下载 Git for Windows
```

## 📦 项目设置

### 1. 克隆项目
```bash
git clone https://github.com/your-username/solana-liquidation-dashboard.git
cd solana-liquidation-dashboard
```

### 2. 安装依赖
```bash
npm install
```

### 3. 环境变量配置
```bash
# 复制环境变量模板
cp env.example public.env

# 编辑环境变量
nano public.env
```

### 4. 环境变量内容
```bash
# RPC 配置
NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_NETWORK=mainnet

# Helius API (可选)
NEXT_PUBLIC_HELIUS_API_KEY=your-helius-api-key

# 调试模式
NEXT_PUBLIC_DEBUG=true
```

## 🚀 启动开发服务器

### 1. 启动开发模式
```bash
npm run dev
```

### 2. 访问应用
打开浏览器访问：
```
http://localhost:3000
```

### 3. 热重载
修改代码后，页面会自动刷新。

## 🔧 开发工具配置

### 1. VS Code 配置
创建 `.vscode/settings.json`：
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### 2. 推荐插件
- **ES7+ React/Redux/React-Native snippets**
- **TypeScript Importer**
- **Tailwind CSS IntelliSense**
- **Prettier - Code formatter**
- **ESLint**

### 3. 代码格式化
创建 `.prettierrc`：
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

## 🧪 测试环境

### 1. 运行测试
```bash
# 运行所有测试
npm test

# 运行单元测试
npm run test:unit

# 运行集成测试
npm run test:integration

# 运行端到端测试
npm run test:e2e

# 生成测试覆盖率报告
npm run test:coverage
```

### 2. 测试配置
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
  ],
};
```

## 🔍 调试配置

### 1. Chrome 调试
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/next/dist/bin/next",
      "args": ["dev"],
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### 2. 网络调试
- 使用 Chrome DevTools 的 Network 面板
- 监控 API 请求和响应
- 检查 WebSocket 连接

### 3. 状态调试
- 使用 React DevTools
- 检查组件状态和 props
- 监控状态变化

## 📊 代码质量

### 1. ESLint 配置
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    '@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'error',
  },
};
```

### 2. TypeScript 配置
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 3. 代码检查
```bash
# 检查代码质量
npm run lint

# 自动修复可修复的问题
npm run lint:fix

# 类型检查
npm run type-check
```

## 🔄 版本控制

### 1. Git 配置
```bash
# 设置用户信息
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 设置默认分支
git config --global init.defaultBranch main
```

### 2. 分支策略
```bash
# 创建功能分支
git checkout -b feature/new-feature

# 创建修复分支
git checkout -b hotfix/bug-fix

# 创建发布分支
git checkout -b release/v1.0.0
```

### 3. 提交规范
```bash
# 功能提交
git commit -m "feat: add wallet connection feature"

# 修复提交
git commit -m "fix: resolve scanning timeout issue"

# 文档提交
git commit -m "docs: update API documentation"

# 样式提交
git commit -m "style: format code with prettier"
```

## 🚀 构建和部署

### 1. 本地构建
```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 导出静态文件
npm run export
```

### 2. 部署到 Vercel
```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 部署到预览环境
vercel

# 部署到生产环境
vercel --prod
```

## 🐛 常见问题

### 1. 依赖安装失败
**问题**: npm install 失败
**解决方案**:
```bash
# 清理缓存
npm cache clean --force

# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 2. 端口被占用
**问题**: 端口 3000 被占用
**解决方案**:
```bash
# 查找占用端口的进程
lsof -ti:3000

# 杀死进程
kill -9 $(lsof -ti:3000)

# 或使用其他端口
npm run dev -- -p 3001
```

### 3. 类型错误
**问题**: TypeScript 类型错误
**解决方案**:
- 检查类型定义
- 更新 @types 包
- 添加类型断言

### 4. 钱包连接问题
**问题**: 钱包无法连接
**解决方案**:
- 检查钱包插件是否安装
- 确保钱包已解锁
- 刷新页面重试

## 📚 相关文档

- [代码规范](coding-standards.md)
- [贡献指南](contributing.md)
- [版本管理](versioning.md)
- [API 文档](../api/overview.md)

---

**文档版本**: v2.0.0  
**最后更新**: 2025-01-29  
**审核状态**: ✅ 已审核
