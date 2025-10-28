'use client';

import { useState, useEffect } from 'react';
import { scanSolendAccounts, LiquidationOpportunity, ScanResult, healthCheck } from '@/lib/api';

export default function Dashboard() {
  const [scanning, setScanning] = useState(false);
  const [data, setData] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<{
    cluster: string;
    hasApiKey: boolean;
  } | null>(null);

  // 检查 API 状态
  useEffect(() => {
    healthCheck().then(status => {
      setApiStatus({
        cluster: status.cluster,
        hasApiKey: status.hasApiKey
      });
    }).catch(err => {
      console.error('API 健康检查失败:', err);
    });
  }, []);

  const handleScan = async () => {
    setScanning(true);
    setError(null);
    try {
      const result = await scanSolendAccounts();
      setData(result);
    } catch (err) {
      console.error('扫描失败:', err);
      setError(err instanceof Error ? err.message : '扫描失败');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* 标题区域 */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            🚀 Solana 清算机器人
          </h1>
          <p className="text-gray-600 text-lg">
            实时扫描 Solend 协议的清算机会
          </p>
          {apiStatus && (
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                🌐 集群: <span className="font-semibold text-blue-600">{apiStatus.cluster.toUpperCase()}</span>
              </span>
              <span className="flex items-center gap-1">
                📡 RPC: <span className="font-mono text-xs">{apiStatus.hasApiKey ? 'Helius ✓' : 'Standard'}</span>
              </span>
              <span className="flex items-center gap-1 text-green-600">
                🔒 <span className="font-semibold">安全模式</span>
              </span>
            </div>
          )}
        </div>

        {/* 操作区域 */}
        <div className="mb-8">
          <button
            onClick={handleScan}
            disabled={scanning}
            className={`
              px-8 py-4 rounded-lg font-semibold text-white text-lg
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
              '🔍 开始扫描'
            )}
          </button>
        </div>

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

            {/* 账户列表 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600">
                <h2 className="text-2xl font-bold text-white">
                  📋 账户详情 ({data.accounts.length})
                </h2>
                <p className="text-blue-100 mt-1">
                  扫描时间: {new Date(data.timestamp).toLocaleString('zh-CN')}
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-700">#</th>
                      <th className="text-left p-4 font-semibold text-gray-700">账户地址</th>
                      <th className="text-right p-4 font-semibold text-gray-700">抵押品</th>
                      <th className="text-right p-4 font-semibold text-gray-700">借款</th>
                      <th className="text-right p-4 font-semibold text-gray-700">抵押率</th>
                      <th className="text-right p-4 font-semibold text-gray-700">健康因子</th>
                      <th className="text-center p-4 font-semibold text-gray-700">状态</th>
                      <th className="text-right p-4 font-semibold text-gray-700">潜在盈利</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.accounts.slice(0, 100).map((acc, idx) => (
                      <tr
                        key={idx}
                        className="border-t border-gray-100 hover:bg-blue-50 transition-colors"
                      >
                        <td className="p-4 text-gray-600">{idx + 1}</td>
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
                            acc.collateralRatio < 110 ? 'text-red-600' : 
                            acc.collateralRatio < 130 ? 'text-yellow-600' : 
                            'text-green-600'
                          }`}>
                            {acc.collateralRatio.toFixed(2)}%
                          </span>
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
                        <td className="text-center p-4">
                          <span className={`
                            px-3 py-1 rounded-full text-sm font-medium
                            ${acc.isLiquidatable 
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                            }
                          `}>
                            {acc.isLiquidatable ? '🔴 可清算' : '✅ 健康'}
                          </span>
                        </td>
                        <td className="text-right p-4">
                          <span className="font-bold text-purple-600">
                            ${acc.estimatedProfit.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {data.accounts.length > 100 && (
                <div className="p-4 bg-gray-50 text-center text-gray-600">
                  显示前 100 个账户，共 {data.accounts.length} 个
                </div>
              )}
            </div>
          </>
        )}

        {/* 空状态 */}
        {!data && !scanning && (
          <div className="text-center py-16 bg-white rounded-lg shadow-lg">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              准备就绪
            </h3>
            <p className="text-gray-500">
              点击"开始扫描"按钮查看 Solend 协议的清算机会
            </p>
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

