export namespace Database {
  export type GroupsTable = {
    id: number;
    label: string;
  };

  export type ItemsTable = {
    id: number;
    groupId: number;
    parentId: number | null;
    label: string;
  };

  export type ItemKeysTable = {
    id: number;
    itemId: number;
    key: string;
  };
}

