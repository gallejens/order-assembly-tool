import { Page } from '@/constants';
import { create } from 'zustand';

type MainState = {
  activePage: Page;
};

type MainStateActions = {
  setActivePage: (page: Page) => void;
};

export const useMainStore = create<MainState & MainStateActions>(set => ({
  activePage: 'home',
  setActivePage: page => set({ activePage: page }),
}));

