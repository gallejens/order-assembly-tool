import { create } from 'zustand';

type GroupsPageState = {
  selectedGroup: number | null;
  selectedItem: number | null;
};

type GroupsPageStateActions = {
  setSelectedGroup: (groupId: GroupsPageState['selectedGroup']) => void;
  setSelectedItem: (itemId: GroupsPageState['selectedItem']) => void;
};

export const useGroupsPageStore = create<
  GroupsPageState & GroupsPageStateActions
>(set => ({
  selectedGroup: null,
  selectedItem: null,
  setSelectedGroup: groupId =>
    set({ selectedGroup: groupId, selectedItem: null }),
  setSelectedItem: itemId => set({ selectedItem: itemId }),
}));
