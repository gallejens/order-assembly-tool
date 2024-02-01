import { Tooltip, TooltipProps, UnstyledButton } from '@mantine/core';
import { TablerIconsProps } from '@tabler/icons-react';
import { FC, type MouseEvent } from 'react';

import styles from './iconbutton.module.scss';

type Props = {
  tooltip?: {
    label: string;
    position: TooltipProps['position'];
  };
  onClick: () => void;
  active?: boolean;
  icon: React.ComponentType<TablerIconsProps>;
  size: string;
};

export const IconButton: FC<Props> = props => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    props.onClick();
  };

  const buttonElement = (
    <UnstyledButton
      onClick={handleClick}
      className={styles.icon_button}
      data-active={!!props.active}
      style={{ width: props.size }}
    >
      <props.icon stroke={1.5} />
    </UnstyledButton>
  );

  return props.tooltip === undefined ? (
    buttonElement
  ) : (
    <Tooltip
      label={props.tooltip.label}
      position={props.tooltip.position}
      transitionProps={{ transition: 'pop' }}
      withArrow
      arrowSize={6}
    >
      {buttonElement}
    </Tooltip>
  );
};
