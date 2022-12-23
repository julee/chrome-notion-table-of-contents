import React from 'react';
import { FoldIcon } from '../FoldIcon';

export default function Headings({
  folded,
  setFolded,
}: {
  folded: boolean;
  setFolded: (valOrCb: ((val: boolean) => boolean) | boolean) => void;
}) {
  return (
    <div
      className="toc-header toc-clickable"
      onClick={() => setFolded(!folded)}
    >
      <FoldIcon direction={folded ? 'right' : 'down'} />
      <span className="toc-title">
        {chrome.i18n.getMessage('TABLE_OF_CONTENTS')}
      </span>
    </div>
  );
}
