import { Button, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { FC } from 'react';
import { Modal } from '.';

type Props = {
  title: string;
  confirmValue: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

type FormValues = {
  confirm: string;
};

export const RetypConfirmModal: FC<Props> = props => {
  const form = useForm<FormValues>({
    initialValues: {
      confirm: '',
    },
    validate: {
      confirm: value =>
        value === props.confirmValue ? null : 'Input is not correct',
    },
  });

  const handleConfirm = (values: FormValues) => {
    if (values.confirm !== props.confirmValue) return;
    props.onConfirm();
  };

  return (
    <Modal title={props.title} onClose={props.onCancel}>
      <form
        onSubmit={form.onSubmit(handleConfirm)}
        style={{ userSelect: 'none' }}
      >
        <TextInput
          label={`To confirm, type "${props.confirmValue}" in the box below`}
          {...form.getInputProps('confirm')}
        />
        <Group justify='flex-end' mt='md'>
          <Button type='submit'>Confirm</Button>
        </Group>
      </form>
    </Modal>
  );
};
