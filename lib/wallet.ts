import { Connection, PublicKey, Transaction, TransactionInstruction, ComputeBudgetInstruction } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';

export interface LiquidationParams {
  opportunity: {
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
  };
  flashloanAmount?: number;
  priorityFee?: number;
}

export interface LiquidationResult {
  success: boolean;
  txSignature?: string;
  profit: number;
  gasUsed: number;
  error?: string;
  timestamp: number;
}

export class LiquidationExecutor {
  private connection: Connection;
  private wallet: WalletContextState;

  constructor(connection: Connection, wallet: WalletContextState) {
    this.connection = connection;
    this.wallet = wallet;
  }

  /**
   * 执行清算交易
   */
  async executeLiquidation(params: LiquidationParams): Promise<LiquidationResult> {
    console.log('🚀 开始执行清算:', params.opportunity.protocol);
    
    if (!this.wallet.publicKey || !this.wallet.signTransaction) {
      return {
        success: false,
        profit: 0,
        gasUsed: 0,
        error: '钱包未连接或不支持签名',
        timestamp: Date.now(),
      };
    }

    try {
      // 构建交易
      const transaction = await this.buildLiquidationTransaction(params);
      
      // 估算 Gas 费用
      const gasEstimate = await this.estimateGasCost(transaction);
      
      // 检查盈利性
      if (!this.isProfitable(params, gasEstimate)) {
        return {
          success: false,
          profit: 0,
          gasUsed: gasEstimate,
          error: '清算不盈利',
          timestamp: Date.now(),
        };
      }
      
      // 签名并发送交易
      const signedTransaction = await this.wallet.signTransaction!(transaction);
      const signature = await this.connection.sendRawTransaction(signedTransaction.serialize());
      
      console.log('✅ 清算交易已发送:', signature);
      
      // 等待确认
      const confirmation = await this.connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        return {
          success: false,
          txSignature: signature,
          profit: 0,
          gasUsed: gasEstimate,
          error: '交易执行失败',
          timestamp: Date.now(),
        };
      }
      
      return {
        success: true,
        txSignature: signature,
        profit: params.opportunity.estimatedProfit,
        gasUsed: gasEstimate,
        timestamp: Date.now(),
      };
      
    } catch (error) {
      console.error('❌ 清算执行失败:', error);
      return {
        success: false,
        profit: 0,
        gasUsed: 0,
        error: error instanceof Error ? error.message : '未知错误',
        timestamp: Date.now(),
      };
    }
  }

  /**
   * 构建清算交易
   */
  private async buildLiquidationTransaction(params: LiquidationParams): Promise<Transaction> {
    const instructions: TransactionInstruction[] = [];
    
    // 设置计算预算
    // 注意：计算预算指令暂时跳过，直接使用基础交易
    
    // 构建清算指令
    const liquidationInstruction = this.createLiquidationInstruction(params);
    instructions.push(liquidationInstruction);
    
    // 获取最新区块哈希
    const { blockhash } = await this.connection.getLatestBlockhash();
    
    // 构建交易
    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: this.wallet.publicKey!,
    });
    
    transaction.add(...instructions);
    
    return transaction;
  }

  /**
   * 创建清算指令
   */
  private createLiquidationInstruction(params: LiquidationParams): TransactionInstruction {
    // 这里需要根据具体的协议实现清算指令
    // 目前返回一个占位符指令
    return new TransactionInstruction({
      keys: [],
      programId: new PublicKey('11111111111111111111111111111111'), // System Program
      data: Buffer.from([]),
    });
  }

  /**
   * 估算 Gas 费用
   */
  private async estimateGasCost(transaction: Transaction): Promise<number> {
    try {
      const feeCalculator = await this.connection.getFeeForMessage(
        transaction.compileMessage()
      );
      return feeCalculator.value || 5000;
    } catch {
      return 5000; // 默认费用
    }
  }

  /**
   * 检查是否盈利
   */
  private isProfitable(params: LiquidationParams, gasCost: number): boolean {
    const gasCostUsd = gasCost * 0.000005; // 假设 1 lamport = 0.000005 USD
    const netProfit = params.opportunity.estimatedProfit - gasCostUsd;
    
    // 最小盈利要求：10 USD
    return netProfit >= 10.0;
  }
}

/**
 * 闪电贷执行器
 */
export class FlashLoanExecutor {
  private connection: Connection;
  private wallet: WalletContextState;

  constructor(connection: Connection, wallet: WalletContextState) {
    this.connection = connection;
    this.wallet = wallet;
  }

  /**
   * 执行闪电贷清算
   */
  async executeFlashLoanLiquidation(params: LiquidationParams): Promise<LiquidationResult> {
    console.log('💸 开始执行闪电贷清算:', params.opportunity.protocol);
    
    if (!this.wallet.publicKey || !this.wallet.signTransaction) {
      return {
        success: false,
        profit: 0,
        gasUsed: 0,
        error: '钱包未连接或不支持签名',
        timestamp: Date.now(),
      };
    }

    try {
      // 计算闪电贷金额
      const flashloanAmount = this.calculateFlashLoanAmount(params);
      
      // 构建闪电贷交易
      const transaction = await this.buildFlashLoanTransaction(params, flashloanAmount);
      
      // 估算 Gas 费用
      const gasEstimate = await this.estimateGasCost(transaction);
      
      // 检查盈利性
      if (!this.isProfitable(params, gasEstimate)) {
        return {
          success: false,
          profit: 0,
          gasUsed: gasEstimate,
          error: '闪电贷清算不盈利',
          timestamp: Date.now(),
        };
      }
      
      // 签名并发送交易
      const signedTransaction = await this.wallet.signTransaction!(transaction);
      const signature = await this.connection.sendRawTransaction(signedTransaction.serialize());
      
      console.log('✅ 闪电贷清算交易已发送:', signature);
      
      // 等待确认
      const confirmation = await this.connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        return {
          success: false,
          txSignature: signature,
          profit: 0,
          gasUsed: gasEstimate,
          error: '交易执行失败',
          timestamp: Date.now(),
        };
      }
      
      return {
        success: true,
        txSignature: signature,
        profit: params.opportunity.estimatedProfit,
        gasUsed: gasEstimate,
        timestamp: Date.now(),
      };
      
    } catch (error) {
      console.error('❌ 闪电贷清算执行失败:', error);
      return {
        success: false,
        profit: 0,
        gasUsed: 0,
        error: error instanceof Error ? error.message : '未知错误',
        timestamp: Date.now(),
      };
    }
  }

  /**
   * 计算闪电贷金额
   */
  private calculateFlashLoanAmount(params: LiquidationParams): number {
    // 通常是债务金额加上清算奖励
    return params.opportunity.debtAmount + (params.opportunity.debtAmount * 0.01); // 1% 清算奖励
  }

  /**
   * 构建闪电贷交易
   */
  private async buildFlashLoanTransaction(params: LiquidationParams, amount: number): Promise<Transaction> {
    const instructions: TransactionInstruction[] = [];
    
    // 设置计算预算
    // 注意：计算预算指令暂时跳过，直接使用基础交易
    
    // 构建闪电贷指令
    const flashloanInstruction = this.createFlashLoanInstruction(params, amount);
    instructions.push(flashloanInstruction);
    
    // 构建清算指令
    const liquidationInstruction = this.createLiquidationInstruction(params);
    instructions.push(liquidationInstruction);
    
    // 构建还款指令
    const repayInstruction = this.createRepayInstruction(params, amount);
    instructions.push(repayInstruction);
    
    // 获取最新区块哈希
    const { blockhash } = await this.connection.getLatestBlockhash();
    
    // 构建交易
    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: this.wallet.publicKey!,
    });
    
    transaction.add(...instructions);
    
    return transaction;
  }

  /**
   * 创建闪电贷指令
   */
  private createFlashLoanInstruction(params: LiquidationParams, amount: number): TransactionInstruction {
    // 这里需要根据具体的闪电贷提供商实现
    // 目前返回一个占位符指令
    return new TransactionInstruction({
      keys: [],
      programId: new PublicKey('11111111111111111111111111111111'), // System Program
      data: Buffer.from([]),
    });
  }

  /**
   * 创建清算指令
   */
  private createLiquidationInstruction(params: LiquidationParams): TransactionInstruction {
    // 这里需要根据具体的协议实现清算指令
    return new TransactionInstruction({
      keys: [],
      programId: new PublicKey('11111111111111111111111111111111'), // System Program
      data: Buffer.from([]),
    });
  }

  /**
   * 创建还款指令
   */
  private createRepayInstruction(params: LiquidationParams, amount: number): TransactionInstruction {
    // 这里需要根据具体的协议实现还款指令
    return new TransactionInstruction({
      keys: [],
      programId: new PublicKey('11111111111111111111111111111111'), // System Program
      data: Buffer.from([]),
    });
  }

  /**
   * 估算 Gas 费用
   */
  private async estimateGasCost(transaction: Transaction): Promise<number> {
    try {
      const feeCalculator = await this.connection.getFeeForMessage(
        transaction.compileMessage()
      );
      return feeCalculator.value || 10000; // 闪电贷交易通常需要更多 Gas
    } catch {
      return 10000; // 默认费用
    }
  }

  /**
   * 检查是否盈利
   */
  private isProfitable(params: LiquidationParams, gasCost: number): boolean {
    const gasCostUsd = gasCost * 0.000005; // 假设 1 lamport = 0.000005 USD
    const flashloanFee = params.opportunity.debtAmount * 0.001; // 0.1% 闪电贷费用
    const totalCost = gasCostUsd + flashloanFee;
    const netProfit = params.opportunity.estimatedProfit - totalCost;
    
    // 最小盈利要求：10 USD
    return netProfit >= 10.0;
  }
}
