import type { FC } from 'react';

import { Title } from '@mantine/core';
import styles from './header.module.scss';

type Props = {
  title: string;
  rightSide: JSX.Element;
};

export const Header: FC<Props> = props => {
  return (
    <div className={styles.header}>
      <Title size='1.2rem'>{props.title}</Title>
      {props.rightSide}
    </div>
  );
};
