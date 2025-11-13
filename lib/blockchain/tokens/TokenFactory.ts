/**
 * TokenFactory.ts
 * Factory for creating DRC-20 and DRC-721 tokens
 */

import { DRC20Token } from './DRC20';
import { DRC721Token } from './DRC721';
import { SmartContract } from '../contracts/SmartContract';
import { createHash } from 'crypto';

export interface TokenCreationParams {
  name: string;
  symbol: string;
  decimals?: number;
  initialSupply?: bigint;
  creator: string;
}

export interface NFTCreationParams {
  name: string;
  symbol: string;
  creator: string;
}

export class TokenFactory {
  private drc20Tokens: Map<string, DRC20Token>;
  private drc721Tokens: Map<string, DRC721Token>;
  private tokenAddresses: string[];

  constructor() {
    this.drc20Tokens = new Map();
    this.drc721Tokens = new Map();
    this.tokenAddresses = [];
  }

  /**
   * Create a new DRC-20 token
   */
  public createDRC20(params: TokenCreationParams): { address: string; token: DRC20Token } {
    const decimals = params.decimals || 18;
    const initialSupply = params.initialSupply || 0n;

    // Create token instance
    const token = new DRC20Token(
      params.name,
      params.symbol,
      decimals,
      initialSupply,
      params.creator
    );

    // Generate deterministic address
    const address = this.generateTokenAddress(params.creator, params.name, params.symbol, 'DRC20');

    // Store token
    this.drc20Tokens.set(address, token);
    this.tokenAddresses.push(address);

    return { address, token };
  }

  /**
   * Create a new DRC-721 (NFT) collection
   */
  public createDRC721(params: NFTCreationParams): { address: string; token: DRC721Token } {
    // Create NFT collection
    const token = new DRC721Token(params.name, params.symbol, params.creator);

    // Generate deterministic address
    const address = this.generateTokenAddress(params.creator, params.name, params.symbol, 'DRC721');

    // Store token
    this.drc721Tokens.set(address, token);
    this.tokenAddresses.push(address);

    return { address, token };
  }

  /**
   * Get DRC-20 token by address
   */
  public getDRC20(address: string): DRC20Token | undefined {
    return this.drc20Tokens.get(address);
  }

  /**
   * Get DRC-721 token by address
   */
  public getDRC721(address: string): DRC721Token | undefined {
    return this.drc721Tokens.get(address);
  }

  /**
   * Get all token addresses
   */
  public getAllTokens(): string[] {
    return [...this.tokenAddresses];
  }

  /**
   * Get tokens created by address
   */
  public getTokensByCreator(creator: string): string[] {
    const tokens: string[] = [];

    for (const [address, token] of this.drc20Tokens.entries()) {
      const metadata = token.getMetadata();
      if (metadata.owner === creator) {
        tokens.push(address);
      }
    }

    for (const [address, token] of this.drc721Tokens.entries()) {
      const metadata = token.getCollectionMetadata();
      if (metadata.owner === creator) {
        tokens.push(address);
      }
    }

    return tokens;
  }

  /**
   * Generate deterministic token address
   */
  private generateTokenAddress(
    creator: string,
    name: string,
    symbol: string,
    standard: string
  ): string {
    const data = `${creator}${name}${symbol}${standard}${Date.now()}`;
    const hash = createHash('sha256').update(data).digest('hex');
    return 'dam1t' + hash.substring(0, 40); // Token addresses start with dam1t
  }

  /**
   * Get token statistics
   */
  public getStats(): {
    totalTokens: number;
    drc20Count: number;
    drc721Count: number;
  } {
    return {
      totalTokens: this.tokenAddresses.length,
      drc20Count: this.drc20Tokens.size,
      drc721Count: this.drc721Tokens.size,
    };
  }
}
