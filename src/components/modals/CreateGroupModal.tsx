import { notifications } from '@/components/notifications';
import { db } from '@/lib/db';
import { Button, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { FC } from 'react';
import { Modal } from '.';

type FormValues = {
  name: string;
};

type Props = {
  onConfirm: () => void;
};

export const CreateGroupModal: FC<Props> = props => {
  const form = useForm<FormValues>({
    initialValues: {
      name: '',
    },
    validate: {
      name: value => (value.trim().length > 0 ? null : 'Name is required'),
    },
  });

  const handleCreate = async (values: FormValues) => {
    await db.execute('INSERT INTO groups (label) VALUES ($1)', [values.name]);
    notifications.add({
      title: 'Group Created',
      message: `Group "${values.name}" was successfully created`,
      autoClose: 3000,
    });
    props.onConfirm();
  };

  return (
    <Modal title='Create New Group'>
      <form onSubmit={form.onSubmit(handleCreate)}>
        <TextInput withAsterisk label='Name' {...form.getInputProps('name')} />
        <Group justify='flex-end' mt='md'>
          <Button type='submit'>Create</Button>
        </Group>
      </form>
    </Modal>
  );
};
