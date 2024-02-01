import { Button, Group } from '@mantine/core';
import { FC } from 'react';
import { Modal } from '.';

type Props = {
  title: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

export const ConfirmModal: FC<Props> = props => {
  return (
    <Modal title={props.title} onClose={props.onCancel}>
      <Group justify='flex-end' mt='md'>
        <Button type='submit' onClick={props.onConfirm}>
          Confirm
        </Button>
      </Group>
    </Modal>
  );
};
