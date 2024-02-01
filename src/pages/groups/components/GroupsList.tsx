import { IconButton } from '@/components/iconbutton';
import { CreateGroupModal } from '@/components/modals/CreateGroupModal';
import { RetypConfirmModal } from '@/components/modals/RetypConfirmModal';
import { notifications } from '@/components/notifications';
import { useDatabase } from '@/hooks/useDatabase';
import { db } from '@/lib/db';
import { useMainStore } from '@/stores/useMainStore';
import type { Database } from '@/types/db';
import { Loader, Text, Title } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import type { FC } from 'react';

import { Resizeable } from '@/components/resizeable';
import styles from '../groups.module.scss';

export const GroupsList: FC = () => {
  const { data: groups, refresh } = useDatabase<Database.GroupsTable[]>(
    'SELECT * FROM groups'
  );
  const { openModal, closeModal } = useMainStore();

  const handleRemoveGroup = (id: number) => {
    const group = groups?.find(g => g.id === id);
    if (!group) return;

    openModal(
      <RetypConfirmModal
        title='Removing Group'
        confirmValue={group.label}
        onConfirm={async () => {
          closeModal();
          await db.execute('DELETE FROM groups WHERE id = $1', [id]);
          notifications.add({
            title: 'Group Deleted',
            message: `"${group.label}" was successfully deleted`,
            autoClose: 3000,
          });
          refresh();
        }}
      />
    );
  };

  const handleCreateGroup = () => {
    openModal(
      <CreateGroupModal
        onConfirm={async label => {
          closeModal();
          await db.execute('INSERT INTO groups (label) VALUES ($1)', [label]);
          notifications.add({
            title: 'Group Created',
            message: `"${label}" was successfully created`,
            autoClose: 3000,
          });
          refresh();
        }}
      />
    );
  };

  const handleGroupClick = (id: number) => {
    notifications.add({
      message: `Group ${id} clicked`,
    });
  };

  return (
    <>
      <Resizeable
        direction={{ right: true }}
        className={styles.groups_list}
        initialWidth='250px'
        minWidth='150px'
        maxWith='350px'
        storageKey='groups-list'
      >
        <div className={styles.header}>
          <Title size='1.2rem'>Groups</Title>
          <IconButton onClick={handleCreateGroup} icon={IconPlus} size='2rem' />
        </div>
        <div className={styles.list}>
          {groups === null ? (
            <Loader />
          ) : groups.length === 0 ? (
            <span>
              <Text size='sm'>Create a group to get started</Text>
            </span>
          ) : (
            groups.map(group => (
              <div
                key={`group-${group.id}`}
                onClick={() => {
                  handleGroupClick(group.id);
                }}
              >
                <Text size='md'>{group.label}</Text>
                <IconButton
                  onClick={() => {
                    handleRemoveGroup(group.id);
                  }}
                  icon={IconTrash}
                  size='1rem'
                />
              </div>
            ))
          )}
        </div>
      </Resizeable>
    </>
  );
};
