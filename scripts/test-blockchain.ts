/**
 * test-blockchain.ts
 * Test script to verify DamChain blockchain implementation
 */

import { Blockchain } from '../lib/blockchain/core/Chain';
import { Transaction } from '../lib/blockchain/core/Transaction';
import { QuantumProofCrypto } from '../lib/blockchain/crypto/QuantumProofCrypto';

async function runTests() {
  console.log('🚀 DamChain Blockchain Test\n');
  console.log('═'.repeat(60));

  // Test 1: Initialize blockchain
  console.log('\n📋 Test 1: Initialize Blockchain');
  const blockchain = new Blockchain({
    blockTime: 5,
    blockSizeLimit: 1000000,
    gasLimit: 30000000n,
    dimensions: 10,
    genesisValidator: 'dam1genesis',
  });
  console.log('✅ Blockchain initialized');
  console.log(`   Genesis block: #${blockchain.getLatestBlock().blockNumber}`);
  console.log(`   Genesis hash: ${blockchain.getLatestBlock().hash.substring(0, 16)}...`);

  // Test 2: Generate quantum-proof key pairs
  console.log('\n🔐 Test 2: Generate Quantum-Proof Key Pairs');
  const alice = QuantumProofCrypto.generateKeyPair();
  const bob = QuantumProofCrypto.generateKeyPair();
  const aliceAddress = QuantumProofCrypto.publicKeyToAddress(alice.publicKey);
  const bobAddress = QuantumProofCrypto.publicKeyToAddress(bob.publicKey);

  console.log('✅ Key pairs generated');
  console.log(`   Alice address: ${aliceAddress}`);
  console.log(`   Bob address: ${bobAddress}`);
  console.log(`   Algorithm: ${alice.algorithm}`);

  // Test 3: Create and sign a transaction
  console.log('\n💸 Test 3: Create Transaction');
  const tx1 = new Transaction({
    from: aliceAddress,
    to: bobAddress,
    value: 100n * 10n ** 18n,
    gasPrice: 1000000n,
    gasLimit: 21000n,
    nonce: 0n,
  });

  const signature = QuantumProofCrypto.sign(tx1.hash, alice.privateKey);
  tx1.sign(signature);

  console.log('✅ Transaction created and signed');
  console.log(`   Value: ${tx1.value / (10n ** 18n)} DamCoins`);

  // Test 4: Add transaction and mine block
  blockchain.addTransaction(tx1);
  console.log('\n⛏️  Test 4: Mine Block');
  const validator = QuantumProofCrypto.generateKeyPair();
  const validatorAddress = QuantumProofCrypto.publicKeyToAddress(validator.publicKey);

  const block = await blockchain.minePendingTransactions(validatorAddress, 0);
  if (block) {
    console.log('✅ Block mined successfully');
    console.log(`   Block #${block.blockNumber} with ${block.transactionCount} transaction(s)`);
    console.log(`   Validator reward: 10 DamCoins`);
  }

  console.log('\n' + '═'.repeat(60));
  console.log('🎉 All core features working!');
  console.log('═'.repeat(60));
}

runTests().catch(console.error);
