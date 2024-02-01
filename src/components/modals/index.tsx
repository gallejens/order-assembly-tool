import { useMainStore } from '@/stores/useMainStore';
import { Modal as MantineModal } from '@mantine/core';
import { FC, PropsWithChildren } from 'react';
import { ConfirmModal } from './ConfirmModal';
import { CreateGroupModal } from './CreateGroupModal';
import { RetypConfirmModal } from './RetypConfirmModal';

export const Modals: FC = () => {
  const { modal } = useMainStore();

  if (modal === null) return null;

  return <>{modal.component}</>;
};

export const Modal: FC<
  PropsWithChildren & {
    title: string;
    onClose?: () => void;
  }
> = props => {
  const { closeModal } = useMainStore();

  return (
    <MantineModal
      opened
      centered
      closeOnClickOutside={false}
      closeOnEscape={false}
      title={props.title}
      onClose={() => {
        closeModal();
        props.onClose?.();
      }}
    >
      {props.children}
    </MantineModal>
  );
};

export { ConfirmModal, CreateGroupModal, RetypConfirmModal };
