import { Tooltip, TooltipProps, UnstyledButton } from '@mantine/core';
import { TablerIconsProps } from '@tabler/icons-react';
import { type MouseEvent, forwardRef } from 'react';

import classNames from 'classnames';
import styles from './iconbutton.module.scss';

type Props = {
  tooltip?: {
    label: string;
    position?: TooltipProps['position'];
    openDelay?: number;
    closeDelay?: number;
  };
  onClick: () => void;
  active?: boolean;
  icon: React.ComponentType<TablerIconsProps>;
  size: string;
};

export const IconButton = forwardRef<HTMLButtonElement, Props>(props => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    props.onClick();
  };

  const buttonElement = (
    <UnstyledButton
      onClick={handleClick}
      className={classNames(styles.icon_button, props.active && 'selected')}
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
      openDelay={props.tooltip.openDelay}
      closeDelay={props.tooltip.closeDelay}
    >
      {buttonElement}
    </Tooltip>
  );
});
