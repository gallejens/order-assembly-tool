import { PAGES } from '@/constants';
import { useMainStore } from '@/stores/useMainStore';
import { ObjEntries } from '@/types/util';
import { Tooltip, UnstyledButton, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSun, TablerIconsProps } from '@tabler/icons-react';
import { FC } from 'react';
import styles from './navbar.module.scss';

const NavbarButton: FC<{
  label: string;
  onClick: () => void;
  icon: React.ComponentType<TablerIconsProps>;
  active?: boolean;
}> = props => {
  return (
    <Tooltip
      label={props.label}
      position='right'
      transitionProps={{ duration: 0 }}
    >
      <UnstyledButton
        onClick={props.onClick}
        className={styles.button}
        data-active={!!props.active}
      >
        <props.icon stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
};

export const Navbar: FC = () => {
  const { activePage, setActivePage } = useMainStore();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const usingDarkMode = colorScheme === 'dark';

  return (
    <div className={styles.navbar}>
      <div className={styles.list}>
        {(Object.entries(PAGES) as ObjEntries<typeof PAGES>).map(
          ([page, { label, icon }]) => (
            <NavbarButton
              key={page}
              label={label}
              icon={icon}
              onClick={() => {
                setActivePage(page);
              }}
              active={activePage === page}
            />
          )
        )}
      </div>
      <NavbarButton
        label={usingDarkMode ? 'Light Mode' : 'Dark Mode'}
        onClick={toggleColorScheme}
        icon={usingDarkMode ? IconSun : IconMoon}
      />
    </div>
  );
};
