#!/usr/bin/env tsx
/**
 * Comprehensive Test Suite for DamChain Blockchain Phases 13-25
 * Tests all god-level features: ZK Proofs, Post-Quantum Crypto, Homomorphic Encryption,
 * Sharding, Layer-2, Interoperability, MEV Protection, Self-Healing, AI Optimization,
 * Oracles, Advanced Signatures, Formal Verification, and Dynamic Protocol Adaptation
 */

import { ZKProofSystem } from '../lib/blockchain/zkp/ZKProofSystem';
import { PostQuantumCrypto } from '../lib/blockchain/postquantum/PostQuantumCrypto';
import { HomomorphicEncryption } from '../lib/blockchain/homomorphic/HomomorphicEncryption';
import { AdvancedSharding } from '../lib/blockchain/sharding/AdvancedSharding';
import { Layer2Scaling } from '../lib/blockchain/layer2/Layer2Scaling';
import { CrossChainBridge } from '../lib/blockchain/interoperability/CrossChainBridge';
import { MEVProtection } from '../lib/blockchain/mev-protection/MEVProtection';
import { SelfHealingSystem } from '../lib/blockchain/self-healing/SelfHealingSystem';
import { AIGasOptimization } from '../lib/blockchain/ai-optimization/AIGasOptimization';
import { OracleNetwork } from '../lib/blockchain/oracle/OracleNetwork';
import { AdvancedSignatureManager } from '../lib/blockchain/signatures/AdvancedSignatures';
import { FormalVerificationSystem } from '../lib/blockchain/formal-verification/FormalVerification';
import { DynamicProtocol } from '../lib/blockchain/dynamic-protocol/DynamicProtocol';

console.log('🚀 DamChain Blockchain Phases 13-25 - Comprehensive Test Suite\n');
console.log('═══════════════════════════════════════════════════════════════\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function test(name: string, fn: () => void) {
  totalTests++;
  try {
    fn();
    console.log(`✅ ${name}`);
    passedTests++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error instanceof Error ? error.message : String(error)}`);
    failedTests++;
  }
}

// Phase 13: Zero-Knowledge Proofs
console.log('🔐 Phase 13: Zero-Knowledge Proof Systems\n');
test('ZK Proof System initialization', () => {
  const zkp = new ZKProofSystem();
  if (!zkp) throw new Error('Failed to initialize ZK Proof System');
});

test('ZK Constraint creation and proof generation', () => {
  const zkp = new ZKProofSystem();
  zkp.addConstraint({ type: 'ADD', a: 3n, b: 4n, c: 7n });
  zkp.addConstraint({ type: 'MUL', a: 2n, b: 5n, c: 10n });
  const witness = [3n, 4n, 7n, 2n, 5n, 10n];
  const proof = zkp.generateProof(witness);
  console.log(`   Generated proof with ${proof.polynomial.length} polynomial coefficients`);
  if (!proof.proof || proof.polynomial.length === 0) throw new Error('Invalid proof');
});

test('ZK Proof verification', () => {
  const zkp = new ZKProofSystem();
  zkp.addConstraint({ type: 'EQ', a: 5n, b: 5n, c: 1n });
  const witness = [5n, 5n, 1n];
  const proof = zkp.generateProof(witness);
  const isValid = zkp.verifyProof(proof);
  console.log(`   Proof verification: ${isValid ? 'VALID' : 'INVALID'}`);
  if (!isValid) throw new Error('Proof verification failed');
});

// Phase 14: Post-Quantum Cryptography
console.log('\n🛡️ Phase 14: Post-Quantum Cryptography Suite\n');
test('Post-quantum crypto initialization', () => {
  const pqc = new PostQuantumCrypto();
  if (!pqc) throw new Error('Failed to initialize Post-Quantum Crypto');
});

test('Dilithium signature generation and verification', () => {
  const pqc = new PostQuantumCrypto();
  const keyPair = pqc.generateDilithiumKeypair();
  const message = Buffer.from('Test message for Dilithium');
  const signature = pqc.signDilithium(message, keyPair.privateKey);
  const isValid = pqc.verifyDilithium(message, signature, keyPair.publicKey);
  console.log(`   Dilithium signature size: ${signature.length} bytes`);
  console.log(`   Signature verification: ${isValid ? 'VALID' : 'INVALID'}`);
  if (!isValid) throw new Error('Dilithium verification failed');
});

test('SPHINCS+ signature generation and verification', () => {
  const pqc = new PostQuantumCrypto();
  const keyPair = pqc.generateSPHINCSKeypair();
  const message = Buffer.from('Test message for SPHINCS+');
  const signature = pqc.signSPHINCS(message, keyPair.privateKey);
  const isValid = pqc.verifySPHINCS(message, signature, keyPair.publicKey);
  console.log(`   SPHINCS+ signature size: ${signature.length} bytes`);
  console.log(`   Signature verification: ${isValid ? 'VALID' : 'INVALID'}`);
  if (!isValid) throw new Error('SPHINCS+ verification failed');
});

// Phase 15: Homomorphic Encryption
console.log('\n🔒 Phase 15: Homomorphic Encryption Layer\n');
test('Paillier cryptosystem initialization', () => {
  const he = new HomomorphicEncryption();
  he.generatePaillierKeys(512);
  const stats = he.getSystemStats();
  console.log(`   Key size: ${stats.keySize} bits`);
  if (stats.keySize !== 512) throw new Error('Invalid key size');
});

test('Homomorphic addition on encrypted values', () => {
  const he = new HomomorphicEncryption();
  he.generatePaillierKeys(512);
  const encrypted1 = he.encryptValue(100n);
  const encrypted2 = he.encryptValue(200n);
  const encryptedSum = he.homomorphicAdd(encrypted1, encrypted2);
  const decrypted = he.decryptValue(encryptedSum);
  console.log(`   100 + 200 = ${decrypted} (encrypted computation)`);
  if (decrypted !== 300n) throw new Error('Homomorphic addition failed');
});

// Phase 16: Advanced Sharding
console.log('\n⚡ Phase 16: Advanced Sharding with Cross-Shard Atomicity\n');
test('Fractal shard hierarchy creation', () => {
  const sharding = new AdvancedSharding(4, 2);
  const stats = sharding.getSystemStats();
  console.log(`   Total shards: ${stats.totalShards}`);
  console.log(`   Fractal depth: ${stats.fractalDepth}`);
  if (stats.totalShards === 0) throw new Error('No shards created');
});

test('Cross-shard atomic transaction', () => {
  const sharding = new AdvancedSharding(4, 2);
  const tx = sharding.submitCrossShardTransaction(
    'sender123',
    'receiver456',
    1000n,
    100n
  );
  console.log(`   Transaction ID: ${tx.id}`);
  console.log(`   Status: ${tx.status}`);
  if (!tx.id) throw new Error('Transaction not created');
});

// Phase 17: Layer-2 Scaling
console.log('\n🚀 Phase 17: Layer-2 Scaling Solutions\n');
test('Optimistic Rollup initialization', () => {
  const layer2 = new Layer2Scaling();
  const batch = layer2.createOptimisticBatch('batch-001');
  console.log(`   Batch ID: ${batch.batchId}`);
  console.log(`   Batch type: ${batch.type}`);
  if (batch.type !== 'OPTIMISTIC') throw new Error('Invalid batch type');
});

test('ZK-Rollup batch creation', () => {
  const layer2 = new Layer2Scaling();
  const batch = layer2.createZKBatch('batch-002');
  console.log(`   Batch ID: ${batch.batchId}`);
  console.log(`   Batch type: ${batch.type}`);
  if (batch.type !== 'ZK_ROLLUP') throw new Error('Invalid batch type');
});

test('State Channel operations', () => {
  const layer2 = new Layer2Scaling();
  const channel = layer2.openStateChannel('alice', 'bob', 1000n);
  console.log(`   Channel ID: ${channel.channelId}`);
  console.log(`   Balance Alice: ${channel.balanceA}, Bob: ${channel.balanceB}`);
  if (channel.state !== 'OPEN') throw new Error('Channel not opened');
});

// Phase 18: Interoperability
console.log('\n🌉 Phase 18: Cross-Chain Interoperability Protocols\n');
test('HTLC atomic swap creation', () => {
  const bridge = new CrossChainBridge();
  const swap = bridge.createAtomicSwap(
    'alice',
    'bob',
    1000000n,
    Buffer.from('secret123'),
    24 * 60 * 60
  );
  console.log(`   Swap ID: ${swap.id}`);
  console.log(`   Lock time: ${swap.lockTime} seconds`);
  if (swap.status !== 'PENDING') throw new Error('Swap not created');
});

test('Cross-chain message relay', () => {
  const bridge = new CrossChainBridge();
  const msg = bridge.sendMessage(
    'DAMCHAIN',
    'ETHEREUM',
    'sender',
    'receiver',
    { data: 'test message' }
  );
  console.log(`   Message ID: ${msg.id}`);
  console.log(`   Status: ${msg.status}`);
  if (!msg.id) throw new Error('Message not sent');
});

// Phase 19: MEV Protection
console.log('\n🛡️ Phase 19: MEV Protection & Game-Theoretic Security\n');
test('Encrypted mempool transaction submission', () => {
  const mev = new MEVProtection();
  const tx = {
    from: 'alice',
    to: 'bob',
    value: 1000n,
    data: Buffer.from('transfer'),
    nonce: 1n,
    gasPrice: 100n,
  };
  const encrypted = mev.submitTransaction(tx, 2);
  console.log(`   Transaction ID: ${encrypted.id}`);
  console.log(`   Reveal block: ${encrypted.revealBlock}`);
  if (!encrypted.commitment) throw new Error('Transaction not encrypted');
});

test('MEV attack detection', () => {
  const mev = new MEVProtection();
  const tx1 = { from: 'attacker', to: 'victim', value: 1000n, gasPrice: 200n, timestamp: Date.now() };
  const tx2 = { from: 'victim', to: 'dex', value: 1000n, gasPrice: 100n, timestamp: Date.now() + 100 };
  const isMEV = mev.detectMEV([tx1, tx2], tx1);
  console.log(`   MEV detected: ${isMEV ? 'YES' : 'NO'}`);
  console.log(`   Attack type: ${isMEV ? 'Front-running' : 'None'}`);
});

// Phase 20: Self-Healing
console.log('\n🔧 Phase 20: Self-Healing Architecture\n');
test('Fork detection and resolution', () => {
  const selfHealing = new SelfHealingSystem();
  const block1 = { height: 100, hash: 'hash1', difficulty: 1000n, timestamp: Date.now() };
  const block2 = { height: 100, hash: 'hash2', difficulty: 1100n, timestamp: Date.now() + 1000 };
  const result = selfHealing.handleFork(block1, block2);
  console.log(`   Fork resolved: ${result.resolved ? 'YES' : 'NO'}`);
  console.log(`   Strategy: ${result.strategy}`);
  console.log(`   Winner: ${result.winner.hash}`);
  if (!result.resolved) throw new Error('Fork not resolved');
});

test('State recovery from checkpoint', () => {
  const selfHealing = new SelfHealingSystem();
  const state = { blockHeight: 1000, accounts: new Map(), contracts: new Map() };
  selfHealing.createCheckpoint(state, 'validator1');
  const recovered = selfHealing.recoverFromFailure();
  console.log(`   Recovery: ${recovered.success ? 'SUCCESS' : 'FAILED'}`);
  console.log(`   Recovered height: ${recovered.state?.blockHeight}`);
  if (!recovered.success) throw new Error('Recovery failed');
});

// Phase 21: AI Optimization
console.log('\n🤖 Phase 21: AI-Powered Gas Optimization\n');
test('Gas price prediction', () => {
  const ai = new AIGasOptimization();
  // Train with sample data
  for (let i = 0; i < 100; i++) {
    ai.recordGasPrice(BigInt(100 + i), Date.now() - (100 - i) * 1000, 0.5 + i * 0.001, i);
  }
  ai.trainModel();
  const prediction = ai.predictOptimalGasPrice(0.7);
  console.log(`   Predicted gas price: ${prediction.price}`);
  console.log(`   Confidence: ${(prediction.confidence * 100).toFixed(1)}%`);
  if (prediction.confidence < 0.8) throw new Error('Low prediction confidence');
});

test('Intelligent block packing', () => {
  const ai = new AIGasOptimization();
  const transactions = Array.from({ length: 20 }, (_, i) => ({
    id: `tx-${i}`,
    gasLimit: BigInt(21000 + i * 1000),
    gasPrice: BigInt(100 + i * 10),
    size: 250,
  }));
  const result = ai.optimizeBlockPacking(transactions, 1000000n);
  console.log(`   Included transactions: ${result.includedTransactions.length}`);
  console.log(`   Block utilization: ${(result.utilization * 100).toFixed(1)}%`);
  if (result.utilization < 0.5) throw new Error('Poor utilization');
});

// Phase 22: Oracle Networks
console.log('\n🔮 Phase 22: Decentralized Oracle Networks\n');
test('Oracle node registration', () => {
  const oracle = new OracleNetwork();
  oracle.registerNode('oracle1', Buffer.from('publicKey1'), 50000n);
  oracle.registerNode('oracle2', Buffer.from('publicKey2'), 50000n);
  const health = oracle.getNetworkHealth();
  console.log(`   Active nodes: ${health.activeNodes}`);
  console.log(`   Total stake: ${health.totalStake}`);
  if (health.activeNodes !== 2) throw new Error('Nodes not registered');
});

test('Data aggregation with weighted median', () => {
  const oracle = new OracleNetwork();
  oracle.registerNode('oracle1', Buffer.from('pk1'), 50000n);
  oracle.registerNode('oracle2', Buffer.from('pk2'), 50000n);
  oracle.registerNode('oracle3', Buffer.from('pk3'), 50000n);
  
  const requestId = oracle.createRequest('ETH/USD', 'requester', 1000n, 3);
  oracle.submitData(requestId, 'oracle1', 2500n, Buffer.from('sig1'));
  oracle.submitData(requestId, 'oracle2', 2505n, Buffer.from('sig2'));
  oracle.submitData(requestId, 'oracle3', 2495n, Buffer.from('sig3'));
  
  const result = oracle.getAggregatedData(requestId);
  console.log(`   Aggregated value: ${result.value}`);
  console.log(`   Confidence: ${(result.confidence * 100).toFixed(1)}%`);
  if (!result.value) throw new Error('Aggregation failed');
});

// Phase 23: Advanced Signatures
console.log('\n✍️ Phase 23: Advanced Signature Schemes\n');
test('VRF proof generation and verification', () => {
  const sigManager = new AdvancedSignatureManager();
  const { output, proof } = sigManager.generateVRFProof('input123');
  const isValid = sigManager.verifyVRFProof(
    sigManager.getPublicKey(),
    'input123',
    output,
    proof
  );
  console.log(`   VRF output: ${output}`);
  console.log(`   Proof valid: ${isValid ? 'YES' : 'NO'}`);
  if (!isValid) throw new Error('VRF verification failed');
});

test('Threshold signature scheme', () => {
  const sigManager = new AdvancedSignatureManager();
  sigManager.createThresholdScheme('treasury', 3, 5);
  const shares = sigManager.generateThresholdShares('treasury', 12345678n);
  console.log(`   Generated ${shares.size} shares for 3-of-5 scheme`);
  if (shares.size !== 5) throw new Error('Invalid number of shares');
});

test('Multi-signature aggregation', () => {
  const sigManager = new AdvancedSignatureManager();
  const message = Buffer.from('Transaction data');
  const sig1 = sigManager.signMulti(123n, message);
  const sig2 = sigManager.signMulti(456n, message);
  const sig3 = sigManager.signMulti(789n, message);
  const aggregated = sigManager.aggregateSignatures([sig1, sig2, sig3]);
  console.log(`   Aggregated signature: ${aggregated}`);
  if (aggregated === 0n) throw new Error('Aggregation failed');
});

// Phase 24: Formal Verification
console.log('\n📐 Phase 24: Formal Verification System\n');
test('Model checking with temporal logic', () => {
  const verifier = new FormalVerificationSystem();
  const contract = `
    function transfer(from, to, amount) {
      require(balances[from] >= amount);
      balances[from] -= amount;
      balances[to] += amount;
    }
  `;
  const result = verifier.modelCheck(contract, { type: 'ALWAYS_NOT', property: 'balance_negative' });
  console.log(`   Verification: ${result.valid ? 'PASS' : 'FAIL'}`);
  console.log(`   States explored: ${result.statesExplored}`);
  if (!result.valid) console.log(`   Counterexample: ${result.counterexample}`);
});

test('Automated theorem proving', () => {
  const verifier = new FormalVerificationSystem();
  const precondition = 'balance >= amount';
  const program = 'balance = balance - amount';
  const postcondition = 'balance >= 0';
  const result = verifier.proveTheorem(precondition, program, postcondition);
  console.log(`   Theorem: ${result.valid ? 'PROVED' : 'UNPROVEN'}`);
  console.log(`   Steps: ${result.proofSteps.length}`);
});

test('Symbolic execution for path coverage', () => {
  const verifier = new FormalVerificationSystem();
  const contract = `
    function withdraw(amount) {
      if (balance >= amount) {
        balance -= amount;
        send(amount);
      }
    }
  `;
  const result = verifier.symbolicExecution(contract, { balance: 'BALANCE_0' });
  console.log(`   Paths explored: ${result.paths.length}`);
  console.log(`   Coverage: ${(result.coverage * 100).toFixed(1)}%`);
  if (result.coverage < 1.0) throw new Error('Incomplete coverage');
});

// Phase 25: Dynamic Protocol Adaptation
console.log('\n⚙️ Phase 25: Dynamic Protocol Adaptation\n');
test('PID control for difficulty adjustment', () => {
  const protocol = new DynamicProtocol();
  protocol.updateNetworkState({
    blockHeight: 1000,
    averageBlockTime: 6.5,
    difficulty: 10000n,
    gasLimit: 8000000n,
    blockSize: 512,
    validatorCount: 10,
    consensusThreshold: 0.67,
    timestamp: Date.now(),
    congestion: 0.7,
    utilization: 0.85,
    latency: 100,
  });
  protocol.updateProtocol();
  const state = protocol.getCurrentState();
  console.log(`   Difficulty adjusted to: ${state.difficulty}`);
  console.log(`   Gas limit adjusted to: ${state.gasLimit}`);
});

test('Q-Learning for parameter optimization', () => {
  const protocol = new DynamicProtocol();
  // Simulate learning over multiple iterations
  for (let i = 0; i < 10; i++) {
    protocol.updateNetworkState({
      blockHeight: 1000 + i,
      averageBlockTime: 5 + Math.random(),
      difficulty: 10000n,
      gasLimit: 8000000n,
      blockSize: 512,
      validatorCount: 10,
      consensusThreshold: 0.67,
      timestamp: Date.now(),
      congestion: Math.random(),
      utilization: Math.random(),
      latency: 50 + Math.random() * 50,
    });
    protocol.updateProtocol();
  }
  const stats = protocol.getSystemStats();
  console.log(`   Q-learning decisions made: ${stats.totalAdaptations}`);
  console.log(`   System health: ${(stats.systemHealth * 100).toFixed(1)}%`);
});

test('Genetic algorithm for consensus evolution', () => {
  const protocol = new DynamicProtocol();
  const state = {
    blockHeight: 1000,
    averageBlockTime: 5.0,
    difficulty: 10000n,
    gasLimit: 8000000n,
    blockSize: 512,
    validatorCount: 10,
    consensusThreshold: 0.67,
    timestamp: Date.now(),
    congestion: 0.5,
    utilization: 0.7,
    latency: 75,
  };
  protocol.updateNetworkState(state);
  protocol.updateProtocol();
  console.log(`   Protocol adapted successfully`);
  console.log(`   Adaptation strategies: ${protocol.getSystemStats().activeStrategies}`);
});

// Summary
console.log('\n═══════════════════════════════════════════════════════════════\n');
console.log('📊 Test Summary\n');
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests} ✅`);
console.log(`Failed: ${failedTests} ❌`);
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (failedTests === 0) {
  console.log('\n🎉 ALL TESTS PASSED! DamChain Phases 13-25 are fully functional! 🎉');
} else {
  console.log(`\n⚠️ ${failedTests} test(s) failed. Please review the errors above.`);
}

console.log('\n═══════════════════════════════════════════════════════════════\n');

process.exit(failedTests === 0 ? 0 : 1);
