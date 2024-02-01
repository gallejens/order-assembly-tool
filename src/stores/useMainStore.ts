import { Page } from '@/constants';
import { create } from 'zustand';

type MainState = {
  activePage: Page;
  modal: { component: JSX.Element } | null;
};

type MainStateActions = {
  setActivePage: (page: Page) => void;
  openModal: (component: JSX.Element) => void;
  closeModal: () => void;
};

export const useMainStore = create<MainState & MainStateActions>(set => ({
  activePage: 'home',
  modal: null,
  setActivePage: page => set({ activePage: page }),
  openModal: component => set({ modal: { component } }),
  closeModal: () => set({ modal: null }),
}));

