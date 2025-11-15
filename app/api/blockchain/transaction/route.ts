/**
 * Transaction Submission API Route
 * POST /api/blockchain/transaction
 */

import { NextRequest, NextResponse } from 'next/server';
import { blockchainAPI } from '@/lib/blockchain/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const tx = {
      from: body.from,
      to: body.to,
      amount: BigInt(body.amount),
      data: body.data,
      gasPrice: body.gasPrice ? BigInt(body.gasPrice) : undefined
    };
    
    const result = await blockchainAPI.submitTransaction(tx, body.useMEVProtection !== false);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, timestamp: Date.now() },
      { status: 500 }
    );
  }
}
