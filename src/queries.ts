export type Queries = {
  getGroups: {
    id: number;
    label: string;
    position: number;
  }[];
  getItemsByGroupId: {
    id: number;
    parentId: number | null;
    label: string;
  }[];
  getItemLabelById: [{ label: string }];
  getItemKeysByItemId: { id: number; name: string; position: number }[];
  getSuggestedItemKeysForGroup: { id: number; name: string }[];
  getProductIdsForItem: { id: number }[];
  getProductValuesForItem: {
    productId: number;
    keyId: number;
    value: string;
  }[];
};

export const QUERIES: Record<keyof Queries, string> = {
  getGroups: 'SELECT * FROM groups ORDER BY position ASC;',
  getItemsByGroupId:
    'SELECT id, parentId, label FROM items WHERE groupId = $1;',
  getItemLabelById: 'SELECT label FROM items WHERE id = $1 LIMIT 1;',
  getItemKeysByItemId:
    'SELECT id, name, position FROM item_keys WHERE itemId = $1 ORDER BY position ASC;',
  getSuggestedItemKeysForGroup:
    'SELECT id, name FROM suggested_item_keys WHERE groupId = $1;',
  getProductIdsForItem: 'SELECT id FROM products WHERE itemId = $1;',
  getProductValuesForItem:
    'SELECT * FROM product_values WHERE productId IN (SELECT id FROM products WHERE itemId = $1);',
};
