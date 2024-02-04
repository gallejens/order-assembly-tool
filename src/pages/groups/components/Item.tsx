import { useDatabase } from '@/hooks/useDatabase';
import { SegmentedControl } from '@mantine/core';
import { IconBox, IconFilter, IconSitemap } from '@tabler/icons-react';
import { type ComponentType, type FC, useState } from 'react';
import { useGroupsPageStore } from '../stores/useGroupsPage';
import { ItemFilters } from './ItemFilters';
import { ItemProducts } from './ItemProducts';
import { ItemProperties } from './ItemProperties';

import { Header } from '@/components/header';
import styles from '../styles/item.module.scss';

const TABS: Record<
  string,
  {
    label: JSX.Element;
    component: ComponentType;
  }
> = {
  properties: {
    label: (
      <div className={styles.tab_button}>
        <IconSitemap />
        <span>Properties</span>
      </div>
    ),
    component: ItemProperties,
  },
  filters: {
    label: (
      <div className={styles.tab_button}>
        <IconFilter />
        <span>Filters</span>
      </div>
    ),
    component: ItemFilters,
  },
  products: {
    label: (
      <div className={styles.tab_button}>
        <IconBox />
        <span>Products</span>
      </div>
    ),
    component: ItemProducts,
  },
};

export const Item: FC = () => {
  const { selectedItem: itemId } = useGroupsPageStore();
  const [tab, setTab] = useState(Object.keys(TABS)[0]);

  const { data: itemDataResult } = useDatabase('getItemLabelById', [itemId]);
  const { data: itemKeys } = useDatabase('getItemKeysByItemId', [itemId]);

  const loading = itemDataResult === null || itemKeys === null;

  if (loading) return <div>Loading...</div>;

  const itemLabel = itemDataResult[0].label;
  const selectedTab = TABS[tab];

  return (
    <div className={styles.item}>
      <Header
        title={itemLabel}
        rightSide={
          <SegmentedControl
            value={tab}
            onChange={setTab}
            data={Object.entries(TABS).map(([key, { label }]) => ({
              value: key,
              label,
            }))}
            size='xs'
            color='primary'
          />
        }
      />
      <selectedTab.component />
    </div>
  );
};
