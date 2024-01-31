import { notifications } from '@/components/notifications';
import { useDatabase } from '@/hooks/useDatabase';
import { db } from '@/lib/db';
import { Database } from '@/types/db';
import { Button, Group, Modal, TextInput, UnstyledButton } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPlus } from '@tabler/icons-react';
import { FC, useState } from 'react';
import styles from './groups.module.scss';

type CreateFormValues = {
  name: string;
};

export const GroupsPage: FC = () => {
  const [modelOpen, setModalOpen] = useState(false);
  const { data: dbGroups, refresh } = useDatabase<Database.GroupsTable[]>(
    'SELECT * FROM groups'
  );

  const createForm = useForm<CreateFormValues>({
    initialValues: {
      name: '',
    },
    validate: {
      name: value => (value.trim().length > 0 ? null : 'Name is required'),
    },
  });

  const handleCreate = async (values: CreateFormValues) => {
    setModalOpen(false);
    await db.execute('INSERT INTO groups (label) VALUES ($1)', [values.name]);
    refresh();
    notifications.add({
      title: 'Group Created',
      message: `Group "${values.name}" was successfully created`,
      autoClose: 3000,
    });
  };

  if (dbGroups === null) return null;

  return (
    <>
      <div className={styles.groups_page}>
        {dbGroups.map(group => (
          <UnstyledButton
            key={`group-${group.id}`}
            onClick={() => {
              console.log(group.id);
            }}
            className={styles.grid_item}
          >
            {group.label}
          </UnstyledButton>
        ))}
      </div>
      <UnstyledButton
        onClick={() => setModalOpen(true)}
        className={styles.create_button}
      >
        <IconPlus />
      </UnstyledButton>
      <Modal
        opened={modelOpen}
        onClose={() => setModalOpen(false)}
        title='Create New Group'
        centered
      >
        <form onSubmit={createForm.onSubmit(handleCreate)}>
          <TextInput
            withAsterisk
            label='Name'
            {...createForm.getInputProps('name')}
          />
          <Group justify='flex-end' mt='md'>
            <Button type='submit'>Create</Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};
