import { MantineProvider } from '@mantine/core';
import { FC } from 'react';
import { Navbar } from './components/navbar';
import { ActivePage } from './components/pages';
import { theme } from './theme';

import styles from './styles/app.module.scss';

export const App: FC = () => {
  return (
    <MantineProvider theme={theme} defaultColorScheme='dark'>
      <div className={styles.app_shell}>
        <Navbar />
        <ActivePage />
      </div>
    </MantineProvider>
  );
};
