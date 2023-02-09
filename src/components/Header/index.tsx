import React from 'react';
import { FoldIcon } from '../FoldIcon';
import './styles.pcss';

export default function Headings({
  wholeFolded,
  setWholeFolded,
}: {
  wholeFolded: boolean;
  setWholeFolded: (valOrCb: ((val: boolean) => boolean) | boolean) => void;
}) {
  return (
    <div
      className="toc-header toc-clickable"
      onClick={() => setWholeFolded(!wholeFolded)}
    >
      <FoldIcon direction={wholeFolded ? 'right' : 'down'} />
      <span className="toc-title">
        {chrome.i18n.getMessage('TABLE_OF_CONTENTS')}
      </span>
    </div>
  );
}
