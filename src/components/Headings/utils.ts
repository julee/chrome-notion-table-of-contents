import { SCROLL_OFFSET } from '../../constants';
import type { Heading } from '../../types';
import { getContainer } from '../../utils';

const HEADING_CLASS_OF = {
  H1: 'notion-header-block',
  H2: 'notion-sub_header-block',
  H3: 'notion-sub_sub_header-block',
} as const;

export const extractHeadings = (): Heading[] => {
  console.info('# extract headings');

  let headings: Heading[] = [];

  const elems = getContainer().querySelectorAll<HTMLElement>(
    Object.values(HEADING_CLASS_OF)
      .map((name) => `.${name}`)
      .join(','),
  );
  for (const elem of elems) {
    const text = (
      elem.querySelector('[placeholder]')?.textContent || ''
    ).trim();
    if (text === '') continue;

    const blockId = elem.getAttribute('data-block-id');
    if (!blockId) {
      console.error('data-block-id is not found', elem);
      continue;
    }

    const classList = elem.classList;
    const level = classList.contains(HEADING_CLASS_OF.H1)
      ? 1
      : classList.contains(HEADING_CLASS_OF.H2)
      ? 2
      : classList.contains(HEADING_CLASS_OF.H3)
      ? 3
      : undefined;
    if (level === undefined) {
      console.error(`Cannot get level. ${JSON.stringify(classList)}`);
      continue;
    }

    headings.push({
      text,
      level: Number(level),
      blockId,
      offset: elem.offsetTop,
      isFocused: false,
    });
  }
  if (
    headings.length !== 0 &&
    Math.min.apply(
      null,
      headings.map((h) => h.level),
    ) !== 1
  ) {
    headings = headings.map((heading) => {
      heading.level--;
      return heading;
    });
  }
  return headings;
};

export const highlightCurrentFocused = (headings: Heading[]): Heading[] => {
  if (headings.length === 0) {
    return headings;
  }
  const container = getContainer();
  const currentOffset = container.offsetTop + container.scrollTop;
  const newHeadings = structuredClone(headings);

  let current: Heading | null = null;
  for (const heading of newHeadings) {
    heading.isFocused = false;
    if (currentOffset < heading.offset - SCROLL_OFFSET) continue;
    current = heading;
  }
  (current ??= newHeadings[0]).isFocused = true;

  return newHeadings;
};
