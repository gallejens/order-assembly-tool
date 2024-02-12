import {
  ConfirmModal,
  RetypConfirmModal,
  TextInputModal,
} from '@/components/modals';
import { notifications } from '@/components/notifications';
import { OptionLabelBox } from '@/components/optionlabelbox';
import { Sidebar } from '@/components/sidebar';
import { useDatabase } from '@/hooks/useDatabase';
import { db } from '@/lib/db';
import type { Queries } from '@/queries';
import { useMainStore } from '@/stores/useMainStore';
import { Button, Loader, Stack, Text } from '@mantine/core';
import {
  IconArrowsMoveVertical,
  IconForms,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { type FC, useState } from 'react';
import { useGroupsPageStore } from '../stores/useGroupsPage';

import styles from '../styles/itemslist.module.scss';

type TreeItem = Queries['getItemsByGroupId'][number] & {
  children: TreeItem[];
};

const findItemByIdInTree = (
  treeItems: TreeItem[],
  id: number
): TreeItem | undefined => {
  for (const treeItem of treeItems) {
    if (treeItem.id === id) return treeItem;

    if (treeItem.children.length > 0) {
      const foundItem = findItemByIdInTree(treeItem.children, id);
      if (foundItem) {
        return foundItem;
      }
    }
  }
};

const buildItemTree = (items: Queries['getItemsByGroupId']) => {
  const itemsLeft = [...items];
  const groupped: TreeItem[] = [];

  let i = 0;
  while (itemsLeft.length > 0) {
    const item = itemsLeft[i];

    let parent = groupped;

    if (item.parentId !== null) {
      const parentItem = findItemByIdInTree(groupped, item.parentId);
      // parent might be not yet processed
      if (!parentItem) {
        i = (i + 1) % itemsLeft.length;
        continue;
      }
      parent = parentItem.children;
    }

    parent.push({
      ...item,
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

  const [movingItemId, setMovingItemId] = useState<number | null>(null);

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

  const handleMoveItem = (newParentId: number | null) => {
    if (movingItemId === null) return;

    const movingLabel =
      items?.find(i => i.id === movingItemId)?.label ?? 'unknown item';
    const parentLabel =
      items?.find(i => i.id === newParentId)?.label ?? 'new category';

    openModal(
      <ConfirmModal
        title={`Do you want to move "${movingLabel}" to "${parentLabel}"?`}
        text='Caution: all filters of this item will be removed!'
        onConfirm={async () => {
          await db.execute('UPDATE items SET parentId = $1 WHERE id = $2;', [
            newParentId,
            movingItemId,
          ]);
          refresh();
          closeModal();

          // TODO: Remove filters of the moved item
        }}
      />
    );

    setMovingItemId(null);
  };

  // extracted for recursions
  const mapFunc = (item: TreeItem) => {
    const options = [
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
    ];

    if (movingItemId === null) {
      options.push({
        label: 'Move',
        icon: IconArrowsMoveVertical,
        onClick: () => {
          setMovingItemId(item.id);
        },
      });
    }

    return (
      <div key={`tree_item_${item.id}`} className={styles.children}>
        <OptionLabelBox
          onClick={() => {
            if (movingItemId !== null) {
              if (movingItemId !== item.id) {
                handleMoveItem(item.id);
              }
              return;
            }

            if (item.id !== selectedItem) {
              setSelectedItem(item.id);
            }
          }}
          label={item.label}
          selected={selectedItem === item.id}
          className={styles.tree_item}
          options={options}
        />
        {item.children.length > 0 && item.children.map(mapFunc)}
      </div>
    );
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
        <div className={styles.tree}>
          {buildItemTree(items).map(mapFunc)}
          {movingItemId !== null && (
            <Stack>
              <Button
                onClick={() => {
                  handleMoveItem(null);
                }}
              >
                New category
              </Button>
              <Button
                onClick={() => {
                  setMovingItemId(null);
                }}
                color='red'
              >
                Cancel
              </Button>
            </Stack>
          )}
        </div>
      )}
    </Sidebar>
  );
};
