import { Box } from '@/components/box';
import { IconButton } from '@/components/iconbutton';
import { RetypConfirmModal, TextInputModal } from '@/components/modals';
import { notifications } from '@/components/notifications';
import { Sidebar } from '@/components/sidebar';
import { useDatabase } from '@/hooks/useDatabase';
import { db } from '@/lib/db';
import type { Queries } from '@/queries';
import { useMainStore } from '@/stores/useMainStore';
import { Loader, Text } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { type FC } from 'react';
import { useGroupsPageStore } from '../stores/useGroupsPage';

import styles from '../styles/itemslist.module.scss';

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

const groupItems = (items: Queries['getItemsByGroupId']) => {
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

export const ItemsList: FC = () => {
  const { selectedGroup, selectedItem, setSelectedItem } = useGroupsPageStore();
  const { openModal, closeModal } = useMainStore();

  const { data: items, refresh } = useDatabase('getItemsByGroupId', [
    selectedGroup,
  ]);

  const handleCreateItem = (parentId: number | null = null) => {
    openModal(
      <TextInputModal
        title='Create a new item'
        inputLabel='Name'
        buttonLabel='Create'
        onConfirm={async label => {
          closeModal();
          await db.execute(
            'INSERT INTO items (groupId, parentId, label) VALUES ($1, $2, $3)',
            [selectedGroup, parentId, label]
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

  const handleDeleteItem = (id: number) => {
    const item = items?.find(i => i.id === id);
    if (!item) return;

    openModal(
      <RetypConfirmModal
        title='Removing item, all linked items will also be deleted!'
        confirmValue={item.label}
        onConfirm={async () => {
          closeModal();
          await db.execute('DELETE FROM items WHERE id = $1', [id]);
          notifications.add({
            title: 'Item Deleted',
            message: `"${item.label}" was successfully deleted`,
            autoClose: 3000,
          });
          refresh();
        }}
      />
    );
  };

  // extracted for recursions
  const mapFunc = (item: Item) => (
    <div key={`tree_item_${item.id}`} className={styles.children}>
      <Box
        onClick={() => {
          setSelectedItem(item.id);
        }}
        selected={selectedItem === item.id}
        className={styles.tree_item}
      >
        {item.label}
        <div className={styles.button_group}>
          <IconButton
            size='1.1rem'
            icon={IconPlus}
            onClick={() => {
              handleCreateItem(item.id);
            }}
          />
          <IconButton
            size='1.1rem'
            icon={IconTrash}
            onClick={() => {
              handleDeleteItem(item.id);
            }}
          />
        </div>
      </Box>
      {item.children.length > 0 && item.children.map(mapFunc)}
    </div>
  );

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
        <div className={styles.tree}>{groupItems(items).map(mapFunc)}</div>
      )}
    </Sidebar>
  );
};
