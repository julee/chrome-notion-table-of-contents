import { getContainer } from '../../utils';

export function extractHeadings(): HeadingsType {
  console.info('# extract headings');

  let headings: HeadingsType = [];

  const elems = getContainer().querySelectorAll<HTMLElement>(
    '[placeholder="Heading 1"],' +
      '[placeholder="Heading 2"],' +
      '[placeholder="Heading 3"]',
  );
  for (const heading of elems) {
    const parentElem = heading.closest('[data-block-id]');
    if (!parentElem) {
      throw new Error('parent element is not found');
    }
    headings.push({
      text: (heading.textContent || '').trim(),
      level: Number(
        (heading.getAttribute('placeholder') || '').replace(/^Heading /, ''),
      ),
      blockId: parentElem.getAttribute('data-block-id') || '',
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
}

export function setHighlight(headings: HeadingsType): HeadingsType {
  if (headings.length === 0) {
    return headings;
  }
  const container = getContainer();
  const currentOffset = container.offsetTop + container.scrollTop;
  const newHeadings = structuredClone(headings);

  let current: HeadingType | null = null;
  for (const heading of newHeadings) {
    heading.isFocused = false;
    if (currentOffset < heading.offset) continue;
    current = heading;
  }
  (current ??= newHeadings[0]).isFocused = true;

  return newHeadings;
}
