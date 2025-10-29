# 🔌 API 接口概览

## 📋 概述

Solana 清算机器人提供完整的 API 接口，支持清算机会扫描、交易执行、后台监控等功能。

## 🎯 API 设计原则

- **RESTful**: 遵循 REST 设计规范
- **类型安全**: 使用 TypeScript 类型定义
- **错误处理**: 统一的错误响应格式
- **版本控制**: 支持 API 版本管理
- **文档完整**: 详细的接口文档

## 📊 API 分类

### 1. 扫描接口 (Scan APIs)
- **GET** `/api/liquidation?action=scan` - 扫描清算机会
- **GET** `/api/liquidation?action=scan&protocol=solend` - 扫描特定协议

### 2. 监控接口 (Monitoring APIs)
- **POST** `/api/liquidation` - 启动/停止监控
- **GET** `/api/liquidation?action=status` - 获取监控状态

### 3. 交易接口 (Transaction APIs)
- **POST** `/api/liquidation/execute` - 执行清算交易
- **POST** `/api/liquidation/flashloan` - 执行闪电贷清算

## 🔧 通用规范

### 请求格式
```typescript
// GET 请求
GET /api/liquidation?action=scan&protocol=solend

// POST 请求
POST /api/liquidation
Content-Type: application/json

{
  "action": "start_monitoring",
  "config": {
    "scanInterval": 30000,
    "maxOpportunities": 50
  }
}
```

### 响应格式
```typescript
// 成功响应
{
  "success": true,
  "data": {
    // 具体数据
  },
  "timestamp": 1640995200000
}

// 错误响应
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid request parameters",
    "details": "Protocol parameter is required"
  },
  "timestamp": 1640995200000
}
```

### 错误代码
| 代码 | 说明 | HTTP 状态码 |
|------|------|-------------|
| `INVALID_REQUEST` | 请求参数无效 | 400 |
| `UNAUTHORIZED` | 未授权访问 | 401 |
| `FORBIDDEN` | 禁止访问 | 403 |
| `NOT_FOUND` | 资源不存在 | 404 |
| `RATE_LIMITED` | 请求频率限制 | 429 |
| `INTERNAL_ERROR` | 服务器内部错误 | 500 |
| `RPC_ERROR` | RPC 调用失败 | 502 |
| `TIMEOUT` | 请求超时 | 504 |

## 📝 类型定义

### 基础类型
```typescript
// 清算机会
interface LiquidationOpportunity {
  address: string;
  protocol: string;
  marketId: string;
  borrower: string;
  collateralToken: string;
  debtToken: string;
  collateralAmount: number;
  debtAmount: number;
  healthFactor: number;
  liquidationThreshold: number;
  estimatedProfit: number;
  gasCost: number;
  timestamp: number;
}

// 扫描结果
interface ScanResult {
  accounts: LiquidationOpportunity[];
  totalAccounts: number;
  liquidatableCount: number;
  healthyCount: number;
  timestamp: number;
  protocols: {
    solend: number;
    mango: number;
    kamino: number;
  };
}

// 清算结果
interface LiquidationResult {
  success: boolean;
  txSignature?: string;
  profit: number;
  gasUsed: number;
  error?: string;
  timestamp: number;
}
```

### 请求类型
```typescript
// 扫描请求
interface ScanRequest {
  action: 'scan';
  protocol?: 'solend' | 'mango' | 'kamino';
  filters?: {
    minProfit?: number;
    maxHealthFactor?: number;
    protocols?: string[];
  };
}

// 监控请求
interface MonitoringRequest {
  action: 'start_monitoring' | 'stop_monitoring';
  config?: {
    scanInterval: number;
    maxOpportunities: number;
    enableNotifications: boolean;
    minProfitThreshold: number;
  };
}

// 交易请求
interface TransactionRequest {
  action: 'execute_liquidation' | 'execute_flashloan';
  opportunity: LiquidationOpportunity;
  params?: {
    priorityFee?: number;
    maxSlippage?: number;
    timeout?: number;
  };
}
```

### 响应类型
```typescript
// 通用响应
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
  timestamp: number;
}

// 扫描响应
interface ScanResponse extends ApiResponse<ScanResult> {}

// 监控响应
interface MonitoringResponse extends ApiResponse<{
  status: 'running' | 'stopped';
  config: MonitoringConfig;
  stats: {
    totalScans: number;
    opportunitiesFound: number;
    lastScanTime: number;
  };
}> {}

// 交易响应
interface TransactionResponse extends ApiResponse<LiquidationResult> {}
```

## 🔐 认证和授权

### 钱包认证
```typescript
// 钱包签名验证
interface WalletAuth {
  publicKey: string;
  signature: string;
  message: string;
  timestamp: number;
}
```

### 权限控制
- **公开接口**: 扫描、状态查询
- **钱包接口**: 交易执行、监控控制
- **管理员接口**: 系统配置、日志查看

## 📊 限流和配额

### 请求限制
- **扫描接口**: 每分钟 60 次
- **交易接口**: 每分钟 10 次
- **监控接口**: 每分钟 5 次

### 配额管理
- **免费用户**: 1000 次/天
- **付费用户**: 10000 次/天
- **企业用户**: 无限制

## 🔍 监控和日志

### 性能指标
- **响应时间**: 平均 < 500ms
- **成功率**: > 99%
- **可用性**: > 99.9%

### 日志记录
- **请求日志**: 记录所有 API 调用
- **错误日志**: 记录错误详情
- **业务日志**: 记录业务操作
- **审计日志**: 记录敏感操作

## 🚀 使用示例

### 1. 扫描清算机会
```typescript
// 扫描所有协议
const response = await fetch('/api/liquidation?action=scan');
const result = await response.json();

// 扫描特定协议
const response = await fetch('/api/liquidation?action=scan&protocol=solend');
const result = await response.json();
```

### 2. 启动监控
```typescript
const response = await fetch('/api/liquidation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    action: 'start_monitoring',
    config: {
      scanInterval: 30000,
      maxOpportunities: 50,
      enableNotifications: true,
      minProfitThreshold: 10.0
    }
  })
});
```

### 3. 执行清算
```typescript
const response = await fetch('/api/liquidation/execute', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${walletSignature}`
  },
  body: JSON.stringify({
    action: 'execute_liquidation',
    opportunity: liquidationOpportunity,
    params: {
      priorityFee: 1000,
      maxSlippage: 0.01,
      timeout: 30000
    }
  })
});
```

## 📚 相关文档

- [扫描接口详情](scan-api.md)
- [交易接口详情](transaction-api.md)
- [监控接口详情](monitoring-api.md)
- [错误处理指南](../user-guide/error-handling.md)
- [最佳实践](../development/best-practices.md)

---

**文档版本**: v2.0.0  
**最后更新**: 2025-01-29  
**审核状态**: ✅ 已审核
