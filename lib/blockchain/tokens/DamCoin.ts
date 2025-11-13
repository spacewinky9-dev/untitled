/**
 * DamCoin.ts
 * Native cryptocurrency for DamChain
 */

export class DamCoin {
  public static readonly NAME = 'DamCoin';
  public static readonly SYMBOL = 'DAM';
  public static readonly DECIMALS = 18;
  public static readonly INITIAL_SUPPLY = 1000000000n * 10n ** 18n; // 1 billion
  public static readonly ANNUAL_INFLATION_RATE = 0.02; // 2%

  private _totalSupply: bigint;
  private _circulatingSupply: bigint;
  private _balances: Map<string, bigint>;
  private _genesis: string;
  private _lastInflationBlock: bigint;

  constructor(genesisAddress: string) {
    this._totalSupply = DamCoin.INITIAL_SUPPLY;
    this._circulatingSupply = DamCoin.INITIAL_SUPPLY;
    this._balances = new Map();
    this._genesis = genesisAddress;
    this._lastInflationBlock = 0n;

    // Allocate initial supply to genesis address
    this._balances.set(genesisAddress, DamCoin.INITIAL_SUPPLY);
  }

  /**
   * Get total supply
   */
  public totalSupply(): bigint {
    return this._totalSupply;
  }

  /**
   * Get circulating supply
   */
  public circulatingSupply(): bigint {
    return this._circulatingSupply;
  }

  /**
   * Get balance of address
   */
  public balanceOf(address: string): bigint {
    return this._balances.get(address) || 0n;
  }

  /**
   * Transfer coins
   */
  public transfer(from: string, to: string, amount: bigint): boolean {
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

  /**
   * Mint new coins (inflation rewards for validators)
   */
  public mint(to: string, amount: bigint): void {
    if (amount <= 0n) {
      throw new Error('Mint amount must be positive');
    }

    const toBalance = this.balanceOf(to);
    this._balances.set(to, toBalance + amount);
    this._totalSupply += amount;
    this._circulatingSupply += amount;
  }

  /**
   * Burn coins (for deflationary pressure)
   */
  public burn(from: string, amount: bigint): boolean {
    if (amount <= 0n) {
      throw new Error('Burn amount must be positive');
    }

    const fromBalance = this.balanceOf(from);
    if (fromBalance < amount) {
      throw new Error('Insufficient balance to burn');
    }

    this._balances.set(from, fromBalance - amount);
    this._totalSupply -= amount;
    this._circulatingSupply -= amount;

    return true;
  }

  /**
   * Apply annual inflation for validator rewards
   * Should be called once per epoch (e.g., every year in blocks)
   */
  public applyInflation(currentBlock: bigint, validatorAddress: string): bigint {
    // Calculate blocks per year (assuming 5 second block time)
    const blocksPerYear = BigInt(365 * 24 * 60 * 60 / 5);

    // Check if a year has passed
    if (currentBlock - this._lastInflationBlock < blocksPerYear) {
      return 0n;
    }

    // Calculate inflation amount (2% of current supply)
    const inflationAmount = (this._totalSupply * BigInt(Math.floor(DamCoin.ANNUAL_INFLATION_RATE * 100))) / 10000n;

    // Mint inflation rewards
    this.mint(validatorAddress, inflationAmount);

    // Update last inflation block
    this._lastInflationBlock = currentBlock;

    return inflationAmount;
  }

  /**
   * Get coin metadata
   */
  public getMetadata(): any {
    return {
      name: DamCoin.NAME,
      symbol: DamCoin.SYMBOL,
      decimals: DamCoin.DECIMALS,
      totalSupply: this._totalSupply.toString(),
      circulatingSupply: this._circulatingSupply.toString(),
      genesisAddress: this._genesis,
      annualInflationRate: DamCoin.ANNUAL_INFLATION_RATE,
    };
  }

  /**
   * Format amount for display
   */
  public static formatAmount(amount: bigint): string {
    const divisor = 10n ** BigInt(DamCoin.DECIMALS);
    const whole = amount / divisor;
    const fractional = amount % divisor;

    // Convert fractional part to string with leading zeros
    const fractionalStr = fractional.toString().padStart(DamCoin.DECIMALS, '0');

    // Remove trailing zeros
    const trimmed = fractionalStr.replace(/0+$/, '');

    if (trimmed === '') {
      return whole.toString();
    }

    return `${whole}.${trimmed}`;
  }

  /**
   * Parse amount from string
   */
  public static parseAmount(amount: string): bigint {
    const parts = amount.split('.');
    const whole = BigInt(parts[0] || '0');
    const fractional = parts[1] || '0';

    // Pad or truncate fractional part to DECIMALS length
    const paddedFractional = fractional.padEnd(DamCoin.DECIMALS, '0').substring(0, DamCoin.DECIMALS);

    const divisor = 10n ** BigInt(DamCoin.DECIMALS);
    return whole * divisor + BigInt(paddedFractional);
  }
}
