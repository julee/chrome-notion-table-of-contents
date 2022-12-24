import React, { useEffect } from 'react';
import { throttle } from 'throttle-debounce';
import { THROTTLE_TIME } from '../../constants';
import { FoldIcon } from '../FoldIcon';
import { useHasScrollBar } from './hooks';

const defaultMaxHeight = '30vh';
const expandedMaxHeight = 'calc(100vh - 213px)';

export const ExpandButton = ({
  maxHeight,
  setMaxHeight,
  tocUpdatedAt,
}: {
  maxHeight: string;
  setMaxHeight: React.Dispatch<React.SetStateAction<string>>;
  tocUpdatedAt: number;
}) => {
  const [hasScrollbar, setHasScrollbar] = useHasScrollBar();

  // set hasScrollbar
  useEffect(() => {
    window.addEventListener('resize', throttle(setHasScrollbar, THROTTLE_TIME));
  }, []);
  useEffect(() => {
    setHasScrollbar(); // setTocUpdatedAt する側で throttle してるので、ここでは間引かない
  }, [tocUpdatedAt]);

  const handleClick = () => {
    setMaxHeight((prevHeight) => {
      return prevHeight === defaultMaxHeight
        ? expandedMaxHeight
        : defaultMaxHeight;
    });
  };

  return hasScrollbar ? (
    <div className="toc-expand-button" onClick={() => handleClick()}>
      <FoldIcon direction={maxHeight === defaultMaxHeight ? 'down' : 'up'} />
    </div>
  ) : null;
};
