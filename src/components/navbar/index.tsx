import { Tooltip, UnstyledButton } from '@mantine/core';
import {
  IconHome,
  IconPlus,
  IconTestPipe,
  TablerIconsProps,
} from '@tabler/icons-react';
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
  return (
    <div className={styles.navbar}>
      <div className={styles.list}>
        <NavbarButton
          label='Home'
          onClick={() => {
            console.log('home');
          }}
          icon={IconHome}
          active
        />
        <NavbarButton
          label='Create'
          onClick={() => {
            console.log('create');
          }}
          icon={IconPlus}
        />
      </div>
      <NavbarButton
        label='Test'
        onClick={() => {
          console.log('test');
        }}
        icon={IconTestPipe}
      />
    </div>
  );
};
