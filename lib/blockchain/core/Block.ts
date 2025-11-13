/**
 * Block.ts
 * Core block implementation for DamChain
 */

import { createHash } from 'crypto';
import { Transaction } from './Transaction';
import { MerkleTree } from './MerkleTree';

export interface MathematicalProof {
  algorithm: 'discrete-log' | 'lattice' | 'polynomial';
  challenge: string;
  response: string;
  verificationData: any;
  difficulty: number;
}

export interface BlockData {
  blockNumber: bigint;
  previousHash: string;
  validator: string;
  dimension?: number;
  gasLimit?: bigint;
  timestamp?: number;
}

export class Block {
  public blockNumber: bigint;
  public timestamp: number;
  public transactions: Transaction[];
  public previousHash: string;
  public hash: string;
  public validator: string;
  public dimension: number;
  public merkleRoot: string;
  public stateRoot: string;
  public gasUsed: bigint;
  public gasLimit: bigint;
  public size: number;
  public nonce: bigint;
  public mathematicalProof?: MathematicalProof;
  public transactionCount: number;

  constructor(data: BlockData, transactions: Transaction[] = []) {
    this.blockNumber = data.blockNumber;
    this.previousHash = data.previousHash;
    this.validator = data.validator;
    this.dimension = data.dimension || 0;
    this.gasLimit = data.gasLimit || 30000000n;
    this.timestamp = data.timestamp || Date.now();
    this.transactions = transactions;
    this.transactionCount = transactions.length;
    this.nonce = 0n;
    this.gasUsed = 0n;
    this.size = 0;
    this.stateRoot = '';

    // Calculate Merkle root from transactions
    this.merkleRoot = this.calculateMerkleRoot();

    // Calculate block hash
    this.hash = this.calculateHash();

    // Calculate size
    this.size = this.calculateSize();
  }

  /**
   * Calculate Merkle root from transactions
   */
  private calculateMerkleRoot(): string {
    if (this.transactions.length === 0) {
      return createHash('sha3-256').update('').digest('hex');
    }

    const txHashes = this.transactions.map((tx) => tx.hash);
    const merkleTree = new MerkleTree(txHashes);
    return merkleTree.getRoot();
  }

  /**
   * Calculate block hash
   */
  public calculateHash(): string {
    const blockData = {
      blockNumber: this.blockNumber.toString(),
      timestamp: this.timestamp,
      previousHash: this.previousHash,
      merkleRoot: this.merkleRoot,
      stateRoot: this.stateRoot,
      validator: this.validator,
      dimension: this.dimension,
      nonce: this.nonce.toString(),
      gasUsed: this.gasUsed.toString(),
      gasLimit: this.gasLimit.toString(),
    };

    const dataString = JSON.stringify(blockData);
    return createHash('sha3-256').update(dataString).digest('hex');
  }

  /**
   * Add a transaction to the block
   */
  public addTransaction(transaction: Transaction): boolean {
    // Validate transaction
    const validation = transaction.validate();
    if (!validation.valid) {
      console.error('Invalid transaction:', validation.errors);
      return false;
    }

    // Check gas limit
    const estimatedGas = this.estimateTransactionGas(transaction);
    if (this.gasUsed + estimatedGas > this.gasLimit) {
      console.error('Block gas limit exceeded');
      return false;
    }

    // Add transaction
    this.transactions.push(transaction);
    this.transactionCount = this.transactions.length;
    this.gasUsed += estimatedGas;

    // Recalculate Merkle root and hash
    this.merkleRoot = this.calculateMerkleRoot();
    this.hash = this.calculateHash();
    this.size = this.calculateSize();

    return true;
  }

  /**
   * Estimate gas for a transaction
   */
  private estimateTransactionGas(transaction: Transaction): bigint {
    let gas = 21000n; // Base transaction cost

    // Add cost for data
    if (transaction.data) {
      const dataBytes = Buffer.from(transaction.data, 'hex').length;
      gas += BigInt(dataBytes) * 68n; // Per byte cost
    }

    // Add cost for contract deployment
    if (!transaction.to || transaction.to === '') {
      gas += 32000n; // Contract creation cost
    }

    return gas;
  }

  /**
   * Calculate total block size in bytes
   */
  private calculateSize(): number {
    const json = JSON.stringify(this.toJSON());
    return Buffer.from(json).length;
  }

  /**
   * Validate block
   */
  public validate(previousBlock?: Block): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check block number
    if (previousBlock && this.blockNumber !== previousBlock.blockNumber + 1n) {
      errors.push('Invalid block number');
    }

    // Check previous hash
    if (previousBlock && this.previousHash !== previousBlock.hash) {
      errors.push('Invalid previous hash');
    }

    // Check hash
    if (this.hash !== this.calculateHash()) {
      errors.push('Invalid block hash');
    }

    // Check Merkle root
    if (this.merkleRoot !== this.calculateMerkleRoot()) {
      errors.push('Invalid Merkle root');
    }

    // Check timestamp
    if (previousBlock && this.timestamp <= previousBlock.timestamp) {
      errors.push('Block timestamp must be greater than previous block');
    }

    // Validate all transactions
    for (const tx of this.transactions) {
      const txValidation = tx.validate();
      if (!txValidation.valid) {
        errors.push(`Invalid transaction ${tx.hash}: ${txValidation.errors.join(', ')}`);
      }
    }

    // Check gas limit
    if (this.gasUsed > this.gasLimit) {
      errors.push('Block gas usage exceeds limit');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Set mathematical proof for PoMP consensus
   */
  public setMathematicalProof(proof: MathematicalProof): void {
    this.mathematicalProof = proof;
  }

  /**
   * Verify mathematical proof
   */
  public verifyMathematicalProof(): boolean {
    if (!this.mathematicalProof) {
      return false;
    }

    // In production, this would verify the actual mathematical proof
    // For now, we'll do basic validation
    return (
      this.mathematicalProof.algorithm !== undefined &&
      this.mathematicalProof.challenge !== undefined &&
      this.mathematicalProof.response !== undefined &&
      this.mathematicalProof.difficulty > 0
    );
  }

  /**
   * Serialize block to JSON
   */
  public toJSON(): any {
    return {
      blockNumber: this.blockNumber.toString(),
      timestamp: this.timestamp,
      transactions: this.transactions.map((tx) => tx.toJSON()),
      previousHash: this.previousHash,
      hash: this.hash,
      validator: this.validator,
      dimension: this.dimension,
      merkleRoot: this.merkleRoot,
      stateRoot: this.stateRoot,
      gasUsed: this.gasUsed.toString(),
      gasLimit: this.gasLimit.toString(),
      size: this.size,
      nonce: this.nonce.toString(),
      mathematicalProof: this.mathematicalProof,
      transactionCount: this.transactionCount,
    };
  }

  /**
   * Deserialize block from JSON
   */
  public static fromJSON(json: any): Block {
    const transactions = json.transactions.map((txJson: any) =>
      Transaction.fromJSON(txJson)
    );

    const block = new Block(
      {
        blockNumber: BigInt(json.blockNumber),
        previousHash: json.previousHash,
        validator: json.validator,
        dimension: json.dimension,
        gasLimit: BigInt(json.gasLimit),
        timestamp: json.timestamp,
      },
      transactions
    );

    block.hash = json.hash;
    block.merkleRoot = json.merkleRoot;
    block.stateRoot = json.stateRoot;
    block.gasUsed = BigInt(json.gasUsed);
    block.size = json.size;
    block.nonce = BigInt(json.nonce);
    block.mathematicalProof = json.mathematicalProof;

    return block;
  }

  /**
   * Get Merkle proof for a specific transaction
   */
  public getTransactionProof(txHash: string): string[] | null {
    const index = this.transactions.findIndex((tx) => tx.hash === txHash);
    if (index === -1) {
      return null;
    }

    const txHashes = this.transactions.map((tx) => tx.hash);
    const merkleTree = new MerkleTree(txHashes);
    return merkleTree.getProof(index);
  }

  /**
   * Verify a transaction is in this block using Merkle proof
   */
  public verifyTransactionProof(txHash: string, proof: string[]): boolean {
    const index = this.transactions.findIndex((tx) => tx.hash === txHash);
    if (index === -1) {
      return false;
    }

    return MerkleTree.verify(txHash, proof, this.merkleRoot, index);
  }
}
