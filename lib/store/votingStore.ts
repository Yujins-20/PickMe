// lib/store/votingStore.ts
import { create } from 'zustand';
import { EloItem } from '../algorithms/elo';
import { ComparisonPair } from '../algorithms/guro';

export interface VotingRoom {
  id: string;
  roomCode: string;
  title: string;
  category: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
}

export interface VotingSession {
  room: VotingRoom | null;
  items: EloItem[];
  currentPair: ComparisonPair | null;
  comparisonHistory: Array<{ winnerId: string; loserId: string }>;
  isLoading: boolean;
  error: string | null;
}

interface VotingStore extends VotingSession {
  // Actions
  setRoom: (room: VotingRoom) => void;
  setItems: (items: EloItem[]) => void;
  setCurrentPair: (pair: ComparisonPair | null) => void;
  addComparison: (winnerId: string, loserId: string) => void;
  updateItemRatings: (winnerId: string, loserId: string, winner: EloItem, loser: EloItem) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  
  // Computed
  getRanking: () => EloItem[];
  getTotalComparisons: () => number;
  getProgress: (targetComparisons: number) => number;
}

const initialState: VotingSession = {
  room: null,
  items: [],
  currentPair: null,
  comparisonHistory: [],
  isLoading: false,
  error: null,
};

export const useVotingStore = create<VotingStore>((set, get) => ({
  ...initialState,

  setRoom: (room) => set({ room }),

  setItems: (items) => set({ items }),

  setCurrentPair: (pair) => set({ currentPair: pair }),

  addComparison: (winnerId, loserId) =>
    set((state) => ({
      comparisonHistory: [...state.comparisonHistory, { winnerId, loserId }],
    })),

  updateItemRatings: (winnerId, loserId, winner, loser) =>
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id === winnerId) return winner;
        if (item.id === loserId) return loser;
        return item;
      }),
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),

  // Computed values
  getRanking: () => {
    const items = get().items;
    return [...items].sort((a, b) => b.rating - a.rating);
  },

  getTotalComparisons: () => {
    return get().comparisonHistory.length;
  },

  getProgress: (targetComparisons) => {
    const current = get().getTotalComparisons();
    return Math.min(100, Math.round((current / targetComparisons) * 100));
  },
}));

export default useVotingStore;
