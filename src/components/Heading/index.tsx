import React from 'react';
import { THEME } from '../../constants';
import { $, getContainer } from '../../utils';
import { useTheme } from '../App/hooks';
import './styles.pcss';

const ANIMATION_DURATION = 1_500;

export default function Heading({ blockId, isFocused, level, text }: Heading) {
  const theme = useTheme();

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

    // Notion doesn't allow to add the CSS class. So I change the style directly.
    textElem.style.animation = `clicked-heading-animation${
      theme === THEME.DARK ? '-dark' : ''
    } ${ANIMATION_DURATION / 1_000}s`;
    setTimeout(() => {
      textElem.style.animation = '';
    }, ANIMATION_DURATION);
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
