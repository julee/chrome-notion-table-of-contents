import React from 'react';
import { $, getContainer } from '../../utils';

const animationDuration = 1_500;

export default function Heading({ blockId, isFocused, level, text }: Heading) {
  const scrollToHeading = () => {
    const heading = $(`[data-block-id="${blockId}"]`);
    getContainer().scroll({
      top: heading.offsetTop,
    });
    const textElem = heading.querySelector<HTMLElement>(
      '[contenteditable="true"]',
    );
    if (!textElem)
      throw new Error(
        `data-block-id="${blockId}" exists, but inner text element doestn't exist.`,
      );
    textElem.style.animation = `clicked-heading ${animationDuration / 1_000}s`;
    setTimeout(() => {
      textElem.style.animation = '';
    }, animationDuration);
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
