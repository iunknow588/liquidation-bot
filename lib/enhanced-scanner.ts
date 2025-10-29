import { Connection, PublicKey } from '@solana/web3.js';

export interface EnhancedLiquidationOpportunity {
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
  protocol: string;
  marketId: string;
  borrower: string;
  collateralToken: string;
  debtToken: string;
  collateralAmount: number;
  debtAmount: number;
  gasCost: number;
  timestamp: number;
}

export interface EnhancedScanResult {
  accounts: EnhancedLiquidationOpportunity[];
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

export class EnhancedLiquidationScanner {
  private connection: Connection;
  private protocols: {
    solend: PublicKey;
    mango: PublicKey;
    kamino: PublicKey;
  };

  constructor(connection: Connection) {
    this.connection = connection;
    this.protocols = {
      solend: new PublicKey('So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo'),
      mango: new PublicKey('mv3ekLzLbnVPNxjSKvqBpU3ZeZXPQdEC3bp5MDEBG68'),
      kamino: new PublicKey('KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD'),
    };
  }

  /**
   * 扫描所有协议的清算机会
   */
  async scanAllProtocols(): Promise<EnhancedScanResult> {
    console.log('🔍 开始扫描所有协议的清算机会...');
    
    const results = await Promise.allSettled([
      this.scanSolendProtocol(),
      this.scanMangoProtocol(),
      this.scanKaminoProtocol(),
    ]);

    const allAccounts: EnhancedLiquidationOpportunity[] = [];
    const protocolCounts = { solend: 0, mango: 0, kamino: 0 };

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allAccounts.push(...result.value);
        const protocolName = ['solend', 'mango', 'kamino'][index] as keyof typeof protocolCounts;
        protocolCounts[protocolName] = result.value.length;
      }
    });

    const liquidatableCount = allAccounts.filter(acc => acc.isLiquidatable).length;
    const healthyCount = allAccounts.length - liquidatableCount;

    console.log(`✅ 扫描完成: 总计 ${allAccounts.length} 个账户, ${liquidatableCount} 个可清算`);

    return {
      accounts: allAccounts,
      totalAccounts: allAccounts.length,
      liquidatableCount,
      healthyCount,
      timestamp: Date.now(),
      protocols: protocolCounts,
    };
  }

  /**
   * 扫描 Solend 协议
   */
  private async scanSolendProtocol(): Promise<EnhancedLiquidationOpportunity[]> {
    console.log('📡 扫描 Solend 协议...');
    
    try {
      const accounts = await this.connection.getProgramAccounts(
        this.protocols.solend,
        {
          filters: [
            { dataSize: 916 } // Solend Obligation 账户精确大小
          ],
          commitment: 'confirmed'
        }
      );

      console.log(`✅ 获取到 ${accounts.length} 个 Solend 账户`);

      return accounts.map(({ pubkey, account }) => {
        const opportunity = this.parseSolendAccount(pubkey, account);
        return {
          ...opportunity,
          protocol: 'Solend',
          marketId: 'Solend Main',
          borrower: pubkey.toBase58(),
          collateralToken: 'SOL',
          debtToken: 'USDC',
          collateralAmount: opportunity.collateralValue * 1_000_000,
          debtAmount: opportunity.borrowedValue * 1_000_000,
          gasCost: 5000,
          timestamp: Date.now(),
        };
      });
    } catch (error) {
      console.error('❌ Solend 扫描失败:', error);
      return [];
    }
  }

  /**
   * 扫描 Mango 协议
   */
  private async scanMangoProtocol(): Promise<EnhancedLiquidationOpportunity[]> {
    console.log('📡 扫描 Mango 协议...');
    
    try {
      const accounts = await this.connection.getProgramAccounts(
        this.protocols.mango,
        {
          filters: [
            { dataSize: 2000 } // Mango 账户通常较大
          ],
          commitment: 'confirmed'
        }
      );

      console.log(`✅ 获取到 ${accounts.length} 个 Mango 账户`);

      return accounts.map(({ pubkey, account }) => {
        const opportunity = this.parseMangoAccount(pubkey, account);
        return {
          ...opportunity,
          protocol: 'Mango',
          marketId: 'Mango Markets',
          borrower: pubkey.toBase58(),
          collateralToken: 'SOL',
          debtToken: 'USDC',
          collateralAmount: opportunity.collateralValue * 1_000_000,
          debtAmount: opportunity.borrowedValue * 1_000_000,
          gasCost: 8000,
          timestamp: Date.now(),
        };
      });
    } catch (error) {
      console.error('❌ Mango 扫描失败:', error);
      return [];
    }
  }

  /**
   * 扫描 Kamino 协议
   */
  private async scanKaminoProtocol(): Promise<EnhancedLiquidationOpportunity[]> {
    console.log('📡 扫描 Kamino 协议...');
    
    try {
      const accounts = await this.connection.getProgramAccounts(
        this.protocols.kamino,
        {
          filters: [
            { dataSize: 1500 } // Kamino 账户大小
          ],
          commitment: 'confirmed'
        }
      );

      console.log(`✅ 获取到 ${accounts.length} 个 Kamino 账户`);

      return accounts.map(({ pubkey, account }) => {
        const opportunity = this.parseKaminoAccount(pubkey, account);
        return {
          ...opportunity,
          protocol: 'Kamino',
          marketId: 'Kamino Finance',
          borrower: pubkey.toBase58(),
          collateralToken: 'SOL',
          debtToken: 'USDC',
          collateralAmount: opportunity.collateralValue * 1_000_000,
          debtAmount: opportunity.borrowedValue * 1_000_000,
          gasCost: 6000,
          timestamp: Date.now(),
        };
      });
    } catch (error) {
      console.error('❌ Kamino 扫描失败:', error);
      return [];
    }
  }

  /**
   * 解析 Solend 账户数据
   */
  private parseSolendAccount(pubkey: PublicKey, account: any): EnhancedLiquidationOpportunity {
    // 模拟数据解析（实际需要根据 Solend 的数据结构实现）
    const collateralValue = Math.random() * 100000 + 1000;
    const borrowedValue = Math.random() * collateralValue * 0.9;
    const healthFactor = borrowedValue > 0 ? collateralValue / borrowedValue : 999;
    const liquidationThreshold = 1.05;
    const collateralRatio = borrowedValue > 0 ? (collateralValue / borrowedValue) * 100 : 999;
    const isLiquidatable = healthFactor < liquidationThreshold;
    const estimatedProfit = isLiquidatable ? borrowedValue * 0.08 : 0;

    return {
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
      estimatedProfit,
      protocol: 'Solend',
      marketId: 'Solend Main',
      borrower: pubkey.toBase58(),
      collateralToken: 'SOL',
      debtToken: 'USDC',
      collateralAmount: collateralValue * 1_000_000,
      debtAmount: borrowedValue * 1_000_000,
      gasCost: 5000,
      timestamp: Date.now(),
    };
  }

  /**
   * 解析 Mango 账户数据
   */
  private parseMangoAccount(pubkey: PublicKey, account: any): EnhancedLiquidationOpportunity {
    // 模拟数据解析（实际需要根据 Mango 的数据结构实现）
    const collateralValue = Math.random() * 200000 + 2000;
    const borrowedValue = Math.random() * collateralValue * 0.85;
    const healthFactor = borrowedValue > 0 ? collateralValue / borrowedValue : 999;
    const liquidationThreshold = 1.1;
    const collateralRatio = borrowedValue > 0 ? (collateralValue / borrowedValue) * 100 : 999;
    const isLiquidatable = healthFactor < liquidationThreshold;
    const estimatedProfit = isLiquidatable ? borrowedValue * 0.1 : 0;

    return {
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
      estimatedProfit,
      protocol: 'Mango',
      marketId: 'Mango Markets',
      borrower: pubkey.toBase58(),
      collateralToken: 'SOL',
      debtToken: 'USDC',
      collateralAmount: collateralValue * 1_000_000,
      debtAmount: borrowedValue * 1_000_000,
      gasCost: 8000,
      timestamp: Date.now(),
    };
  }

  /**
   * 解析 Kamino 账户数据
   */
  private parseKaminoAccount(pubkey: PublicKey, account: any): EnhancedLiquidationOpportunity {
    // 模拟数据解析（实际需要根据 Kamino 的数据结构实现）
    const collateralValue = Math.random() * 150000 + 1500;
    const borrowedValue = Math.random() * collateralValue * 0.88;
    const healthFactor = borrowedValue > 0 ? collateralValue / borrowedValue : 999;
    const liquidationThreshold = 1.08;
    const collateralRatio = borrowedValue > 0 ? (collateralValue / borrowedValue) * 100 : 999;
    const isLiquidatable = healthFactor < liquidationThreshold;
    const estimatedProfit = isLiquidatable ? borrowedValue * 0.09 : 0;

    return {
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
      estimatedProfit,
      protocol: 'Kamino',
      marketId: 'Kamino Finance',
      borrower: pubkey.toBase58(),
      collateralToken: 'SOL',
      debtToken: 'USDC',
      collateralAmount: collateralValue * 1_000_000,
      debtAmount: borrowedValue * 1_000_000,
      gasCost: 6000,
      timestamp: Date.now(),
    };
  }

  /**
   * 获取特定协议的清算机会
   */
  async scanProtocol(protocol: 'solend' | 'mango' | 'kamino'): Promise<EnhancedLiquidationOpportunity[]> {
    switch (protocol) {
      case 'solend':
        return this.scanSolendProtocol();
      case 'mango':
        return this.scanMangoProtocol();
      case 'kamino':
        return this.scanKaminoProtocol();
      default:
        return [];
    }
  }

  /**
   * 实时监控模式（用于后台任务）
   */
  async startRealTimeMonitoring(
    onOpportunityFound: (opportunity: EnhancedLiquidationOpportunity) => void,
    intervalMs: number = 30000
  ): Promise<void> {
    console.log(`🔄 开始实时监控，间隔: ${intervalMs}ms`);
    
    const monitor = async () => {
      try {
        const result = await this.scanAllProtocols();
        
        // 检查新的清算机会
        result.accounts
          .filter(acc => acc.isLiquidatable)
          .forEach(onOpportunityFound);
          
      } catch (error) {
        console.error('❌ 监控扫描失败:', error);
      }
    };

    // 立即执行一次
    await monitor();
    
    // 设置定时器
    setInterval(monitor, intervalMs);
  }
}
