import React from 'react';
import { getContainer, querySelector } from '../utils';

export default function Heading({ blockId, isFocused, level, text }: Heading) {
  const scrollToHeading = () => {
    getContainer().scroll({
      top: querySelector(`[data-block-id="${blockId}"]`).offsetTop,
    });
  };
  return (
    <p
      className={`toc-h${level} toc-heading toc-clickable ${
        isFocused ? 'toc-focused' : ''
      }`}
      key={blockId}
      onClick={() => scrollToHeading()}
    >
      {text}
    </p>
  );
}
