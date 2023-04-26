import React, { memo } from 'react';
import './styles.pcss';

export default memo(function Heading({
  blockId,
  isFocused,
  level,
  text,
}: Heading) {
  return (
    <div
      className={`toc-h${level} toc-heading toc-clickable ${
        isFocused ? 'toc-focused' : ''
      }`}
      key={blockId}
      onClick={() => {
        location.hash = '#' + blockId;
      }}
    >
      {text}
    </div>
  );
});
