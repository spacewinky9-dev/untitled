/**
 * Gas Price Prediction API Route  
 * GET /api/blockchain/gas-price
 */

import { NextRequest, NextResponse } from 'next/server';
import { blockchainAPI } from '@/lib/blockchain/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const utilization = searchParams.get('utilization');
    
    const result = await blockchainAPI.predictGasPrice(
      utilization ? parseFloat(utilization) : undefined
    );
    
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, timestamp: Date.now() },
      { status: 500 }
    );
  }
}
