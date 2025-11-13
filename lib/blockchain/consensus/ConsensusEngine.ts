/**
 * ConsensusEngine.ts
 * Proof of Mathematical Proof (PoMP) Consensus Engine
 */

import { createHash } from 'crypto';
import { Validator } from './Validator';
import { Block } from '../core/Block';
import type { MathematicalProof } from '../core/Block';

export interface ConsensusConfig {
  minStake: bigint;
  blockReward: bigint;
  proofDifficulty: number;
  finalizationBlocks: number;
}

export class ConsensusEngine {
  private validators: Map<string, Validator>;
  private config: ConsensusConfig;
  private currentEpoch: number;

  constructor(config: ConsensusConfig) {
    this.validators = new Map();
    this.config = config;
    this.currentEpoch = 0;
  }

  /**
   * Register a new validator
   */
  public registerValidator(validator: Validator): boolean {
    if (validator.stake < this.config.minStake) {
      return false;
    }

    if (this.validators.has(validator.address)) {
      return false;
    }

    this.validators.set(validator.address, validator);
    return true;
  }

  /**
   * Unregister a validator
   */
  public unregisterValidator(address: string): boolean {
    return this.validators.delete(address);
  }

  /**
   * Get all active validators
   */
  public getActiveValidators(): Validator[] {
    return Array.from(this.validators.values()).filter((v) => v.canPropose());
  }

  /**
   * Select validator for block proposal using weighted random selection
   * Based on stake and reputation
   */
  public selectValidator(previousBlockHash: string, blockHeight: number): Validator | null {
    const activeValidators = this.getActiveValidators();

    if (activeValidators.length === 0) {
      return null;
    }

    // Calculate total voting power
    let totalVotingPower = 0n;
    for (const validator of activeValidators) {
      totalVotingPower += validator.getVotingPower();
    }

    if (totalVotingPower === 0n) {
      return null;
    }

    // Deterministic random selection based on previous block hash
    const seed = previousBlockHash + blockHeight.toString();
    const randomHash = createHash('sha256').update(seed).digest();
    const randomBigInt = BigInt('0x' + randomHash.toString('hex'));
    const target = randomBigInt % totalVotingPower;

    // Select validator based on cumulative voting power
    let cumulativeVotingPower = 0n;
    for (const validator of activeValidators) {
      cumulativeVotingPower += validator.getVotingPower();
      if (cumulativeVotingPower > target) {
        return validator;
      }
    }

    // Fallback to first validator (shouldn't reach here)
    return activeValidators[0];
  }

  /**
   * Generate mathematical proof for PoMP consensus
   * This creates a proof that the validator solved a mathematical puzzle
   */
  public generateMathematicalProof(
    block: Block,
    validatorAddress: string
  ): MathematicalProof {
    const difficulty = this.config.proofDifficulty;

    // Create a challenge based on block data
    const challengeData = `${block.hash}${validatorAddress}${block.timestamp}${difficulty}`;
    const challenge = createHash('sha256').update(challengeData).digest('hex');

    // Generate response by solving a simplified discrete logarithm-like problem
    // In production, this would be a real mathematical puzzle
    const responseSeed = `${challenge}${validatorAddress}`;
    const response = createHash('sha256').update(responseSeed).digest('hex');

    // Generate proof of work that's verifiable but not computationally intensive
    const proofData = {
      blockHash: block.hash,
      validator: validatorAddress,
      timestamp: block.timestamp,
      difficulty,
      challenge,
      response,
    };

    return {
      algorithm: 'discrete-log',
      challenge,
      response,
      verificationData: proofData,
      difficulty,
    };
  }

  /**
   * Verify mathematical proof
   */
  public verifyMathematicalProof(
    block: Block,
    proof: MathematicalProof,
    validatorAddress: string
  ): boolean {
    if (!proof || !proof.challenge || !proof.response) {
      return false;
    }

    // Recreate the challenge
    const challengeData = `${block.hash}${validatorAddress}${block.timestamp}${proof.difficulty}`;
    const expectedChallenge = createHash('sha256').update(challengeData).digest('hex');

    if (proof.challenge !== expectedChallenge) {
      return false;
    }

    // Verify the response
    const responseSeed = `${proof.challenge}${validatorAddress}`;
    const expectedResponse = createHash('sha256').update(responseSeed).digest('hex');

    if (proof.response !== expectedResponse) {
      return false;
    }

    // Verify difficulty meets requirements
    if (proof.difficulty < this.config.proofDifficulty) {
      return false;
    }

    return true;
  }

  /**
   * Validate block according to PoMP consensus rules
   */
  public validateBlock(
    block: Block,
    previousBlock: Block
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check if validator exists and is active
    const validator = this.validators.get(block.validator);
    if (!validator) {
      errors.push('Validator not found');
    } else if (!validator.canPropose()) {
      errors.push('Validator cannot propose blocks');
    }

    // Verify mathematical proof
    if (!block.mathematicalProof) {
      errors.push('Missing mathematical proof');
    } else if (!this.verifyMathematicalProof(block, block.mathematicalProof, block.validator)) {
      errors.push('Invalid mathematical proof');
    }

    // Check block height
    if (block.blockNumber !== previousBlock.blockNumber + 1n) {
      errors.push('Invalid block number');
    }

    // Check previous hash
    if (block.previousHash !== previousBlock.hash) {
      errors.push('Invalid previous hash');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Reward validator for successfully proposing a block
   */
  public rewardValidator(validatorAddress: string): bigint {
    const validator = this.validators.get(validatorAddress);
    if (!validator) {
      return 0n;
    }

    validator.rewardBlock(this.config.blockReward);
    return this.config.blockReward;
  }

  /**
   * Slash validator for malicious behavior
   */
  public slashValidator(validatorAddress: string, reason: string): void {
    const validator = this.validators.get(validatorAddress);
    if (!validator) {
      return;
    }

    // Slash 10% of stake for misbehavior
    const slashAmount = validator.stake / 10n;
    validator.slash(slashAmount, reason);
  }

  /**
   * Check if block is finalized (has enough confirmations)
   */
  public isFinalized(blockNumber: bigint, currentBlockNumber: bigint): boolean {
    const confirmations = currentBlockNumber - blockNumber;
    return confirmations >= BigInt(this.config.finalizationBlocks);
  }

  /**
   * Get validator by address
   */
  public getValidator(address: string): Validator | undefined {
    return this.validators.get(address);
  }

  /**
   * Get all validators
   */
  public getAllValidators(): Validator[] {
    return Array.from(this.validators.values());
  }

  /**
   * Get total staked amount
   */
  public getTotalStake(): bigint {
    let total = 0n;
    for (const validator of this.validators.values()) {
      total += validator.stake;
    }
    return total;
  }

  /**
   * Get network statistics
   */
  public getStats(): {
    totalValidators: number;
    activeValidators: number;
    totalStake: string;
    averageReputation: number;
  } {
    const allValidators = this.getAllValidators();
    const activeValidators = this.getActiveValidators();
    const totalStake = this.getTotalStake();

    let totalReputation = 0;
    for (const validator of allValidators) {
      totalReputation += validator.reputation;
    }

    return {
      totalValidators: allValidators.length,
      activeValidators: activeValidators.length,
      totalStake: totalStake.toString(),
      averageReputation:
        allValidators.length > 0 ? totalReputation / allValidators.length : 0,
    };
  }

  /**
   * Serialize consensus state to JSON
   */
  public toJSON(): any {
    return {
      validators: Array.from(this.validators.values()).map((v) => v.toJSON()),
      config: {
        minStake: this.config.minStake.toString(),
        blockReward: this.config.blockReward.toString(),
        proofDifficulty: this.config.proofDifficulty,
        finalizationBlocks: this.config.finalizationBlocks,
      },
      currentEpoch: this.currentEpoch,
    };
  }

  /**
   * Deserialize consensus state from JSON
   */
  public static fromJSON(json: any): ConsensusEngine {
    const config: ConsensusConfig = {
      minStake: BigInt(json.config.minStake),
      blockReward: BigInt(json.config.blockReward),
      proofDifficulty: json.config.proofDifficulty,
      finalizationBlocks: json.config.finalizationBlocks,
    };

    const engine = new ConsensusEngine(config);
    engine.currentEpoch = json.currentEpoch;

    for (const validatorJson of json.validators) {
      const validator = Validator.fromJSON(validatorJson);
      engine.validators.set(validator.address, validator);
    }

    return engine;
  }
}
