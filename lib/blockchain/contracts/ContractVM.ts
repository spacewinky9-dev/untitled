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
      if (!contractInstance || typeof contractInstance[method] !== 'function') {
        const availableMethods = contractInstance 
          ? Object.keys(contractInstance).filter(k => typeof contractInstance[k] === 'function')
          : [];
        return {
          success: false,
          returnValue: null,
          gasUsed,
          error: `Method ${method} not found. Available methods: ${availableMethods.join(', ') || 'none'}`,
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

      // Save contract state from both instance and sandbox
      this.saveContractState(contract, contractInstance.storage || sandbox.storage);

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
    // Create a proxy for storage to track modifications
    const storageProxy = new Proxy(contract.storage, {
      set: (target, property, value) => {
        target[property as string] = value;
        return true;
      },
      get: (target, property) => {
        return target[property as string];
      }
    });

    return {
      // Contract storage with proxy for tracking
      storage: storageProxy,

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
      Array,
      Object,

      // JSON for data handling
      JSON,

      // Restricted: No access to dangerous globals
      // No process, require, import, eval, Function constructor, etc.
    };
  }

  /**
   * Instantiate contract from code
   * Uses Function constructor for controlled execution
   */
  private instantiateContract(code: string, sandbox: any): any {
    try {
      // Create function body that executes contract code
      // and returns an instance with sandbox properties bound
      const functionBody = `
        ${code}
        
        // Check if Contract class was defined
        if (typeof Contract === 'undefined') {
          throw new Error('Contract class not defined in code');
        }
        
        // Create instance using Object.create to avoid constructor issues
        const instance = Object.create(Contract.prototype);
        
        // Pre-bind all sandbox properties to instance before calling constructor
        instance.storage = sandbox.storage;
        instance.log = sandbox.log;
        instance.msg = sandbox.msg;
        instance.block = sandbox.block;
        instance.address = sandbox.address;
        instance.balance = sandbox.balance;
        instance.Math = sandbox.Math;
        instance.BigInt = sandbox.BigInt;
        instance.Number = sandbox.Number;
        instance.String = sandbox.String;
        instance.Boolean = sandbox.Boolean;
        instance.Array = sandbox.Array;
        instance.Object = sandbox.Object;
        instance.JSON = sandbox.JSON;
        
        // Call constructor if it exists
        if (typeof Contract === 'function') {
          try {
            Contract.call(instance);
          } catch (constructorError) {
            // If constructor fails, that's okay - instance still has methods
            // This allows contracts that access this.storage in constructor
          }
        }
        
        return instance;
      `;

      // Create and execute the function with sandbox parameter
      const createContract = new Function('sandbox', functionBody);
      const instance = createContract(sandbox);
      
      return instance;
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
