import React from 'react';
import { ACTION } from '../../constants';
import { FoldIcon } from '../FoldIcon/FoldIcon';
import './styles.pcss';

export default function Headings({
  wholeFolded,
  dispatch,
}: {
  wholeFolded: boolean;
  dispatch: React.Dispatch<{ type: string }>;
}) {
  return (
    <div
      className="toc-header toc-clickable"
      onClick={() => dispatch({ type: ACTION.WHOLE_FOLDED_BUTTON_CLICKED })}
    >
      <FoldIcon direction={wholeFolded ? 'right' : 'down'} />
      <span className="toc-title">
        {chrome.i18n.getMessage('TABLE_OF_CONTENTS')}
      </span>
    </div>
  );
}
