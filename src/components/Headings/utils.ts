import { getContainer } from '../../utils';

const HEADING_CLASS = {
  H1: 'notion-header-block',
  H2: 'notion-sub_header-block',
  H3: 'notion-sub_sub_header-block',
} as const;

export const extractHeadings = (): Headings => {
  // console.info('# extract headings'); // FIXME

  let headings: Headings = [];

  const elems = getContainer().querySelectorAll<HTMLElement>(
    Object.values(HEADING_CLASS)
      .map((name) => `.${name}`)
      .join(','),
  );
  for (const elem of elems) {
    const text = (elem.textContent || '').trim();
    if (text === '') continue;

    const blockId = elem.getAttribute('data-block-id');
    if (!blockId) {
      console.error('data-block-id is not found', elems);
      continue;
    }
    const level = elem.classList.contains(HEADING_CLASS.H1)
      ? 1
      : elem.classList.contains(HEADING_CLASS.H2)
      ? 2
      : elem.classList.contains(HEADING_CLASS.H3)
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

export const highlightCurrentFocused = (headings: Headings): Headings => {
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
