import { IconButton } from '@/components/iconbutton';
import { useDatabase } from '@/hooks/useDatabase';
import { db } from '@/lib/db';
import { ConfirmModal } from '@/modals/ConfirmModal';
import { CreateGroupModal } from '@/modals/CreateGroupModal';
import { useMainStore } from '@/stores/useMainStore';
import { Database } from '@/types/db';
import { Text, UnstyledButton } from '@mantine/core';
import { IconPlus, IconX } from '@tabler/icons-react';
import { FC } from 'react';
import styles from './groups.module.scss';

export const GroupsPage: FC = () => {
  const { data: groups, refresh } = useDatabase<Database.GroupsTable[]>(
    'SELECT * FROM groups'
  );
  const { openModal, closeModal } = useMainStore();

  if (groups === null) return null;

  const handleRemoveGroup = (id: number) => {
    openModal(
      <ConfirmModal
        title={`Do you want to remove group '${
          groups.find(g => g.id === id)?.label
        }'`}
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
      <div className={styles.groups_page}>
        {groups.map(group => (
          <div
            key={`group-${group.id}`}
            onClick={() => {
              console.log(group.id);
            }}
            className={styles.grid_item}
          >
            <Text>{group.label}</Text>
            <IconButton
              onClick={() => {
                handleRemoveGroup(group.id);
              }}
              icon={IconX}
              size={'2rem'}
            />
          </div>
        ))}
      </div>
      <UnstyledButton
        onClick={handleCreateGroup}
        className={styles.create_button}
      >
        <IconPlus />
      </UnstyledButton>
    </>
  );
};
