import React, { useEffect } from 'react';
import { throttle } from 'throttle-debounce';
import { THROTTLE_TIME } from '../../constants';
import { usePageChangeEvent } from '../../hooks';
import { FoldIcon } from '../FoldIcon';
import { useHasScrollBar } from './hooks';

export const ExpandButton = ({
  tocUpdatedAt,
  isWhileFolded,
  tailFolded,
  setTailFolded,
}: {
  tocUpdatedAt: number;
  isWhileFolded: boolean;
  tailFolded: boolean;
  setTailFolded: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { hasScrollbar, setHasScrollbar } = useHasScrollBar();

  // set hasScrollbar
  useEffect(() => {
    const fn = throttle(setHasScrollbar, THROTTLE_TIME);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  useEffect(() => {
    setHasScrollbar(); // setTocUpdatedAt する側で throttle してるので、ここでは間引かない
  }, [tocUpdatedAt, isWhileFolded]);

  // ページ遷移したら畳む
  usePageChangeEvent(() => {
    setTailFolded(true);
  });

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
