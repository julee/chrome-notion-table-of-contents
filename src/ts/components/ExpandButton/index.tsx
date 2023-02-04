import React, { useEffect } from 'react';
import { throttle } from 'throttle-debounce';
import { THROTTLE_TIME } from '../../constants';
import { FoldIcon } from '../FoldIcon';
import { useHasScrollBar } from './hooks';

export const ExpandButton = ({
  tocUpdatedAt,
  isWholeFolded,
  tailFolded,
  setTailFolded,
}: {
  tocUpdatedAt: number;
  isWholeFolded: boolean;
  tailFolded: boolean;
  setTailFolded: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { hasScrollbar, calcHasScrollbar } = useHasScrollBar();

  // set hasScrollbar
  useEffect(() => {
    const fn = throttle(calcHasScrollbar, THROTTLE_TIME);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  useEffect(() => {
    calcHasScrollbar(); // setTocUpdatedAt する側で throttle してるので、ここでは間引かない
  }, [tocUpdatedAt, isWholeFolded]);

  if (tailFolded && !hasScrollbar) return null;

  return (
    <div
      className="toc-expand-button"
      onClick={() => {
        setTailFolded(!tailFolded);
      }}
    >
      <FoldIcon direction={tailFolded ? 'down' : 'up'} />
    </div>
  );
};
