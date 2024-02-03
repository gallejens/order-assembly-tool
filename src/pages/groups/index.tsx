import { Text } from '@mantine/core';
import { type FC } from 'react';
import { GroupsList } from './components/GroupsList';
import { Item } from './components/Item';
import { ItemsList } from './components/ItemsList';
import { useGroupsPageStore } from './stores/useGroupsPage';

export const GroupsPage: FC = () => {
  const { selectedGroup, selectedItem } = useGroupsPageStore();

  return (
    <>
      <GroupsList />
      {selectedGroup === null ? (
        <div className='fullcenter'>
          <Text size='lg'>Select a group to continue</Text>
        </div>
      ) : (
        <>
          <ItemsList />
          {selectedItem === null ? (
            <div className='fullcenter'>
              <Text size='lg'>Select an item to continue</Text>
            </div>
          ) : (
            <Item />
          )}
        </>
      )}
    </>
  );
};
