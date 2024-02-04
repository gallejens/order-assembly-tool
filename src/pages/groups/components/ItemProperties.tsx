import { useDatabase } from '@/hooks/useDatabase';
import type { FC } from 'react';

type Props = {
  itemId: number;
};

export const ItemProperties: FC<Props> = props => {
  const { data: itemKeys } = useDatabase('getItemKeysByItemId', [props.itemId]);

  return <div>{JSON.stringify(itemKeys)}</div>;
};
