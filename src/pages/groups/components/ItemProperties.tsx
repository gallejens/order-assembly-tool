import { RetypConfirmModal, TextInputModal } from '@/components/modals';
import { notifications } from '@/components/notifications';
import { OptionLabelBox } from '@/components/optionlabelbox';
import { Resizeable } from '@/components/resizeable';
import { useDatabase } from '@/hooks/useDatabase';
import { db } from '@/lib/db';
import { useMainStore } from '@/stores/useMainStore';
import { Button, Center, Chip, Loader, Text } from '@mantine/core';
import { IconForms, IconTrash } from '@tabler/icons-react';
import type { FC } from 'react';
import styles from '../styles/itemproperties.module.scss';

type Props = {
  itemId: number;
  itemLabel: string;
};

const SUGGESTED_PROPERTIES = ['Productnumber'];

const addKey = async (itemId: number, itemLabel: string, keyName: string) => {
  await db.execute('INSERT INTO item_keys (itemId, name) VALUES ($1, $2);', [
    itemId,
    keyName,
  ]);
  notifications.add({
    title: 'Property Added',
    message: `Property "${keyName}" was successfully added to "${itemLabel}"`,
    autoClose: 3000,
  });
};

export const ItemProperties: FC<Props> = props => {
  const { data: itemKeys, refresh } = useDatabase('getItemKeysByItemId', [
    props.itemId,
  ]);
  const { openModal, closeModal } = useMainStore();

  if (itemKeys === null) {
    return (
      <div className='fullcenter'>
        <Loader />
      </div>
    );
  }

  const handleAddKey = () => {
    openModal(
      <TextInputModal
        title={`Add property to "${props.itemLabel}"`}
        inputLabel='Property Name'
        buttonLabel='Add'
        onConfirm={async keyName => {
          closeModal();
          addKey(props.itemId, props.itemLabel, keyName);
          refresh();
        }}
      />
    );
  };

  const handleDeleteKey = (id: number) => {
    const key = itemKeys.find(k => k.id === id);
    if (!key) return;

    openModal(
      <RetypConfirmModal
        title={`Delete property "${key.name}"`}
        confirmValue={key.name}
        onConfirm={async () => {
          closeModal();
          await db.execute('DELETE FROM item_keys WHERE id = $1', [id]);
          notifications.add({
            title: 'Property Deleted',
            message: `Property "${key.name}" was successfully deleted`,
            autoClose: 3000,
          });
          refresh();
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
          refresh();
        }}
      />
    );
  };

  const handleAddSuggestedKey = async (keyName: string) => {
    await addKey(props.itemId, props.itemLabel, keyName);
    refresh();
  };

  const suggestedKeys = SUGGESTED_PROPERTIES.reduce<string[]>((acc, cur) => {
    if (itemKeys.find(k => k.name === cur)) return acc;
    acc.push(cur);
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
          itemKeys.map(key => (
            <OptionLabelBox
              key={`item_key_${key.id}`}
              label={key.name}
              options={[
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
              ]}
            />
          ))
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
        {suggestedKeys.map(key => (
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
