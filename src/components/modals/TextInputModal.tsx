import { Button, Divider, Group, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { FC } from 'react';
import { Modal } from '.';

type FormValues = {
  value: string;
};

type Props = {
  title: string;
  text?: string;
  inputLabel: string;
  buttonLabel: string;
  onConfirm: (label: string) => void;
};

export const TextInputModal: FC<Props> = props => {
  const form = useForm<FormValues>({
    initialValues: {
      value: '',
    },
    validate: {
      value: value => (value.trim().length > 0 ? null : 'Field is required'),
    },
  });

  return (
    <Modal title={props.title}>
      <form
        onSubmit={form.onSubmit(({ value }) => {
          props.onConfirm(value);
        })}
      >
        {props.text && (
          <>
            <Text size='sm'>{props.text}</Text>
            <Divider my='xs' />
          </>
        )}
        <TextInput
          withAsterisk
          label={props.inputLabel}
          {...form.getInputProps('value')}
        />
        <Group justify='flex-end' mt='md'>
          <Button type='submit'>{props.buttonLabel}</Button>
        </Group>
      </form>
    </Modal>
  );
};
