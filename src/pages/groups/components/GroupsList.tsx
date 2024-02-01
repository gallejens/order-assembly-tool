import { IconButton } from '@/components/iconbutton';
import { CreateGroupModal } from '@/components/modals/CreateGroupModal';
import { useDatabase } from '@/hooks/useDatabase';
import { db } from '@/lib/db';
import { useMainStore } from '@/stores/useMainStore';
import type { Database } from '@/types/db';
import { Text, Title } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import type { FC } from 'react';

import { RetypConfirmModal } from '@/components/modals/RetypConfirmModal';
import styles from '../groups.module.scss';

export const GroupsList: FC = () => {
  const { data: groups, refresh } = useDatabase<Database.GroupsTable[]>(
    'SELECT * FROM groups'
  );
  const { openModal, closeModal } = useMainStore();

  if (groups === null) return null;

  const handleRemoveGroup = (id: number) => {
    const groupData = groups.find(g => g.id === id);
    if (!groupData) return;

    openModal(
      <RetypConfirmModal
        title='Removing Group'
        confirmValue={groupData.label}
        onConfirm={async () => {
          closeModal();
          await db.execute('DELETE FROM groups WHERE id = $1', [id]);
          refresh();
        }}
      />
    );
  };

  const handleCreateGroup = () => {
    openModal(
      <CreateGroupModal
        onConfirm={() => {
          closeModal();
          refresh();
        }}
      />
    );
  };

  return (
    <>
      <div className={styles.groups_list}>
        <div className={styles.header}>
          <Title size='1.2rem'>Groups</Title>
          <IconButton onClick={handleCreateGroup} icon={IconPlus} size='2rem' />
        </div>
        <div className={styles.list}>
          {groups.map(group => (
            <div key={`group-${group.id}`}>
              <Text size='md'>{group.label}</Text>
              <IconButton
                onClick={() => {
                  handleRemoveGroup(group.id);
                }}
                icon={IconTrash}
                size='1rem'
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
