import { CreateGroupModal } from '@/components/modals';
import { notifications } from '@/components/notifications';
import { Sidebar } from '@/components/sidebar';
import { useDatabase } from '@/hooks/useDatabase';
import { db } from '@/lib/db';
import { useMainStore } from '@/stores/useMainStore';
import type { Database } from '@/types/db';
import { Loader, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import type { FC } from 'react';
import styles from '../groups.module.scss';

type Props = {
  groupId: number;
  selected: number | null;
  onClick: (id: number) => void;
};

type QueryResult = Omit<Database.ItemsTable, 'groupId'>[];

type Item = {
  id: number;
  label: string;
  children: Item[];
};

const findItemById = (items: Item[], id: number): Item | undefined => {
  for (const item of items) {
    if (item.id === id) return item;

    if (item.children.length > 0) {
      const foundItem = findItemById(item.children, id);
      if (foundItem) {
        return foundItem;
      }
    }
  }
};

const groupItems = (items: QueryResult) => {
  const itemsLeft = [...items];
  const groupped: Item[] = [];

  let i = 0;
  while (itemsLeft.length > 0) {
    const item = itemsLeft[i];

    if (item.parentId === null) {
      groupped.push({
        id: item.id,
        label: item.label,
        children: [],
      });
      itemsLeft.splice(i, 1);
      continue;
    }

    const parent = findItemById(groupped, item.parentId);
    // parent might be not yet processed
    if (!parent) {
      i = (i + 1) % itemsLeft.length;
      continue;
    }

    parent.children.push({
      id: item.id,
      label: item.label,
      children: [],
    });
    itemsLeft.splice(i, 1);
  }

  return groupped;
};

export const ItemsList: FC<Props> = props => {
  const { openModal, closeModal } = useMainStore();

  const { data: items, refresh } = useDatabase<QueryResult>(
    'SELECT id, parentId, label FROM items WHERE groupId = $1',
    [props.groupId]
  );

  const handleCreateItem = (parentId: number | null = null) => {
    openModal(
      <CreateGroupModal
        onConfirm={async label => {
          closeModal();
          await db.execute(
            'INSERT INTO items (groupId, parentId, label) VALUES ($1, $2, $3)',
            [props.groupId, parentId, label]
          );
          notifications.add({
            title: 'Item Created',
            message: `"${label}" was successfully created`,
            autoClose: 3000,
          });
          refresh();
        }}
      />
    );
  };

  const mapComponents = (items: Item[]) => {
    const components: JSX.Element[] = [];

    for (const item of items) {
      components.push(
        <div key={item.id}>
          <p>{item.label}</p>
          {item.children.length > 0 ? mapComponents(item.children) : null}
        </div>
      );
    }

    return components;
  };

  return (
    <Sidebar
      title='Items'
      icon={IconPlus}
      onClick={handleCreateItem}
      sizeStorageKey='items-list'
      className={styles.items_list}
    >
      {items === null ? (
        <Loader />
      ) : items.length === 0 ? (
        <span>
          <Text size='sm'>No items found</Text>
        </span>
      ) : (
        <div className={styles.tree}>{mapComponents(groupItems(items))}</div>
      )}
    </Sidebar>
  );
};
