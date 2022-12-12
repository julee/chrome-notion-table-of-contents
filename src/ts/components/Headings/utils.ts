import { getContainer } from '../../utils';

export const extractHeadings = (): Headings => {
  console.info('# extract headings');

  let headings: Headings = [];

  const elems = getContainer().querySelectorAll<HTMLElement>(
    '[class^="notion-"][class$="header-block"]',
  );
  for (const elem of elems) {
    const text = (elem.textContent || '').trim();
    if (text === '') continue;

    const blockId = elem.getAttribute('data-block-id');
    if (!blockId) {
      console.error('data-block-id is not found', elems);
      continue;
    }
    const level = elem.classList.contains('notion-header-block')
      ? 1
      : elem.classList.contains('notion-sub_header-block')
      ? 2
      : elem.classList.contains('notion-sub_sub_header-block')
      ? 3
      : undefined;
    if (level === undefined) {
      console.error(`Cannot get level. ${JSON.stringify(elem.classList)}`);
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

export const setHighlight = (headings: Headings): Headings => {
  if (headings.length === 0) {
    return headings;
  }
  const container = getContainer();
  const currentOffset = container.offsetTop + container.scrollTop;
  const newHeadings = structuredClone(headings);

  let current: Heading | null = null;
  for (const heading of newHeadings) {
    heading.isFocused = false;
    if (currentOffset < heading.offset) continue;
    current = heading;
  }
  (current ??= newHeadings[0]).isFocused = true;

  return newHeadings;
};
