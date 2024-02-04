import type { TablerIconsProps } from '@tabler/icons-react';
import classNames from 'classnames';
import type { ComponentType, FC, PropsWithChildren } from 'react';
import { Header } from '../header';
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
      <Header
        title={props.title}
        rightSide={
          <IconButton onClick={props.onClick} icon={props.icon} size='2rem' />
        }
      />
      <div className={classNames(styles.content, props.className)}>
        {props.children}
      </div>
    </Resizeable>
  );
};
