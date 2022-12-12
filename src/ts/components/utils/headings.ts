import { getContainer } from '../../utils';

export const extractHeadings = (): Headings => {
  console.info('# extract headings');

  let headings: Headings = [];

  const elems = getContainer().querySelectorAll<HTMLElement>(
    '[class^="notion-"][class$="header-block"]',
  );
  for (const heading of elems) {
    const blockId = heading.getAttribute('data-block-id');
    if (!blockId) {
      console.error('data-block-id is not found', elems);
      continue;
    }
    const level = heading.classList.contains('notion-header-block')
      ? 1
      : heading.classList.contains('notion-sub_header-block')
      ? 2
      : heading.classList.contains('notion-sub_sub_header-block')
      ? 3
      : undefined;
    if (level === undefined) {
      console.error(`Cannot get level. ${JSON.stringify(heading.classList)}`);
      continue;
    }

    headings.push({
      text: (heading.textContent || '').trim(),
      level: Number(level),
      blockId,
      offset: heading.offsetTop,
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
