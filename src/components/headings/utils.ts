import { getContainer } from '../../utils';

export function extractHeadings(): HeadingsType {
  console.info('# fetch heading');

  let headings: HeadingsType = [];

  const elems = getContainer().querySelectorAll<HTMLElement>(
    '[placeholder="Heading 1"],' +
      '[placeholder="Heading 2"],' +
      '[placeholder="Heading 3"]',
  );
  for (const heading of elems) {
    const parentElem = heading.closest('[data-block-id]');
    if (!parentElem) {
      console.error(parentElem);
      throw new Error('parent element is not found');
    }
    headings.push({
      text: (heading.textContent || '').trim(),
      rank: Number(
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
      headings.map((h) => h.rank),
    ) !== 1
  ) {
    headings = headings.map((heading) => {
      heading.rank--;
      return heading;
    });
  }
  return headings;
}

// destructive
export function setHighlight(headings: HeadingsType): void {
  if (headings.length === 0) {
    return;
  }
  const container = getContainer();
  const currentOffset = container.scrollTop + container.offsetTop;

  let current: HeadingType | null = null;
  for (const heading of headings) {
    heading.isFocused = false;
    if (currentOffset < Number(heading.offset)) continue;
    current = heading;
  }
  (current ??= headings[0]).isFocused = true;
}
