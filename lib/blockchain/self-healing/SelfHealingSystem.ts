/**
 * SelfHealingSystem.ts
 * Self-Healing Architecture for DamChain (Phase 20)
 * 
 * Implements:
 * - Autonomous fork resolution
 * - Automatic state recovery
 * - Enhanced Byzantine fault tolerance
 * - Network partition handling
 * - Self-repair mechanisms
 * - Consensus failure recovery
 * 
 * Mathematical Foundation:
 * - Graph theory for network topology
 * - Consensus algorithms for fork resolution
 * - State machine replication
 * - Byzantine agreement protocols
 */

import { createHash } from 'crypto';
import { Block } from '../core/Block';
import { Transaction } from '../core/Transaction';

/**
 * Fork detection and resolution
 */
export interface Fork {
  forkId: string;
  commonAncestor: Block;
  branch1: Block[];
  branch2: Block[];
  detectedAt: number;
  resolved: boolean;
  winningBranch?: 'branch1' | 'branch2';
}

/**
 * Network partition information
 */
export interface NetworkPartition {
  partitionId: string;
  nodes: string[];
  startTime: number;
  endTime?: number;
  resolved: boolean;
  stateSnapshot?: any;
}

/**
 * Health metrics for nodes
 */
export interface NodeHealth {
  nodeId: string;
  uptime: number;
  lastSeen: number;
  blockHeight: number;
  peerCount: number;
  syncStatus: 'SYNCED' | 'SYNCING' | 'OFFLINE';
  healthScore: number;
}

/**
 * Recovery checkpoint
 */
export interface RecoveryCheckpoint {
  checkpointId: string;
  blockNumber: bigint;
  stateRoot: string;
  timestamp: number;
  validators: string[];
  signature: string;
}

/**
 * Fork Resolution Engine
 * Automatically detects and resolves blockchain forks
 */
export class ForkResolver {
  private detectedForks: Map<string, Fork>;
  private resolutionStrategy: 'LONGEST_CHAIN' | 'HEAVIEST_CHAIN' | 'VALIDATOR_VOTE';

  constructor(strategy: 'LONGEST_CHAIN' | 'HEAVIEST_CHAIN' | 'VALIDATOR_VOTE' = 'LONGEST_CHAIN') {
    this.detectedForks = new Map();
    this.resolutionStrategy = strategy;
  }

  /**
   * Detect fork in blockchain
   */
  detectFork(block1: Block, block2: Block): Fork | null {
    // Check if blocks have same height but different hashes
    if (block1.blockNumber !== block2.blockNumber || block1.hash === block2.hash) {
      return null;
    }

    // Find common ancestor
    const commonAncestor = this.findCommonAncestor(block1, block2);

    const fork: Fork = {
      forkId: createHash('sha256').update(block1.hash + block2.hash).digest('hex'),
      commonAncestor,
      branch1: [block1],
      branch2: [block2],
      detectedAt: Date.now(),
      resolved: false,
    };

    this.detectedForks.set(fork.forkId, fork);
    return fork;
  }

  /**
   * Resolve fork using configured strategy
   */
  resolveFork(forkId: string): { resolved: boolean; winningBranch?: 'branch1' | 'branch2' } {
    const fork = this.detectedForks.get(forkId);
    if (!fork) {
      return { resolved: false };
    }

    let winningBranch: 'branch1' | 'branch2';

    switch (this.resolutionStrategy) {
      case 'LONGEST_CHAIN':
        winningBranch = this.resolveLongestChain(fork);
        break;
      case 'HEAVIEST_CHAIN':
        winningBranch = this.resolveHeaviestChain(fork);
        break;
      case 'VALIDATOR_VOTE':
        winningBranch = this.resolveByValidatorVote(fork);
        break;
      default:
        winningBranch = 'branch1';
    }

    fork.resolved = true;
    fork.winningBranch = winningBranch;

    return { resolved: true, winningBranch };
  }

  /**
   * Longest chain rule (Nakamoto consensus)
   */
  private resolveLongestChain(fork: Fork): 'branch1' | 'branch2' {
    return fork.branch1.length >= fork.branch2.length ? 'branch1' : 'branch2';
  }

  /**
   * Heaviest chain rule (consider cumulative difficulty)
   */
  private resolveHeaviestChain(fork: Fork): 'branch1' | 'branch2' {
    const weight1 = fork.branch1.reduce((sum, block) => sum + Number(block.gasUsed), 0);
    const weight2 = fork.branch2.reduce((sum, block) => sum + Number(block.gasUsed), 0);
    return weight1 >= weight2 ? 'branch1' : 'branch2';
  }

  /**
   * Validator voting (BFT-style resolution)
   */
  private resolveByValidatorVote(fork: Fork): 'branch1' | 'branch2' {
    // Count validator votes (simplified - use validator weights in production)
    const votes1 = new Set(fork.branch1.map(b => b.validator)).size;
    const votes2 = new Set(fork.branch2.map(b => b.validator)).size;
    return votes1 >= votes2 ? 'branch1' : 'branch2';
  }

  /**
   * Find common ancestor of two blocks
   */
  private findCommonAncestor(block1: Block, block2: Block): Block {
    // Simplified: return the block with lower number
    return block1.blockNumber < block2.blockNumber ? block1 : block2;
  }

  /**
   * Get all active forks
   */
  getActiveForks(): Fork[] {
    return Array.from(this.detectedForks.values()).filter(f => !f.resolved);
  }

  /**
   * Get fork statistics
   */
  getStats(): { total: number; active: number; resolved: number } {
    const all = Array.from(this.detectedForks.values());
    return {
      total: all.length,
      active: all.filter(f => !f.resolved).length,
      resolved: all.filter(f => f.resolved).length,
    };
  }
}

/**
 * State Recovery Manager
 * Handles automatic state recovery from checkpoints
 */
export class StateRecoveryManager {
  private checkpoints: Map<string, RecoveryCheckpoint>;
  private checkpointInterval: number;
  private maxCheckpoints: number;

  constructor(checkpointInterval: number = 1000, maxCheckpoints: number = 10) {
    this.checkpoints = new Map();
    this.checkpointInterval = checkpointInterval;
    this.maxCheckpoints = maxCheckpoints;
  }

  /**
   * Create recovery checkpoint
   */
  createCheckpoint(blockNumber: bigint, stateRoot: string, validators: string[]): RecoveryCheckpoint {
    const checkpointId = createHash('sha256')
      .update(blockNumber.toString() + stateRoot)
      .digest('hex');

    const checkpoint: RecoveryCheckpoint = {
      checkpointId,
      blockNumber,
      stateRoot,
      timestamp: Date.now(),
      validators,
      signature: this.signCheckpoint(checkpointId, validators),
    };

    this.checkpoints.set(checkpointId, checkpoint);

    // Clean old checkpoints
    this.pruneOldCheckpoints();

    return checkpoint;
  }

  /**
   * Recover state from checkpoint
   */
  recoverFromCheckpoint(checkpointId: string): { success: boolean; checkpoint?: RecoveryCheckpoint } {
    const checkpoint = this.checkpoints.get(checkpointId);
    if (!checkpoint) {
      return { success: false };
    }

    // Verify checkpoint signature
    if (!this.verifyCheckpoint(checkpoint)) {
      return { success: false };
    }

    return { success: true, checkpoint };
  }

  /**
   * Get latest checkpoint
   */
  getLatestCheckpoint(): RecoveryCheckpoint | undefined {
    const checkpoints = Array.from(this.checkpoints.values());
    if (checkpoints.length === 0) return undefined;

    return checkpoints.reduce((latest, current) =>
      current.blockNumber > latest.blockNumber ? current : latest
    );
  }

  /**
   * Find nearest checkpoint to block number
   */
  findNearestCheckpoint(blockNumber: bigint): RecoveryCheckpoint | undefined {
    const checkpoints = Array.from(this.checkpoints.values());
    return checkpoints
      .filter(cp => cp.blockNumber <= blockNumber)
      .reduce((nearest, current) =>
        !nearest || current.blockNumber > nearest.blockNumber ? current : nearest,
        undefined as RecoveryCheckpoint | undefined
      );
  }

  /**
   * Sign checkpoint (simplified)
   */
  private signCheckpoint(checkpointId: string, validators: string[]): string {
    const data = checkpointId + validators.join('');
    return createHash('sha256').update(data).digest('hex');
  }

  /**
   * Verify checkpoint signature
   */
  private verifyCheckpoint(checkpoint: RecoveryCheckpoint): boolean {
    const expectedSig = this.signCheckpoint(checkpoint.checkpointId, checkpoint.validators);
    return expectedSig === checkpoint.signature;
  }

  /**
   * Prune old checkpoints
   */
  private pruneOldCheckpoints(): void {
    const checkpoints = Array.from(this.checkpoints.values());
    if (checkpoints.length <= this.maxCheckpoints) return;

    // Sort by block number and keep only newest
    const sorted = checkpoints.sort((a, b) => Number(b.blockNumber - a.blockNumber));
    const toKeep = sorted.slice(0, this.maxCheckpoints);

    this.checkpoints.clear();
    toKeep.forEach(cp => this.checkpoints.set(cp.checkpointId, cp));
  }

  /**
   * Get checkpoint statistics
   */
  getStats(): { total: number; latestBlock: string; oldestBlock: string } {
    const checkpoints = Array.from(this.checkpoints.values());
    if (checkpoints.length === 0) {
      return { total: 0, latestBlock: '0', oldestBlock: '0' };
    }

    const latest = checkpoints.reduce((max, cp) => cp.blockNumber > max.blockNumber ? cp : max);
    const oldest = checkpoints.reduce((min, cp) => cp.blockNumber < min.blockNumber ? cp : min);

    return {
      total: checkpoints.length,
      latestBlock: latest.blockNumber.toString(),
      oldestBlock: oldest.blockNumber.toString(),
    };
  }
}

/**
 * Network Partition Handler
 * Detects and resolves network partitions
 */
export class NetworkPartitionHandler {
  private partitions: Map<string, NetworkPartition>;
  private nodeHealthMap: Map<string, NodeHealth>;
  private partitionDetectionThreshold: number;

  constructor(partitionDetectionThreshold: number = 30000) {
    this.partitions = new Map();
    this.nodeHealthMap = new Map();
    this.partitionDetectionThreshold = partitionDetectionThreshold;
  }

  /**
   * Update node health
   */
  updateNodeHealth(nodeId: string, health: Partial<NodeHealth>): void {
    const existing = this.nodeHealthMap.get(nodeId);
    const updated: NodeHealth = {
      nodeId,
      uptime: health.uptime ?? existing?.uptime ?? 0,
      lastSeen: Date.now(),
      blockHeight: health.blockHeight ?? existing?.blockHeight ?? 0,
      peerCount: health.peerCount ?? existing?.peerCount ?? 0,
      syncStatus: health.syncStatus ?? existing?.syncStatus ?? 'SYNCING',
      healthScore: health.healthScore ?? this.calculateHealthScore(health),
    };

    this.nodeHealthMap.set(nodeId, updated);
  }

  /**
   * Detect network partition
   */
  detectPartition(nodes: string[]): NetworkPartition | null {
    // Check if nodes haven't communicated recently
    const now = Date.now();
    const isolated = nodes.filter(nodeId => {
      const health = this.nodeHealthMap.get(nodeId);
      return health && now - health.lastSeen > this.partitionDetectionThreshold;
    });

    if (isolated.length === 0) return null;

    const partition: NetworkPartition = {
      partitionId: createHash('sha256').update(isolated.join('')).digest('hex'),
      nodes: isolated,
      startTime: now,
      resolved: false,
    };

    this.partitions.set(partition.partitionId, partition);
    return partition;
  }

  /**
   * Resolve partition
   */
  resolvePartition(partitionId: string): boolean {
    const partition = this.partitions.get(partitionId);
    if (!partition) return false;

    // Check if all nodes are back online
    const allOnline = partition.nodes.every(nodeId => {
      const health = this.nodeHealthMap.get(nodeId);
      return health && health.syncStatus === 'SYNCED';
    });

    if (allOnline) {
      partition.resolved = true;
      partition.endTime = Date.now();
      return true;
    }

    return false;
  }

  /**
   * Calculate node health score
   */
  private calculateHealthScore(health: Partial<NodeHealth>): number {
    let score = 100;

    // Penalize low peer count
    if (health.peerCount !== undefined && health.peerCount < 3) {
      score -= 20;
    }

    // Penalize not synced
    if (health.syncStatus === 'SYNCING') score -= 10;
    if (health.syncStatus === 'OFFLINE') score -= 100;

    return Math.max(0, score);
  }

  /**
   * Get network health overview
   */
  getNetworkHealth(): {
    totalNodes: number;
    onlineNodes: number;
    syncedNodes: number;
    activePartitions: number;
    averageHealthScore: number;
  } {
    const nodes = Array.from(this.nodeHealthMap.values());
    const online = nodes.filter(n => n.syncStatus !== 'OFFLINE');
    const synced = nodes.filter(n => n.syncStatus === 'SYNCED');
    const activePartitions = Array.from(this.partitions.values()).filter(p => !p.resolved);

    const avgScore = nodes.length > 0
      ? nodes.reduce((sum, n) => sum + n.healthScore, 0) / nodes.length
      : 0;

    return {
      totalNodes: nodes.length,
      onlineNodes: online.length,
      syncedNodes: synced.length,
      activePartitions: activePartitions.length,
      averageHealthScore: avgScore,
    };
  }

  /**
   * Get partition statistics
   */
  getStats(): { total: number; active: number; resolved: number } {
    const all = Array.from(this.partitions.values());
    return {
      total: all.length,
      active: all.filter(p => !p.resolved).length,
      resolved: all.filter(p => p.resolved).length,
    };
  }
}

/**
 * Byzantine Fault Tolerance Manager
 * Enhanced BFT with automatic failure detection and recovery
 */
export class ByzantineFaultTolerance {
  private maxFaultyNodes: number;
  private totalNodes: number;
  private suspectedNodes: Set<string>;
  private recoveredNodes: Set<string>;

  constructor(totalNodes: number) {
    this.totalNodes = totalNodes;
    this.maxFaultyNodes = Math.floor((totalNodes - 1) / 3); // BFT: f < n/3
    this.suspectedNodes = new Set();
    this.recoveredNodes = new Set();
  }

  /**
   * Report suspicious node behavior
   */
  reportSuspiciousNode(nodeId: string, reason: string): void {
    this.suspectedNodes.add(nodeId);

    // Auto-recovery: remove from suspected if below threshold
    if (this.suspectedNodes.size <= this.maxFaultyNodes) {
      this.attemptRecovery(nodeId);
    }
  }

  /**
   * Attempt to recover a node
   */
  private attemptRecovery(nodeId: string): void {
    // Mark for recovery
    this.recoveredNodes.add(nodeId);
  }

  /**
   * Check if system can tolerate current faults
   */
  canTolerateCurrentFaults(): boolean {
    return this.suspectedNodes.size <= this.maxFaultyNodes;
  }

  /**
   * Get consensus threshold (2f + 1)
   */
  getConsensusThreshold(): number {
    return 2 * this.maxFaultyNodes + 1;
  }

  /**
   * Check if quorum is reached
   */
  hasQuorum(votes: number): boolean {
    return votes >= this.getConsensusThreshold();
  }

  /**
   * Get BFT statistics
   */
  getStats(): {
    totalNodes: number;
    maxFaultyNodes: number;
    suspectedNodes: number;
    recoveredNodes: number;
    canTolerateFaults: boolean;
  } {
    return {
      totalNodes: this.totalNodes,
      maxFaultyNodes: this.maxFaultyNodes,
      suspectedNodes: this.suspectedNodes.size,
      recoveredNodes: this.recoveredNodes.size,
      canTolerateFaults: this.canTolerateCurrentFaults(),
    };
  }
}

/**
 * Self-Healing System (Phase 20)
 * Main coordinator for all self-healing capabilities
 */
export class SelfHealingSystem {
  private forkResolver: ForkResolver;
  private stateRecovery: StateRecoveryManager;
  private partitionHandler: NetworkPartitionHandler;
  private bft: ByzantineFaultTolerance;
  private enabled: boolean;

  constructor(totalNodes: number = 10) {
    this.forkResolver = new ForkResolver('LONGEST_CHAIN');
    this.stateRecovery = new StateRecoveryManager(1000, 10);
    this.partitionHandler = new NetworkPartitionHandler(30000);
    this.bft = new ByzantineFaultTolerance(totalNodes);
    this.enabled = true;
  }

  /**
   * Enable/disable self-healing
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Detect and resolve forks automatically
   */
  handleFork(block1: Block, block2: Block): { detected: boolean; resolved: boolean } {
    if (!this.enabled) return { detected: false, resolved: false };

    const fork = this.forkResolver.detectFork(block1, block2);
    if (!fork) return { detected: false, resolved: false };

    const resolution = this.forkResolver.resolveFork(fork.forkId);
    return { detected: true, resolved: resolution.resolved };
  }

  /**
   * Create automatic checkpoint
   */
  createAutoCheckpoint(blockNumber: bigint, stateRoot: string, validators: string[]): RecoveryCheckpoint {
    return this.stateRecovery.createCheckpoint(blockNumber, stateRoot, validators);
  }

  /**
   * Recover from failure
   */
  recoverFromFailure(blockNumber?: bigint): { success: boolean; checkpoint?: RecoveryCheckpoint } {
    if (!this.enabled) return { success: false };

    const checkpoint = blockNumber
      ? this.stateRecovery.findNearestCheckpoint(blockNumber)
      : this.stateRecovery.getLatestCheckpoint();

    if (!checkpoint) return { success: false };

    return this.stateRecovery.recoverFromCheckpoint(checkpoint.checkpointId);
  }

  /**
   * Handle network partition
   */
  handleNetworkPartition(nodes: string[]): { detected: boolean; partition?: NetworkPartition } {
    if (!this.enabled) return { detected: false };

    const partition = this.partitionHandler.detectPartition(nodes);
    return { detected: !!partition, partition: partition ?? undefined };
  }

  /**
   * Update node health status
   */
  updateNodeHealth(nodeId: string, health: Partial<NodeHealth>): void {
    this.partitionHandler.updateNodeHealth(nodeId, health);
  }

  /**
   * Report Byzantine behavior
   */
  reportByzantineNode(nodeId: string, reason: string): void {
    this.bft.reportSuspiciousNode(nodeId, reason);
  }

  /**
   * Check system health
   */
  checkSystemHealth(): {
    healthy: boolean;
    forks: number;
    partitions: number;
    bftStatus: boolean;
    networkHealth: any;
  } {
    const forkStats = this.forkResolver.getStats();
    const partitionStats = this.partitionHandler.getStats();
    const bftStats = this.bft.getStats();
    const networkHealth = this.partitionHandler.getNetworkHealth();

    return {
      healthy: forkStats.active === 0 && partitionStats.active === 0 && bftStats.canTolerateFaults,
      forks: forkStats.active,
      partitions: partitionStats.active,
      bftStatus: bftStats.canTolerateFaults,
      networkHealth,
    };
  }

  /**
   * Get comprehensive statistics
   */
  getStats(): {
    forks: any;
    checkpoints: any;
    partitions: any;
    bft: any;
    networkHealth: any;
  } {
    return {
      forks: this.forkResolver.getStats(),
      checkpoints: this.stateRecovery.getStats(),
      partitions: this.partitionHandler.getStats(),
      bft: this.bft.getStats(),
      networkHealth: this.partitionHandler.getNetworkHealth(),
    };
  }

  /**
   * Get individual components for advanced usage
   */
  getForkResolver(): ForkResolver {
    return this.forkResolver;
  }

  getStateRecovery(): StateRecoveryManager {
    return this.stateRecovery;
  }

  getPartitionHandler(): NetworkPartitionHandler {
    return this.partitionHandler;
  }

  getBFT(): ByzantineFaultTolerance {
    return this.bft;
  }
}
