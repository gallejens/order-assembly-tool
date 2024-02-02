import { IconButton } from '@/components/iconbutton';
import { CreateGroupModal } from '@/components/modals/CreateGroupModal';
import { RetypConfirmModal } from '@/components/modals/RetypConfirmModal';
import { notifications } from '@/components/notifications';
import { Sidebar } from '@/components/sidebar';
import { useDatabase } from '@/hooks/useDatabase';
import { db } from '@/lib/db';
import { useMainStore } from '@/stores/useMainStore';
import type { Database } from '@/types/db';
import { Loader, Text } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import classNames from 'classnames';
import type { FC } from 'react';
import styles from '../groups.module.scss';

type Props = {
  selected: number | null;
  onClick: (id: number) => void;
};

export const GroupsList: FC<Props> = props => {
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

  return (
    <Sidebar
      title='Groups'
      icon={IconPlus}
      onClick={handleCreateGroup}
      sizeStorageKey='groups-list'
      className={styles.groups_list}
    >
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
              props.onClick(group.id);
            }}
            className={classNames(props.selected === group.id && 'selected')}
          >
            <Text size='md'>{group.label}</Text>
            <IconButton
              onClick={() => {
                handleRemoveGroup(group.id);
              }}
              icon={IconTrash}
              size='1.1rem'
            />
          </div>
        ))
      )}
    </Sidebar>
  );
};
