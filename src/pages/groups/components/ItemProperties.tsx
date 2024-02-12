import { ConfirmModal, TextInputModal } from '@/components/modals';
import { notifications } from '@/components/notifications';
import { OptionLabelBox } from '@/components/optionlabelbox';
import { Resizeable } from '@/components/resizeable';
import { useDatabase } from '@/hooks/useDatabase';
import { db } from '@/lib/db';
import { useMainStore } from '@/stores/useMainStore';
import { Button, Center, Chip, Loader, Text } from '@mantine/core';
import {
  IconArrowBadgeDown,
  IconArrowBadgeUp,
  IconForms,
  IconTrash,
} from '@tabler/icons-react';
import type { FC } from 'react';
import { useGroupsPageStore } from '../stores/useGroupsPage';
import styles from '../styles/itemproperties.module.scss';

type Props = {
  itemId: number;
  itemLabel: string;
};

export const ItemProperties: FC<Props> = props => {
  const { data: itemKeys, refresh: refreshItemKeys } = useDatabase(
    'getItemKeysByItemId',
    [props.itemId]
  );
  const { openModal, closeModal } = useMainStore();
  const { suggestedKeys } = useGroupsPageStore(s => ({
    suggestedKeys: s.suggestedKeys,
  }));

  if (itemKeys === null) {
    return (
      <div className='fullcenter'>
        <Loader />
      </div>
    );
  }

  const addKey = async (itemId: number, itemLabel: string, keyName: string) => {
    console.log(itemKeys);
    const position = (itemKeys[itemKeys.length - 1]?.position ?? 0) + 1;
    await db.execute(
      'INSERT INTO item_keys (itemId, name, position) VALUES ($1, $2, $3);',
      [itemId, keyName, position]
    );
    notifications.add({
      title: 'Property Added',
      message: `Property "${keyName}" was successfully added to "${itemLabel}"`,
      autoClose: 3000,
    });
  };

  const handleAddKey = () => {
    openModal(
      <TextInputModal
        title={`Add property to "${props.itemLabel}"`}
        inputLabel='Property Name'
        buttonLabel='Add'
        onConfirm={async keyName => {
          closeModal();
          addKey(props.itemId, props.itemLabel, keyName);
          refreshItemKeys();
        }}
      />
    );
  };

  const handleDeleteKey = (id: number) => {
    const key = itemKeys.find(k => k.id === id);
    if (!key) return;

    openModal(
      <ConfirmModal
        title={`Delete property "${key.name}"`}
        onConfirm={async () => {
          closeModal();
          await db.execute('DELETE FROM item_keys WHERE id = $1', [id]);
          notifications.add({
            title: 'Property Deleted',
            message: `Property "${key.name}" was successfully deleted`,
            autoClose: 3000,
          });
          refreshItemKeys();
        }}
      />
    );
  };

  const handleRenameGroup = (id: number) => {
    const itemKey = itemKeys?.find(g => g.id === id);
    if (!itemKey) return;

    openModal(
      <TextInputModal
        title={`Rename property "${itemKey.name}"`}
        inputLabel='New Name'
        buttonLabel='Rename'
        onConfirm={async name => {
          closeModal();
          await db.execute('UPDATE item_keys SET name = $1 WHERE id = $2', [
            name,
            id,
          ]);
          notifications.add({
            title: 'Property Renamed',
            message: `"${itemKey.name}" was successfully renamed to "${name}"`,
            autoClose: 3000,
          });
          refreshItemKeys();
        }}
      />
    );
  };

  const handleKeyPositionChange = async (id: number, movement: 1 | -1) => {
    const idx = itemKeys.findIndex(g => g.id === id);
    const swappingIdx = idx + movement;

    await db.execute(
      'UPDATE item_keys SET position = CASE id WHEN $1 THEN $2 WHEN $3 then $4 END WHERE ID in ($1, $3);',
      [
        id,
        itemKeys[swappingIdx].position,
        itemKeys[swappingIdx].id,
        itemKeys[idx].position,
      ]
    );

    refreshItemKeys();
  };

  const handleAddSuggestedKey = async (keyName: string) => {
    await addKey(props.itemId, props.itemLabel, keyName);
    refreshItemKeys();
  };

  const filteredSuggestedKeys = suggestedKeys.reduce<string[]>((acc, cur) => {
    if (itemKeys.find(k => k.name === cur.name)) return acc;
    acc.push(cur.name);
    return acc;
  }, []);

  return (
    <div className={styles.item_properties}>
      <div className={styles.keys}>
        {itemKeys.length === 0 ? (
          <Center>
            <Text>No properties found</Text>
          </Center>
        ) : (
          itemKeys.map((key, idx) => {
            const options = [
              {
                label: 'Rename',
                icon: IconForms,
                onClick: () => {
                  handleRenameGroup(key.id);
                },
              },
              {
                label: 'Delete',
                icon: IconTrash,
                onClick: () => {
                  handleDeleteKey(key.id);
                },
              },
            ];

            if (idx !== 0) {
              options.push({
                label: 'Move Up',
                icon: IconArrowBadgeUp,
                onClick: () => {
                  handleKeyPositionChange(key.id, -1);
                },
              });
            }

            if (idx !== itemKeys.length - 1) {
              options.push({
                label: 'Move Down',
                icon: IconArrowBadgeDown,
                onClick: () => {
                  handleKeyPositionChange(key.id, 1);
                },
              });
            }

            return (
              <OptionLabelBox
                key={`item_key_${key.id}`}
                label={key.name}
                options={options}
              />
            );
          })
        )}
      </div>
      <Resizeable
        direction={{ left: true }}
        className={styles.inputs}
        initialWidth='250px'
        minWidth='200px'
        maxWidth='300px'
        storageKey={'item_properties_inputs'}
      >
        <Button onClick={handleAddKey}>Add Custom</Button>
        {suggestedKeys.length > 0 && (
          <Text truncate='end' c='dimmed'>
            Suggested:
          </Text>
        )}
        {filteredSuggestedKeys.map(key => (
          <Chip
            key={`suggested_key_${key}`}
            onClick={() => {
              handleAddSuggestedKey(key);
            }}
          >
            {key}
          </Chip>
        ))}
      </Resizeable>
    </div>
  );
};
