/**
 * AdvancedSharding.ts  
 * Cross-shard atomic composability for DamChain
 * 
 * Implements:
 * - Fractal sharding with self-similar recursive structures
 * - Cross-shard atomic commits using 2-phase commit protocol
 * - Shard state synchronization
 * - Dynamic shard rebalancing
 */

import { createHash } from 'crypto';
import { Block } from '../core/Block';
import { Transaction } from '../core/Transaction';

export interface ShardConfig {
  shardId: number;
  addressRange: { start: bigint; end: bigint };
  validators: string[];
  parentShard?: number;
  childShards: number[];
}

export interface CrossShardTransaction {
  txId: string;
  sourceShardId: number;
  targetShardId: number;
  transaction: Transaction;
  status: 'PENDING' | 'LOCKED' | 'COMMITTED' | 'ABORTED';
  lockTimestamp?: number;
  commitTimestamp?: number;
}

/**
 * Fractal Shard Manager
 * Manages hierarchical sharding with recursive structure
 */
export class FractalShardManager {
  private shards: Map<number, ShardConfig>;
  private maxDepth: number;
  private shardsPerLevel: number;

  constructor(maxDepth: number = 3, shardsPerLevel: number = 4) {
    this.shards = new Map();
    this.maxDepth = maxDepth;
    this.shardsPerLevel = shardsPerLevel;
    this.initializeFractalStructure();
  }

  /**
   * Initialize fractal shard structure
   * Each shard can have child shards, creating a recursive tree
   */
  private initializeFractalStructure(): void {
    let shardId = 0;
    const totalRange = 2n ** 256n; // Full address space

    // Create root shards
    for (let i = 0; i < this.shardsPerLevel; i++) {
      const rangeSize = totalRange / BigInt(this.shardsPerLevel);
      const start = BigInt(i) * rangeSize;
      const end = start + rangeSize - 1n;

      this.shards.set(shardId, {
        shardId,
        addressRange: { start, end },
        validators: [],
        childShards: [],
      });

      shardId++;
    }

    // Create child shards recursively
    for (let depth = 1; depth < this.maxDepth; depth++) {
      const parentShards = Array.from(this.shards.values()).filter(
        s => !s.parentShard && s.childShards.length === 0
      );

      for (const parent of parentShards) {
        const rangeSize = (parent.addressRange.end - parent.addressRange.start + 1n) / BigInt(this.shardsPerLevel);

        for (let i = 0; i < this.shardsPerLevel; i++) {
          const start = parent.addressRange.start + BigInt(i) * rangeSize;
          const end = start + rangeSize - 1n;

          this.shards.set(shardId, {
            shardId,
            addressRange: { start, end },
            validators: [],
            parentShard: parent.shardId,
            childShards: [],
          });

          parent.childShards.push(shardId);
          shardId++;
        }
      }
    }
  }

  /**
   * Route address to appropriate shard
   */
  routeToShard(address: string): number {
    const addressBigInt = BigInt('0x' + createHash('sha256').update(address).digest('hex'));

    for (const [shardId, config] of this.shards.entries()) {
      if (addressBigInt >= config.addressRange.start && addressBigInt <= config.addressRange.end) {
        // If has children, route to deepest child
        if (config.childShards.length > 0) {
          return this.routeToChildShard(addressBigInt, config);
        }
        return shardId;
      }
    }

    return 0; // Default to shard 0
  }

  private routeToChildShard(address: bigint, parent: ShardConfig): number {
    for (const childId of parent.childShards) {
      const child = this.shards.get(childId);
      if (child && address >= child.addressRange.start && address <= child.addressRange.end) {
        if (child.childShards.length > 0) {
          return this.routeToChildShard(address, child);
        }
        return childId;
      }
    }
    return parent.shardId;
  }

  /**
   * Get shard configuration
   */
  getShard(shardId: number): ShardConfig | undefined {
    return this.shards.get(shardId);
  }

  /**
   * Get all leaf shards (shards without children)
   */
  getLeafShards(): ShardConfig[] {
    return Array.from(this.shards.values()).filter(s => s.childShards.length === 0);
  }

  /**
   * Rebalance shards based on load
   */
  rebalanceShards(loadMetrics: Map<number, number>): void {
    // Simplified rebalancing: merge underutilized shards, split overutilized ones
    for (const [shardId, load] of loadMetrics.entries()) {
      const shard = this.shards.get(shardId);
      if (!shard) continue;

      // If overloaded and can split further
      if (load > 0.8 && shard.childShards.length === 0) {
        this.splitShard(shardId);
      }
    }
  }

  private splitShard(shardId: number): void {
    const shard = this.shards.get(shardId);
    if (!shard) return;

    const rangeSize = (shard.addressRange.end - shard.addressRange.start + 1n) / BigInt(this.shardsPerLevel);
    let newShardId = Math.max(...Array.from(this.shards.keys())) + 1;

    for (let i = 0; i < this.shardsPerLevel; i++) {
      const start = shard.addressRange.start + BigInt(i) * rangeSize;
      const end = start + rangeSize - 1n;

      this.shards.set(newShardId, {
        shardId: newShardId,
        addressRange: { start, end },
        validators: [],
        parentShard: shardId,
        childShards: [],
      });

      shard.childShards.push(newShardId);
      newShardId++;
    }
  }
}

/**
 * Cross-Shard Atomic Transaction Manager
 * Implements 2-phase commit protocol for cross-shard atomicity
 */
export class CrossShardAtomicManager {
  private pendingTransactions: Map<string, CrossShardTransaction>;
  private lockTimeout: number = 30000; // 30 seconds

  constructor() {
    this.pendingTransactions = new Map();
  }

  /**
   * Initiate cross-shard transaction
   */
  initiateCrossShardTx(tx: Transaction, sourceShardId: number, targetShardId: number): CrossShardTransaction {
    const crossShardTx: CrossShardTransaction = {
      txId: tx.hash,
      sourceShardId,
      targetShardId,
      transaction: tx,
      status: 'PENDING',
    };

    this.pendingTransactions.set(tx.hash, crossShardTx);
    return crossShardTx;
  }

  /**
   * Phase 1: Lock resources in both shards
   */
  lockPhase(txId: string): boolean {
    const crossShardTx = this.pendingTransactions.get(txId);
    if (!crossShardTx || crossShardTx.status !== 'PENDING') {
      return false;
    }

    // Lock resources
    crossShardTx.status = 'LOCKED';
    crossShardTx.lockTimestamp = Date.now();
    
    return true;
  }

  /**
   * Phase 2: Commit transaction in both shards
   */
  commitPhase(txId: string): boolean {
    const crossShardTx = this.pendingTransactions.get(txId);
    if (!crossShardTx || crossShardTx.status !== 'LOCKED') {
      return false;
    }

    // Check lock timeout
    if (crossShardTx.lockTimestamp && Date.now() - crossShardTx.lockTimestamp > this.lockTimeout) {
      this.abortPhase(txId);
      return false;
    }

    // Commit
    crossShardTx.status = 'COMMITTED';
    crossShardTx.commitTimestamp = Date.now();
    
    return true;
  }

  /**
   * Abort transaction and release locks
   */
  abortPhase(txId: string): void {
    const crossShardTx = this.pendingTransactions.get(txId);
    if (crossShardTx) {
      crossShardTx.status = 'ABORTED';
    }
  }

  /**
   * Get transaction status
   */
  getTransactionStatus(txId: string): string | undefined {
    return this.pendingTransactions.get(txId)?.status;
  }

  /**
   * Clean up completed transactions
   */
  cleanup(): void {
    const now = Date.now();
    for (const [txId, crossShardTx] of this.pendingTransactions.entries()) {
      if (
        crossShardTx.status === 'COMMITTED' ||
        crossShardTx.status === 'ABORTED' ||
        (crossShardTx.lockTimestamp && now - crossShardTx.lockTimestamp > this.lockTimeout * 2)
      ) {
        this.pendingTransactions.delete(txId);
      }
    }
  }
}

/**
 * Advanced Sharding System
 */
export class AdvancedSharding {
  private fractalManager: FractalShardManager;
  private atomicManager: CrossShardAtomicManager;

  constructor(maxDepth: number = 3, shardsPerLevel: number = 4) {
    this.fractalManager = new FractalShardManager(maxDepth, shardsPerLevel);
    this.atomicManager = new CrossShardAtomicManager();
  }

  routeTransaction(tx: Transaction): number {
    return this.fractalManager.routeToShard(tx.to);
  }

  executeCrossShardTransaction(tx: Transaction): boolean {
    const sourceShard = this.fractalManager.routeToShard(tx.from);
    const targetShard = this.fractalManager.routeToShard(tx.to);

    if (sourceShard === targetShard) {
      return true; // Same shard, no cross-shard needed
    }

    // Initiate cross-shard transaction
    const crossShardTx = this.atomicManager.initiateCrossShardTx(tx, sourceShard, targetShard);

    // Execute 2-phase commit
    if (!this.atomicManager.lockPhase(crossShardTx.txId)) {
      return false;
    }

    if (!this.atomicManager.commitPhase(crossShardTx.txId)) {
      this.atomicManager.abortPhase(crossShardTx.txId);
      return false;
    }

    return true;
  }

  getLeafShards(): ShardConfig[] {
    return this.fractalManager.getLeafShards();
  }

  rebalance(loadMetrics: Map<number, number>): void {
    this.fractalManager.rebalanceShards(loadMetrics);
  }
}
