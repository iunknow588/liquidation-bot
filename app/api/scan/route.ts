import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';

// 🔒 安全：API Key 只在服务器端，不会暴露给前端
const HELIUS_API_KEY = process.env.HELIUS_API_KEY || '';
const SOLANA_CLUSTER = process.env.SOLANA_CLUSTER || 'mainnet';

// Solend Program ID
const SOLEND_PROGRAM_ID = new PublicKey(
  'So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo'
);

// 获取 RPC 端点
function getRpcEndpoint(): { url: string; provider: string } {
  if (HELIUS_API_KEY) {
    // 使用 Helius（如果配置了 API Key）
    if (SOLANA_CLUSTER === 'devnet') {
      return {
        url: `https://devnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`,
        provider: 'Helius Devnet'
      };
    }
    return {
      url: `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`,
      provider: 'Helius Mainnet'
    };
  }
  
  // 使用 Solana 公开节点（免费，无需 API Key）
  if (SOLANA_CLUSTER === 'devnet') {
    return {
      url: 'https://api.devnet.solana.com',
      provider: 'Solana 公开节点 (Devnet)'
    };
  }
  
  return {
    url: 'https://api.mainnet-beta.solana.com',
    provider: 'Solana 公开节点 (Mainnet)'
  };
}

// 简单的限流（防止滥用）
const requestCache = new Map<string, number>();
const RATE_LIMIT = 10; // 每分钟最多 10 次请求
const RATE_WINDOW = 60000; // 1 分钟

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const key = `${ip}-${Math.floor(now / RATE_WINDOW)}`;
  const count = requestCache.get(key) || 0;
  
  if (count >= RATE_LIMIT) {
    return false;
  }
  
  requestCache.set(key, count + 1);
  
  // 清理过期的缓存
  const currentKey = `${ip}-${Math.floor(now / RATE_WINDOW)}`;
  Array.from(requestCache.keys()).forEach(k => {
    if (!k.startsWith(currentKey)) {
      requestCache.delete(k);
    }
  });
  
  return true;
}

// POST /api/scan
export async function POST(request: NextRequest) {
  try {
    // 获取客户端 IP
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // 限流检查
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: '请求过于频繁，请稍后再试' },
        { status: 429 }
      );
    }
    
    console.log(`[API] 扫描请求来自: ${ip}`);
    
    // 创建 Solana 连接
    const rpcConfig = getRpcEndpoint();
    const connection = new Connection(rpcConfig.url, 'confirmed');
    
    console.log(`[API] 使用 RPC: ${rpcConfig.provider}`);
    
    // 获取 Solend 账户
    const accounts = await connection.getProgramAccounts(
      SOLEND_PROGRAM_ID,
      {
        filters: [
          { dataSize: 916 } // Solend Obligation 账户大小
        ],
        commitment: 'confirmed'
      }
    );
    
    console.log(`[API] 获取到 ${accounts.length} 个账户`);
    
    // 处理账户数据
    const opportunities = accounts.map(({ pubkey, account }) => {
      // 模拟解析（实际需要根据 Solend 结构）
      const collateralValue = Math.random() * 50000 + 10000;
      const borrowedValue = Math.random() * 40000 + 5000;
      const healthFactor = collateralValue / borrowedValue;
      const collateralRatio = (collateralValue / borrowedValue) * 100;
      const liquidationThreshold = 1.05;
      const isLiquidatable = healthFactor < liquidationThreshold;
      const estimatedProfit = isLiquidatable 
        ? (collateralValue - borrowedValue) * 0.05
        : 0;
      
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
        estimatedProfit
      };
    });
    
    // 按健康因子排序
    opportunities.sort((a, b) => a.healthFactor - b.healthFactor);
    
    const liquidatableCount = opportunities.filter(o => o.isLiquidatable).length;
    const healthyCount = opportunities.length - liquidatableCount;
    
    // 返回结果
    return NextResponse.json({
      success: true,
      data: {
        accounts: opportunities,
        totalAccounts: opportunities.length,
        liquidatableCount,
        healthyCount,
        timestamp: Date.now(),
        cluster: SOLANA_CLUSTER
      }
    });
    
  } catch (error) {
    console.error('[API] 扫描失败:', error);
    
    return NextResponse.json(
      { 
        error: '扫描失败', 
        message: error instanceof Error ? error.message : '未知错误' 
      },
      { status: 500 }
    );
  }
}

// GET /api/scan (健康检查)
export async function GET() {
  const rpcConfig = getRpcEndpoint();
  
  return NextResponse.json({
    status: 'ok',
    cluster: SOLANA_CLUSTER,
    provider: rpcConfig.provider,
    hasApiKey: !!HELIUS_API_KEY,
    usingPublicRpc: !HELIUS_API_KEY,
    timestamp: Date.now()
  });
}

