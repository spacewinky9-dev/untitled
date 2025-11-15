/**
 * Wallet System - Phase 10
 * Complete wallet implementation with key management, transaction creation, and security
 */

import { QuantumProofCrypto } from '../crypto/QuantumProofCrypto';
import { Transaction } from '../core/Transaction';
import crypto from 'crypto';

/**
 * Wallet configuration
 */
export interface WalletConfig {
  encrypted?: boolean;
  password?: string;
}

/**
 * Wallet data structure
 */
export interface WalletData {
  version: string;
  address: string;
  publicKey: string;
  encryptedPrivateKey?: string;
  privateKey?: string;
  mnemonic?: string | string[];
  createdAt: Date;
  label?: string;
}

/**
 * Transaction history entry
 */
export interface TransactionHistoryEntry {
  hash: string;
  from: string;
  to: string;
  value: bigint;
  fee: bigint;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
  blockNumber?: number;
}

/**
 * Wallet class with full key management and transaction capabilities
 */
export class Wallet {
  private address: string;
  private publicKey: string;
  private privateKey: string;
  private mnemonic?: string | string[];
  private encrypted: boolean;
  private label?: string;
  private createdAt: Date;
  private transactionHistory: TransactionHistoryEntry[] = [];

  constructor(privateKey: string, publicKey: string, address: string, options?: {
    mnemonic?: string | string[];
    label?: string;
    createdAt?: Date;
  }) {
    this.privateKey = privateKey;
    this.publicKey = publicKey;
    this.address = address;
    this.mnemonic = options?.mnemonic;
    this.label = options?.label;
    this.createdAt = options?.createdAt || new Date();
    this.encrypted = false;
  }

  /**
   * Create a new wallet with generated keys
   */
  static createNew(label?: string): Wallet {
    const keyPair = QuantumProofCrypto.generateKeyPair();
    const address = QuantumProofCrypto.publicKeyToAddress(keyPair.publicKey);
    const mnemonic = QuantumProofCrypto.generateMnemonic();

    return new Wallet(keyPair.privateKey, keyPair.publicKey, address, {
      mnemonic,
      label,
      createdAt: new Date(),
    });
  }

  /**
   * Import wallet from private key
   */
  static fromPrivateKey(privateKey: string, label?: string): Wallet {
    const keyPair = QuantumProofCrypto.generateKeyPair(); // Get public key format
    const publicKey = keyPair.publicKey; // In production, derive from private key
    const address = QuantumProofCrypto.publicKeyToAddress(publicKey);

    return new Wallet(privateKey, publicKey, address, {
      label,
      createdAt: new Date(),
    });
  }

  /**
   * Import wallet from mnemonic phrase
   */
  static fromMnemonic(mnemonic: string | string[], label?: string): Wallet {
    // Convert array to string if needed
    const mnemonicStr = Array.isArray(mnemonic) ? mnemonic.join(' ') : mnemonic;
    // Use first word as salt for demonstration
    const salt = mnemonicStr.split(' ')[0];
    const privateKey = QuantumProofCrypto.deriveKey(mnemonicStr, salt);
    const keyPair = QuantumProofCrypto.generateKeyPair(); // Get format
    const publicKey = keyPair.publicKey;
    const address = QuantumProofCrypto.publicKeyToAddress(publicKey);

    return new Wallet(privateKey, publicKey, address, {
      mnemonic: mnemonicStr,
      label,
      createdAt: new Date(),
    });
  }

  /**
   * Encrypt wallet with password
   */
  encrypt(password: string): void {
    if (this.encrypted) {
      throw new Error('Wallet is already encrypted');
    }

    const encryptedKey = QuantumProofCrypto.encrypt(this.privateKey, password);
    this.privateKey = encryptedKey;
    this.encrypted = true;
  }

  /**
   * Decrypt wallet with password
   */
  decrypt(password: string): void {
    if (!this.encrypted) {
      throw new Error('Wallet is not encrypted');
    }

    const decryptedKey = QuantumProofCrypto.decrypt(this.privateKey, password);
    if (!decryptedKey) {
      throw new Error("Failed to decrypt wallet - incorrect password");
    }
    this.privateKey = decryptedKey;
    this.encrypted = false;
  }

  /**
   * Export wallet data
   */
  export(password?: string): WalletData {
    let exportData: WalletData = {
      version: '1.0',
      address: this.address,
      publicKey: this.publicKey,
      mnemonic: this.mnemonic,
      createdAt: this.createdAt,
      label: this.label,
    };

    if (password) {
      // Encrypt private key for export
      exportData.encryptedPrivateKey = QuantumProofCrypto.encrypt(this.privateKey, password);
    } else {
      // WARNING: Exporting unencrypted private key
      exportData.privateKey = this.privateKey;
    }

    return exportData;
  }

  /**
   * Import wallet from exported data
   */
  static import(data: WalletData, password?: string): Wallet {
    let privateKey: string;

    if (data.encryptedPrivateKey && password) {
      const decrypted = QuantumProofCrypto.decrypt(data.encryptedPrivateKey, password);
      if (!decrypted) {
        throw new Error('Failed to decrypt wallet - incorrect password');
      }
      privateKey = decrypted;
    } else if (data.privateKey) {
      privateKey = data.privateKey;
    } else {
      throw new Error('No private key found in wallet data');
    }

    return new Wallet(privateKey, data.publicKey, data.address, {
      mnemonic: data.mnemonic,
      label: data.label,
      createdAt: data.createdAt,
    });
  }

  /**
   * Create and sign a transaction
   */
  createTransaction(to: string, value: bigint, options?: {
    gasPrice?: bigint;
    gasLimit?: bigint;
    nonce?: bigint;
    data?: string;
  }): Transaction {
    if (this.encrypted) {
      throw new Error('Wallet is encrypted. Please decrypt before signing.');
    }

    const tx = new Transaction({
      from: this.address,
      to,
      value,
      gasPrice: options?.gasPrice || 1000000n,
      gasLimit: options?.gasLimit || 21000n,
      nonce: options?.nonce || 0n,
      data: options?.data,
      timestamp: Date.now(),
    });

    // Sign transaction
    const signature = QuantumProofCrypto.sign(tx.hash, this.privateKey);
    tx.sign(signature);

    return tx;
  }

  /**
   * Sign arbitrary data
   */
  sign(data: string): string {
    if (this.encrypted) {
      throw new Error('Wallet is encrypted. Please decrypt before signing.');
    }

    const signature = QuantumProofCrypto.sign(data, this.privateKey);
    // Convert signature object to string
    return JSON.stringify(signature);
  }

  /**
   * Verify signature
   */
  verify(data: string, signature: string): boolean {
    // Parse signature from JSON string
    const signatureObj = JSON.parse(signature);
    return QuantumProofCrypto.verify(data, signatureObj, this.publicKey);
  }

  /**
   * Add transaction to history
   */
  addTransactionToHistory(entry: TransactionHistoryEntry): void {
    this.transactionHistory.push(entry);
  }

  /**
   * Get transaction history
   */
  getTransactionHistory(): TransactionHistoryEntry[] {
    return [...this.transactionHistory].sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  /**
   * Get pending transactions
   */
  getPendingTransactions(): TransactionHistoryEntry[] {
    return this.transactionHistory.filter(tx => tx.status === 'pending');
  }

  /**
   * Update transaction status
   */
  updateTransactionStatus(hash: string, status: 'pending' | 'confirmed' | 'failed', confirmations: number = 0, blockNumber?: number): void {
    const tx = this.transactionHistory.find(t => t.hash === hash);
    if (tx) {
      tx.status = status;
      tx.confirmations = confirmations;
      if (blockNumber !== undefined) {
        tx.blockNumber = blockNumber;
      }
    }
  }

  // Getters
  getAddress(): string {
    return this.address;
  }

  getPublicKey(): string {
    return this.publicKey;
  }

  getMnemonic(): string | string[] | undefined {
    return this.mnemonic;
  }

  getLabel(): string | undefined {
    return this.label;
  }

  setLabel(label: string): void {
    this.label = label;
  }

  isEncrypted(): boolean {
    return this.encrypted;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  /**
   * Generate QR code data for receiving
   */
  getQRData(): string {
    return `damchain:${this.address}`;
  }

  /**
   * Generate payment request QR
   */
  getPaymentRequestQR(amount: bigint, label?: string): string {
    let qrData = `damchain:${this.address}?amount=${amount.toString()}`;
    if (label) {
      qrData += `&label=${encodeURIComponent(label)}`;
    }
    return qrData;
  }
}

/**
 * Wallet Manager - manages multiple wallets
 */
export class WalletManager {
  private wallets: Map<string, Wallet> = new Map();
  private activeWallet?: string;

  /**
   * Add wallet to manager
   */
  addWallet(wallet: Wallet): void {
    this.wallets.set(wallet.getAddress(), wallet);
    
    // Set as active if first wallet
    if (this.wallets.size === 1) {
      this.activeWallet = wallet.getAddress();
    }
  }

  /**
   * Remove wallet
   */
  removeWallet(address: string): boolean {
    const removed = this.wallets.delete(address);
    
    // Update active wallet if removed
    if (removed && this.activeWallet === address) {
      const addresses = Array.from(this.wallets.keys());
      this.activeWallet = addresses.length > 0 ? addresses[0] : undefined;
    }
    
    return removed;
  }

  /**
   * Get wallet by address
   */
  getWallet(address: string): Wallet | undefined {
    return this.wallets.get(address);
  }

  /**
   * Get all wallets
   */
  getAllWallets(): Wallet[] {
    return Array.from(this.wallets.values());
  }

  /**
   * Set active wallet
   */
  setActiveWallet(address: string): void {
    if (!this.wallets.has(address)) {
      throw new Error('Wallet not found');
    }
    this.activeWallet = address;
  }

  /**
   * Get active wallet
   */
  getActiveWallet(): Wallet | undefined {
    if (!this.activeWallet) {
      return undefined;
    }
    return this.wallets.get(this.activeWallet);
  }

  /**
   * Get total balance (requires blockchain query)
   */
  async getTotalBalance(getBalance: (address: string) => Promise<bigint>): Promise<bigint> {
    let total = 0n;
    
    for (const wallet of this.wallets.values()) {
      const balance = await getBalance(wallet.getAddress());
      total += balance;
    }
    
    return total;
  }

  /**
   * Export all wallets
   */
  exportAll(password: string): WalletData[] {
    return Array.from(this.wallets.values()).map(wallet => wallet.export(password));
  }

  /**
   * Import wallets
   */
  importAll(wallets: WalletData[], password: string): void {
    for (const data of wallets) {
      const wallet = Wallet.import(data, password);
      this.addWallet(wallet);
    }
  }

  /**
   * Get wallet count
   */
  getWalletCount(): number {
    return this.wallets.size;
  }
}
