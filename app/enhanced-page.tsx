'use client';

import { useState, useEffect, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton, WalletDisconnectButton } from '@/lib/wallet-provider';
import { EnhancedLiquidationScanner, EnhancedLiquidationOpportunity, EnhancedScanResult } from '@/lib/enhanced-scanner';
import { LiquidationExecutor, FlashLoanExecutor } from '@/lib/wallet';
import { BackgroundTaskManager } from '@/lib/background-tasks';

// 获取版本信息
const getVersion = () => {
  const major = process.env.NEXT_PUBLIC_VERSION_MAJOR || '2';
  const minor = process.env.NEXT_PUBLIC_VERSION_MINOR || '0';
  const patch = process.env.NEXT_PUBLIC_VERSION_PATCH || '0';
  const prefix = process.env.NEXT_PUBLIC_VERSION_PREFIX || 'v';
  const commitTime = process.env.NEXT_PUBLIC_VERSION_COMMIT_TIME || '';
  
  const versionNumber = `${prefix}${major}.${minor}.${patch}`;
  const fullVersion = commitTime ? `${versionNumber} (${commitTime})` : versionNumber;
  
  return {
    full: fullVersion,
    versionNumber: versionNumber,
    commitTime: commitTime
  };
};

export default function EnhancedDashboard() {
  const { connection } = useConnection();
  const wallet = useWallet();
  
  const [scanning, setScanning] = useState(false);
  const [data, setData] = useState<EnhancedScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [backgroundTask, setBackgroundTask] = useState<BackgroundTaskManager | null>(null);
  const [taskStatus, setTaskStatus] = useState<any>(null);
  const [executingLiquidation, setExecutingLiquidation] = useState<string | null>(null);
  const [liquidationResults, setLiquidationResults] = useState<any[]>([]);
  
  const version = getVersion();

  // 初始化后台任务管理器
  useEffect(() => {
    if (connection) {
      const taskManager = new BackgroundTaskManager(connection, {
        scanInterval: 30000, // 30秒扫描一次
        maxOpportunities: 50,
        enableNotifications: true,
        minProfitThreshold: 10.0,
      });
      
      // 添加机会监听器
      taskManager.addOpportunityListener((opportunity) => {
        console.log('🎯 发现新的清算机会:', opportunity);
        // 这里可以添加通知逻辑
      });
      
      setBackgroundTask(taskManager);
    }
  }, [connection]);

  // 更新任务状态
  useEffect(() => {
    if (backgroundTask) {
      const interval = setInterval(() => {
        setTaskStatus(backgroundTask.getStatus());
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [backgroundTask]);

  const handleScan = async () => {
    if (!connection) {
      setError('RPC 连接未初始化');
      return;
    }

    setScanning(true);
    setError(null);
    
    try {
      const scanner = new EnhancedLiquidationScanner(connection);
      const result = await scanner.scanAllProtocols();
      setData(result);
    } catch (err) {
      console.error('扫描失败:', err);
      setError(err instanceof Error ? err.message : '扫描失败');
    } finally {
      setScanning(false);
    }
  };

  const handleStartBackgroundTask = () => {
    if (backgroundTask) {
      backgroundTask.start();
    }
  };

  const handleStopBackgroundTask = () => {
    if (backgroundTask) {
      backgroundTask.stop();
    }
  };

  const handleExecuteLiquidation = async (opportunity: EnhancedLiquidationOpportunity) => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      setError('请先连接钱包');
      return;
    }

    setExecutingLiquidation(opportunity.address);
    
    try {
      const executor = new LiquidationExecutor(connection, wallet);
      const result = await executor.executeLiquidation({
        opportunity: {
          protocol: opportunity.protocol,
          marketId: opportunity.marketId,
          borrower: opportunity.borrower,
          collateralToken: opportunity.collateralToken,
          debtToken: opportunity.debtToken,
          collateralAmount: opportunity.collateralAmount,
          debtAmount: opportunity.debtAmount,
          healthFactor: opportunity.healthFactor,
          liquidationThreshold: opportunity.liquidationThreshold,
          estimatedProfit: opportunity.estimatedProfit,
          gasCost: opportunity.gasCost,
          timestamp: opportunity.timestamp,
        },
        priorityFee: 1000,
      });

      setLiquidationResults(prev => [result, ...prev.slice(0, 9)]);
      
      if (result.success) {
        console.log('✅ 清算执行成功:', result.txSignature);
      } else {
        console.error('❌ 清算执行失败:', result.error);
      }
    } catch (err) {
      console.error('清算执行失败:', err);
      setError(err instanceof Error ? err.message : '清算执行失败');
    } finally {
      setExecutingLiquidation(null);
    }
  };

  const handleExecuteFlashLoanLiquidation = async (opportunity: EnhancedLiquidationOpportunity) => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      setError('请先连接钱包');
      return;
    }

    setExecutingLiquidation(opportunity.address);
    
    try {
      const executor = new FlashLoanExecutor(connection, wallet);
      const result = await executor.executeFlashLoanLiquidation({
        opportunity: {
          protocol: opportunity.protocol,
          marketId: opportunity.marketId,
          borrower: opportunity.borrower,
          collateralToken: opportunity.collateralToken,
          debtToken: opportunity.debtToken,
          collateralAmount: opportunity.collateralAmount,
          debtAmount: opportunity.debtAmount,
          healthFactor: opportunity.healthFactor,
          liquidationThreshold: opportunity.liquidationThreshold,
          estimatedProfit: opportunity.estimatedProfit,
          gasCost: opportunity.gasCost,
          timestamp: opportunity.timestamp,
        },
        priorityFee: 1000,
      });

      setLiquidationResults(prev => [result, ...prev.slice(0, 9)]);
      
      if (result.success) {
        console.log('✅ 闪电贷清算执行成功:', result.txSignature);
      } else {
        console.error('❌ 闪电贷清算执行失败:', result.error);
      }
    } catch (err) {
      console.error('闪电贷清算执行失败:', err);
      setError(err instanceof Error ? err.message : '闪电贷清算执行失败');
    } finally {
      setExecutingLiquidation(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* 标题区域 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                🚀 Solana 清算机器人
              </h1>
              <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold rounded-full shadow-lg">
                {version.full}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <WalletMultiButton className="!bg-gradient-to-r !from-blue-600 !to-indigo-600 !rounded-lg !px-6 !py-2" />
              {wallet.connected && <WalletDisconnectButton className="!bg-red-500 !rounded-lg !px-4 !py-2" />}
            </div>
          </div>
          <p className="text-gray-600 text-lg">
            全功能 Solana 清算机器人 - 支持多协议扫描、钱包连接、实时交易执行
          </p>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              🌐 集群: <span className="font-semibold text-blue-600">MAINNET</span>
            </span>
            <span className="flex items-center gap-1">
              📡 RPC: <span className="font-mono text-xs">Helius ✓</span>
            </span>
            <span className="flex items-center gap-1 text-blue-600">
              ⚡ <span className="font-semibold">前端全功能</span>
            </span>
          </div>
        </div>

        {/* 操作区域 */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleScan}
            disabled={scanning}
            className={`
              px-6 py-3 rounded-lg font-semibold text-white text-lg
              transition-all duration-200 shadow-lg
              ${scanning
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl transform hover:scale-105'
              }
            `}
          >
            {scanning ? (
              <>
                <span className="inline-block animate-spin mr-2">⟳</span>
                扫描中...
              </>
            ) : (
              '🔍 手动扫描'
            )}
          </button>

          <button
            onClick={handleStartBackgroundTask}
            disabled={!backgroundTask || taskStatus?.isRunning}
            className={`
              px-6 py-3 rounded-lg font-semibold text-white text-lg
              transition-all duration-200 shadow-lg
              ${!backgroundTask || taskStatus?.isRunning
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl transform hover:scale-105'
              }
            `}
          >
            {taskStatus?.isRunning ? '🔄 监控中...' : '▶️ 启动监控'}
          </button>

          <button
            onClick={handleStopBackgroundTask}
            disabled={!backgroundTask || !taskStatus?.isRunning}
            className={`
              px-6 py-3 rounded-lg font-semibold text-white text-lg
              transition-all duration-200 shadow-lg
              ${!backgroundTask || !taskStatus?.isRunning
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 hover:shadow-xl transform hover:scale-105'
              }
            `}
          >
            ⏹️ 停止监控
          </button>
        </div>

        {/* 后台任务状态 */}
        {taskStatus && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-3">📊 后台任务状态</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-semibold text-gray-600">状态:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${
                  taskStatus.isRunning ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {taskStatus.isRunning ? '运行中' : '已停止'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-600">扫描次数:</span>
                <span className="ml-2 font-bold text-blue-600">{taskStatus.totalScans}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-600">发现机会:</span>
                <span className="ml-2 font-bold text-purple-600">{taskStatus.opportunitiesFound}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-600">最后扫描:</span>
                <span className="ml-2 text-gray-500">
                  {taskStatus.lastScanTime ? new Date(taskStatus.lastScanTime).toLocaleTimeString() : '从未'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 错误信息 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700">❌ {error}</p>
          </div>
        )}

        {/* 数据展示 */}
        {data && (
          <>
            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="总账户数"
                value={data.totalAccounts}
                color="blue"
                icon="📊"
              />
              <StatsCard
                title="可清算账户"
                value={data.liquidatableCount}
                color="red"
                icon="🔴"
              />
              <StatsCard
                title="健康账户"
                value={data.healthyCount}
                color="green"
                icon="✅"
              />
              <StatsCard
                title="总盈利潜力"
                value={`$${data.accounts
                  .reduce((sum, acc) => sum + acc.estimatedProfit, 0)
                  .toFixed(2)}`}
                color="purple"
                icon="💰"
              />
            </div>

            {/* 协议统计 */}
            <div className="mb-8 p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📈 协议分布</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{data.protocols.solend}</div>
                  <div className="text-sm text-gray-600">Solend</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{data.protocols.mango}</div>
                  <div className="text-sm text-gray-600">Mango</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{data.protocols.kamino}</div>
                  <div className="text-sm text-gray-600">Kamino</div>
                </div>
              </div>
            </div>

            {/* 账户列表 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600">
                <h2 className="text-2xl font-bold text-white">
                  📋 清算机会 ({data.accounts.length})
                </h2>
                <p className="text-blue-100 mt-1">
                  扫描时间: {new Date(data.timestamp).toLocaleString('zh-CN')}
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-700">协议</th>
                      <th className="text-left p-4 font-semibold text-gray-700">账户地址</th>
                      <th className="text-right p-4 font-semibold text-gray-700">抵押品</th>
                      <th className="text-right p-4 font-semibold text-gray-700">借款</th>
                      <th className="text-right p-4 font-semibold text-gray-700">健康因子</th>
                      <th className="text-right p-4 font-semibold text-gray-700">潜在盈利</th>
                      <th className="text-center p-4 font-semibold text-gray-700">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.accounts.slice(0, 50).map((acc, idx) => (
                      <tr
                        key={idx}
                        className="border-t border-gray-100 hover:bg-blue-50 transition-colors"
                      >
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            acc.protocol === 'Solend' ? 'bg-blue-100 text-blue-800' :
                            acc.protocol === 'Mango' ? 'bg-green-100 text-green-800' :
                            acc.protocol === 'Kamino' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {acc.protocol}
                          </span>
                        </td>
                        <td className="p-4">
                          <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            {acc.address.slice(0, 8)}...{acc.address.slice(-8)}
                          </code>
                        </td>
                        <td className="text-right p-4 font-semibold text-gray-800">
                          ${acc.collateralValue.toFixed(2)}
                        </td>
                        <td className="text-right p-4 font-semibold text-gray-800">
                          ${acc.borrowedValue.toFixed(2)}
                        </td>
                        <td className="text-right p-4">
                          <span className={`font-bold ${
                            acc.healthFactor < 1.05 ? 'text-red-600' :
                            acc.healthFactor < 1.2 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {acc.healthFactor.toFixed(4)}
                          </span>
                        </td>
                        <td className="text-right p-4">
                          <span className="font-bold text-purple-600">
                            ${acc.estimatedProfit.toFixed(2)}
                          </span>
                        </td>
                        <td className="text-center p-4">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleExecuteLiquidation(acc)}
                              disabled={!wallet.connected || executingLiquidation === acc.address}
                              className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                                !wallet.connected || executingLiquidation === acc.address
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-blue-500 text-white hover:bg-blue-600'
                              }`}
                            >
                              {executingLiquidation === acc.address ? '执行中...' : '清算'}
                            </button>
                            <button
                              onClick={() => handleExecuteFlashLoanLiquidation(acc)}
                              disabled={!wallet.connected || executingLiquidation === acc.address}
                              className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                                !wallet.connected || executingLiquidation === acc.address
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-purple-500 text-white hover:bg-purple-600'
                              }`}
                            >
                              闪电贷
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {data.accounts.length > 50 && (
                <div className="p-4 bg-gray-50 text-center text-gray-600">
                  显示前 50 个账户，共 {data.accounts.length} 个
                </div>
              )}
            </div>
          </>
        )}

        {/* 清算结果 */}
        {liquidationResults.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-green-600 to-emerald-600">
              <h2 className="text-2xl font-bold text-white">
                📊 清算执行结果
              </h2>
            </div>
            <div className="p-6">
              {liquidationResults.map((result, idx) => (
                <div key={idx} className={`p-4 rounded-lg mb-3 ${
                  result.success ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold">
                        {result.success ? '✅ 清算成功' : '❌ 清算失败'}
                      </div>
                      {result.txSignature && (
                        <div className="text-sm text-gray-600 mt-1">
                          交易签名: <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {result.txSignature.slice(0, 8)}...{result.txSignature.slice(-8)}
                          </code>
                        </div>
                      )}
                      {result.error && (
                        <div className="text-sm text-red-600 mt-1">
                          错误: {result.error}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-purple-600">
                        ${result.profit.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Gas: {result.gasUsed}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 空状态 */}
        {!data && !scanning && (
          <div className="text-center py-16 bg-white rounded-lg shadow-lg">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              准备就绪
            </h3>
            <p className="text-gray-500 mb-4">
              连接钱包后，点击"手动扫描"或"启动监控"开始扫描清算机会
            </p>
            {!wallet.connected && (
              <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                💡 请先连接钱包以执行清算交易
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// 统计卡片组件
function StatsCard({ 
  title, 
  value, 
  color, 
  icon 
}: { 
  title: string; 
  value: number | string; 
  color: string; 
  icon: string;
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
  }[color];

  return (
    <div className={`
      bg-gradient-to-br ${colorClasses} 
      rounded-lg shadow-lg p-6 text-white
      transform transition-all duration-200 hover:scale-105 hover:shadow-xl
    `}>
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm opacity-90">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-4xl font-bold">{value}</p>
    </div>
  );
}
