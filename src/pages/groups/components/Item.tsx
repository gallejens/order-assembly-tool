import { useDatabase } from '@/hooks/useDatabase';
import { Loader, SegmentedControl, Text } from '@mantine/core';
import { IconBox, IconFilter, IconSitemap } from '@tabler/icons-react';
import { type FC, useState } from 'react';
import { useGroupsPageStore } from '../stores/useGroupsPage';
import { ItemFilters } from './ItemFilters';
import { ItemProducts } from './ItemProducts';
import { ItemProperties } from './ItemProperties';

import { Header } from '@/components/header';
import styles from '../styles/item.module.scss';

const TABS = [
  {
    value: 'properties',
    label: (
      <div className={styles.tab_button}>
        <IconSitemap size='1rem' />
        <Text size='xs'>Properties</Text>
      </div>
    ),
    component: ItemProperties,
  },
  {
    value: 'filters',
    label: (
      <div className={styles.tab_button}>
        <IconFilter size='1rem' />
        <Text size='xs'>Filters</Text>
      </div>
    ),
    component: ItemFilters,
  },
  {
    value: 'products',
    label: (
      <div className={styles.tab_button}>
        <IconBox size='1rem' />
        <Text size='xs'>Products</Text>
      </div>
    ),
    component: ItemProducts,
  },
];

export const Item: FC = () => {
  const { selectedItem: itemId } = useGroupsPageStore();
  const [tab, setTab] = useState(TABS[0].value);
  const { data: itemDataResult } = useDatabase('getItemLabelById', [itemId]);

  const selectedTab = TABS.find(({ value }) => value === tab);

  if (itemId === null) {
    throw new Error('Item ID is not provided');
  }

  const itemLabel = itemDataResult?.[0]?.label ?? 'Loading';

  return (
    <div className={styles.item}>
      <Header
        title={itemLabel}
        rightSide={
          <SegmentedControl
            className='shadow'
            value={tab}
            onChange={setTab}
            data={TABS}
            size='xs'
            color='primary'
          />
        }
      />
      {selectedTab === undefined ? (
        <Loader />
      ) : (
        <selectedTab.component
          itemId={itemId}
          itemLabel={itemLabel}
          key={`item_${itemId}`}
        />
      )}
    </div>
  );
};
