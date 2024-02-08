import { RetypConfirmModal } from '@/components/modals/RetypConfirmModal';
import { TextInputModal } from '@/components/modals/TextInputModal';
import { notifications } from '@/components/notifications';
import { OptionLabelBox } from '@/components/optionlabelbox';
import { Sidebar } from '@/components/sidebar';
import { useDatabase } from '@/hooks/useDatabase';
import { db } from '@/lib/db';
import { useMainStore } from '@/stores/useMainStore';
import { Loader, Text } from '@mantine/core';
import {
  IconArrowBadgeDown,
  IconArrowBadgeUp,
  IconForms,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
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
        title={`Delete group "${group.label}"`}
        text={'Caution: all items in this group will be deleted!'}
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
    if (!groups) return;

    openModal(
      <TextInputModal
        title='Create a new group'
        inputLabel='Name'
        buttonLabel='Create'
        onConfirm={async label => {
          closeModal();
          await db.execute(
            'INSERT INTO groups (label, position) VALUES ($1, $2);',
            [label, groups[groups.length - 1].position + 1]
          );
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
        title={`Rename group "${group.label}"`}
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

  const handleGroupPositionChange = async (id: number, movement: 1 | -1) => {
    if (!groups) return;

    const idx = groups.findIndex(g => g.id === id);
    const swappingIdx = idx + movement;

    await db.execute(
      'UPDATE groups SET position = CASE id WHEN $1 THEN $2 WHEN $3 then $4 END WHERE ID in ($1, $3);',
      [
        id,
        groups[swappingIdx].position,
        groups[swappingIdx].id,
        groups[idx].position,
      ]
    );

    refresh();
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
        groups.map((group, idx) => {
          const options = [
            {
              label: 'Rename',
              icon: IconForms,
              onClick: () => {
                handleRenameGroup(group.id);
              },
            },
            {
              label: 'Delete',
              icon: IconTrash,
              onClick: () => {
                handleDeleteGroup(group.id);
              },
            },
          ];

          if (idx !== 0) {
            options.push({
              label: 'Move Up',
              icon: IconArrowBadgeUp,
              onClick: () => {
                handleGroupPositionChange(group.id, -1);
              },
            });
          }

          if (idx !== groups.length - 1) {
            options.push({
              label: 'Move Down',
              icon: IconArrowBadgeDown,
              onClick: () => {
                handleGroupPositionChange(group.id, 1);
              },
            });
          }

          return (
            <OptionLabelBox
              key={`group-${group.id}`}
              label={group.label}
              onClick={() => {
                if (group.id === selectedGroup) return;
                setSelectedGroup(group.id);
              }}
              selected={selectedGroup === group.id}
              options={options}
            />
          );
        })
      )}
    </Sidebar>
  );
};
