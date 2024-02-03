import { useDatabase } from '@/hooks/useDatabase';
import type { FC } from 'react';
import { useGroupsPageStore } from '../stores/useGroupsPage';

import styles from '../styles/item.module.scss';

export const Item: FC = () => {
  const { selectedItem: itemId } = useGroupsPageStore();

  const { data: itemDataResult } = useDatabase('getItemLabelById', [itemId]);
  const { data: itemKeys } = useDatabase('getItemKeysByItemId', [itemId]);

  if (itemKeys === null) return <div>Loading...</div>;

  return (
    <div className={styles.item}>
      {itemDataResult?.[0]?.label ?? 'Loading...'}
      {itemKeys.map(({ id, name }) => (
        <>
          <p>{`${id}: ${name}`}</p>
          <br />
        </>
      ))}
    </div>
  );
};
