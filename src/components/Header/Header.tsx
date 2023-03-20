import { useAtomValue, useSetAtom } from 'jotai';
import React, { memo } from 'react';
import { handleWholeFoldButtonClickAtom, wholeFoldedAtom } from '../../atoms';
import { FoldIcon } from '../FoldIcon/FoldIcon';
import './styles.pcss';

export default memo(function Headings() {
  const wholeFolded = useAtomValue(wholeFoldedAtom);

  const handleWholeFoldButtonClick = useSetAtom(handleWholeFoldButtonClickAtom);

  return (
    <div
      className="toc-header toc-clickable"
      onClick={() => handleWholeFoldButtonClick()}
    >
      <FoldIcon direction={wholeFolded ? 'right' : 'down'} />
      <span className="toc-title">
        {chrome.i18n.getMessage('TABLE_OF_CONTENTS')}
      </span>
    </div>
  );
});
