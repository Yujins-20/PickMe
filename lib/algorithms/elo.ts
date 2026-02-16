// lib/algorithms/elo.ts
// Elo Rating System for pairwise comparison

export interface EloItem {
  id: string;
  name: string;
  rating: number;
  comparisons: number;
  wins: number;
  losses: number;
  imageUrl?: string;
  metadata?: any;
}

export class EloRatingSystem {
  private K: number; // K-factor (learning rate)
  
  constructor(K: number = 32) {
    this.K = K;
  }

  /**
   * Calculate expected score for player A
   */
  private expectedScore(ratingA: number, ratingB: number): number {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  }

  /**
   * Update ratings after a comparison
   * @param winner The item that won
   * @param loser The item that lost
   * @returns Updated items
   */
  updateRatings(winner: EloItem, loser: EloItem): { winner: EloItem; loser: EloItem } {
    const expectedWinner = this.expectedScore(winner.rating, loser.rating);
    const expectedLoser = this.expectedScore(loser.rating, winner.rating);

    const newWinnerRating = winner.rating + this.K * (1 - expectedWinner);
    const newLoserRating = loser.rating + this.K * (0 - expectedLoser);

    return {
      winner: {
        ...winner,
        rating: newWinnerRating,
        comparisons: winner.comparisons + 1,
        wins: winner.wins + 1,
      },
      loser: {
        ...loser,
        rating: newLoserRating,
        comparisons: loser.comparisons + 1,
        losses: loser.losses + 1,
      },
    };
  }

  /**
   * Initialize items with default Elo rating (1500)
   */
  initializeItems(items: Array<{ id: string; name: string; imageUrl?: string; metadata?: any }>): EloItem[] {
    return items.map(item => ({
      ...item,
      rating: 1500,
      comparisons: 0,
      wins: 0,
      losses: 0,
    }));
  }

  /**
   * Calculate uncertainty (standard deviation) for an item
   * More comparisons = less uncertainty
   */
  calculateUncertainty(item: EloItem): number {
    // Uncertainty decreases with more comparisons
    // Formula: 350 / sqrt(1 + comparisons)
    return 350 / Math.sqrt(1 + item.comparisons);
  }

  /**
   * Get final ranking sorted by Elo rating
   */
  getRanking(items: EloItem[]): EloItem[] {
    return [...items].sort((a, b) => b.rating - a.rating);
  }
}

export default EloRatingSystem;
