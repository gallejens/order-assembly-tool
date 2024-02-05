import classNames from 'classnames';
import type { FC, PropsWithChildren } from 'react';

import styles from './box.module.scss';

type Props = {
  selected?: boolean;
  onClick?: () => void;
  className?: string;
};

export const Box: FC<PropsWithChildren<Props>> = props => {
  return (
    <div
      onClick={props.onClick}
      className={classNames(
        styles.box,
        props.selected && 'selected',
        props.className
      )}
    >
      {props.children}
    </div>
  );
};
