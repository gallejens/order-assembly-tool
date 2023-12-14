import { create } from 'zustand';

type MainState = {
  count: number;
};

type MainStateActions = {
  increaseCount: () => void;
};

export const useMainStore = create<MainState & MainStateActions>(set => ({
  count: 0,
  increaseCount: () => set(s => ({ count: s.count + 1 })),
}));
