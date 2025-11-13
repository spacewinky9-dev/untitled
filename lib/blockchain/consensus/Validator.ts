/**
 * Validator.ts
 * Validator implementation for PoMP consensus
 */

import { createHash } from 'crypto';

export interface ValidatorData {
  address: string;
  stake: bigint;
  reputation?: number;
  isActive?: boolean;
}

export class Validator {
  public address: string;
  public stake: bigint;
  public reputation: number;
  public isActive: boolean;
  public totalBlocks: number;
  public totalRewards: bigint;
  public slashCount: number;
  public commission: number; // percentage
  public lastBlockTime: number;

  constructor(data: ValidatorData) {
    this.address = data.address;
    this.stake = data.stake;
    this.reputation = data.reputation || 100;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.totalBlocks = 0;
    this.totalRewards = 0n;
    this.slashCount = 0;
    this.commission = 5; // 5% default commission
    this.lastBlockTime = Date.now();
  }

  /**
   * Calculate validator's effective stake (stake * reputation)
   */
  public getEffectiveStake(): bigint {
    const reputationFactor = BigInt(this.reputation) / 100n;
    return this.stake * reputationFactor;
  }

  /**
   * Reward validator for producing a valid block
   */
  public rewardBlock(reward: bigint): void {
    this.totalBlocks++;
    this.totalRewards += reward;
    this.lastBlockTime = Date.now();
    
    // Increase reputation for successful blocks
    if (this.reputation < 200) {
      this.reputation += 1;
    }
  }

  /**
   * Slash validator for malicious behavior
   */
  public slash(amount: bigint, reason: string): void {
    this.slashCount++;
    this.stake = this.stake > amount ? this.stake - amount : 0n;
    this.reputation = Math.max(0, this.reputation - 10);
    
    if (this.slashCount >= 3) {
      this.isActive = false;
    }
  }

  /**
   * Check if validator can propose a block
   */
  public canPropose(): boolean {
    return (
      this.isActive &&
      this.stake > 0n &&
      this.reputation > 50
    );
  }

  /**
   * Add stake to validator
   */
  public addStake(amount: bigint): void {
    this.stake += amount;
  }

  /**
   * Withdraw stake from validator
   */
  public withdrawStake(amount: bigint): boolean {
    if (this.stake < amount) {
      return false;
    }
    this.stake -= amount;
    return true;
  }

  /**
   * Calculate validator's voting power
   */
  public getVotingPower(): bigint {
    if (!this.isActive || this.reputation < 50) {
      return 0n;
    }
    return this.getEffectiveStake();
  }

  /**
   * Serialize validator to JSON
   */
  public toJSON(): any {
    return {
      address: this.address,
      stake: this.stake.toString(),
      reputation: this.reputation,
      isActive: this.isActive,
      totalBlocks: this.totalBlocks,
      totalRewards: this.totalRewards.toString(),
      slashCount: this.slashCount,
      commission: this.commission,
      lastBlockTime: this.lastBlockTime,
    };
  }

  /**
   * Deserialize validator from JSON
   */
  public static fromJSON(json: any): Validator {
    const validator = new Validator({
      address: json.address,
      stake: BigInt(json.stake),
      reputation: json.reputation,
      isActive: json.isActive,
    });

    validator.totalBlocks = json.totalBlocks;
    validator.totalRewards = BigInt(json.totalRewards);
    validator.slashCount = json.slashCount;
    validator.commission = json.commission;
    validator.lastBlockTime = json.lastBlockTime;

    return validator;
  }
}
