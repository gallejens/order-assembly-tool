import { executeSelectQuery } from '@/lib/db';
import { create } from 'zustand';

type GroupsPageState = {
  selectedGroup: number | null;
  selectedItem: number | null;
  suggestedKeys: { id: number; name: string }[];
};

type GroupsPageStateActions = {
  setSelectedGroup: (groupId: GroupsPageState['selectedGroup']) => void;
  setSelectedItem: (itemId: GroupsPageState['selectedItem']) => void;
  updateSuggestedKeys: () => void;
};

export const useGroupsPageStore = create<
  GroupsPageState & GroupsPageStateActions
>((set, get) => ({
  selectedGroup: null,
  selectedItem: null,
  suggestedKeys: [],
  setSelectedGroup: async groupId => {
    const suggestedKeys = await executeSelectQuery(
      'getSuggestedItemKeysForGroup',
      [groupId]
    );
    set({ selectedGroup: groupId, selectedItem: null, suggestedKeys });
  },
  setSelectedItem: itemId => set({ selectedItem: itemId }),
  updateSuggestedKeys: async () => {
    const selectedGroup = get().selectedGroup;
    if (selectedGroup === null) return;

    const suggestedKeys = await executeSelectQuery(
      'getSuggestedItemKeysForGroup',
      [selectedGroup]
    );
    set({ suggestedKeys });
  },
}));
