/**
 * SmartContract.ts
 * Smart contract implementation for DamChain
 */

import { createHash } from 'crypto';

export interface ContractStorage {
  [key: string]: any;
}

export interface ContractMetadata {
  name: string;
  version: string;
  author: string;
  description?: string;
}

export interface DeploymentInfo {
  creator: string;
  deploymentBlock: bigint;
  deploymentTx: string;
  timestamp: number;
}

export class SmartContract {
  public address: string;
  public code: string;
  public storage: ContractStorage;
  public balance: bigint;
  public metadata: ContractMetadata;
  public deployment: DeploymentInfo;
  public isPaused: boolean;
  public owner: string;

  constructor(
    address: string,
    code: string,
    creator: string,
    metadata: ContractMetadata
  ) {
    this.address = address;
    this.code = code;
    this.storage = {};
    this.balance = 0n;
    this.metadata = metadata;
    this.deployment = {
      creator,
      deploymentBlock: 0n,
      deploymentTx: '',
      timestamp: Date.now(),
    };
    this.isPaused = false;
    this.owner = creator;
  }

  /**
   * Generate deterministic contract address
   */
  public static generateAddress(creator: string, nonce: bigint, code: string): string {
    const data = `${creator}${nonce.toString()}${code}`;
    const hash = createHash('sha256').update(data).digest('hex');
    return 'dam1c' + hash.substring(0, 40); // Contract addresses start with dam1c
  }

  /**
   * Get storage value
   */
  public getStorage(key: string): any {
    return this.storage[key];
  }

  /**
   * Set storage value
   */
  public setStorage(key: string, value: any): void {
    this.storage[key] = value;
  }

  /**
   * Clear all storage
   */
  public clearStorage(): void {
    this.storage = {};
  }

  /**
   * Add balance to contract
   */
  public addBalance(amount: bigint): void {
    this.balance += amount;
  }

  /**
   * Deduct balance from contract
   */
  public deductBalance(amount: bigint): boolean {
    if (this.balance < amount) {
      return false;
    }
    this.balance -= amount;
    return true;
  }

  /**
   * Pause contract execution
   */
  public pause(): void {
    this.isPaused = true;
  }

  /**
   * Resume contract execution
   */
  public resume(): void {
    this.isPaused = false;
  }

  /**
   * Transfer ownership
   */
  public transferOwnership(newOwner: string): void {
    this.owner = newOwner;
  }

  /**
   * Get contract size in bytes
   */
  public getSize(): number {
    return Buffer.from(this.code).length;
  }

  /**
   * Serialize contract to JSON
   */
  public toJSON(): any {
    return {
      address: this.address,
      code: this.code,
      storage: this.storage,
      balance: this.balance.toString(),
      metadata: this.metadata,
      deployment: {
        creator: this.deployment.creator,
        deploymentBlock: this.deployment.deploymentBlock.toString(),
        deploymentTx: this.deployment.deploymentTx,
        timestamp: this.deployment.timestamp,
      },
      isPaused: this.isPaused,
      owner: this.owner,
    };
  }

  /**
   * Deserialize contract from JSON
   */
  public static fromJSON(json: any): SmartContract {
    const contract = new SmartContract(
      json.address,
      json.code,
      json.deployment.creator,
      json.metadata
    );

    contract.storage = json.storage;
    contract.balance = BigInt(json.balance);
    contract.deployment.deploymentBlock = BigInt(json.deployment.deploymentBlock);
    contract.deployment.deploymentTx = json.deployment.deploymentTx;
    contract.deployment.timestamp = json.deployment.timestamp;
    contract.isPaused = json.isPaused;
    contract.owner = json.owner;

    return contract;
  }
}
