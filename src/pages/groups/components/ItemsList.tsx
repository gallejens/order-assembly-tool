import { RetypConfirmModal, TextInputModal } from '@/components/modals';
import { notifications } from '@/components/notifications';
import { OptionLabelBox } from '@/components/optionlabelbox';
import { Sidebar } from '@/components/sidebar';
import { useDatabase } from '@/hooks/useDatabase';
import { db } from '@/lib/db';
import type { Queries } from '@/queries';
import { useMainStore } from '@/stores/useMainStore';
import { Loader, Text } from '@mantine/core';
import { IconForms, IconPlus, IconTrash } from '@tabler/icons-react';
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
    const parentItemLabel =
      (parentId === null ? undefined : items?.find(i => i.id === parentId))
        ?.label ?? 'Unknown';

    openModal(
      <TextInputModal
        title={
          parentId === null
            ? 'Create a new item'
            : `Add subitem to "${parentItemLabel}"`
        }
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
        title={`Delete "${item.label}"`}
        text='Caution: all subitems will also be deleted!'
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

  const handleRenameItem = (id: number) => {
    const item = items?.find(g => g.id === id);
    if (!item) return;

    openModal(
      <TextInputModal
        title={`Rename "${item.label}"`}
        inputLabel='New Name'
        buttonLabel='Rename'
        onConfirm={async label => {
          closeModal();
          await db.execute('UPDATE items SET label = $1 WHERE id = $2', [
            label,
            id,
          ]);
          notifications.add({
            title: 'Item Renamed',
            message: `"${item.label}" was successfully renamed to "${label}"`,
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
      <OptionLabelBox
        onClick={() => {
          if (item.id === selectedItem) return;
          setSelectedItem(item.id);
        }}
        label={item.label}
        selected={selectedItem === item.id}
        className={styles.tree_item}
        options={[
          {
            label: 'Add Subitem',
            icon: IconPlus,
            onClick: () => {
              handleCreateItem(item.id);
            },
          },
          {
            label: 'Rename',
            icon: IconForms,
            onClick: () => {
              handleRenameItem(item.id);
            },
          },
          {
            label: 'Delete',
            icon: IconTrash,
            onClick: () => {
              handleDeleteItem(item.id);
            },
          },
        ]}
      />
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
