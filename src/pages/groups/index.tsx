import { Text } from '@mantine/core';
import { type FC, useState } from 'react';
import { GroupsList } from './components/GroupsList';
import { ItemsList } from './components/ItemsList';

export const GroupsPage: FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  return (
    <>
      <GroupsList selected={selectedGroup} setSelected={setSelectedGroup} />
      {selectedGroup === null ? (
        <div className='fullcenter'>
          <Text size='lg'>Select a group to continue</Text>
        </div>
      ) : (
        <>
          <ItemsList
            groupId={selectedGroup}
            selected={selectedItem}
            setSelected={setSelectedItem}
          />
          {selectedItem === null ? (
            <div className='fullcenter'>
              <Text size='lg'>Select an item to continue</Text>
            </div>
          ) : (
            <div>{selectedItem}</div>
          )}
        </>
      )}
    </>
  );
};
