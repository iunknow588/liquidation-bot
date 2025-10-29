// ✅ 前端 RPC 配置
// 所有配置都在前端使用，使用 NEXT_PUBLIC_ 前缀

// 配置类型
type ClusterType = 'mainnet' | 'testnet' | 'devnet';

// RPC 端点配置
const RPC_ENDPOINTS = {
  mainnet: process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC || 'https://api.mainnet-beta.solana.com',
  testnet: process.env.NEXT_PUBLIC_SOLANA_TESTNET_RPC || 'https://api.testnet.solana.com',
  devnet: process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC || 'https://api.devnet.solana.com',
};

// Helius API Key（前端直接使用，公开可见）
// 注意：对于学习/测试项目，使用公开的 Solana 节点就够了
const HELIUS_API_KEY = 
  process.env.NEXT_PUBLIC_HELIUS_API_KEY || 
  '08108945-f5b2-4aa4-8453-58e16774c9ba'; // Demo Key

// 当前使用的集群
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
  const endpoint = RPC_ENDPOINTS[targetCluster];
  
  // 最终兜底：确保总是返回有效的 URL
  if (!endpoint || endpoint === 'undefined') {
    console.warn(`⚠️  RPC 端点无效，使用默认 devnet: ${endpoint}`);
    return 'https://api.devnet.solana.com';
  }
  
  return endpoint;
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

