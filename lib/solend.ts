import { connection, SOLEND_PROGRAM_ID } from './solana';

export interface LiquidationOpportunity {
  address: string;
  dataSize: number;
  lamports: number;
  owner: string;
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
}

export async function scanSolendAccounts(): Promise<ScanResult> {
  console.log('🔍 开始扫描 Solend 账户...');
  console.log('📡 RPC 端点: Helius Mainnet');
  console.log('🎯 Program ID:', SOLEND_PROGRAM_ID.toBase58());
  
  try {
    // 获取所有 Solend 程序账户（过滤大小 >= 900 bytes）
    const accounts = await connection.getProgramAccounts(
      SOLEND_PROGRAM_ID,
      {
        filters: [
          { dataSize: 916 } // Solend Obligation 账户精确大小
        ],
        commitment: 'confirmed'
      }
    );

    console.log(`✅ 成功获取 ${accounts.length} 个 Obligation 账户`);

    if (accounts.length === 0) {
      console.warn('⚠️  未找到任何账户');
      return {
        accounts: [],
        totalAccounts: 0,
        liquidatableCount: 0,
        healthyCount: 0,
        timestamp: Date.now()
      };
    }

    const opportunities: LiquidationOpportunity[] = [];
    let liquidatableCount = 0;
    let healthyCount = 0;

    for (const { pubkey, account } of accounts) {
      // 模拟解析账户数据
      // 在实际应用中，需要根据 Solend 的账户结构正确解析
      const collateralValue = Math.random() * 50000 + 10000;
      const borrowedValue = Math.random() * 40000 + 5000;
      const healthFactor = collateralValue / borrowedValue;
      const collateralRatio = (collateralValue / borrowedValue) * 100;
      const liquidationThreshold = 1.05; // 105%
      const isLiquidatable = healthFactor < liquidationThreshold;
      const estimatedProfit = isLiquidatable 
        ? (collateralValue - borrowedValue) * 0.05 // 5% 清算奖励
        : 0;

      if (isLiquidatable) {
        liquidatableCount++;
      } else {
        healthyCount++;
      }

      opportunities.push({
        address: pubkey.toBase58(),
        dataSize: account.data.length,
        lamports: account.lamports,
        owner: account.owner.toBase58(),
        collateralValue,
        borrowedValue,
        healthFactor,
        collateralRatio,
        liquidationThreshold,
        isLiquidatable,
        estimatedProfit
      });
    }

    // 按健康因子排序（最不健康的在前）
    const sorted = opportunities.sort((a, b) => a.healthFactor - b.healthFactor);

    console.log('📊 扫描统计：');
    console.log(`  总账户数: ${accounts.length}`);
    console.log(`  可清算: ${liquidatableCount}`);
    console.log(`  健康: ${healthyCount}`);

    return {
      accounts: sorted,
      totalAccounts: accounts.length,
      liquidatableCount,
      healthyCount,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('❌ 扫描失败:', error);
    throw error;
  }
}

