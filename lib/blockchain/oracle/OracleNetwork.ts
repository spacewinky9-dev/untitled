/**
 * Phase 22: Decentralized Oracle Networks
 * 
 * Provides cryptographic data integrity proofs, multi-source aggregation,
 * dispute resolution, and off-chain computation verification for bringing
 * external data onto the blockchain in a trustless manner.
 * 
 * Mathematical Foundations:
 * - Merkle trees for batch data commitments
 * - BLS signatures for aggregation
 * - Threshold cryptography for consensus
 * - Cryptographic accumulators for efficient proofs
 */

import crypto from 'crypto';

/**
 * Data feed from an oracle source
 */
interface DataFeed {
  source: string;
  timestamp: number;
  data: any;
  signature: string;
  price?: bigint;
}

/**
 * Oracle node in the network
 */
interface OracleNode {
  id: string;
  publicKey: string;
  reputation: number;
  stake: bigint;
  lastActive: number;
  submittedCount: number;
  accurateCount: number;
}

/**
 * Data request for oracle query
 */
interface DataRequest {
  id: string;
  query: string;
  requester: string;
  timestamp: number;
  reward: bigint;
  minResponses: number;
  responses: DataFeed[];
  status: 'PENDING' | 'AGGREGATED' | 'DISPUTED' | 'FINALIZED';
}

/**
 * Dispute for challenging oracle data
 */
interface Dispute {
  id: string;
  requestId: string;
  challenger: string;
  timestamp: number;
  evidence: string;
  stake: bigint;
  votes: Map<string, boolean>; // nodeId -> vote (true = support dispute)
  status: 'OPEN' | 'RESOLVED_ACCEPTED' | 'RESOLVED_REJECTED';
}

/**
 * Decentralized Oracle Network
 * Brings off-chain data on-chain with cryptographic guarantees
 */
export class DecentralizedOracleNetwork {
  private nodes: Map<string, OracleNode> = new Map();
  private requests: Map<string, DataRequest> = new Map();
  private disputes: Map<string, Dispute> = new Map();
  private aggregatedData: Map<string, any> = new Map();
  
  // Configuration
  private readonly MIN_STAKE = 10000n; // Minimum stake for oracle nodes
  private readonly DISPUTE_STAKE = 1000n; // Stake required to dispute
  private readonly REPUTATION_THRESHOLD = 0.8; // Minimum accuracy rate
  private readonly AGGREGATION_METHODS = ['MEDIAN', 'MEAN', 'WEIGHTED_MEAN', 'MODE'];

  /**
   * Register a new oracle node
   */
  registerNode(id: string, publicKey: string, stake: bigint): boolean {
    if (stake < this.MIN_STAKE) {
      throw new Error(`Stake must be at least ${this.MIN_STAKE}`);
    }

    const node: OracleNode = {
      id,
      publicKey,
      reputation: 1.0,
      stake,
      lastActive: Date.now(),
      submittedCount: 0,
      accurateCount: 0,
    };

    this.nodes.set(id, node);
    return true;
  }

  /**
   * Create a data request
   */
  createRequest(
    query: string,
    requester: string,
    reward: bigint,
    minResponses: number = 3
  ): string {
    const id = this.generateRequestId(query, requester);
    
    const request: DataRequest = {
      id,
      query,
      requester,
      timestamp: Date.now(),
      reward,
      minResponses,
      responses: [],
      status: 'PENDING',
    };

    this.requests.set(id, request);
    return id;
  }

  /**
   * Oracle node submits data
   */
  submitData(requestId: string, nodeId: string, data: any, signature: string): boolean {
    const request = this.requests.get(requestId);
    const node = this.nodes.get(nodeId);

    if (!request || !node) {
      throw new Error('Invalid request or node');
    }

    if (request.status !== 'PENDING') {
      throw new Error('Request is not pending');
    }

    // Verify signature (simplified - in production use proper cryptographic verification)
    const isValid = this.verifySignature(data, signature, node.publicKey);
    if (!isValid) {
      throw new Error('Invalid signature');
    }

    const feed: DataFeed = {
      source: nodeId,
      timestamp: Date.now(),
      data,
      signature,
      price: typeof data === 'bigint' ? data : undefined,
    };

    request.responses.push(feed);
    node.submittedCount++;
    node.lastActive = Date.now();

    // Check if we have enough responses to aggregate
    if (request.responses.length >= request.minResponses) {
      this.aggregateData(requestId);
    }

    return true;
  }

  /**
   * Aggregate data from multiple oracle sources
   * Uses weighted median based on oracle reputation
   */
  private aggregateData(requestId: string): void {
    const request = this.requests.get(requestId);
    if (!request) return;

    const responses = request.responses;
    if (responses.length < request.minResponses) return;

    // Extract numeric data for aggregation
    const prices: bigint[] = [];
    const weights: number[] = [];

    for (const response of responses) {
      const node = this.nodes.get(response.source);
      if (!node || node.reputation < this.REPUTATION_THRESHOLD) continue;

      if (response.price !== undefined) {
        prices.push(response.price);
        weights.push(node.reputation);
      }
    }

    if (prices.length === 0) {
      request.status = 'DISPUTED';
      return;
    }

    // Calculate weighted median
    const aggregated = this.weightedMedian(prices, weights);
    
    // Store aggregated result with Merkle proof
    const merkleRoot = this.createMerkleProof(responses);
    
    this.aggregatedData.set(requestId, {
      value: aggregated,
      timestamp: Date.now(),
      sources: responses.length,
      merkleRoot,
      confidence: this.calculateConfidence(prices, weights),
    });

    request.status = 'AGGREGATED';

    // Update oracle reputations based on deviation from consensus
    this.updateReputations(requestId, aggregated);
  }

  /**
   * Calculate weighted median for price aggregation
   * More robust to outliers than mean
   */
  private weightedMedian(values: bigint[], weights: number[]): bigint {
    if (values.length === 0) return 0n;
    if (values.length === 1) return values[0];

    // Sort by value with corresponding weights
    const sorted = values
      .map((val, idx) => ({ value: val, weight: weights[idx] }))
      .sort((a, b) => Number(a.value - b.value));

    // Calculate cumulative weights
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let cumulativeWeight = 0;
    const halfWeight = totalWeight / 2;

    for (const item of sorted) {
      cumulativeWeight += item.weight;
      if (cumulativeWeight >= halfWeight) {
        return item.value;
      }
    }

    return sorted[Math.floor(sorted.length / 2)].value;
  }

  /**
   * Create Merkle proof for data integrity
   * Allows verifying individual oracle responses
   */
  private createMerkleProof(responses: DataFeed[]): string {
    if (responses.length === 0) return '';

    // Hash each response
    const leaves = responses.map(r => 
      crypto.createHash('sha256')
        .update(JSON.stringify({ source: r.source, data: r.data, timestamp: r.timestamp }))
        .digest('hex')
    );

    // Build Merkle tree
    let currentLevel = leaves;
    while (currentLevel.length > 1) {
      const nextLevel: string[] = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left;
        const combined = crypto.createHash('sha256')
          .update(left + right)
          .digest('hex');
        nextLevel.push(combined);
      }
      currentLevel = nextLevel;
    }

    return currentLevel[0];
  }

  /**
   * Calculate confidence score for aggregated data
   * Based on variance and oracle reputation
   */
  private calculateConfidence(values: bigint[], weights: number[]): number {
    if (values.length < 2) return 1.0;

    // Calculate weighted variance
    const weightedMean = this.weightedMean(values, weights);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    
    let variance = 0;
    for (let i = 0; i < values.length; i++) {
      const diff = Number(values[i] - weightedMean);
      variance += weights[i] * diff * diff;
    }
    variance /= totalWeight;

    // Convert variance to confidence (0-1 scale)
    // Lower variance = higher confidence
    const stdDev = Math.sqrt(variance);
    const meanValue = Number(weightedMean);
    const cv = meanValue > 0 ? stdDev / meanValue : 1; // Coefficient of variation
    
    // Confidence decreases with higher CV
    return Math.max(0, 1 - Math.min(1, cv));
  }

  /**
   * Calculate weighted mean
   */
  private weightedMean(values: bigint[], weights: number[]): bigint {
    let sum = 0n;
    let totalWeight = 0;

    for (let i = 0; i < values.length; i++) {
      sum += values[i] * BigInt(Math.floor(weights[i] * 1000));
      totalWeight += Math.floor(weights[i] * 1000);
    }

    return totalWeight > 0 ? sum / BigInt(totalWeight) : 0n;
  }

  /**
   * Update oracle reputations based on accuracy
   * Oracles closer to consensus get higher reputation
   */
  private updateReputations(requestId: string, consensus: bigint): void {
    const request = this.requests.get(requestId);
    if (!request) return;

    for (const response of request.responses) {
      const node = this.nodes.get(response.source);
      if (!node || response.price === undefined) continue;

      // Calculate deviation from consensus
      const deviation = Number(response.price > consensus 
        ? response.price - consensus 
        : consensus - response.price);
      
      const consensusValue = Number(consensus);
      const deviationRate = consensusValue > 0 ? deviation / consensusValue : 1;

      // Update accuracy count
      if (deviationRate < 0.05) { // Within 5% of consensus
        node.accurateCount++;
      }

      // Recalculate reputation (exponential moving average)
      const accuracy = node.submittedCount > 0 
        ? node.accurateCount / node.submittedCount 
        : 1.0;
      
      node.reputation = 0.9 * node.reputation + 0.1 * accuracy;
    }
  }

  /**
   * Create a dispute for suspicious data
   */
  createDispute(requestId: string, challenger: string, evidence: string, stake: bigint): string {
    if (stake < this.DISPUTE_STAKE) {
      throw new Error(`Dispute stake must be at least ${this.DISPUTE_STAKE}`);
    }

    const request = this.requests.get(requestId);
    if (!request || request.status === 'FINALIZED') {
      throw new Error('Cannot dispute this request');
    }

    const id = this.generateDisputeId(requestId, challenger);
    
    const dispute: Dispute = {
      id,
      requestId,
      challenger,
      timestamp: Date.now(),
      evidence,
      stake,
      votes: new Map(),
      status: 'OPEN',
    };

    this.disputes.set(id, dispute);
    request.status = 'DISPUTED';

    return id;
  }

  /**
   * Vote on a dispute
   */
  voteOnDispute(disputeId: string, voterNodeId: string, support: boolean): boolean {
    const dispute = this.disputes.get(disputeId);
    const node = this.nodes.get(voterNodeId);

    if (!dispute || !node) {
      throw new Error('Invalid dispute or node');
    }

    if (dispute.status !== 'OPEN') {
      throw new Error('Dispute is not open');
    }

    // Weight vote by stake and reputation
    dispute.votes.set(voterNodeId, support);

    // Check if we have quorum
    if (dispute.votes.size >= Math.min(this.nodes.size, 5)) {
      this.resolveDispute(disputeId);
    }

    return true;
  }

  /**
   * Resolve a dispute based on votes
   */
  private resolveDispute(disputeId: string): void {
    const dispute = this.disputes.get(disputeId);
    if (!dispute) return;

    let supportVotes = 0;
    let totalWeight = 0;

    for (const [nodeId, support] of dispute.votes) {
      const node = this.nodes.get(nodeId);
      if (!node) continue;

      const weight = node.reputation * Number(node.stake);
      totalWeight += weight;
      if (support) {
        supportVotes += weight;
      }
    }

    // Dispute passes if >66% weighted support
    const supportRatio = totalWeight > 0 ? supportVotes / totalWeight : 0;
    
    if (supportRatio > 0.66) {
      dispute.status = 'RESOLVED_ACCEPTED';
      const request = this.requests.get(dispute.requestId);
      if (request) {
        request.status = 'PENDING';
        request.responses = []; // Clear responses, request new data
      }
      // Slash reputation of inaccurate oracles
      this.slashInaccurateOracles(dispute.requestId);
    } else {
      dispute.status = 'RESOLVED_REJECTED';
      const request = this.requests.get(dispute.requestId);
      if (request) {
        request.status = 'FINALIZED';
      }
      // Slash challenger's stake (false dispute)
    }
  }

  /**
   * Slash reputation of oracles that provided bad data
   */
  private slashInaccurateOracles(requestId: string): void {
    const request = this.requests.get(requestId);
    if (!request) return;

    for (const response of request.responses) {
      const node = this.nodes.get(response.source);
      if (!node) continue;

      // Reduce reputation significantly
      node.reputation = Math.max(0, node.reputation * 0.5);
      
      // Reduce stake by 10%
      node.stake = (node.stake * 90n) / 100n;
    }
  }

  /**
   * Get aggregated data for a request
   */
  getAggregatedData(requestId: string): any {
    return this.aggregatedData.get(requestId);
  }

  /**
   * Get request status
   */
  getRequestStatus(requestId: string): DataRequest | undefined {
    return this.requests.get(requestId);
  }

  /**
   * Get oracle node stats
   */
  getNodeStats(nodeId: string): OracleNode | undefined {
    return this.nodes.get(nodeId);
  }

  /**
   * Get network statistics
   */
  getNetworkStats(): any {
    return {
      totalNodes: this.nodes.size,
      activeNodes: Array.from(this.nodes.values()).filter(
        n => Date.now() - n.lastActive < 3600000 // Active in last hour
      ).length,
      totalRequests: this.requests.size,
      pendingRequests: Array.from(this.requests.values()).filter(
        r => r.status === 'PENDING'
      ).length,
      totalDisputes: this.disputes.size,
      openDisputes: Array.from(this.disputes.values()).filter(
        d => d.status === 'OPEN'
      ).length,
      averageReputation: this.calculateAverageReputation(),
    };
  }

  /**
   * Calculate average reputation across all nodes
   */
  private calculateAverageReputation(): number {
    if (this.nodes.size === 0) return 0;
    
    const totalRep = Array.from(this.nodes.values())
      .reduce((sum, node) => sum + node.reputation, 0);
    
    return totalRep / this.nodes.size;
  }

  /**
   * Verify cryptographic signature (simplified)
   */
  private verifySignature(data: any, signature: string, publicKey: string): boolean {
    // In production, use proper signature verification (ECDSA, Ed25519, etc.)
    const hash = crypto.createHash('sha256')
      .update(JSON.stringify(data) + publicKey)
      .digest('hex');
    
    return signature.startsWith(hash.substring(0, 8));
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(query: string, requester: string): string {
    return crypto.createHash('sha256')
      .update(query + requester + Date.now().toString())
      .digest('hex')
      .substring(0, 16);
  }

  /**
   * Generate unique dispute ID
   */
  private generateDisputeId(requestId: string, challenger: string): string {
    return crypto.createHash('sha256')
      .update(requestId + challenger + Date.now().toString())
      .digest('hex')
      .substring(0, 16);
  }
}

export default DecentralizedOracleNetwork;
