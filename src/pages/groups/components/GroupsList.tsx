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
import { IconForms, IconPlus, IconTrash } from '@tabler/icons-react';
import type { FC } from 'react';
import { useGroupsPageStore } from '../stores/useGroupsPage';

import styles from '../styles/groupslist.module.scss';

export const GroupsList: FC = () => {
  const { selectedGroup, setSelectedGroup } = useGroupsPageStore();
  const { data: groups, refresh } = useDatabase('getGroups');
  const { openModal, closeModal } = useMainStore();

  const handleDeleteGroup = (id: number) => {
    const group = groups?.find(g => g.id === id);
    if (!group) return;

    openModal(
      <RetypConfirmModal
        title={`Renaming ${group.label}`}
        text={'Caution: all items in this group will also be deleted!'}
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

  const handleRenameGroup = (id: number) => {
    const group = groups?.find(g => g.id === id);
    if (!group) return;

    openModal(
      <TextInputModal
        title={`Renaming ${group.label}`}
        inputLabel='New Name'
        buttonLabel='Rename'
        onConfirm={async label => {
          closeModal();
          await db.execute('UPDATE groups SET label = $1 WHERE id = $2', [
            label,
            id,
          ]);
          notifications.add({
            title: 'Group Renamed',
            message: `"${group.label}" was successfully renamed to "${label}"`,
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
              if (group.id === selectedGroup) return;
              setSelectedGroup(group.id);
            }}
            selected={selectedGroup === group.id}
          >
            <Text size='md'>{group.label}</Text>
            <div className={styles.button_group}>
              <IconButton
                onClick={() => {
                  handleRenameGroup(group.id);
                }}
                icon={IconForms}
                size='1.1rem'
                tooltip={{
                  label: 'Rename',
                  openDelay: 300,
                }}
              />
              <IconButton
                onClick={() => {
                  handleDeleteGroup(group.id);
                }}
                icon={IconTrash}
                size='1.1rem'
                tooltip={{
                  label: 'Delete',
                  openDelay: 300,
                }}
              />
            </div>
          </Box>
        ))
      )}
    </Sidebar>
  );
};
