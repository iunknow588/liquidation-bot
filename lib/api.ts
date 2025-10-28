// 🔒 安全的 API 客户端
// 通过 API Route 代理，不暴露 API Key

export interface LiquidationOpportunity {
  address: string;
  dataSize: number;
  lamports: number;
  owner: string;
  accountType?: string; // 新增：账户类型 (Obligation, Reserve, Market, etc.)
  collateralValue: number;
  borrowedValue: number;
  healthFactor: number;
  collateralRatio: number;
  liquidationThreshold: number;
  isLiquidatable: boolean;
  estimatedProfit: number;
}

export interface ScanResult {
  accounts: LiquidationOpportunity[];
  totalAccounts: number;
  liquidatableCount: number;
  healthyCount: number;
  timestamp: number;
  cluster?: string;
  rpcStatus?: {
    connected: boolean;
    currentSlot: number;
    provider: string;
    solendProgramId: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 扫描 Solend 账户（通过安全的 API 路由）
 * 🔒 API Key 在服务器端，前端看不到
 */
export async function scanSolendAccounts(): Promise<ScanResult> {
  console.log('📡 发送扫描请求到 API 路由...');
  
  try {
    const response = await fetch('/api/scan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('请求过于频繁，请稍后再试');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result: ApiResponse<ScanResult> = await response.json();
    
    if (!result.success || !result.data) {
      throw new Error(result.message || result.error || '扫描失败');
    }
    
    console.log('✅ 扫描成功:', result.data.totalAccounts, '个账户');
    
    return result.data;
    
  } catch (error) {
    console.error('❌ 扫描失败:', error);
    throw error;
  }
}

/**
 * 健康检查
 */
export async function healthCheck(): Promise<{
  status: string;
  cluster: string;
  hasApiKey: boolean;
  timestamp: number;
}> {
  const response = await fetch('/api/scan');
  return response.json();
}

