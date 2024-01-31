import { PAGES } from '@/constants';
import { useMainStore } from '@/stores/useMainStore';
import { FC } from 'react';

import styles from './page.module.scss';

export const ActivePage: FC = () => {
  const { activePage } = useMainStore();

  const page = PAGES[activePage];

  return (
    <div className={styles.page_wrapper}>
      <page.component />
    </div>
  );
};
