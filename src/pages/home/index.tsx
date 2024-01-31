import { notifications } from '@/components/notifications';
import { Button } from '@mantine/core';
import { FC } from 'react';

import styles from './home.module.scss';

export const HomePage: FC = () => {
  return (
    <div className={styles.home_page}>
      <Button
        onClick={() => {
          notifications.add({
            title: 'Test Notification',
            message: `${new Date().toLocaleTimeString()}`,
          });
        }}
      >
        Test Notification
      </Button>
    </div>
  );
};
