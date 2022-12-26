import React, { useEffect, useState } from 'react';
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
  const [folded, setFolded] = useState(true);

  // set hasScrollbar
  useEffect(() => {
    const fn = throttle(setHasScrollbar, THROTTLE_TIME);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  useEffect(() => {
    setHasScrollbar(); // setTocUpdatedAt する側で throttle してるので、ここでは間引かない
  }, [tocUpdatedAt]);

  return !folded || hasScrollbar ? (
    <div
      className="toc-expand-button"
      onClick={() => {
        setFolded(!folded);
        toggleMaxHeight();
      }}
    >
      <FoldIcon direction={isDefaultMaxHeight ? 'down' : 'up'} />
    </div>
  ) : null;
};
