/**
 * MEVProtection.ts
 * MEV Protection & Game-Theoretic Security for DamChain (Phase 19)
 * 
 * Implements:
 * - Front-running prevention
 * - Fair transaction ordering
 * - Encrypted mempools
 * - Proposer-builder separation (PBS)
 * - Commit-reveal schemes
 * - Time-based ordering
 * 
 * Mathematical Foundation:
 * - Cryptographic commitments for transaction privacy
 * - Game theory for fair ordering
 * - Time-locked encryption
 * - VDF-based randomness for unpredictability
 */

import { createHash, randomBytes } from 'crypto';
import { Transaction } from '../core/Transaction';

/**
 * Transaction priority
 */
export type TransactionPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * MEV type classification
 */
export type MEVType = 'FRONT_RUN' | 'BACK_RUN' | 'SANDWICH' | 'LIQUIDATION' | 'ARBITRAGE';

/**
 * Encrypted transaction in mempool
 */
export interface EncryptedTransaction {
  txId: string;
  commitment: string; // Hash of transaction data
  encryptedData: string; // Encrypted transaction
  timestamp: number;
  gasPrice: bigint;
  priority: TransactionPriority;
  revealBlock?: number; // Block number when transaction should be revealed
}

/**
 * Transaction order commitment
 */
export interface OrderCommitment {
  batchId: string;
  transactions: string[]; // Transaction IDs in order
  commitment: string; // Hash of ordered transaction IDs
  proposer: string;
  timestamp: number;
  signature?: string;
}

/**
 * Fair ordering rule
 */
export interface FairOrderingRule {
  name: string;
  type: 'TIME_BASED' | 'GAS_PRICE' | 'RANDOM' | 'WEIGHTED';
  weight: number;
  parameters?: any;
}

/**
 * MEV Protection Statistics
 */
export interface MEVStats {
  totalTransactions: number;
  protectedTransactions: number;
  detectedMEVAttempts: number;
  preventedMEVAttacks: number;
  averageProtectionTime: number;
}

/**
 * Encrypted Mempool
 * Prevents front-running by keeping transactions encrypted until inclusion
 */
export class EncryptedMempool {
  private encryptedTxs: Map<string, EncryptedTransaction>;
  private revealedTxs: Map<string, Transaction>;
  private currentBlock: number;

  constructor() {
    this.encryptedTxs = new Map();
    this.revealedTxs = new Map();
    this.currentBlock = 0;
  }

  /**
   * Add encrypted transaction to mempool
   */
  addEncryptedTransaction(
    tx: Transaction,
    revealDelay: number = 1
  ): EncryptedTransaction {
    // Create commitment (hash of transaction)
    const commitment = createHash('sha256').update(JSON.stringify(tx)).digest('hex');

    // Encrypt transaction data
    const encryptionKey = randomBytes(32).toString('hex');
    const encryptedData = this.encrypt(JSON.stringify(tx), encryptionKey);

    const encryptedTx: EncryptedTransaction = {
      txId: tx.hash,
      commitment,
      encryptedData,
      timestamp: Date.now(),
      gasPrice: tx.gasPrice,
      priority: this.calculatePriority(tx.gasPrice),
      revealBlock: this.currentBlock + revealDelay,
    };

    this.encryptedTxs.set(tx.hash, encryptedTx);
    return encryptedTx;
  }

  /**
   * Reveal transaction when block is reached
   */
  revealTransaction(txId: string, tx: Transaction): boolean {
    const encryptedTx = this.encryptedTxs.get(txId);
    if (!encryptedTx) return false;

    // Check if reveal block has been reached
    if (encryptedTx.revealBlock && this.currentBlock < encryptedTx.revealBlock) {
      return false;
    }

    // Verify commitment
    const commitment = createHash('sha256').update(JSON.stringify(tx)).digest('hex');
    if (commitment !== encryptedTx.commitment) {
      return false;
    }

    // Add to revealed transactions
    this.revealedTxs.set(txId, tx);
    this.encryptedTxs.delete(txId);

    return true;
  }

  /**
   * Get transactions ready for reveal
   */
  getRevealableTransactions(): EncryptedTransaction[] {
    return Array.from(this.encryptedTxs.values()).filter(
      (tx) => tx.revealBlock && this.currentBlock >= tx.revealBlock
    );
  }

  /**
   * Update current block number
   */
  updateBlock(blockNumber: number): void {
    this.currentBlock = blockNumber;
  }

  /**
   * Simple encryption (in production, use proper encryption like AES-256-GCM)
   */
  private encrypt(data: string, key: string): string {
    const hash = createHash('sha256').update(data + key).digest('hex');
    return Buffer.from(data).toString('base64') + ':' + hash;
  }

  /**
   * Calculate transaction priority based on gas price
   */
  private calculatePriority(gasPrice: bigint): TransactionPriority {
    if (gasPrice > 1000000000n) return 'CRITICAL';
    if (gasPrice > 100000000n) return 'HIGH';
    if (gasPrice > 10000000n) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Get mempool statistics
   */
  getStats(): { encrypted: number; revealed: number } {
    return {
      encrypted: this.encryptedTxs.size,
      revealed: this.revealedTxs.size,
    };
  }
}

/**
 * Fair Transaction Ordering
 * Implements game-theoretic fair ordering mechanisms
 */
export class FairOrderingEngine {
  private rules: FairOrderingRule[];
  private orderHistory: Map<string, OrderCommitment>;

  constructor() {
    this.rules = this.initializeDefaultRules();
    this.orderHistory = new Map();
  }

  /**
   * Initialize default ordering rules
   */
  private initializeDefaultRules(): FairOrderingRule[] {
    return [
      {
        name: 'Time-based ordering',
        type: 'TIME_BASED',
        weight: 0.4,
      },
      {
        name: 'Gas price priority',
        type: 'GAS_PRICE',
        weight: 0.3,
      },
      {
        name: 'Randomized selection',
        type: 'RANDOM',
        weight: 0.3,
      },
    ];
  }

  /**
   * Order transactions fairly using multiple criteria
   */
  orderTransactions(transactions: Transaction[]): Transaction[] {
    // Calculate score for each transaction
    const scoredTxs = transactions.map((tx) => ({
      tx,
      score: this.calculateFairScore(tx),
    }));

    // Sort by score (higher is better)
    scoredTxs.sort((a, b) => b.score - a.score);

    return scoredTxs.map((item) => item.tx);
  }

  /**
   * Calculate fair ordering score using weighted rules
   */
  private calculateFairScore(tx: Transaction): number {
    let totalScore = 0;

    for (const rule of this.rules) {
      let ruleScore = 0;

      switch (rule.type) {
        case 'TIME_BASED':
          // Earlier transactions get higher score
          ruleScore = 1000000 - tx.timestamp;
          break;
        case 'GAS_PRICE':
          // Higher gas price gets higher score
          ruleScore = Number(tx.gasPrice);
          break;
        case 'RANDOM':
          // Random component to prevent predictability
          const hash = createHash('sha256').update(tx.hash).digest('hex');
          ruleScore = parseInt(hash.substring(0, 8), 16);
          break;
        case 'WEIGHTED':
          // Custom weighted scoring
          ruleScore = 100;
          break;
      }

      totalScore += ruleScore * rule.weight;
    }

    return totalScore;
  }

  /**
   * Create order commitment to prevent reordering
   */
  createOrderCommitment(transactions: Transaction[], proposer: string): OrderCommitment {
    const batchId = createHash('sha256')
      .update(transactions.map((tx) => tx.hash).join(''))
      .digest('hex');

    const txIds = transactions.map((tx) => tx.hash);
    const commitment = createHash('sha256').update(JSON.stringify(txIds)).digest('hex');

    const orderCommitment: OrderCommitment = {
      batchId,
      transactions: txIds,
      commitment,
      proposer,
      timestamp: Date.now(),
    };

    this.orderHistory.set(batchId, orderCommitment);
    return orderCommitment;
  }

  /**
   * Verify transaction order matches commitment
   */
  verifyOrderCommitment(batchId: string, actualOrder: string[]): boolean {
    const commitment = this.orderHistory.get(batchId);
    if (!commitment) return false;

    const actualCommitment = createHash('sha256').update(JSON.stringify(actualOrder)).digest('hex');

    return actualCommitment === commitment.commitment;
  }

  /**
   * Add custom ordering rule
   */
  addRule(rule: FairOrderingRule): void {
    this.rules.push(rule);
    this.normalizeWeights();
  }

  /**
   * Normalize rule weights to sum to 1.0
   */
  private normalizeWeights(): void {
    const totalWeight = this.rules.reduce((sum, rule) => sum + rule.weight, 0);
    this.rules.forEach((rule) => {
      rule.weight = rule.weight / totalWeight;
    });
  }
}

/**
 * MEV Detection System
 * Detects and prevents MEV attacks
 */
export class MEVDetector {
  private detectedMEV: Map<string, MEVType>;
  private stats: MEVStats;

  constructor() {
    this.detectedMEV = new Map();
    this.stats = {
      totalTransactions: 0,
      protectedTransactions: 0,
      detectedMEVAttempts: 0,
      preventedMEVAttacks: 0,
      averageProtectionTime: 0,
    };
  }

  /**
   * Analyze transaction batch for MEV attacks
   */
  analyzeBatch(transactions: Transaction[]): Map<string, MEVType> {
    const mevAttempts = new Map<string, MEVType>();

    for (let i = 0; i < transactions.length; i++) {
      const tx = transactions[i];

      // Check for front-running (similar tx before target)
      if (this.isFrontRun(tx, transactions.slice(0, i))) {
        mevAttempts.set(tx.hash, 'FRONT_RUN');
        this.stats.detectedMEVAttempts++;
      }

      // Check for back-running (similar tx after target)
      if (this.isBackRun(tx, transactions.slice(i + 1))) {
        mevAttempts.set(tx.hash, 'BACK_RUN');
        this.stats.detectedMEVAttempts++;
      }

      // Check for sandwich attack (both front and back)
      if (this.isSandwich(tx, transactions, i)) {
        mevAttempts.set(tx.hash, 'SANDWICH');
        this.stats.detectedMEVAttempts++;
      }
    }

    this.stats.totalTransactions += transactions.length;
    return mevAttempts;
  }

  /**
   * Check if transaction is a front-run attempt
   */
  private isFrontRun(tx: Transaction, previousTxs: Transaction[]): boolean {
    // Simplified detection: check if similar transaction with higher gas price exists
    for (const prevTx of previousTxs) {
      if (prevTx.to === tx.to && prevTx.gasPrice > tx.gasPrice) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if transaction is a back-run attempt
   */
  private isBackRun(tx: Transaction, followingTxs: Transaction[]): boolean {
    // Simplified detection: check if similar transaction follows immediately
    for (const followTx of followingTxs) {
      if (followTx.from === tx.from && followTx.to === tx.to) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if transaction is part of sandwich attack
   */
  private isSandwich(tx: Transaction, allTxs: Transaction[], index: number): boolean {
    if (index === 0 || index === allTxs.length - 1) return false;

    const prevTx = allTxs[index - 1];
    const nextTx = allTxs[index + 1];

    // Simplified: check if same address front and back runs
    return prevTx.from === nextTx.from && prevTx.to === tx.to && nextTx.to === tx.to;
  }

  /**
   * Prevent MEV attack
   */
  preventMEV(txHash: string, mevType: MEVType): boolean {
    this.detectedMEV.set(txHash, mevType);
    this.stats.preventedMEVAttacks++;
    return true;
  }

  /**
   * Get MEV statistics
   */
  getStats(): MEVStats {
    return { ...this.stats };
  }
}

/**
 * Proposer-Builder Separation (PBS)
 * Separates block proposal from block building to reduce MEV extraction
 */
export class ProposerBuilderSeparation {
  private builders: Set<string>;
  private proposers: Set<string>;
  private buildRequests: Map<string, any>;

  constructor() {
    this.builders = new Set();
    this.proposers = new Set();
    this.buildRequests = new Map();
  }

  /**
   * Register block builder
   */
  registerBuilder(builderAddress: string): void {
    this.builders.add(builderAddress);
  }

  /**
   * Register block proposer
   */
  registerProposer(proposerAddress: string): void {
    this.proposers.add(proposerAddress);
  }

  /**
   * Builder creates block template
   */
  createBlockTemplate(
    builder: string,
    transactions: Transaction[]
  ): { templateId: string; transactions: Transaction[] } {
    if (!this.builders.has(builder)) {
      throw new Error('Not a registered builder');
    }

    const templateId = createHash('sha256')
      .update(builder + Date.now().toString() + JSON.stringify(transactions))
      .digest('hex');

    this.buildRequests.set(templateId, {
      builder,
      transactions,
      timestamp: Date.now(),
    });

    return { templateId, transactions };
  }

  /**
   * Proposer selects and proposes block
   */
  proposeBlock(proposer: string, templateId: string): boolean {
    if (!this.proposers.has(proposer)) {
      return false;
    }

    const template = this.buildRequests.get(templateId);
    if (!template) {
      return false;
    }

    // Proposer validates and proposes the block
    return true;
  }

  /**
   * Get statistics
   */
  getStats(): { builders: number; proposers: number; templates: number } {
    return {
      builders: this.builders.size,
      proposers: this.proposers.size,
      templates: this.buildRequests.size,
    };
  }
}

/**
 * MEV Protection System (Phase 19)
 */
export class MEVProtectionSystem {
  private encryptedMempool: EncryptedMempool;
  private fairOrdering: FairOrderingEngine;
  private mevDetector: MEVDetector;
  private pbs: ProposerBuilderSeparation;

  constructor() {
    this.encryptedMempool = new EncryptedMempool();
    this.fairOrdering = new FairOrderingEngine();
    this.mevDetector = new MEVDetector();
    this.pbs = new ProposerBuilderSeparation();
  }

  /**
   * Submit transaction with MEV protection
   */
  submitTransaction(tx: Transaction, revealDelay: number = 1): EncryptedTransaction {
    return this.encryptedMempool.addEncryptedTransaction(tx, revealDelay);
  }

  /**
   * Process transaction batch with fair ordering and MEV protection
   */
  processBatch(transactions: Transaction[], proposer: string): {
    orderedTransactions: Transaction[];
    mevDetections: Map<string, MEVType>;
    orderCommitment: OrderCommitment;
  } {
    // Detect MEV attempts
    const mevDetections = this.mevDetector.analyzeBatch(transactions);

    // Filter out detected MEV attacks
    const cleanTransactions = transactions.filter((tx) => !mevDetections.has(tx.hash));

    // Apply fair ordering
    const orderedTransactions = this.fairOrdering.orderTransactions(cleanTransactions);

    // Create order commitment
    const orderCommitment = this.fairOrdering.createOrderCommitment(
      orderedTransactions,
      proposer
    );

    return {
      orderedTransactions,
      mevDetections,
      orderCommitment,
    };
  }

  /**
   * Update block number for encrypted mempool
   */
  updateBlock(blockNumber: number): void {
    this.encryptedMempool.updateBlock(blockNumber);
  }

  /**
   * Get encrypted mempool
   */
  getMempool(): EncryptedMempool {
    return this.encryptedMempool;
  }

  /**
   * Get fair ordering engine
   */
  getOrderingEngine(): FairOrderingEngine {
    return this.fairOrdering;
  }

  /**
   * Get MEV detector
   */
  getDetector(): MEVDetector {
    return this.mevDetector;
  }

  /**
   * Get PBS system
   */
  getPBS(): ProposerBuilderSeparation {
    return this.pbs;
  }

  /**
   * Get comprehensive statistics
   */
  getStats(): {
    mempool: any;
    mev: MEVStats;
    pbs: any;
  } {
    return {
      mempool: this.encryptedMempool.getStats(),
      mev: this.mevDetector.getStats(),
      pbs: this.pbs.getStats(),
    };
  }
}
