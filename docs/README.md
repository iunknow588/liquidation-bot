# 📚 Solana 清算机器人 - 文档中心

## 📖 文档概览

本文档中心包含 Solana 清算机器人项目的完整技术文档，涵盖架构设计、API 接口、测试方案、部署指南等各个方面。

## 🗂️ 文档结构

### 🏗️ 架构设计 (`architecture/`)
- [系统架构设计](architecture/system-architecture.md) - 整体架构和组件关系
- [技术栈说明](architecture/tech-stack.md) - 使用的技术和工具
- [数据流设计](architecture/data-flow.md) - 数据流转和处理逻辑
- [安全架构](architecture/security.md) - 安全机制和风险控制

### 🔌 API 接口 (`api/`)
- [API 概览](api/overview.md) - API 接口总览
- [扫描接口](api/scan-api.md) - 清算机会扫描接口
- [交易接口](api/transaction-api.md) - 交易执行接口
- [监控接口](api/monitoring-api.md) - 后台监控接口

### 🧪 测试方案 (`testing/`)
- [测试策略](testing/test-strategy.md) - 测试方法和策略
- [单元测试](testing/unit-tests.md) - 单元测试用例
- [集成测试](testing/integration-tests.md) - 集成测试方案
- [端到端测试](testing/e2e-tests.md) - 端到端测试流程

### 🚀 部署指南 (`deployment/`)
- [部署概览](deployment/overview.md) - 部署方案总览
- [Vercel 部署](deployment/vercel.md) - Vercel 平台部署
- [环境配置](deployment/environment.md) - 环境变量配置
- [监控运维](deployment/monitoring.md) - 生产环境监控

### 👥 用户指南 (`user-guide/`)
- [快速开始](user-guide/quick-start.md) - 快速上手指南
- [功能说明](user-guide/features.md) - 详细功能说明
- [操作手册](user-guide/operations.md) - 操作步骤指南
- [常见问题](user-guide/faq.md) - 常见问题解答

### 🛠️ 开发指南 (`development/`)
- [开发环境](development/setup.md) - 开发环境搭建
- [代码规范](development/coding-standards.md) - 代码编写规范
- [贡献指南](development/contributing.md) - 贡献代码指南
- [版本管理](development/versioning.md) - 版本发布管理

## 📋 现有文档整理

### 已整理的文档
以下文档已从项目根目录整理到 docs 目录：

#### 部署相关
- `DEPLOYMENT_GUIDE.md` → `deployment/vercel.md`
- `Vercel环境变量配置指南.md` → `deployment/environment.md`
- `Vercel自动部署说明.md` → `deployment/vercel.md`
- `部署指南.md` → `deployment/overview.md`

#### 开发相关
- `快速启动.sh` → `development/setup.md`
- `版本管理说明.md` → `development/versioning.md`
- `快速修复.md` → `user-guide/troubleshooting.md`

#### 安全相关
- `安全部署指南.md` → `architecture/security.md`
- `验证RPC连接功能.md` → `testing/integration-tests.md`

#### 项目说明
- `README.md` → 保留在根目录作为项目入口
- `ENHANCED_README.md` → 整合到用户指南
- `INTEGRATION_SUMMARY.md` → 整合到架构文档
- `FINAL_SUMMARY.md` → 整合到项目概览

## 🎯 文档原则

### 1. 单一职责
每个文档只负责一个特定领域，避免内容重复和混淆。

### 2. 逻辑一致
所有文档遵循统一的逻辑结构和命名规范。

### 3. 可实现性
文档中的方案和步骤都是经过验证的，可以直接执行。

### 4. 可验证性
每个功能都有对应的测试用例和验证方法。

### 5. 可维护性
文档结构清晰，便于后续更新和维护。

## 📋 文档维护

- **更新频率**: 随代码变更同步更新
- **版本控制**: 与代码版本保持一致
- **审核流程**: 重要文档需要技术审核
- **反馈机制**: 欢迎提出改进建议

## 🔗 相关链接

- [项目仓库](https://github.com/your-username/solana-liquidation-dashboard)
- [在线演示](https://your-demo-url.vercel.app)
- [问题反馈](https://github.com/your-username/solana-liquidation-dashboard/issues)

---

**文档版本**: v2.0.0  
**最后更新**: 2025-01-29  
**维护者**: 开发团队
