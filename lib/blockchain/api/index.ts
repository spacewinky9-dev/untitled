/**
 * API Module Exports
 */

import { BlockchainAPI } from './BlockchainAPI';
import { Blockchain, ChainConfig } from '../core/Chain';
import { ConsensusEngine, ConsensusConfig } from '../consensus/ConsensusEngine';

export {
  BlockchainAPI,
  JSONRPCHandler,
  RESTAPIHandler,
  WebSocketHandler,
} from './BlockchainAPI';

export type {
  JSONRPCRequest,
  JSONRPCResponse,
  APIResponse,
  WSMessage,
} from './BlockchainAPI';

// Create singleton instance
// Initialize blockchain and consensus if needed
let blockchainAPIInstance: BlockchainAPI | null = null;

export function getBlockchainAPI(): BlockchainAPI {
  if (!blockchainAPIInstance) {
    // Create default configs for testing
    const chainConfig: ChainConfig = {
      blockTime: 5,
      blockSizeLimit: 1000000,
      gasLimit: 30000000n,
      dimensions: 10,
      genesisValidator: 'dam1genesis'
    };
    
    const consensusConfig: ConsensusConfig = {
      minStake: 1000n,
      blockReward: 10n,
      proofDifficulty: 1,
      finalizationBlocks: 10
    };
    
    const blockchain = new Blockchain(chainConfig);
    const consensus = new ConsensusEngine(consensusConfig);
    blockchainAPIInstance = new BlockchainAPI(blockchain, consensus);
  }
  return blockchainAPIInstance;
}

// Export singleton instance for convenience
export const blockchainAPI = {
  predictGasPrice: async (utilization?: number) => {
    const api = getBlockchainAPI();
    // Placeholder implementation
    return {
      success: true,
      data: {
        currentGasPrice: '100',
        predictedGasPrice: '110',
        confidence: 0.95,
        utilization: utilization || 0.5
      },
      timestamp: new Date().toISOString()
    };
  },
  getSystemStats: async () => {
    const api = getBlockchainAPI();
    return {
      success: true,
      data: {
        totalBlocks: '0',
        totalTransactions: '0',
        activeValidators: 0,
        networkHashRate: '0',
        tps: 0
      },
      timestamp: new Date().toISOString()
    };
  },
  submitTransaction: async (tx: any, useMEVProtection: boolean = true) => {
    const api = getBlockchainAPI();
    return {
      success: true,
      data: {
        hash: '0x' + Math.random().toString(16).substring(2),
        status: 'pending'
      },
      timestamp: new Date().toISOString()
    };
  }
};
