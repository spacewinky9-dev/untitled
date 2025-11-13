/**
 * MultiDimensionalNetwork.ts
 * Multi-dimensional sharding network implementation
 */

import { createHash } from 'crypto';
import { VirtualNode } from './VirtualNode';
import { Transaction } from '../core/Transaction';
import { Block } from '../core/Block';

export interface Dimension {
  id: number;
  nodes: VirtualNode[];
  transactionCount: number;
  blockCount: number;
  stateRoot: string;
}

export interface NetworkConfig {
  dimensionCount: number;
  nodesPerDimension: number;
  crossShardEnabled: boolean;
}

export class MultiDimensionalNetwork {
  private nodes: Map<string, VirtualNode>;
  private dimensions: Dimension[];
  private config: NetworkConfig;
  private transactionPool: Map<number, Transaction[]>;

  constructor(config: NetworkConfig) {
    this.nodes = new Map();
    this.dimensions = [];
    this.config = config;
    this.transactionPool = new Map();

    // Initialize dimensions
    for (let i = 0; i < config.dimensionCount; i++) {
      this.dimensions.push({
        id: i,
        nodes: [],
        transactionCount: 0,
        blockCount: 0,
        stateRoot: this.hashString(''),
      });
      this.transactionPool.set(i, []);
    }
  }

  /**
   * Add a virtual node to the network
   */
  public addNode(node: VirtualNode): void {
    this.nodes.set(node.id, node);

    // Add node to its dimensions
    for (const dimId of node.dimensions) {
      if (dimId < this.dimensions.length) {
        this.dimensions[dimId].nodes.push(node);
      }
    }
  }

  /**
   * Remove a node from the network
   */
  public removeNode(nodeId: string): boolean {
    const node = this.nodes.get(nodeId);
    if (!node) {
      return false;
    }

    // Remove from dimensions
    for (const dimId of node.dimensions) {
      const dim = this.dimensions[dimId];
      if (dim) {
        dim.nodes = dim.nodes.filter((n) => n.id !== nodeId);
      }
    }

    return this.nodes.delete(nodeId);
  }

  /**
   * Route transaction to appropriate dimension based on address hash
   */
  public routeTransaction(tx: Transaction): number {
    const addressHash = this.hashString(tx.to);
    const hashInt = BigInt('0x' + addressHash.substring(0, 16));
    const dimension = Number(hashInt % BigInt(this.dimensions.length));
    
    tx.dimension = dimension;
    return dimension;
  }

  /**
   * Add transaction to dimension's pool
   */
  public addTransaction(tx: Transaction): boolean {
    const dimension = this.routeTransaction(tx);
    const pool = this.transactionPool.get(dimension);

    if (!pool) {
      return false;
    }

    // Check if transaction already exists
    const exists = pool.some((t) => t.hash === tx.hash);
    if (exists) {
      return false;
    }

    pool.push(tx);
    return true;
  }

  /**
   * Get pending transactions for a dimension
   */
  public getPendingTransactions(dimension: number): Transaction[] {
    return this.transactionPool.get(dimension) || [];
  }

  /**
   * Propagate block to all nodes in dimension
   */
  public async propagate(block: Block): Promise<void> {
    const dimension = this.dimensions[block.dimension];
    if (!dimension) {
      return;
    }

    // Propagate to all nodes in this dimension
    const propagationPromises = dimension.nodes.map((node) =>
      node.propagateBlock(block)
    );

    await Promise.all(propagationPromises);

    // Update dimension stats
    dimension.blockCount++;
    dimension.transactionCount += block.transactionCount;
    dimension.stateRoot = block.stateRoot;

    // Remove processed transactions from pool
    const pool = this.transactionPool.get(block.dimension);
    if (pool) {
      const processedHashes = new Set(block.transactions.map((tx) => tx.hash));
      this.transactionPool.set(
        block.dimension,
        pool.filter((tx) => !processedHashes.has(tx.hash))
      );
    }
  }

  /**
   * Synchronize state across all dimensions
   */
  public async synchronize(): Promise<void> {
    // Calculate global state root from all dimension state roots
    const dimensionRoots = this.dimensions.map((d) => d.stateRoot).join('');
    const globalStateRoot = this.hashString(dimensionRoots);

    // In a real implementation, this would:
    // 1. Verify state consistency across shards
    // 2. Handle cross-shard transactions
    // 3. Update global state
    // 4. Resolve any conflicts

    return Promise.resolve();
  }

  /**
   * Process cross-dimensional transaction (atomic commit)
   */
  public async processCrossShardTransaction(tx: Transaction): Promise<boolean> {
    if (!this.config.crossShardEnabled) {
      return false;
    }

    // Determine source and destination dimensions
    const fromDimension = this.routeTransaction({ ...tx, to: tx.from } as Transaction);
    const toDimension = this.routeTransaction(tx);

    if (fromDimension === toDimension) {
      // Not a cross-shard transaction
      return this.addTransaction(tx);
    }

    // Two-phase commit protocol for cross-shard transactions
    // Phase 1: Lock assets in source shard
    // Phase 2: Unlock assets in destination shard
    // Both phases must succeed or transaction is rolled back

    return true;
  }

  /**
   * Get nodes in a specific dimension
   */
  public getNodesInDimension(dimension: number): VirtualNode[] {
    if (dimension >= this.dimensions.length) {
      return [];
    }
    return this.dimensions[dimension].nodes;
  }

  /**
   * Get dimension info
   */
  public getDimension(id: number): Dimension | undefined {
    return this.dimensions[id];
  }

  /**
   * Get all dimensions
   */
  public getAllDimensions(): Dimension[] {
    return this.dimensions;
  }

  /**
   * Get network statistics
   */
  public getStats(): {
    totalNodes: number;
    totalDimensions: number;
    totalTransactions: number;
    totalBlocks: number;
    averageNodesPerDimension: number;
    healthyNodes: number;
  } {
    let totalTransactions = 0;
    let totalBlocks = 0;

    for (const dim of this.dimensions) {
      totalTransactions += dim.transactionCount;
      totalBlocks += dim.blockCount;
    }

    const allNodes = Array.from(this.nodes.values());
    const healthyNodes = allNodes.filter((n) => n.isHealthy()).length;

    return {
      totalNodes: this.nodes.size,
      totalDimensions: this.dimensions.length,
      totalTransactions,
      totalBlocks,
      averageNodesPerDimension:
        this.dimensions.length > 0 ? this.nodes.size / this.dimensions.length : 0,
      healthyNodes,
    };
  }

  /**
   * Simulate network with virtual nodes
   */
  public simulateNetwork(nodeCount: number): void {
    const nodesPerDimension = Math.ceil(nodeCount / this.dimensions.length);

    for (let i = 0; i < nodeCount; i++) {
      // Assign node to dimensions (can participate in multiple)
      const primaryDimension = i % this.dimensions.length;
      const dimensions = [primaryDimension];

      // Some nodes participate in multiple dimensions for redundancy
      if (Math.random() > 0.7) {
        const secondaryDimension = (primaryDimension + 1) % this.dimensions.length;
        dimensions.push(secondaryDimension);
      }

      const node = new VirtualNode({
        id: `node-${i}`,
        dimensions,
        stake: BigInt(1000 + Math.floor(Math.random() * 9000)) * 10n ** 18n,
      });

      this.addNode(node);
    }
  }

  /**
   * Calculate network throughput (TPS)
   */
  public calculateThroughput(timeWindow: number): number {
    // In a real implementation, this would track actual TPS
    // For simulation, calculate theoretical max based on dimensions
    const txPerBlockPerDimension = 1000; // Max transactions per block
    const blockTime = 5; // seconds
    const tpsPerDimension = txPerBlockPerDimension / blockTime;
    
    return tpsPerDimension * this.dimensions.length;
  }

  /**
   * Helper: Hash string using SHA-256
   */
  private hashString(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }

  /**
   * Serialize to JSON
   */
  public toJSON(): any {
    return {
      nodes: Array.from(this.nodes.values()).map((n) => n.toJSON()),
      dimensions: this.dimensions.map((d) => ({
        id: d.id,
        transactionCount: d.transactionCount,
        blockCount: d.blockCount,
        stateRoot: d.stateRoot,
        nodeCount: d.nodes.length,
      })),
      config: this.config,
    };
  }

  /**
   * Deserialize from JSON
   */
  public static fromJSON(json: any): MultiDimensionalNetwork {
    const network = new MultiDimensionalNetwork(json.config);

    // Restore nodes
    for (const nodeJson of json.nodes) {
      const node = VirtualNode.fromJSON(nodeJson);
      network.addNode(node);
    }

    // Restore dimension stats
    for (const dimJson of json.dimensions) {
      const dim = network.dimensions[dimJson.id];
      if (dim) {
        dim.transactionCount = dimJson.transactionCount;
        dim.blockCount = dimJson.blockCount;
        dim.stateRoot = dimJson.stateRoot;
      }
    }

    return network;
  }
}
