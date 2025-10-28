// Solana RPC 配置
// 配置源: solana-liquidation-bot/env/.info
// 通过 sync-config.sh 同步到环境变量

// 配置类型
type ClusterType = 'mainnet' | 'testnet' | 'devnet';

// 从环境变量读取配置（支持运行时切换）
const RPC_ENDPOINTS = {
  mainnet: process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC || 'https://api.mainnet-beta.solana.com',
  testnet: process.env.NEXT_PUBLIC_SOLANA_TESTNET_RPC || 'https://api.testnet.solana.com',
  devnet: process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC || 'https://api.devnet.solana.com',
};

// Helius API Key（从环境变量读取或使用默认值）
const HELIUS_API_KEY = 
  process.env.NEXT_PUBLIC_HELIUS_API_KEY || 
  '08108945-f5b2-4aa4-8453-58e16774c9ba';

// 当前使用的集群（从环境变量读取，默认 mainnet）
const CURRENT_CLUSTER: ClusterType = 
  (process.env.NEXT_PUBLIC_SOLANA_CLUSTER as ClusterType) || 'mainnet';

// 获取 RPC 端点
export function getRpcEndpoint(cluster?: ClusterType): string {
  const targetCluster = cluster || CURRENT_CLUSTER;
  
  // 优先使用 Helius（更稳定）
  if (HELIUS_API_KEY && targetCluster === 'mainnet') {
    return `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
  }
  
  if (HELIUS_API_KEY && targetCluster === 'devnet') {
    return `https://devnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
  }
  
  // 降级到标准 RPC
  return RPC_ENDPOINTS[targetCluster];
}

// 备用 RPC 列表
export const BACKUP_RPC_URLS = [
  'https://solana-api.projectserum.com',
  'https://api.mainnet-beta.solana.com',
  'https://api.devnet.solana.com',
];

// 导出配置
export const config = {
  cluster: CURRENT_CLUSTER,
  rpcEndpoint: getRpcEndpoint(),
  heliusApiKey: HELIUS_API_KEY,
  backupRpcUrls: BACKUP_RPC_URLS,
};

// 打印当前配置（开发环境）
if (process.env.NODE_ENV === 'development') {
  console.log('📡 Solana RPC 配置:');
  console.log('  集群:', CURRENT_CLUSTER);
  console.log('  RPC 端点:', getRpcEndpoint());
  console.log('  Helius API:', HELIUS_API_KEY ? '已配置' : '未配置');
}

