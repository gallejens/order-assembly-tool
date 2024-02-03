import type { ComponentType, FC, PropsWithChildren } from 'react';

import { Title } from '@mantine/core';
import type { TablerIconsProps } from '@tabler/icons-react';
import classNames from 'classnames';
import { IconButton } from '../iconbutton';
import { Resizeable } from '../resizeable';
import styles from './sidebar.module.scss';

type Props = {
  title: string;
  icon: ComponentType<TablerIconsProps>;
  onClick: () => void;
  sizeStorageKey?: string;
  className?: string;
};

export const Sidebar: FC<PropsWithChildren<Props>> = props => {
  return (
    <Resizeable
      direction={{ right: true }}
      className={styles.sidebar}
      initialWidth='250px'
      minWidth='200px'
      maxWidth='400px'
      storageKey={props.sizeStorageKey}
    >
      <div className={styles.header}>
        <Title size='1.2rem'>{props.title}</Title>
        <IconButton onClick={props.onClick} icon={props.icon} size='2rem' />
      </div>
      <div className={classNames(styles.content, props.className)}>
        {props.children}
      </div>
    </Resizeable>
  );
};
