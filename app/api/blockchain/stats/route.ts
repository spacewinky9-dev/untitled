/**
 * Blockchain Statistics API Route
 * GET /api/blockchain/stats
 */

import { NextRequest, NextResponse } from 'next/server';
import { blockchainAPI } from '@/lib/blockchain/api/BlockchainAPI';

export async function GET(request: NextRequest) {
  try {
    const stats = await blockchainAPI.getSystemStats();
    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, timestamp: Date.now() },
      { status: 500 }
    );
  }
}
