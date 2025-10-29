import { Connection, PublicKey } from '@solana/web3.js';
import { config, getRpcEndpoint } from './config';

// 从配置读取 RPC 端点
// 配置源: solana-liquidation-bot/env/.info
const RPC_ENDPOINT = getRpcEndpoint() || 'https://api.devnet.solana.com'; // 确保有默认值

console.log('🔗 Solana 连接配置:');
console.log('  集群:', config.cluster);
console.log('  RPC:', RPC_ENDPOINT);

// 验证 RPC_ENDPOINT 有效性
if (!RPC_ENDPOINT || !RPC_ENDPOINT.startsWith('http')) {
  throw new Error(`Invalid RPC endpoint: ${RPC_ENDPOINT}`);
}

// 创建连接，设置更长的超时时间
export const connection = new Connection(RPC_ENDPOINT, {
  commitment: 'confirmed',
  confirmTransactionInitialTimeout: 120000, // 120 秒
});

// 协议 Program ID
export const SOLEND_PROGRAM_ID = new PublicKey(
  'So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo'
);

export const MANGO_PROGRAM_ID = new PublicKey(
  '4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg'
);

// 导出配置供其他模块使用
export { config, getRpcEndpoint };

