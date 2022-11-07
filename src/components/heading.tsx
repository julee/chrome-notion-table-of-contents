import React from 'react';
import { getContainer, querySelector } from '../utils';

export default function Heading({ heading: h }: { heading: HeadingType }) {
  const scrollToHeading = () => {
    getContainer().scroll({
      top: querySelector(`[data-block-id="${h.blockId}"]`).offsetTop,
    });
  };
  return (
    <p
      className={`toc-h${h.level} toc-heading toc-clickable ${
        h.isFocused ? 'toc-focused' : ''
      }`}
      key={h.blockId}
      onClick={() => scrollToHeading()}
    >
      {h.text}
    </p>
  );
}
