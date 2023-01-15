import React, { useEffect, useState } from 'react';
import { throttle } from 'throttle-debounce';
import { THROTTLE_TIME } from '../../constants';
import { usePageChangeEvent } from '../../hooks';
import { useMaxheight } from '../App/hooks';
import { FoldIcon } from '../FoldIcon';
import { useHasScrollBar } from './hooks';

export const ExpandButton = ({
  tocUpdatedAt,
  setMaxHeight,
  isContainerFolded,
}: {
  tocUpdatedAt: number;
  setMaxHeight: ReturnType<typeof useMaxheight>['setMaxHeight'];
  isContainerFolded: boolean;
}) => {
  const { hasScrollbar, setHasScrollbar } = useHasScrollBar();
  const [tailFolded, setTailFolded] = useState(true);

  // set hasScrollbar
  useEffect(() => {
    const fn = throttle(setHasScrollbar, THROTTLE_TIME);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  useEffect(() => {
    setHasScrollbar(); // setTocUpdatedAt する側で throttle してるので、ここでは間引かない
  }, [tocUpdatedAt, isContainerFolded]);

  // ページ遷移したら畳む
  usePageChangeEvent(() => {
    setTailFolded(true);
    setMaxHeight(({ defaultVal }) => defaultVal);
  });

  return !tailFolded || hasScrollbar ? (
    <div
      className="toc-expand-button"
      onClick={() => {
        setTailFolded(!tailFolded);
        setMaxHeight(({ defaultVal, expanded }) =>
          tailFolded ? expanded : defaultVal,
        );
      }}
    >
      <FoldIcon direction={tailFolded ? 'down' : 'up'} />
    </div>
  ) : null;
};
