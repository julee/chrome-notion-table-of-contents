import React, { useEffect } from 'react';
import { throttle } from 'throttle-debounce';
import { THROTTLE_TIME } from '../../constants';
import { FoldIcon } from '../FoldIcon';
import { useHasScrollBar } from './hooks';

export const ExpandButton = ({
  toggleMaxHeight,
  isDefaultMaxHeight,
  tocUpdatedAt,
}: {
  toggleMaxHeight: () => void;
  isDefaultMaxHeight: boolean;
  tocUpdatedAt: number;
}) => {
  const { hasScrollbar, setHasScrollbar } = useHasScrollBar();

  // set hasScrollbar
  useEffect(() => {
    window.addEventListener('resize', throttle(setHasScrollbar, THROTTLE_TIME));
  }, []);
  useEffect(() => {
    setHasScrollbar(); // setTocUpdatedAt する側で throttle してるので、ここでは間引かない
  }, [tocUpdatedAt]);

  return hasScrollbar ? (
    <div className="toc-expand-button" onClick={() => toggleMaxHeight()}>
      <FoldIcon direction={isDefaultMaxHeight ? 'down' : 'up'} />
    </div>
  ) : null;
};
