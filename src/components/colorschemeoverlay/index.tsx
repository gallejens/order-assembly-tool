import { Button, useMantineColorScheme } from '@mantine/core';
import { FC } from 'react';

export const ColorschemeOverlay: FC = () => {
  const { toggleColorScheme } = useMantineColorScheme();

  return (
    <>
      <div style={{ position: 'absolute', top: 0, right: 0 }}>
        <Button onClick={toggleColorScheme}>Colorscheme</Button>
      </div>
    </>
  );
};
