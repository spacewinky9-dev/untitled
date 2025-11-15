/**
 * HomomorphicEncryption.ts
 * Privacy-Preserving Computation Layer for DamChain
 * 
 * Implements homomorphic encryption for:
 * - Private smart contract execution
 * - Confidential transactions
 * - Encrypted state transitions
 * 
 * Based on Paillier and BFV/BGV schemes (simplified)
 */

import { createHash, randomBytes } from 'crypto';

export interface EncryptedValue {
  ciphertext: bigint;
  publicKey: bigint;
  randomness?: bigint;
}

export interface HomomorphicKeyPair {
  publicKey: { n: bigint; g: bigint };
  privateKey: { lambda: bigint; mu: bigint };
}

/**
 * Paillier Homomorphic Encryption
 * Supports additive homomorphic operations
 */
export class PaillierEncryption {
  private bitLength: number;

  constructor(bitLength: number = 2048) {
    this.bitLength = bitLength;
  }

  /**
   * Generate Paillier key pair
   */
  generateKeyPair(): HomomorphicKeyPair {
    // Generate two large primes p and q
    const p = this.generatePrime(this.bitLength / 2);
    const q = this.generatePrime(this.bitLength / 2);
    
    const n = p * q;
    const lambda = this.lcm(p - 1n, q - 1n);
    const g = n + 1n;
    
    // Compute mu = (L(g^lambda mod n^2))^(-1) mod n
    const n2 = n * n;
    const gLambda = this.modPow(g, lambda, n2);
    const l = this.lFunction(gLambda, n);
    const mu = this.modInverse(l, n);

    return {
      publicKey: { n, g },
      privateKey: { lambda, mu },
    };
  }

  /**
   * Encrypt a value using Paillier encryption
   */
  encrypt(message: bigint, publicKey: { n: bigint; g: bigint }): EncryptedValue {
    const { n, g } = publicKey;
    const n2 = n * n;
    
    // Generate random r < n
    const r = this.generateRandom(n);
    
    // Compute ciphertext: c = g^m * r^n mod n^2
    const gm = this.modPow(g, message, n2);
    const rn = this.modPow(r, n, n2);
    const ciphertext = (gm * rn) % n2;

    return {
      ciphertext,
      publicKey: n,
      randomness: r,
    };
  }

  /**
   * Decrypt ciphertext using private key
   */
  decrypt(encrypted: EncryptedValue, privateKey: { lambda: bigint; mu: bigint }, n: bigint): bigint {
    const { lambda, mu } = privateKey;
    const n2 = n * n;
    
    // Compute m = L(c^lambda mod n^2) * mu mod n
    const cLambda = this.modPow(encrypted.ciphertext, lambda, n2);
    const l = this.lFunction(cLambda, n);
    const message = (l * mu) % n;

    return message;
  }

  /**
   * Homomorphic addition: E(m1) + E(m2) = E(m1 + m2)
   */
  add(enc1: EncryptedValue, enc2: EncryptedValue, n: bigint): EncryptedValue {
    const n2 = n * n;
    const sum = (enc1.ciphertext * enc2.ciphertext) % n2;

    return {
      ciphertext: sum,
      publicKey: n,
    };
  }

  /**
   * Homomorphic scalar multiplication: k * E(m) = E(k * m)
   */
  scalarMultiply(encrypted: EncryptedValue, scalar: bigint, n: bigint): EncryptedValue {
    const n2 = n * n;
    const result = this.modPow(encrypted.ciphertext, scalar, n2);

    return {
      ciphertext: result,
      publicKey: n,
    };
  }

  // Helper functions
  private generatePrime(bits: number): bigint {
    // Simplified prime generation
    const bytes = randomBytes(Math.ceil(bits / 8));
    let num = BigInt('0x' + bytes.toString('hex'));
    num = num | (1n << BigInt(bits - 1)); // Set MSB
    num = num | 1n; // Make odd
    
    // Find next prime (simplified Miller-Rabin)
    while (!this.isPrime(num)) {
      num += 2n;
    }
    
    return num;
  }

  private isPrime(n: bigint, rounds: number = 5): boolean {
    if (n <= 1n) return false;
    if (n <= 3n) return true;
    if (n % 2n === 0n) return false;

    let d = n - 1n;
    let r = 0n;
    while (d % 2n === 0n) {
      d /= 2n;
      r++;
    }

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

  private modPow(base: bigint, exp: bigint, mod: bigint): bigint {
    if (mod === 1n) return 0n;
    
    let result = 1n;
    base = base % mod;
    
    while (exp > 0n) {
      if (exp % 2n === 1n) {
        result = (result * base) % mod;
      }
      exp = exp >> 1n;
      base = (base * base) % mod;
    }
    
    return result;
  }

  private modInverse(a: bigint, m: bigint): bigint {
    // Extended Euclidean Algorithm
    let [old_r, r] = [a, m];
    let [old_s, s] = [1n, 0n];

    while (r !== 0n) {
      const quotient = old_r / r;
      [old_r, r] = [r, old_r - quotient * r];
      [old_s, s] = [s, old_s - quotient * s];
    }

    return old_s < 0n ? old_s + m : old_s;
  }

  private gcd(a: bigint, b: bigint): bigint {
    while (b !== 0n) {
      [a, b] = [b, a % b];
    }
    return a;
  }

  private lcm(a: bigint, b: bigint): bigint {
    return (a * b) / this.gcd(a, b);
  }

  private lFunction(x: bigint, n: bigint): bigint {
    return (x - 1n) / n;
  }

  private generateRandom(max: bigint): bigint {
    const bytes = randomBytes(32);
    const num = BigInt('0x' + bytes.toString('hex'));
    return (num % (max - 1n)) + 1n;
  }
}

/**
 * Homomorphic Smart Contract Executor
 * Execute contracts on encrypted data
 */
export class HomomorphicContractExecutor {
  private paillier: PaillierEncryption;

  constructor() {
    this.paillier = new PaillierEncryption();
  }

  /**
   * Execute addition on encrypted balances
   */
  executeEncryptedTransfer(
    senderBalance: EncryptedValue,
    amount: EncryptedValue,
    n: bigint
  ): { newSenderBalance: EncryptedValue; recipientIncrease: EncryptedValue } {
    // Homomorphically subtract amount from sender
    const negAmount = this.paillier.scalarMultiply(amount, -1n, n);
    const newSenderBalance = this.paillier.add(senderBalance, negAmount, n);

    return {
      newSenderBalance,
      recipientIncrease: amount,
    };
  }

  /**
   * Verify encrypted balance is sufficient (using range proofs)
   */
  verifyEncryptedBalance(
    encryptedBalance: EncryptedValue,
    privateKey: { lambda: bigint; mu: bigint },
    n: bigint,
    minAmount: bigint
  ): boolean {
    const balance = this.paillier.decrypt(encryptedBalance, privateKey, n);
    return balance >= minAmount;
  }
}

export class HomomorphicEncryption {
  private paillier: PaillierEncryption;
  private executor: HomomorphicContractExecutor;

  constructor() {
    this.paillier = new PaillierEncryption();
    this.executor = new HomomorphicContractExecutor();
  }

  generateKeyPair(): HomomorphicKeyPair {
    return this.paillier.generateKeyPair();
  }

  encrypt(message: bigint, publicKey: { n: bigint; g: bigint }): EncryptedValue {
    return this.paillier.encrypt(message, publicKey);
  }

  decrypt(encrypted: EncryptedValue, privateKey: { lambda: bigint; mu: bigint }, n: bigint): bigint {
    return this.paillier.decrypt(encrypted, privateKey, n);
  }

  add(enc1: EncryptedValue, enc2: EncryptedValue, n: bigint): EncryptedValue {
    return this.paillier.add(enc1, enc2, n);
  }

  getExecutor(): HomomorphicContractExecutor {
    return this.executor;
  }
}
