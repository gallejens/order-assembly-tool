import {
  IconBoxMultiple,
  IconHome,
  IconTruckDelivery,
  TablerIconsProps,
} from '@tabler/icons-react';
import { GroupsPage } from './pages/groups';
import { HomePage } from './pages/home';
import { OrderPage } from './pages/order';

export type Page = keyof typeof PAGES;

export const PAGES = {
  home: {
    label: 'Home',
    icon: IconHome,
    component: HomePage,
  },
  groups: {
    label: 'Groups',
    icon: IconBoxMultiple,
    component: GroupsPage,
  },
  order: {
    label: 'Order',
    icon: IconTruckDelivery,
    component: OrderPage,
  },
} satisfies Record<
  string,
  {
    label: string;
    icon: React.ComponentType<TablerIconsProps>;
    component: React.ComponentType;
  }
>;
