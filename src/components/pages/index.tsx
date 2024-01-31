import { PAGES } from '@/constants';
import { useMainStore } from '@/stores/useMainStore';
import { FC } from 'react';
import { GroupsPage } from './groups';
import { OrderPage } from './order';

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

export { GroupsPage, OrderPage };
