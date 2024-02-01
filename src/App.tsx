import { MantineProvider } from '@mantine/core';
import { FC } from 'react';
import { Modals } from './components/modals';
import { Navbar } from './components/navbar';
import { Notifications } from './components/notifications';
import { ActivePage } from './pages';
import { theme } from './theme';

import styles from './styles/app.module.scss';

export const App: FC = () => {
  return (
    <MantineProvider theme={theme} defaultColorScheme='dark'>
      <div className={styles.app_shell}>
        <Navbar />
        <ActivePage />
      </div>
      <Notifications />
      <Modals />
    </MantineProvider>
  );
};
