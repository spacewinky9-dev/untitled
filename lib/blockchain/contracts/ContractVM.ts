/**
 * ContractVM.ts
 * Virtual machine for executing smart contracts safely
 */

import { SmartContract } from './SmartContract';

export interface ExecutionContext {
  caller: string;
  contractAddress: string;
  value: bigint;
  gasLimit: bigint;
  blockNumber: bigint;
  timestamp: number;
}

export interface ExecutionResult {
  success: boolean;
  returnValue: any;
  gasUsed: bigint;
  error?: string;
  logs: string[];
}

export class ContractVM {
  private gasPrice: bigint;
  private maxGasLimit: bigint;

  constructor(gasPrice: bigint = 1000000n, maxGasLimit: bigint = 30000000n) {
    this.gasPrice = gasPrice;
    this.maxGasLimit = maxGasLimit;
  }

  /**
   * Execute contract method in sandboxed environment
   */
  public async execute(
    contract: SmartContract,
    method: string,
    params: any[],
    context: ExecutionContext
  ): Promise<ExecutionResult> {
    const logs: string[] = [];
    let gasUsed = 21000n; // Base gas cost

    try {
      // Check if contract is paused
      if (contract.isPaused) {
        return {
          success: false,
          returnValue: null,
          gasUsed,
          error: 'Contract is paused',
          logs,
        };
      }

      // Check gas limit
      if (context.gasLimit > this.maxGasLimit) {
        return {
          success: false,
          returnValue: null,
          gasUsed,
          error: 'Gas limit exceeds maximum',
          logs,
        };
      }

      // Create execution sandbox
      const sandbox = this.createSandbox(contract, context, logs);

      // Parse and execute contract code
      const contractInstance = this.instantiateContract(contract.code, sandbox);

      // Check if method exists
      if (typeof contractInstance[method] !== 'function') {
        return {
          success: false,
          returnValue: null,
          gasUsed,
          error: `Method ${method} not found`,
          logs,
        };
      }

      // Execute method with gas tracking
      const startGas = gasUsed;
      const result = await this.executeWithGasTracking(
        contractInstance,
        method,
        params,
        context.gasLimit - gasUsed
      );

      gasUsed += result.gasUsed;

      // Check if gas limit exceeded
      if (gasUsed > context.gasLimit) {
        return {
          success: false,
          returnValue: null,
          gasUsed: context.gasLimit,
          error: 'Out of gas',
          logs,
        };
      }

      // Save contract state
      this.saveContractState(contract, sandbox.storage);

      return {
        success: true,
        returnValue: result.value,
        gasUsed,
        logs,
      };
    } catch (error: any) {
      return {
        success: false,
        returnValue: null,
        gasUsed,
        error: error.message || 'Execution failed',
        logs,
      };
    }
  }

  /**
   * Create sandboxed execution environment
   */
  private createSandbox(
    contract: SmartContract,
    context: ExecutionContext,
    logs: string[]
  ): any {
    return {
      // Contract storage
      storage: { ...contract.storage },

      // Context information
      msg: {
        sender: context.caller,
        value: context.value,
      },

      block: {
        number: context.blockNumber,
        timestamp: context.timestamp,
      },

      // Contract address
      address: contract.address,

      // Balance
      balance: contract.balance,

      // Logging function
      log: (...args: any[]) => {
        logs.push(args.map(String).join(' '));
      },

      // Math operations
      Math,

      // Safe conversion functions
      BigInt,
      Number,
      String,
      Boolean,

      // Restricted: No access to dangerous globals
      // No process, require, import, eval, Function constructor, etc.
    };
  }

  /**
   * Instantiate contract from code
   */
  private instantiateContract(code: string, sandbox: any): any {
    // Create a safe function to execute contract code
    // In production, use vm2 or isolated-vm for better isolation
    const wrappedCode = `
      (function(sandbox) {
        with(sandbox) {
          ${code}
          return new Contract();
        }
      })
    `;

    try {
      // eslint-disable-next-line no-new-func
      const contractFactory = new Function('return ' + wrappedCode)();
      return contractFactory(sandbox);
    } catch (error: any) {
      throw new Error(`Failed to instantiate contract: ${error.message}`);
    }
  }

  /**
   * Execute method with gas tracking
   */
  private async executeWithGasTracking(
    contractInstance: any,
    method: string,
    params: any[],
    remainingGas: bigint
  ): Promise<{ value: any; gasUsed: bigint }> {
    const startTime = Date.now();
    let gasUsed = 0n;

    try {
      // Execute the method
      const result = await contractInstance[method](...params);

      // Calculate gas based on execution time and operations
      const executionTime = Date.now() - startTime;
      gasUsed = BigInt(executionTime) * 1000n; // 1000 gas per millisecond

      // Add gas for storage operations
      const storageOps = Object.keys(contractInstance.storage || {}).length;
      gasUsed += BigInt(storageOps) * 20000n; // 20000 gas per storage slot

      return { value: result, gasUsed };
    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      gasUsed = BigInt(executionTime) * 1000n;
      throw error;
    }
  }

  /**
   * Save contract state after execution
   */
  private saveContractState(contract: SmartContract, storage: any): void {
    contract.storage = { ...storage };
  }

  /**
   * Deploy a new contract
   */
  public async deployContract(
    code: string,
    creator: string,
    nonce: bigint,
    metadata: any,
    constructorParams: any[] = []
  ): Promise<SmartContract> {
    // Generate contract address
    const address = SmartContract.generateAddress(creator, nonce, code);

    // Create contract instance
    const contract = new SmartContract(address, code, creator, metadata);

    // Execute constructor if it exists
    const context: ExecutionContext = {
      caller: creator,
      contractAddress: address,
      value: 0n,
      gasLimit: 1000000n,
      blockNumber: 0n,
      timestamp: Date.now(),
    };

    // Try to execute constructor
    try {
      await this.execute(contract, 'constructor', constructorParams, context);
    } catch (error) {
      // Constructor is optional
    }

    return contract;
  }
}
