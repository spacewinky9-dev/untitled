/**
 * DRC20.ts
 * DamChain Request for Comment 20 - Fungible Token Standard
 * Similar to ERC-20 but optimized for DamChain
 */

export interface DRC20Interface {
  name(): string;
  symbol(): string;
  decimals(): number;
  totalSupply(): bigint;
  balanceOf(address: string): bigint;
  transfer(to: string, amount: bigint): boolean;
  approve(spender: string, amount: bigint): boolean;
  transferFrom(from: string, to: string, amount: bigint): boolean;
  allowance(owner: string, spender: string): bigint;
}

export class DRC20Token implements DRC20Interface {
  private _name: string;
  private _symbol: string;
  private _decimals: number;
  private _totalSupply: bigint;
  private _balances: Map<string, bigint>;
  private _allowances: Map<string, Map<string, bigint>>;
  private _owner: string;

  constructor(name: string, symbol: string, decimals: number, initialSupply: bigint, owner: string) {
    this._name = name;
    this._symbol = symbol;
    this._decimals = decimals;
    this._totalSupply = initialSupply;
    this._balances = new Map();
    this._allowances = new Map();
    this._owner = owner;

    // Mint initial supply to owner
    if (initialSupply > 0n) {
      this._balances.set(owner, initialSupply);
    }
  }

  public name(): string {
    return this._name;
  }

  public symbol(): string {
    return this._symbol;
  }

  public decimals(): number {
    return this._decimals;
  }

  public totalSupply(): bigint {
    return this._totalSupply;
  }

  public balanceOf(address: string): bigint {
    return this._balances.get(address) || 0n;
  }

  public transfer(to: string, amount: bigint, from: string): boolean {
    if (amount <= 0n) {
      throw new Error('Transfer amount must be positive');
    }

    const fromBalance = this.balanceOf(from);
    if (fromBalance < amount) {
      throw new Error('Insufficient balance');
    }

    // Deduct from sender
    this._balances.set(from, fromBalance - amount);

    // Add to recipient
    const toBalance = this.balanceOf(to);
    this._balances.set(to, toBalance + amount);

    return true;
  }

  public approve(spender: string, amount: bigint, owner: string): boolean {
    if (!this._allowances.has(owner)) {
      this._allowances.set(owner, new Map());
    }

    const ownerAllowances = this._allowances.get(owner)!;
    ownerAllowances.set(spender, amount);

    return true;
  }

  public transferFrom(from: string, to: string, amount: bigint, spender: string): boolean {
    if (amount <= 0n) {
      throw new Error('Transfer amount must be positive');
    }

    // Check allowance
    const allowed = this.allowance(from, spender);
    if (allowed < amount) {
      throw new Error('Insufficient allowance');
    }

    // Check balance
    const fromBalance = this.balanceOf(from);
    if (fromBalance < amount) {
      throw new Error('Insufficient balance');
    }

    // Update allowance
    const ownerAllowances = this._allowances.get(from)!;
    ownerAllowances.set(spender, allowed - amount);

    // Transfer tokens
    this._balances.set(from, fromBalance - amount);
    const toBalance = this.balanceOf(to);
    this._balances.set(to, toBalance + amount);

    return true;
  }

  public allowance(owner: string, spender: string): bigint {
    if (!this._allowances.has(owner)) {
      return 0n;
    }

    const ownerAllowances = this._allowances.get(owner)!;
    return ownerAllowances.get(spender) || 0n;
  }

  /**
   * Mint new tokens (only owner)
   */
  public mint(to: string, amount: bigint, caller: string): boolean {
    if (caller !== this._owner) {
      throw new Error('Only owner can mint');
    }

    if (amount <= 0n) {
      throw new Error('Mint amount must be positive');
    }

    const toBalance = this.balanceOf(to);
    this._balances.set(to, toBalance + amount);
    this._totalSupply += amount;

    return true;
  }

  /**
   * Burn tokens
   */
  public burn(amount: bigint, from: string): boolean {
    if (amount <= 0n) {
      throw new Error('Burn amount must be positive');
    }

    const fromBalance = this.balanceOf(from);
    if (fromBalance < amount) {
      throw new Error('Insufficient balance to burn');
    }

    this._balances.set(from, fromBalance - amount);
    this._totalSupply -= amount;

    return true;
  }

  /**
   * Get token metadata
   */
  public getMetadata(): any {
    return {
      name: this._name,
      symbol: this._symbol,
      decimals: this._decimals,
      totalSupply: this._totalSupply.toString(),
      owner: this._owner,
    };
  }
}
