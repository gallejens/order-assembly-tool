import { type FC, type PropsWithChildren, useEffect, useRef } from 'react';

import classNames from 'classnames';
import styles from './resizeable.module.scss';

type Direction = 'right' | 'bottom';

type Props = {
  initialWidth?: string;
  initialHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
  minWidth?: string;
  minHeight?: string;
  direction: Partial<Record<Direction, boolean>>;
  className?: string;
  storageKey?: string;
};

const DIRECTION_INFO = {
  right: {
    eventKey: 'clientX',
    rectKey: 'left',
    styleKey: 'width',
  },
  bottom: {
    eventKey: 'clientY',
    rectKey: 'top',
    styleKey: 'height',
  },
} as const;

export const Resizeable: FC<PropsWithChildren<Props>> = props => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dirRef = useRef<Direction | null>(null); // we use ref because doesnt need to be state as only used to update css

  const directions = Object.entries(props.direction)
    .filter(([, value]) => value)
    .map(([key]) => key as Direction);

  useEffect(() => {
    if (!containerRef.current) return;

    // load saved size in storage if key is provided
    if (props.storageKey) {
      const savedWidth = localStorage.getItem(
        `resizeable-width-${props.storageKey}`
      );
      const savedHeight = localStorage.getItem(
        `resizeable-height-${props.storageKey}`
      );

      if (savedWidth) containerRef.current.style.width = savedWidth;
      if (savedHeight) containerRef.current.style.height = savedHeight;
    }

    // register mouseup handler, seperate from other useEffect to fix quick click not registering
    const mouseUpHandler = () => {
      if (!containerRef.current) return;

      if (props.storageKey && dirRef.current !== null) {
        const value =
          containerRef.current.style[DIRECTION_INFO[dirRef.current].styleKey];
        localStorage.setItem(
          `resizeable-${DIRECTION_INFO[dirRef.current].styleKey}-${
            props.storageKey
          }`,
          value
        );
      }

      dirRef.current = null;
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      if (!containerRef.current || !dirRef.current) return;

      const directionInfo = DIRECTION_INFO[dirRef.current];
      const containerRect = containerRef.current.getBoundingClientRect();
      const movement = e[directionInfo.eventKey];
      const newCoord = movement - containerRect[directionInfo.rectKey];

      containerRef.current.style[directionInfo.styleKey] = `${newCoord}px`;
    };

    window.addEventListener('mouseup', mouseUpHandler);
    window.addEventListener('mousemove', mouseMoveHandler);

    return () => {
      window.removeEventListener('mouseup', mouseUpHandler);
      window.removeEventListener('mousemove', mouseMoveHandler);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={classNames(props.className, styles.resizeable)}
      style={{
        width: props.initialWidth,
        height: props.initialHeight,
        maxWidth: props.maxWidth,
        maxHeight: props.maxHeight,
        minWidth: props.minWidth,
        minHeight: props.minHeight,
      }}
    >
      {props.children}
      {directions.map(dir => (
        <div
          key={dir}
          className={styles[dir]}
          onMouseDown={() => {
            dirRef.current = dir;
          }}
        />
      ))}
    </div>
  );
};
