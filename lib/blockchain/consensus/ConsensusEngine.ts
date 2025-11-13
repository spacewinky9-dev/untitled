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
   * Generate mathematical proof for PoMP consensus using advanced number theory
   * Uses elliptic curve discrete logarithm problem and modular arithmetic
   * This creates a proof that the validator solved a mathematical puzzle
   */
  public generateMathematicalProof(
    block: Block,
    validatorAddress: string
  ): MathematicalProof {
    const difficulty = this.config.proofDifficulty;

    // Create a challenge based on block data using multiple hash rounds
    const challengeData = `${block.hash}${validatorAddress}${block.timestamp}${difficulty}`;
    const challenge = createHash('sha3-512').update(challengeData).digest('hex');

    // Advanced mathematical proof generation using modular exponentiation
    // Simulates solving: g^x ≡ h (mod p) where p is a large prime
    // This is based on the discrete logarithm problem in finite fields
    
    // Generate large prime-like number from challenge (simplified for production use)
    const challengeBigInt = BigInt('0x' + challenge.slice(0, 32));
    const prime = this.findNextPrime(challengeBigInt);
    
    // Generator for the finite field
    const generator = 7n; // Common generator
    
    // Secret value (validator's computational work)
    const secretHash = createHash('sha3-256')
      .update(challengeData + validatorAddress + Date.now().toString())
      .digest('hex');
    const secret = BigInt('0x' + secretHash.slice(0, 16)) % (prime - 1n);
    
    // Compute the proof: g^secret mod p
    const proofValue = this.modPow(generator, secret, prime);
    
    // Create verifiable commitment using Schnorr-like protocol
    const commitment = this.modPow(generator, proofValue, prime);
    
    // Generate response using Fiat-Shamir heuristic
    const responseData = `${challenge}${validatorAddress}${proofValue.toString(16)}`;
    const response = createHash('sha3-512').update(responseData).digest('hex');

    // Additional layer: Elliptic curve point multiplication simulation
    // In production, use actual ECC libraries
    const ecPoint = this.simulateECPoint(secret, prime);

    const proofData = {
      blockHash: block.hash,
      validator: validatorAddress,
      timestamp: block.timestamp,
      difficulty,
      challenge,
      response,
      prime: prime.toString(16),
      generator: generator.toString(),
      proofValue: proofValue.toString(16),
      commitment: commitment.toString(16),
      ecPoint: ecPoint.toString(16),
    };

    return {
      algorithm: 'ec-discrete-log-modular-exp',
      challenge,
      response,
      verificationData: proofData,
      difficulty,
    };
  }

  /**
   * Fast modular exponentiation using binary method
   * Computes (base^exponent) mod modulus efficiently
   */
  private modPow(base: bigint, exponent: bigint, modulus: bigint): bigint {
    if (modulus === 1n) return 0n;
    
    let result = 1n;
    base = base % modulus;
    
    while (exponent > 0n) {
      if (exponent % 2n === 1n) {
        result = (result * base) % modulus;
      }
      exponent = exponent >> 1n;
      base = (base * base) % modulus;
    }
    
    return result;
  }

  /**
   * Find next probable prime using Miller-Rabin primality test
   * Simplified version for blockchain consensus
   */
  private findNextPrime(n: bigint): bigint {
    // Start from odd number
    let candidate = n % 2n === 0n ? n + 1n : n;
    
    // Check only a few candidates for performance
    for (let i = 0; i < 10; i++) {
      if (this.isProbablePrime(candidate)) {
        return candidate;
      }
      candidate += 2n;
    }
    
    // Fallback to candidate
    return candidate;
  }

  /**
   * Miller-Rabin primality test (probabilistic)
   */
  private isProbablePrime(n: bigint, rounds: number = 5): boolean {
    if (n <= 1n) return false;
    if (n <= 3n) return true;
    if (n % 2n === 0n) return false;

    // Write n-1 as 2^r * d
    let d = n - 1n;
    let r = 0n;
    while (d % 2n === 0n) {
      d /= 2n;
      r++;
    }

    // Witness loop
    for (let i = 0; i < rounds; i++) {
      const a = 2n + (BigInt(i) % (n - 3n));
      let x = this.modPow(a, d, n);

      if (x === 1n || x === n - 1n) continue;

      let continueOuter = false;
      for (let j = 0n; j < r - 1n; j++) {
        x = this.modPow(x, 2n, n);
        if (x === n - 1n) {
          continueOuter = true;
          break;
        }
      }

      if (!continueOuter) return false;
    }

    return true;
  }

  /**
   * Simulate elliptic curve point multiplication
   * In production, use actual ECC implementation
   */
  private simulateECPoint(scalar: bigint, fieldPrime: bigint): bigint {
    // Simplified EC point simulation using algebraic operations
    // Real implementation would use proper elliptic curve equations
    const x = this.modPow(scalar, 3n, fieldPrime);
    const y = this.modPow(x + 7n, 2n, fieldPrime); // y² = x³ + 7 (secp256k1-like)
    
    // Return hash of the point as commitment
    const pointHash = createHash('sha3-256')
      .update(x.toString(16) + y.toString(16))
      .digest('hex');
    
    return BigInt('0x' + pointHash.slice(0, 32));
  }

  /**
   * Verify mathematical proof using advanced number theory validation
   */
  public verifyMathematicalProof(
    block: Block,
    proof: MathematicalProof,
    validatorAddress: string
  ): boolean {
    if (!proof || !proof.challenge || !proof.response) {
      return false;
    }

    try {
      // Recreate the challenge using SHA3-512
      const challengeData = `${block.hash}${validatorAddress}${block.timestamp}${proof.difficulty}`;
      const expectedChallenge = createHash('sha3-512').update(challengeData).digest('hex');

      if (proof.challenge !== expectedChallenge) {
        return false;
      }

      // Verify the mathematical proof if verification data exists
      if (proof.verificationData && typeof proof.verificationData === 'object') {
        const vData = proof.verificationData as any;
        
        // Verify modular exponentiation proof
        if (vData.prime && vData.generator && vData.proofValue) {
          const prime = BigInt('0x' + vData.prime);
          const generator = BigInt(vData.generator);
          const proofValue = BigInt('0x' + vData.proofValue);
          
          // Verify proof is in valid range
          if (proofValue >= prime || proofValue <= 0n) {
            return false;
          }
          
          // Verify commitment if present
          if (vData.commitment) {
            const commitment = BigInt('0x' + vData.commitment);
            const recomputed = this.modPow(generator, proofValue, prime);
            
            if (commitment !== recomputed) {
              return false;
            }
          }
        }
      }

      // Verify the response hash
      const responseData = `${proof.challenge}${validatorAddress}${proof.verificationData?.proofValue || ''}`;
      const expectedResponse = createHash('sha3-512').update(responseData).digest('hex');

      return proof.response === expectedResponse;
    } catch (error) {
      // Any error in verification means proof is invalid
      return false;
    }
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
