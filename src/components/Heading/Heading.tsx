import React, { memo } from 'react';
import { $, getContainer } from '../../utils';
import './styles.pcss';

export default memo(function Heading({
  blockId,
  isFocused,
  level,
  text,
}: Heading) {
  const scrollToHeading = (blockId: string) => {
    const heading = $(`[data-block-id="${blockId}"]`);
    getContainer().scroll({
      top: heading.offsetTop,
    });
  };

  return (
    <div
      className={`toc-h${level} toc-heading toc-clickable ${
        isFocused ? 'toc-focused' : ''
      }`}
      key={blockId}
      onClick={() => {
        location.hash = '#' + blockId.replaceAll('-', '');
        setTimeout(() => {
          scrollToHeading(blockId);
        }, 0);
      }}
    >
      {text}
    </div>
  );
});
