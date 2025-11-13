/**
 * Chain.ts
 * Core blockchain implementation for DamChain
 */

import { Block, BlockData } from './Block';
import { Transaction } from './Transaction';
import { createHash } from 'crypto';

export interface ChainConfig {
  blockTime: number; // seconds
  blockSizeLimit: number; // bytes
  gasLimit: bigint;
  dimensions: number; // sharding dimensions
  genesisValidator?: string;
}

export class Blockchain {
  private chain: Block[];
  private pendingTransactions: Transaction[];
  private config: ChainConfig;
  private difficulty: number;
  private blockReward: bigint;

  constructor(config: ChainConfig) {
    this.chain = [];
    this.pendingTransactions = [];
    this.config = config;
    this.difficulty = 1;
    this.blockReward = 10n * 10n ** 18n; // 10 DamCoins

    // Create genesis block
    this.createGenesisBlock();
  }

  /**
   * Create the genesis block
   */
  private createGenesisBlock(): void {
    const genesisBlock = new Block({
      blockNumber: 0n,
      previousHash: '0'.repeat(64),
      validator: this.config.genesisValidator || 'genesis',
      dimension: 0,
      gasLimit: this.config.gasLimit,
      timestamp: Date.now(),
    });

    // Set genesis proof
    genesisBlock.setMathematicalProof({
      algorithm: 'discrete-log',
      challenge: 'genesis',
      response: 'genesis',
      verificationData: {},
      difficulty: 0,
    });

    this.chain.push(genesisBlock);
  }

  /**
   * Get the latest block
   */
  public getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Get block by number
   */
  public getBlock(blockNumber: bigint): Block | undefined {
    return this.chain.find((block) => block.blockNumber === blockNumber);
  }

  /**
   * Get block by hash
   */
  public getBlockByHash(hash: string): Block | undefined {
    return this.chain.find((block) => block.hash === hash);
  }

  /**
   * Get all blocks
   */
  public getChain(): Block[] {
    return this.chain;
  }

  /**
   * Get chain length
   */
  public getLength(): number {
    return this.chain.length;
  }

  /**
   * Add a new block to the chain
   */
  public addBlock(block: Block): boolean {
    // Validate block
    const previousBlock = this.getLatestBlock();
    const validation = block.validate(previousBlock);

    if (!validation.valid) {
      console.error('Invalid block:', validation.errors);
      return false;
    }

    // Verify mathematical proof
    if (!block.verifyMathematicalProof()) {
      console.error('Invalid mathematical proof');
      return false;
    }

    // Add block to chain
    this.chain.push(block);

    // Update transaction status
    for (const tx of block.transactions) {
      tx.status = 'confirmed';
      tx.blockNumber = block.blockNumber;
      tx.blockHash = block.hash;

      // Remove from pending
      this.pendingTransactions = this.pendingTransactions.filter(
        (pendingTx) => pendingTx.hash !== tx.hash
      );
    }

    return true;
  }

  /**
   * Add transaction to pending pool
   */
  public addTransaction(transaction: Transaction): boolean {
    // Validate transaction
    const validation = transaction.validate();
    if (!validation.valid) {
      console.error('Invalid transaction:', validation.errors);
      return false;
    }

    // Check if transaction already exists
    const exists = this.pendingTransactions.some(
      (tx) => tx.hash === transaction.hash
    );
    if (exists) {
      console.error('Transaction already in pending pool');
      return false;
    }

    // Add to pending pool
    this.pendingTransactions.push(transaction);
    return true;
  }

  /**
   * Get pending transactions
   */
  public getPendingTransactions(): Transaction[] {
    return this.pendingTransactions;
  }

  /**
   * Get transaction by hash
   */
  public getTransaction(hash: string): Transaction | undefined {
    // Check pending transactions
    const pending = this.pendingTransactions.find((tx) => tx.hash === hash);
    if (pending) {
      return pending;
    }

    // Check confirmed transactions in blocks
    for (const block of this.chain) {
      const tx = block.transactions.find((tx) => tx.hash === hash);
      if (tx) {
        return tx;
      }
    }

    return undefined;
  }

  /**
   * Get all transactions for an address
   */
  public getTransactionsByAddress(address: string): Transaction[] {
    const transactions: Transaction[] = [];

    // Check all blocks
    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.from === address || tx.to === address) {
          transactions.push(tx);
        }
      }
    }

    // Check pending
    for (const tx of this.pendingTransactions) {
      if (tx.from === address || tx.to === address) {
        transactions.push(tx);
      }
    }

    return transactions;
  }

  /**
   * Get balance for an address
   */
  public getBalance(address: string): bigint {
    let balance = 0n;

    // Sum all transactions
    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.from === address) {
          balance -= tx.value + tx.calculateFee();
        }
        if (tx.to === address) {
          balance += tx.value;
        }
      }

      // Add block rewards if validator
      if (block.validator === address && block.blockNumber > 0n) {
        balance += this.blockReward;
      }
    }

    return balance;
  }

  /**
   * Get nonce for an address (number of transactions sent)
   */
  public getNonce(address: string): bigint {
    let nonce = 0n;

    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.from === address) {
          nonce++;
        }
      }
    }

    return nonce;
  }

  /**
   * Validate the entire chain
   */
  public isValid(): boolean {
    // Check genesis block
    if (this.chain.length === 0) {
      return false;
    }

    // Validate each block
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      const validation = currentBlock.validate(previousBlock);
      if (!validation.valid) {
        console.error(`Block ${i} is invalid:`, validation.errors);
        return false;
      }

      if (!currentBlock.verifyMathematicalProof()) {
        console.error(`Block ${i} has invalid mathematical proof`);
        return false;
      }
    }

    return true;
  }

  /**
   * Mine pending transactions (for PoMP consensus)
   * This doesn't actually "mine" - it creates a block with mathematical proof
   */
  public async minePendingTransactions(
    validatorAddress: string,
    dimension: number = 0
  ): Promise<Block | null> {
    // Filter transactions for this dimension
    const dimensionTransactions = this.pendingTransactions.filter(
      (tx) => tx.getDimension(this.config.dimensions) === dimension
    );

    if (dimensionTransactions.length === 0) {
      return null;
    }

    // Create new block
    const newBlock = new Block(
      {
        blockNumber: BigInt(this.chain.length),
        previousHash: this.getLatestBlock().hash,
        validator: validatorAddress,
        dimension,
        gasLimit: this.config.gasLimit,
      },
      dimensionTransactions.slice(0, 1000) // Max 1000 transactions per block
    );

    // Generate mathematical proof (simplified version)
    const proof = this.generateMathematicalProof(newBlock, this.difficulty);
    newBlock.setMathematicalProof(proof);

    // Add block to chain
    if (this.addBlock(newBlock)) {
      return newBlock;
    }

    return null;
  }

  /**
   * Generate mathematical proof for PoMP consensus
   * In production, this would solve actual mathematical puzzles
   */
  private generateMathematicalProof(
    block: Block,
    difficulty: number
  ): any {
    const challenge = createHash('sha256')
      .update(block.hash + difficulty.toString())
      .digest('hex');

    // Simplified proof - in production, this would be a real mathematical puzzle
    const response = createHash('sha256')
      .update(challenge + block.validator)
      .digest('hex');

    return {
      algorithm: 'discrete-log',
      challenge,
      response,
      verificationData: {
        blockHash: block.hash,
        validator: block.validator,
        timestamp: block.timestamp,
      },
      difficulty,
    };
  }

  /**
   * Get network statistics
   */
  public getStats(): {
    totalBlocks: number;
    totalTransactions: number;
    pendingTransactions: number;
    averageBlockTime: number;
    chainLength: bigint;
  } {
    let totalTransactions = 0;
    let totalBlockTime = 0;

    for (let i = 1; i < this.chain.length; i++) {
      totalTransactions += this.chain[i].transactionCount;
      totalBlockTime += this.chain[i].timestamp - this.chain[i - 1].timestamp;
    }

    return {
      totalBlocks: this.chain.length,
      totalTransactions,
      pendingTransactions: this.pendingTransactions.length,
      averageBlockTime:
        this.chain.length > 1 ? totalBlockTime / (this.chain.length - 1) / 1000 : 0,
      chainLength: this.getLatestBlock().blockNumber,
    };
  }

  /**
   * Export chain to JSON
   */
  public toJSON(): any {
    return {
      config: this.config,
      difficulty: this.difficulty,
      blockReward: this.blockReward.toString(),
      chain: this.chain.map((block) => block.toJSON()),
      pendingTransactions: this.pendingTransactions.map((tx) => tx.toJSON()),
    };
  }

  /**
   * Import chain from JSON
   */
  public static fromJSON(json: any): Blockchain {
    const blockchain = new Blockchain(json.config);
    blockchain.difficulty = json.difficulty;
    blockchain.blockReward = BigInt(json.blockReward);

    // Clear genesis and load chain
    blockchain.chain = json.chain.map((blockJson: any) =>
      Block.fromJSON(blockJson)
    );

    blockchain.pendingTransactions = json.pendingTransactions.map(
      (txJson: any) => Transaction.fromJSON(txJson)
    );

    return blockchain;
  }
}
