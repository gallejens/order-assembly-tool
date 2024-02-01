import { PAGES } from '@/constants';
import { useMainStore } from '@/stores/useMainStore';
import { ObjEntries } from '@/types/util';
import { useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { FC } from 'react';
import { IconButton } from '../iconbutton';
import styles from './navbar.module.scss';

export const Navbar: FC = () => {
  const { activePage, setActivePage } = useMainStore();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const usingDarkMode = colorScheme === 'dark';

  return (
    <div className={styles.navbar}>
      <div className={styles.list}>
        {(Object.entries(PAGES) as ObjEntries<typeof PAGES>).map(
          ([page, { label, icon }]) => (
            <IconButton
              key={page}
              tooltip={{ label, position: 'right' }}
              icon={icon}
              onClick={() => {
                setActivePage(page);
              }}
              active={activePage === page}
              size={'calc(100% - 1rem)'}
            />
          )
        )}
      </div>
      <IconButton
        tooltip={{
          label: usingDarkMode ? 'Light Mode' : 'Dark Mode',
          position: 'right',
        }}
        onClick={toggleColorScheme}
        icon={usingDarkMode ? IconSun : IconMoon}
        size={'calc(100% - 1rem)'}
      />
    </div>
  );
};
