export type Queries = {
  getGroups: {
    id: number;
    label: string;
  }[];
  getItemsByGroupId: {
    id: number;
    parentId: number | null;
    label: string;
  }[];
  getItemLabelById: [{ label: string }];
  getItemKeysByItemId: { id: number; name: string }[];
};

export const QUERIES: Record<keyof Queries, string> = {
  getGroups: 'SELECT * FROM groups',
  getItemsByGroupId: 'SELECT id, parentId, label FROM items WHERE groupId = $1',
  getItemLabelById: 'SELECT label FROM items WHERE id = $1 LIMIT 1;',
  getItemKeysByItemId: 'SELECT id, name FROM item_keys WHERE itemId = $1;',
};
