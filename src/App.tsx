import { MantineProvider } from '@mantine/core';
import { FC } from 'react';
import { Navbar } from './components/navbar';
import { theme } from './theme';

import '@mantine/core/styles.css';
import { ColorschemeOverlay } from './components/colorschemeoverlay';

export const App: FC = () => {
  return (
    <MantineProvider theme={theme} defaultColorScheme='dark'>
      <Navbar />
      <ColorschemeOverlay />
    </MantineProvider>
  );
};
