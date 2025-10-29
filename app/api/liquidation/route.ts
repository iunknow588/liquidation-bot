import { NextRequest, NextResponse } from 'next/server';
import { Connection } from '@solana/web3.js';
import { EnhancedLiquidationScanner } from '@/lib/enhanced-scanner';

// 全局连接实例
let connection: Connection | null = null;

function getConnection(): Connection {
  if (!connection) {
    connection = new Connection(
      process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com',
      'confirmed'
    );
  }
  return connection;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const protocol = searchParams.get('protocol');

    const conn = getConnection();
    const scanner = new EnhancedLiquidationScanner(conn);

    switch (action) {
      case 'scan':
        if (protocol && ['solend', 'mango', 'kamino'].includes(protocol)) {
          const opportunities = await scanner.scanProtocol(protocol as any);
          return NextResponse.json({
            success: true,
            protocol,
            opportunities,
            count: opportunities.length,
            timestamp: Date.now(),
          });
        } else {
          const result = await scanner.scanAllProtocols();
          return NextResponse.json({
            success: true,
            result,
            timestamp: Date.now(),
          });
        }

      case 'status':
        return NextResponse.json({
          success: true,
          status: {
            rpcEndpoint: conn.rpcEndpoint,
            commitment: 'confirmed',
            timestamp: Date.now(),
          },
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
        }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, config } = body;

    const conn = getConnection();

    switch (action) {
      case 'start_monitoring':
        // 这里可以实现更复杂的监控逻辑
        return NextResponse.json({
          success: true,
          message: 'Monitoring started',
          config,
          timestamp: Date.now(),
        });

      case 'stop_monitoring':
        return NextResponse.json({
          success: true,
          message: 'Monitoring stopped',
          timestamp: Date.now(),
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
        }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
