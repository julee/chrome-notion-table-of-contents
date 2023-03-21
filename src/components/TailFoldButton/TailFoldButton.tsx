import { useAtomValue, useSetAtom } from 'jotai';
import React, { memo } from 'react';
import {
  handleTailFoldButtonClickAtom,
  showsTailFoldButtonAtom,
  tailFoldedAtom,
} from '../../atoms';
import { FoldIcon } from '../FoldIcon/FoldIcon';
import './styles.pcss';

export default memo(function TailFoldButton() {
  const tailFolded = useAtomValue(tailFoldedAtom);
  const showsTailFoldButton = useAtomValue(showsTailFoldButtonAtom);

  const handleTailFoldButtonClick = useSetAtom(handleTailFoldButtonClickAtom);

  return showsTailFoldButton ? (
    <div
      className="toc-tail-fold-button"
      onClick={() => {
        handleTailFoldButtonClick();
      }}
    >
      <FoldIcon direction={tailFolded ? 'down' : 'up'} />
    </div>
  ) : null;
});
