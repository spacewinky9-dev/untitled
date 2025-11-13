/**
 * API & Integration Layer - Phase 12
 * JSON-RPC, REST, WebSocket APIs for blockchain interaction
 */

import { Blockchain } from '../core/Chain';
import { Transaction } from '../core/Transaction';
import { Block } from '../core/Block';
import { Wallet } from '../wallet/Wallet';
import { DamCoin } from '../tokens/DamCoin';
import { ConsensusEngine } from '../consensus/ConsensusEngine';

/**
 * JSON-RPC Request
 */
export interface JSONRPCRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: any[];
}

/**
 * JSON-RPC Response
 */
export interface JSONRPCResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

/**
 * REST API Response
 */
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

/**
 * WebSocket Message
 */
export interface WSMessage {
  type: 'subscribe' | 'unsubscribe' | 'notification';
  event?: string;
  data?: any;
}

/**
 * JSON-RPC API Handler (Ethereum-compatible)
 */
export class JSONRPCHandler {
  private blockchain: Blockchain;
  private consensus: ConsensusEngine;

  constructor(blockchain: Chain, consensus: ConsensusEngine) {
    this.blockchain = blockchain;
    this.consensus = consensus;
  }

  /**
   * Handle JSON-RPC request
   */
  async handleRequest(request: JSONRPCRequest): Promise<JSONRPCResponse> {
    try {
      const result = await this.executeMethod(request.method, request.params || []);
      
      return {
        jsonrpc: '2.0',
        id: request.id,
        result,
      };
    } catch (error: any) {
      return {
        jsonrpc: '2.0',
        id: request.id,
        error: {
          code: -32000,
          message: error.message || 'Internal error',
        },
      };
    }
  }

  /**
   * Execute RPC method
   */
  private async executeMethod(method: string, params: any[]): Promise<any> {
    switch (method) {
      // Network methods
      case 'dam_getBlockNumber':
        return this.blockchain.chain.length - 1;

      case 'dam_getBlockByNumber':
        return this.getBlockByNumber(params[0]);

      case 'dam_getBlockByHash':
        return this.getBlockByHash(params[0]);

      // Transaction methods
      case 'dam_getTransactionByHash':
        return this.getTransactionByHash(params[0]);

      case 'dam_sendTransaction':
        return this.sendTransaction(params[0]);

      case 'dam_sendRawTransaction':
        return this.sendRawTransaction(params[0]);

      case 'dam_getTransactionReceipt':
        return this.getTransactionReceipt(params[0]);

      // Account methods
      case 'dam_getBalance':
        return this.blockchain.getBalance(params[0]).toString();

      case 'dam_getTransactionCount':
        return this.blockchain.getNonce(params[0]).toString();

      case 'dam_call':
        return this.call(params[0]);

      case 'dam_estimateGas':
        return this.estimateGas(params[0]);

      // Network info
      case 'dam_chainId':
        return '1'; // DamChain mainnet

      case 'dam_gasPrice':
        return '1000000'; // 1 Gwei

      case 'dam_accounts':
        return []; // No default accounts

      // Consensus methods
      case 'dam_getValidators':
        return this.consensus.getActiveValidators().map(v => ({
          address: v.address,
          stake: v.stake.toString(),
          reputation: v.reputation,
        }));

      case 'dam_getConsensusStats':
        return this.consensus.getNetworkStats();

      default:
        throw new Error(`Method ${method} not supported`);
    }
  }

  private getBlockByNumber(number: number): any {
    const block = this.blockchain.chain[number];
    if (!block) return null;

    return {
      number: number,
      hash: block.hash,
      parentHash: block.previousHash,
      timestamp: block.timestamp.toISOString(),
      transactions: block.transactions.map(tx => tx.hash),
      transactionCount: block.transactions.length,
      validator: block.validator,
      proof: block.proof,
    };
  }

  private getBlockByHash(hash: string): any {
    const block = this.blockchain.chain.find(b => b.hash === hash);
    if (!block) return null;

    return {
      number: this.blockchain.chain.indexOf(block),
      hash: block.hash,
      parentHash: block.previousHash,
      timestamp: block.timestamp.toISOString(),
      transactions: block.transactions.map(tx => tx.hash),
      transactionCount: block.transactions.length,
      validator: block.validator,
      proof: block.proof,
    };
  }

  private getTransactionByHash(hash: string): any {
    // Search in all blocks
    for (const block of this.blockchain.chain) {
      const tx = block.transactions.find(t => t.hash === hash);
      if (tx) {
        return {
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: tx.value.toString(),
          gasPrice: tx.gasPrice.toString(),
          gasLimit: tx.gasLimit.toString(),
          nonce: tx.nonce.toString(),
          blockHash: block.hash,
          blockNumber: this.blockchain.chain.indexOf(block),
        };
      }
    }

    // Check pending transactions
    const pendingTx = this.blockchain.pendingTransactions.find(t => t.hash === hash);
    if (pendingTx) {
      return {
        hash: pendingTx.hash,
        from: pendingTx.from,
        to: pendingTx.to,
        value: pendingTx.value.toString(),
        gasPrice: pendingTx.gasPrice.toString(),
        gasLimit: pendingTx.gasLimit.toString(),
        nonce: pendingTx.nonce.toString(),
        blockHash: null,
        blockNumber: null,
      };
    }

    return null;
  }

  private async sendTransaction(txData: any): Promise<string> {
    const tx = new Transaction({
      from: txData.from,
      to: txData.to,
      value: BigInt(txData.value || 0),
      gasPrice: BigInt(txData.gasPrice || 1000000),
      gasLimit: BigInt(txData.gasLimit || 21000),
      nonce: BigInt(txData.nonce || 0),
      data: txData.data,
      timestamp: new Date(),
    });

    this.blockchain.addTransaction(tx);
    return tx.hash;
  }

  private async sendRawTransaction(rawTx: string): Promise<string> {
    // Parse and validate raw transaction
    // In production, deserialize from hex
    throw new Error('sendRawTransaction not implemented');
  }

  private getTransactionReceipt(hash: string): any {
    for (const block of this.blockchain.chain) {
      const tx = block.transactions.find(t => t.hash === hash);
      if (tx) {
        return {
          transactionHash: tx.hash,
          blockHash: block.hash,
          blockNumber: this.blockchain.chain.indexOf(block),
          from: tx.from,
          to: tx.to,
          gasUsed: tx.gasLimit.toString(),
          status: '1', // success
        };
      }
    }

    return null;
  }

  private async call(txData: any): Promise<string> {
    // Simulate contract call without creating transaction
    return '0x';
  }

  private estimateGas(txData: any): string {
    // Estimate gas for transaction
    return '21000';
  }
}

/**
 * REST API Handler
 */
export class RESTAPIHandler {
  private blockchain: Blockchain;
  private consensus: ConsensusEngine;

  constructor(blockchain: Chain, consensus: ConsensusEngine) {
    this.blockchain = blockchain;
    this.consensus = consensus;
  }

  /**
   * Get blockchain info
   */
  getBlockchainInfo(): APIResponse {
    return {
      success: true,
      data: {
        chainId: 1,
        blockHeight: this.blockchain.chain.length - 1,
        totalTransactions: this.blockchain.chain.reduce((sum, block) => 
          sum + block.transactions.length, 0),
        pendingTransactions: this.blockchain.pendingTransactions.length,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get latest blocks
   */
  getLatestBlocks(limit: number = 10): APIResponse {
    const blocks = this.blockchain.chain.slice(-limit).reverse().map((block, idx) => ({
      number: this.blockchain.chain.length - 1 - idx,
      hash: block.hash,
      timestamp: typeof block.timestamp === 'number' 
        ? new Date(block.timestamp).toISOString()
        : block.timestamp.toISOString(),
      transactionCount: block.transactions.length,
      validator: block.validator,
    }));

    return {
      success: true,
      data: blocks,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get recent transactions
   */
  getRecentTransactions(limit: number = 10): APIResponse {
    const allTxs: any[] = [];
    
    for (let i = this.blockchain.chain.length - 1; i >= 0 && allTxs.length < limit; i--) {
      const block = this.blockchain.chain[i];
      for (const tx of block.transactions) {
        if (allTxs.length >= limit) break;
        allTxs.push({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: tx.value.toString(),
          blockNumber: i,
          timestamp: block.timestamp.toISOString(),
        });
      }
    }

    return {
      success: true,
      data: allTxs,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get address info
   */
  getAddressInfo(address: string): APIResponse {
    const balance = this.blockchain.getBalance(address);
    const nonce = this.blockchain.getNonce(address);

    return {
      success: true,
      data: {
        address,
        balance: balance.toString(),
        nonce: nonce.toString(),
        transactionCount: 0, // Would calculate from blockchain
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get network statistics
   */
  getNetworkStats(): APIResponse {
    const stats = this.consensus.getNetworkStats?.() || {
      totalBlocks: 0,
      totalTransactions: 0,
      totalStake: 0n,
    };

    return {
      success: true,
      data: {
        totalBlocks: this.blockchain.chain.length,
        ...(stats || {}),
        activeValidators: this.consensus.getActiveValidators().length,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Search blockchain
   */
  search(query: string): APIResponse {
    // Search for block hash, tx hash, or address
    let result: any = null;
    let type: string = 'unknown';

    // Check if block hash
    const block = this.blockchain.chain.find(b => b.hash === query);
    if (block) {
      result = {
        number: this.blockchain.chain.indexOf(block),
        hash: block.hash,
        timestamp: block.timestamp.toISOString(),
      };
      type = 'block';
    }

    // Check if transaction hash
    if (!result) {
      for (const block of this.blockchain.chain) {
        const tx = block.transactions.find(t => t.hash === query);
        if (tx) {
          result = {
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: tx.value.toString(),
          };
          type = 'transaction';
          break;
        }
      }
    }

    // Check if address
    if (!result && query.startsWith('dam1')) {
      const balance = this.blockchain.getBalance(query);
      result = {
        address: query,
        balance: balance.toString(),
      };
      type = 'address';
    }

    return {
      success: !!result,
      data: result ? { type, ...result } : null,
      error: result ? undefined : 'Not found',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * WebSocket Handler for real-time updates
 */
export class WebSocketHandler {
  private subscriptions: Map<string, Set<string>> = new Map();

  /**
   * Subscribe to event
   */
  subscribe(clientId: string, event: string): void {
    if (!this.subscriptions.has(event)) {
      this.subscriptions.set(event, new Set());
    }
    this.subscriptions.get(event)!.add(clientId);
  }

  /**
   * Unsubscribe from event
   */
  unsubscribe(clientId: string, event: string): void {
    if (this.subscriptions.has(event)) {
      this.subscriptions.get(event)!.delete(clientId);
    }
  }

  /**
   * Broadcast event to subscribers
   */
  broadcast(event: string, data: any): string[] {
    const subscribers = this.subscriptions.get(event);
    return subscribers ? Array.from(subscribers) : [];
  }

  /**
   * Handle WebSocket message
   */
  handleMessage(clientId: string, message: WSMessage): any {
    switch (message.type) {
      case 'subscribe':
        if (message.event) {
          this.subscribe(clientId, message.event);
          return { type: 'subscribed', event: message.event };
        }
        break;

      case 'unsubscribe':
        if (message.event) {
          this.unsubscribe(clientId, message.event);
          return { type: 'unsubscribed', event: message.event };
        }
        break;
    }

    return { type: 'error', message: 'Invalid message' };
  }

  /**
   * Notify new block
   */
  notifyNewBlock(block: Block): void {
    const subscribers = this.broadcast('newBlock', {
      number: 0, // Would get from blockchain
      hash: block.hash,
      timestamp: block.timestamp.toISOString(),
      transactionCount: block.transactions.length,
    });
  }

  /**
   * Notify new transaction
   */
  notifyNewTransaction(tx: Transaction): void {
    this.broadcast('newTransaction', {
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: tx.value.toString(),
    });
  }
}

/**
 * Unified API Server
 */
export class BlockchainAPI {
  private jsonRPC: JSONRPCHandler;
  private rest: RESTAPIHandler;
  private ws: WebSocketHandler;

  constructor(blockchain: Chain, consensus: ConsensusEngine) {
    this.jsonRPC = new JSONRPCHandler(blockchain, consensus);
    this.rest = new RESTAPIHandler(blockchain, consensus);
    this.ws = new WebSocketHandler();
  }

  getJSONRPC(): JSONRPCHandler {
    return this.jsonRPC;
  }

  getREST(): RESTAPIHandler {
    return this.rest;
  }

  getWebSocket(): WebSocketHandler {
    return this.ws;
  }
}
