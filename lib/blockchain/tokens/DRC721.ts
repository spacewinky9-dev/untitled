/**
 * DRC721.ts
 * DamChain Request for Comment 721 - Non-Fungible Token (NFT) Standard
 * Similar to ERC-721 but optimized for DamChain
 */

export interface DRC721Interface {
  name(): string;
  symbol(): string;
  ownerOf(tokenId: string): string;
  balanceOf(address: string): number;
  transferFrom(from: string, to: string, tokenId: string): void;
  approve(to: string, tokenId: string): void;
  getApproved(tokenId: string): string;
  setApprovalForAll(operator: string, approved: boolean): void;
  isApprovedForAll(owner: string, operator: string): boolean;
  tokenURI(tokenId: string): string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{ trait_type: string; value: any }>;
}

export class DRC721Token implements DRC721Interface {
  private _name: string;
  private _symbol: string;
  private _owners: Map<string, string>; // tokenId => owner
  private _balances: Map<string, number>; // owner => count
  private _tokenApprovals: Map<string, string>; // tokenId => approved address
  private _operatorApprovals: Map<string, Set<string>>; // owner => Set of operators
  private _tokenURIs: Map<string, string>; // tokenId => URI
  private _metadata: Map<string, NFTMetadata>; // tokenId => metadata
  private _owner: string;
  private _nextTokenId: number;

  constructor(name: string, symbol: string, owner: string) {
    this._name = name;
    this._symbol = symbol;
    this._owner = owner;
    this._owners = new Map();
    this._balances = new Map();
    this._tokenApprovals = new Map();
    this._operatorApprovals = new Map();
    this._tokenURIs = new Map();
    this._metadata = new Map();
    this._nextTokenId = 1;
  }

  public name(): string {
    return this._name;
  }

  public symbol(): string {
    return this._symbol;
  }

  public ownerOf(tokenId: string): string {
    const owner = this._owners.get(tokenId);
    if (!owner) {
      throw new Error('Token does not exist');
    }
    return owner;
  }

  public balanceOf(address: string): number {
    return this._balances.get(address) || 0;
  }

  public transferFrom(from: string, to: string, tokenId: string): void {
    // In production, caller would be msg.sender from transaction context
    // For now, throw error
    throw new Error('transferFrom must be called with transaction context');
  }

  public approve(to: string, tokenId: string): void {
    // In production, caller would be msg.sender from transaction context
    throw new Error('approve must be called with transaction context');
  }

  public getApproved(tokenId: string): string {
    if (!this._owners.has(tokenId)) {
      throw new Error('Token does not exist');
    }
    return this._tokenApprovals.get(tokenId) || '';
  }

  public setApprovalForAll(operator: string, approved: boolean): void {
    // In production, owner would be msg.sender from transaction context
    throw new Error('setApprovalForAll must be called with transaction context');
  }

  public isApprovedForAll(owner: string, operator: string): boolean {
    if (!this._operatorApprovals.has(owner)) {
      return false;
    }
    return this._operatorApprovals.get(owner)!.has(operator);
  }

  public tokenURI(tokenId: string): string {
    if (!this._owners.has(tokenId)) {
      throw new Error('Token does not exist');
    }
    return this._tokenURIs.get(tokenId) || '';
  }

  /**
   * Mint new NFT
   */
  public mint(to: string, tokenURI: string, metadata: NFTMetadata, caller: string): string {
    if (caller !== this._owner) {
      throw new Error('Only owner can mint');
    }

    const tokenId = this._nextTokenId.toString();
    this._nextTokenId++;

    // Set owner
    this._owners.set(tokenId, to);

    // Update balance
    const balance = this.balanceOf(to);
    this._balances.set(to, balance + 1);

    // Set URI and metadata
    this._tokenURIs.set(tokenId, tokenURI);
    this._metadata.set(tokenId, metadata);

    return tokenId;
  }

  /**
   * Burn NFT
   */
  public burn(tokenId: string, caller: string): void {
    const owner = this.ownerOf(tokenId);

    if (caller !== owner) {
      throw new Error('Only owner can burn');
    }

    // Clear approvals
    this._tokenApprovals.delete(tokenId);

    // Update balance
    const balance = this.balanceOf(owner);
    this._balances.set(owner, balance - 1);

    // Remove ownership
    this._owners.delete(tokenId);
    this._tokenURIs.delete(tokenId);
    this._metadata.delete(tokenId);
  }

  /**
   * Get token metadata
   */
  public getTokenMetadata(tokenId: string): NFTMetadata | undefined {
    return this._metadata.get(tokenId);
  }

  /**
   * Check if address is approved or owner
   */
  private isApprovedOrOwner(address: string, tokenId: string): boolean {
    const owner = this.ownerOf(tokenId);
    return (
      address === owner ||
      this.getApproved(tokenId) === address ||
      this.isApprovedForAll(owner, address)
    );
  }

  /**
   * Get all tokens owned by address
   */
  public tokensOfOwner(owner: string): string[] {
    const tokens: string[] = [];
    for (const [tokenId, tokenOwner] of this._owners.entries()) {
      if (tokenOwner === owner) {
        tokens.push(tokenId);
      }
    }
    return tokens;
  }

  /**
   * Get collection metadata
   */
  public getCollectionMetadata(): any {
    return {
      name: this._name,
      symbol: this._symbol,
      owner: this._owner,
      totalSupply: this._owners.size,
    };
  }
}
