/**
 * index.ts
 * Export contracts module components
 */

export { SmartContract } from './SmartContract';
export type { ContractStorage, ContractMetadata, DeploymentInfo } from './SmartContract';
export { ContractVM } from './ContractVM';
export type { ExecutionContext, ExecutionResult } from './ContractVM';
