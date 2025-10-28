import { Connection, PublicKey } from '@solana/web3.js';
import { config, getRpcEndpoint } from './config';

// 从配置读取 RPC 端点
// 配置源: solana-liquidation-bot/env/.info
const RPC_ENDPOINT = getRpcEndpoint();

console.log('🔗 Solana 连接配置:');
console.log('  集群:', config.cluster);
console.log('  RPC:', RPC_ENDPOINT);

export const connection = new Connection(RPC_ENDPOINT, 'confirmed');

// 协议 Program ID
export const SOLEND_PROGRAM_ID = new PublicKey(
  'So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo'
);

export const MANGO_PROGRAM_ID = new PublicKey(
  '4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg'
);

// 导出配置供其他模块使用
export { config, getRpcEndpoint };

