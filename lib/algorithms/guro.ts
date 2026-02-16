// lib/algorithms/guro.ts
// GURO: Greedy Uncertainty Reduction Optimization
// Active sampling strategy for pairwise comparison

import { EloItem, EloRatingSystem } from './elo';

export interface ComparisonPair {
  itemA: EloItem;
  itemB: EloItem;
  score: number; // Higher score = more informative pair
}

export class GUROSampler {
  private eloSystem: EloRatingSystem;

  constructor(eloSystem: EloRatingSystem) {
    this.eloSystem = eloSystem;
  }

  /**
   * Calculate information gain for a pair
   * Based on:
   * 1. Rating uncertainty (both items)
   * 2. Rating closeness (close ratings = more informative)
   * 3. Comparison count (fewer comparisons = higher priority)
   */
  private calculateInformationGain(itemA: EloItem, itemB: EloItem): number {
    // 1. Uncertainty score (higher uncertainty = more informative)
    const uncertaintyA = this.eloSystem.calculateUncertainty(itemA);
    const uncertaintyB = this.eloSystem.calculateUncertainty(itemB);
    const avgUncertainty = (uncertaintyA + uncertaintyB) / 2;

    // 2. Rating closeness score (closer ratings = more informative)
    const ratingDiff = Math.abs(itemA.rating - itemB.rating);
    const closenessScore = Math.exp(-ratingDiff / 400); // Exponential decay

    // 3. Comparison balance score (prefer items with fewer comparisons)
    const avgComparisons = (itemA.comparisons + itemB.comparisons) / 2;
    const balanceScore = 1 / (1 + avgComparisons / 10);

    // Combine scores
    const informationGain = avgUncertainty * closenessScore * balanceScore;

    return informationGain;
  }

  /**
   * Select the most informative pair for next comparison
   * GURO strategy: Greedy selection of pair with highest information gain
   */
  selectNextPair(items: EloItem[], excludePairs?: Set<string>): ComparisonPair | null {
    if (items.length < 2) return null;

    let bestPair: ComparisonPair | null = null;
    let maxScore = -Infinity;

    // Evaluate all possible pairs
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const itemA = items[i];
        const itemB = items[j];

        // Check if this pair should be excluded
        const pairKey = this.getPairKey(itemA.id, itemB.id);
        if (excludePairs?.has(pairKey)) {
          continue;
        }

        // Calculate information gain
        const score = this.calculateInformationGain(itemA, itemB);

        if (score > maxScore) {
          maxScore = score;
          bestPair = { itemA, itemB, score };
        }
      }
    }

    return bestPair;
  }

  /**
   * Generate a sequence of comparison pairs
   * @param items List of items to compare
   * @param numComparisons Number of comparisons to generate
   */
  generateComparisonSequence(items: EloItem[], numComparisons: number): ComparisonPair[] {
    const sequence: ComparisonPair[] = [];
    const usedPairs = new Set<string>();
    const itemsCopy = [...items];

    for (let i = 0; i < numComparisons; i++) {
      const pair = this.selectNextPair(itemsCopy, usedPairs);
      
      if (!pair) break; // No more valid pairs

      sequence.push(pair);
      usedPairs.add(this.getPairKey(pair.itemA.id, pair.itemB.id));
    }

    return sequence;
  }

  /**
   * Estimate minimum comparisons needed for convergence
   * Based on number of items and desired confidence
   */
  estimateRequiredComparisons(numItems: number, confidence: number = 0.95): number {
    // Heuristic: log(n) * n / 2 * adjustment
    // For high confidence, we need more comparisons
    const baseComparisons = Math.ceil(Math.log2(numItems) * numItems / 2);
    const confidenceMultiplier = 1 + (confidence - 0.5);
    
    return Math.ceil(baseComparisons * confidenceMultiplier);
  }

  /**
   * Check if ranking has converged (stable)
   */
  hasConverged(items: EloItem[], threshold: number = 50): boolean {
    // Check if all items have sufficient comparisons
    const minComparisons = Math.min(...items.map(item => item.comparisons));
    
    // Check if uncertainty is below threshold for all items
    const maxUncertainty = Math.max(...items.map(item => 
      this.eloSystem.calculateUncertainty(item)
    ));

    return minComparisons >= 3 && maxUncertainty < threshold;
  }

  /**
   * Helper: Create unique key for a pair
   */
  private getPairKey(idA: string, idB: string): string {
    return [idA, idB].sort().join('_');
  }

  /**
   * Calculate ranking confidence (0-100%)
   * Based on average uncertainty across all items
   */
  calculateRankingConfidence(items: EloItem[]): number {
    if (items.length === 0) return 0;

    const avgUncertainty = items.reduce((sum, item) => 
      sum + this.eloSystem.calculateUncertainty(item), 0
    ) / items.length;

    // Map uncertainty to confidence (lower uncertainty = higher confidence)
    // Max uncertainty ~350, min ~0
    const confidence = Math.max(0, Math.min(100, 100 * (1 - avgUncertainty / 350)));

    return Math.round(confidence);
  }
}

export default GUROSampler;
