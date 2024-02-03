import { Box } from '@/components/box';
import { IconButton } from '@/components/iconbutton';
import { RetypConfirmModal } from '@/components/modals/RetypConfirmModal';
import { TextInputModal } from '@/components/modals/TextInputModal';
import { notifications } from '@/components/notifications';
import { Sidebar } from '@/components/sidebar';
import { useDatabase } from '@/hooks/useDatabase';
import { db } from '@/lib/db';
import { useMainStore } from '@/stores/useMainStore';
import { Loader, Text } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import type { FC } from 'react';
import { useGroupsPageStore } from '../stores/useGroupsPage';

import styles from '../styles/groupslist.module.scss';

export const GroupsList: FC = () => {
  const { selectedGroup, setSelectedGroup } = useGroupsPageStore();
  const { data: groups, refresh } = useDatabase('getGroups');
  const { openModal, closeModal } = useMainStore();

  const handleRemoveGroup = (id: number) => {
    const group = groups?.find(g => g.id === id);
    if (!group) return;

    openModal(
      <RetypConfirmModal
        title='Removing group, all items in this group will also be deleted!'
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

          if (selectedGroup === id) {
            setSelectedGroup(null);
          }
        }}
      />
    );
  };

  const handleCreateGroup = () => {
    openModal(
      <TextInputModal
        title='Create a new group'
        inputLabel='Name'
        buttonLabel='Create'
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
          <Box
            key={`group-${group.id}`}
            onClick={() => {
              setSelectedGroup(group.id);
            }}
            selected={selectedGroup === group.id}
          >
            <Text size='md'>{group.label}</Text>
            <IconButton
              onClick={() => {
                handleRemoveGroup(group.id);
              }}
              icon={IconTrash}
              size='1.1rem'
            />
          </Box>
        ))
      )}
    </Sidebar>
  );
};
