import { EnhancedLiquidationScanner, EnhancedLiquidationOpportunity } from './enhanced-scanner';
import { Connection } from '@solana/web3.js';

export interface BackgroundTaskConfig {
  scanInterval: number; // 扫描间隔（毫秒）
  maxOpportunities: number; // 最大缓存机会数
  enableNotifications: boolean; // 是否启用通知
  minProfitThreshold: number; // 最小盈利阈值
}

export interface TaskStatus {
  isRunning: boolean;
  lastScanTime: number;
  totalScans: number;
  opportunitiesFound: number;
  errors: string[];
}

export class BackgroundTaskManager {
  private scanner: EnhancedLiquidationScanner;
  private config: BackgroundTaskConfig;
  private status: TaskStatus;
  private intervalId: NodeJS.Timeout | null = null;
  private opportunities: EnhancedLiquidationOpportunity[] = [];
  private listeners: Array<(opportunity: EnhancedLiquidationOpportunity) => void> = [];

  constructor(connection: Connection, config: Partial<BackgroundTaskConfig> = {}) {
    this.scanner = new EnhancedLiquidationScanner(connection);
    this.config = {
      scanInterval: 30000, // 30秒
      maxOpportunities: 100,
      enableNotifications: true,
      minProfitThreshold: 10.0,
      ...config,
    };
    this.status = {
      isRunning: false,
      lastScanTime: 0,
      totalScans: 0,
      opportunitiesFound: 0,
      errors: [],
    };
  }

  /**
   * 启动后台任务
   */
  start(): void {
    if (this.status.isRunning) {
      console.warn('⚠️ 后台任务已在运行');
      return;
    }

    console.log('🚀 启动后台清算监控任务...');
    this.status.isRunning = true;

    // 立即执行一次扫描
    this.performScan();

    // 设置定时扫描
    this.intervalId = setInterval(() => {
      this.performScan();
    }, this.config.scanInterval);

    console.log(`✅ 后台任务已启动，扫描间隔: ${this.config.scanInterval}ms`);
  }

  /**
   * 停止后台任务
   */
  stop(): void {
    if (!this.status.isRunning) {
      console.warn('⚠️ 后台任务未在运行');
      return;
    }

    console.log('🛑 停止后台清算监控任务...');
    this.status.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    console.log('✅ 后台任务已停止');
  }

  /**
   * 执行扫描
   */
  private async performScan(): Promise<void> {
    try {
      console.log('🔍 执行后台扫描...');
      const result = await this.scanner.scanAllProtocols();
      
      this.status.lastScanTime = Date.now();
      this.status.totalScans++;
      
      // 过滤盈利机会
      const profitableOpportunities = result.accounts.filter(
        opp => opp.isLiquidatable && opp.estimatedProfit >= this.config.minProfitThreshold
      );
      
      this.status.opportunitiesFound += profitableOpportunities.length;
      
      // 更新机会列表
      this.updateOpportunities(profitableOpportunities);
      
      // 通知监听器
      profitableOpportunities.forEach(opportunity => {
        this.notifyListeners(opportunity);
      });
      
      console.log(`✅ 扫描完成: 发现 ${profitableOpportunities.length} 个盈利机会`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      console.error('❌ 后台扫描失败:', errorMessage);
      
      this.status.errors.push(`${new Date().toISOString()}: ${errorMessage}`);
      
      // 保持最近10个错误
      if (this.status.errors.length > 10) {
        this.status.errors = this.status.errors.slice(-10);
      }
    }
  }

  /**
   * 更新机会列表
   */
  private updateOpportunities(newOpportunities: EnhancedLiquidationOpportunity[]): void {
    // 合并新机会到现有列表
    const existingAddresses = new Set(this.opportunities.map(opp => opp.address));
    const uniqueNewOpportunities = newOpportunities.filter(
      opp => !existingAddresses.has(opp.address)
    );
    
    this.opportunities.push(...uniqueNewOpportunities);
    
    // 按时间戳排序（最新的在前）
    this.opportunities.sort((a, b) => b.timestamp - a.timestamp);
    
    // 限制最大数量
    if (this.opportunities.length > this.config.maxOpportunities) {
      this.opportunities = this.opportunities.slice(0, this.config.maxOpportunities);
    }
  }

  /**
   * 添加机会监听器
   */
  addOpportunityListener(listener: (opportunity: EnhancedLiquidationOpportunity) => void): void {
    this.listeners.push(listener);
  }

  /**
   * 移除机会监听器
   */
  removeOpportunityListener(listener: (opportunity: EnhancedLiquidationOpportunity) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * 通知所有监听器
   */
  private notifyListeners(opportunity: EnhancedLiquidationOpportunity): void {
    this.listeners.forEach(listener => {
      try {
        listener(opportunity);
      } catch (error) {
        console.error('❌ 监听器执行失败:', error);
      }
    });
  }

  /**
   * 获取任务状态
   */
  getStatus(): TaskStatus {
    return { ...this.status };
  }

  /**
   * 获取所有机会
   */
  getOpportunities(): EnhancedLiquidationOpportunity[] {
    return [...this.opportunities];
  }

  /**
   * 获取最新机会
   */
  getLatestOpportunities(count: number = 10): EnhancedLiquidationOpportunity[] {
    return this.opportunities.slice(0, count);
  }

  /**
   * 获取特定协议的机会
   */
  getOpportunitiesByProtocol(protocol: string): EnhancedLiquidationOpportunity[] {
    return this.opportunities.filter(opp => opp.protocol === protocol);
  }

  /**
   * 清除所有机会
   */
  clearOpportunities(): void {
    this.opportunities = [];
    console.log('🗑️ 已清除所有机会');
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<BackgroundTaskConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ 配置已更新:', this.config);
  }

  /**
   * 手动触发扫描
   */
  async triggerScan(): Promise<void> {
    console.log('🔍 手动触发扫描...');
    await this.performScan();
  }

  /**
   * 获取统计信息
   */
  getStats(): {
    totalScans: number;
    opportunitiesFound: number;
    averageOpportunitiesPerScan: number;
    uptime: number;
    errorRate: number;
  } {
    const uptime = this.status.isRunning 
      ? Date.now() - (this.status.lastScanTime - this.status.totalScans * this.config.scanInterval)
      : 0;
    
    const averageOpportunitiesPerScan = this.status.totalScans > 0 
      ? this.status.opportunitiesFound / this.status.totalScans 
      : 0;
    
    const errorRate = this.status.totalScans > 0 
      ? this.status.errors.length / this.status.totalScans 
      : 0;

    return {
      totalScans: this.status.totalScans,
      opportunitiesFound: this.status.opportunitiesFound,
      averageOpportunitiesPerScan,
      uptime,
      errorRate,
    };
  }
}
