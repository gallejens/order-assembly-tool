import { Menu, Text } from '@mantine/core';
import { IconMenu2, type TablerIconsProps } from '@tabler/icons-react';
import classNames from 'classnames';
import { type FC } from 'react';
import styles from './optionlabelbox.module.scss';

type Props = {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  options?: {
    label: string;
    icon: FC<TablerIconsProps>;
    onClick: () => void;
  }[];
};

export const OptionLabelBox: FC<Props> = props => {
  return (
    <div
      onClick={props.onClick}
      className={classNames(
        styles.option_label_box,
        props.selected && 'selected',
        props.className
      )}
    >
      <Text size='md' truncate='end'>
        {props.label}
      </Text>
      <Menu width={250}>
        <Menu.Target>
          <IconMenu2
            stroke={1.5}
            size='1.4rem'
            onClick={e => {
              e.stopPropagation();
            }}
          />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Options</Menu.Label>
          {(props.options ?? []).map((option, i) => (
            <Menu.Item
              key={`menu_option_${i}`}
              leftSection={<option.icon style={{ width: '1.3rem' }} />}
              onClick={option.onClick}
            >
              {option.label}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};
