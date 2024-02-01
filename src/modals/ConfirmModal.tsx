import { Modal } from '@/components/modals';
import { Button } from '@mantine/core';
import { FC } from 'react';

type Props = {
  title: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

export const ConfirmModal: FC<Props> = props => {
  return (
    <Modal title={props.title} onClose={props.onCancel}>
      <Button type='submit' onClick={props.onConfirm}>
        Confirm
      </Button>
    </Modal>
  );
};
