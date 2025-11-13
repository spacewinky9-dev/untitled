/**
 * MerkleTree.ts
 * Merkle tree implementation for efficient transaction verification
 */

import { createHash } from 'crypto';

export class MerkleTree {
  private leaves: string[];
  private tree: string[][];
  private root: string;

  constructor(data: string[]) {
    this.leaves = data.map((item) => this.hash(item));
    this.tree = this.buildTree();
    this.root = this.tree[this.tree.length - 1][0];
  }

  /**
   * Hash function using SHA-3 (quantum-resistant)
   */
  private hash(data: string): string {
    return createHash('sha3-256').update(data).digest('hex');
  }

  /**
   * Build the Merkle tree
   */
  private buildTree(): string[][] {
    if (this.leaves.length === 0) {
      return [[this.hash('')]];
    }

    const tree: string[][] = [this.leaves];
    let currentLevel = this.leaves;

    while (currentLevel.length > 1) {
      const nextLevel: string[] = [];

      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left;
        const combined = this.hash(left + right);
        nextLevel.push(combined);
      }

      tree.push(nextLevel);
      currentLevel = nextLevel;
    }

    return tree;
  }

  /**
   * Get the Merkle root
   */
  public getRoot(): string {
    return this.root;
  }

  /**
   * Get proof for a specific leaf
   */
  public getProof(index: number): string[] {
    if (index < 0 || index >= this.leaves.length) {
      throw new Error('Invalid leaf index');
    }

    const proof: string[] = [];
    let currentIndex = index;

    for (let level = 0; level < this.tree.length - 1; level++) {
      const currentLevel = this.tree[level];
      const isRightNode = currentIndex % 2 === 1;
      const siblingIndex = isRightNode ? currentIndex - 1 : currentIndex + 1;

      if (siblingIndex < currentLevel.length) {
        proof.push(currentLevel[siblingIndex]);
      }

      currentIndex = Math.floor(currentIndex / 2);
    }

    return proof;
  }

  /**
   * Verify a proof
   */
  public static verify(
    leaf: string,
    proof: string[],
    root: string,
    index: number
  ): boolean {
    const hashFunc = (data: string) =>
      createHash('sha3-256').update(data).digest('hex');

    let computedHash = hashFunc(leaf);
    let currentIndex = index;

    for (const sibling of proof) {
      const isRightNode = currentIndex % 2 === 1;
      computedHash = isRightNode
        ? hashFunc(sibling + computedHash)
        : hashFunc(computedHash + sibling);
      currentIndex = Math.floor(currentIndex / 2);
    }

    return computedHash === root;
  }

  /**
   * Get all leaves
   */
  public getLeaves(): string[] {
    return this.leaves;
  }

  /**
   * Get the full tree
   */
  public getTree(): string[][] {
    return this.tree;
  }

  /**
   * Visualize the tree (for debugging)
   */
  public visualize(): string {
    let output = 'Merkle Tree:\n';
    
    for (let level = this.tree.length - 1; level >= 0; level--) {
      const indent = ' '.repeat((this.tree.length - level - 1) * 2);
      output += `${indent}Level ${this.tree.length - level - 1}: `;
      output += this.tree[level].map((hash) => hash.substring(0, 8) + '...').join(' | ');
      output += '\n';
    }

    return output;
  }
}
