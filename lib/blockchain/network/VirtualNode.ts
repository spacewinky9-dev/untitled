/**
 * VirtualNode.ts
 * Virtual node implementation for multi-dimensional network
 */

import { Transaction } from '../core/Transaction';
import { Block } from '../core/Block';

export interface Vector {
  x: number;
  y: number;
  z: number;
}

export interface VirtualNodeData {
  id: string;
  dimensions: number[];
  stake: bigint;
  position?: Vector;
}

export class VirtualNode {
  public id: string;
  public dimensions: number[]; // Which dimensions this node participates in
  public position: Vector; // Mathematical position in hyperspace
  public reputation: number;
  public stake: bigint;
  public processedTransactions: number;
  public isOnline: boolean;
  public lastActivity: number;

  constructor(data: VirtualNodeData) {
    this.id = data.id;
    this.dimensions = data.dimensions;
    this.stake = data.stake;
    this.position = data.position || { x: Math.random(), y: Math.random(), z: Math.random() };
    this.reputation = 100;
    this.processedTransactions = 0;
    this.isOnline = true;
    this.lastActivity = Date.now();
  }

  /**
   * Check if node participates in a specific dimension
   */
  public participatesInDimension(dimension: number): boolean {
    return this.dimensions.includes(dimension);
  }

  /**
   * Process a transaction in assigned dimension
   */
  public async processTransaction(tx: Transaction): Promise<boolean> {
    // Validate transaction belongs to this node's dimension
    const txDimension = tx.dimension;
    if (!this.participatesInDimension(txDimension)) {
      return false;
    }

    // Validate transaction
    const validation = tx.validate();
    if (!validation.valid) {
      return false;
    }

    this.processedTransactions++;
    this.lastActivity = Date.now();
    
    // Increase reputation for successful processing
    if (this.reputation < 200) {
      this.reputation += 0.1;
    }

    return true;
  }

  /**
   * Propagate block to other nodes
   */
  public async propagateBlock(block: Block): Promise<void> {
    // In a real implementation, this would send the block to peer nodes
    // For now, we'll just update last activity
    this.lastActivity = Date.now();
  }

  /**
   * Calculate distance to another node in hyperspace
   */
  public distanceTo(other: VirtualNode): number {
    const dx = this.position.x - other.position.x;
    const dy = this.position.y - other.position.y;
    const dz = this.position.z - other.position.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Find nearest neighbors in hyperspace
   */
  public findNearestNeighbors(nodes: VirtualNode[], count: number): VirtualNode[] {
    const distances = nodes
      .filter((n) => n.id !== this.id)
      .map((node) => ({
        node,
        distance: this.distanceTo(node),
      }))
      .sort((a, b) => a.distance - b.distance);

    return distances.slice(0, count).map((d) => d.node);
  }

  /**
   * Check if node is healthy and active
   */
  public isHealthy(): boolean {
    const timeSinceActivity = Date.now() - this.lastActivity;
    const maxInactivity = 60000; // 1 minute

    return (
      this.isOnline &&
      this.reputation > 50 &&
      timeSinceActivity < maxInactivity
    );
  }

  /**
   * Serialize to JSON
   */
  public toJSON(): any {
    return {
      id: this.id,
      dimensions: this.dimensions,
      position: this.position,
      reputation: this.reputation,
      stake: this.stake.toString(),
      processedTransactions: this.processedTransactions,
      isOnline: this.isOnline,
      lastActivity: this.lastActivity,
    };
  }

  /**
   * Deserialize from JSON
   */
  public static fromJSON(json: any): VirtualNode {
    const node = new VirtualNode({
      id: json.id,
      dimensions: json.dimensions,
      stake: BigInt(json.stake),
      position: json.position,
    });

    node.reputation = json.reputation;
    node.processedTransactions = json.processedTransactions;
    node.isOnline = json.isOnline;
    node.lastActivity = json.lastActivity;

    return node;
  }
}
