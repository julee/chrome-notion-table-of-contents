import React from 'react';
import { getContainer } from '../utils';

export default function Heading({ heading: h }: { heading: HeadingType }) {
  const scrollToHeading = () => {
    const target = document.querySelector<HTMLElement>(
      `[data-block-id="${h.blockId}"]`,
    );
    if (!target) {
      throw new Error(`data-block-id="${h.blockId}" is not found`);
    }
    getContainer().scroll({
      top: target.offsetTop,
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
