import React, { useEffect } from 'react';
import { throttle } from 'throttle-debounce';
import { ACTION, THROTTLE_TIME } from '../../constants';
import { FoldIcon } from '../FoldIcon/FoldIcon';
import './styles.pcss';

export const ExpandTailButton = ({
  tailFolded,
  showsExpandTailButton,
  dispatch,
}: {
  tailFolded: boolean;
  showsExpandTailButton: boolean;
  dispatch: React.Dispatch<{ type: string }>;
}) => {
  // set hasScrollbar
  useEffect(() => {
    const fn = throttle(
      () => dispatch({ type: ACTION.RESIZED }),
      THROTTLE_TIME,
    );
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  if (!showsExpandTailButton) return null;

  return (
    <div
      className="toc-expand-tail-button"
      onClick={() => dispatch({ type: ACTION.TAIL_FOLDED_BUTTON_CLICKED })}
    >
      <FoldIcon direction={tailFolded ? 'down' : 'up'} />
    </div>
  );
};
