import { db } from '@/lib/db';
import { Button, Divider, Group, Stack, Text, TextInput } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { FC, useState } from 'react';
import { Modal } from '../../../components/modals';
import { notifications } from '../../../components/notifications';
import { OptionLabelBox } from '../../../components/optionlabelbox';
import { useGroupsPageStore } from '../stores/useGroupsPage';

type Props = {
  groupId: number;
};

export const SuggestedKeysModal: FC<Props> = props => {
  const [input, setInput] = useState<string>('');
  const { suggestedKeys, updateSuggestedKeys } = useGroupsPageStore(s => ({
    suggestedKeys: s.suggestedKeys,
    updateSuggestedKeys: s.updateSuggestedKeys,
  }));

  const handleRemoveKey = async (id: number) => {
    await db.execute('DELETE FROM suggested_item_keys WHERE id = $1', [id]);
    updateSuggestedKeys();
  };

  const handleAddKey = async () => {
    if (suggestedKeys?.find(k => k.name === input)) {
      notifications.add({
        color: 'red',
        message: 'This property already exists',
        autoClose: 3000,
      });
      return;
    }

    await db.execute(
      'INSERT INTO suggested_item_keys (groupId, name) VALUES ($1, $2)',
      [props.groupId, input]
    );
    updateSuggestedKeys();
  };

  return (
    <Modal title='Edit Suggested Properties'>
      <Stack>
        <Text size='sm'>
          Add properties to automatically suggest when creating a new item
        </Text>
        {suggestedKeys?.map(key => (
          <OptionLabelBox
            key={`suggested_key_${key.id}`}
            label={key.name}
            options={[
              {
                label: 'Remove',
                icon: IconX,
                onClick: () => {
                  handleRemoveKey(key.id);
                },
              },
            ]}
          />
        ))}
        <Divider />
        <Group
          justify='space-between'
          align='center'
          grow
          preventGrowOverflow={false}
          wrap='nowrap'
        >
          <TextInput
            placeholder='Add new property'
            value={input}
            onChange={e => setInput(e.currentTarget.value)}
          />
          <Button onClick={handleAddKey}>Add</Button>
        </Group>
      </Stack>
    </Modal>
  );
};
