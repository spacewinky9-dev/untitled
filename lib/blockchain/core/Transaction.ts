/**
 * Transaction.ts
 * Core transaction implementation for DamChain
 */

import { createHash } from 'crypto';

export interface TransactionData {
  from: string;
  to: string;
  value: bigint;
  gasPrice: bigint;
  gasLimit: bigint;
  nonce: bigint;
  data?: string; // For smart contract calls
  timestamp?: number;
}

export interface QuantumProofSignature {
  algorithm: 'lattice' | 'hash-based' | 'multivariate';
  publicKey: string;
  signature: string;
  r?: string; // For lattice-based
  s?: string; // For lattice-based
}

export class Transaction {
  public id: string;
  public hash: string;
  public from: string;
  public to: string;
  public value: bigint;
  public gasPrice: bigint;
  public gasLimit: bigint;
  public gasUsed: bigint = 0n;
  public nonce: bigint;
  public data?: string;
  public timestamp: number;
  public signature?: QuantumProofSignature;
  public status: 'pending' | 'confirmed' | 'failed' = 'pending';
  public blockNumber?: bigint;
  public blockHash?: string;
  public dimension: number = 0;
  public contractAddress?: string;

  constructor(data: TransactionData) {
    this.from = data.from;
    this.to = data.to;
    this.value = data.value;
    this.gasPrice = data.gasPrice;
    this.gasLimit = data.gasLimit;
    this.nonce = data.nonce;
    this.data = data.data;
    this.timestamp = data.timestamp || Date.now();
    this.id = this.generateId();
    this.hash = this.calculateHash();
  }

  /**
   * Generate unique transaction ID
   */
  private generateId(): string {
    const data = `${this.from}${this.to}${this.value}${this.nonce}${this.timestamp}`;
    return createHash('sha256').update(data).digest('hex');
  }

  /**
   * Calculate transaction hash
   * Uses SHA-3 (quantum-resistant)
   */
  public calculateHash(): string {
    const txData = {
      from: this.from,
      to: this.to,
      value: this.value.toString(),
      gasPrice: this.gasPrice.toString(),
      gasLimit: this.gasLimit.toString(),
      nonce: this.nonce.toString(),
      data: this.data || '',
      timestamp: this.timestamp,
    };

    const dataString = JSON.stringify(txData);
    return createHash('sha3-256').update(dataString).digest('hex');
  }

  /**
   * Sign transaction with quantum-proof signature
   */
  public sign(signature: QuantumProofSignature): void {
    this.signature = signature;
  }

  /**
   * Verify transaction signature
   */
  public verifySignature(): boolean {
    if (!this.signature) {
      return false;
    }

    // In production, this would call actual quantum-proof signature verification
    // For now, we'll do basic validation
    return (
      this.signature.algorithm !== undefined &&
      this.signature.publicKey !== undefined &&
      this.signature.signature !== undefined
    );
  }

  /**
   * Validate transaction
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check addresses
    if (!this.from || this.from.length < 10) {
      errors.push('Invalid sender address');
    }

    if (!this.to || this.to.length < 10) {
      errors.push('Invalid recipient address');
    }

    // Check value
    if (this.value < 0n) {
      errors.push('Value cannot be negative');
    }

    // Check gas
    if (this.gasPrice <= 0n) {
      errors.push('Gas price must be positive');
    }

    if (this.gasLimit <= 0n) {
      errors.push('Gas limit must be positive');
    }

    // Check nonce
    if (this.nonce < 0n) {
      errors.push('Nonce cannot be negative');
    }

    // Check signature
    if (!this.verifySignature()) {
      errors.push('Invalid signature');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Calculate transaction fee
   */
  public calculateFee(): bigint {
    return this.gasUsed * this.gasPrice;
  }

  /**
   * Determine which dimension (shard) this transaction belongs to
   */
  public getDimension(totalDimensions: number): number {
    const hash = createHash('sha256').update(this.to).digest();
    const hashInt = BigInt('0x' + hash.toString('hex'));
    return Number(hashInt % BigInt(totalDimensions));
  }

  /**
   * Check if this is a cross-dimensional (cross-shard) transaction
   */
  public isCrossDimensional(totalDimensions: number): boolean {
    const fromDim = this.getDimension(totalDimensions);
    const toDimHash = createHash('sha256').update(this.to).digest();
    const toDimInt = BigInt('0x' + toDimHash.toString('hex'));
    const toDim = Number(toDimInt % BigInt(totalDimensions));
    
    return fromDim !== toDim;
  }

  /**
   * Serialize transaction to JSON
   */
  public toJSON(): any {
    return {
      id: this.id,
      hash: this.hash,
      from: this.from,
      to: this.to,
      value: this.value.toString(),
      gasPrice: this.gasPrice.toString(),
      gasLimit: this.gasLimit.toString(),
      gasUsed: this.gasUsed.toString(),
      nonce: this.nonce.toString(),
      data: this.data,
      timestamp: this.timestamp,
      signature: this.signature,
      status: this.status,
      blockNumber: this.blockNumber?.toString(),
      blockHash: this.blockHash,
      dimension: this.dimension,
      contractAddress: this.contractAddress,
    };
  }

  /**
   * Deserialize transaction from JSON
   */
  public static fromJSON(json: any): Transaction {
    const tx = new Transaction({
      from: json.from,
      to: json.to,
      value: BigInt(json.value),
      gasPrice: BigInt(json.gasPrice),
      gasLimit: BigInt(json.gasLimit),
      nonce: BigInt(json.nonce),
      data: json.data,
      timestamp: json.timestamp,
    });

    tx.id = json.id;
    tx.hash = json.hash;
    tx.gasUsed = BigInt(json.gasUsed);
    tx.signature = json.signature;
    tx.status = json.status;
    tx.blockNumber = json.blockNumber ? BigInt(json.blockNumber) : undefined;
    tx.blockHash = json.blockHash;
    tx.dimension = json.dimension;
    tx.contractAddress = json.contractAddress;

    return tx;
  }
}
