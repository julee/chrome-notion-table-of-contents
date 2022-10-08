import React, { useEffect, useState } from 'react';
import { debounce } from '../utils';

type HeadingType = {
  blockId: string;
  text: string;
  rank: number;
  offset: number;
  isFocused: boolean;
};
type HeadingsType = HeadingType[];

let MAIN_CONTAINER: HTMLElement | null = null;
const getMainContainer = (): HTMLElement => {
  MAIN_CONTAINER ??= document.querySelector('.notion-frame .notion-scroller');
  if (!MAIN_CONTAINER) {
    throw new Error('"main" is not found');
  }
  return MAIN_CONTAINER;
};

let SCROLLABLE_CONTAINER: HTMLElement | null = null;
const getScrollableContainer = (): HTMLElement => {
  SCROLLABLE_CONTAINER ??= document.querySelector('.notion-frame .notion-scroller');
  if (!SCROLLABLE_CONTAINER) {
    throw new Error('".notion-frame .notion-scroller" is not found');
  }
  return SCROLLABLE_CONTAINER;
};

const extractHeadings = (): HeadingsType => {
  console.info('# fetch heading');

  // TODO: 流石にどこかに切り出したい気がするが、どういう粒度で、どういうディレクトリに切り出すのが適切なのだろう...
  //       あとテスト書きたい
  let headings: HeadingsType = [];
  const elems = getMainContainer().querySelectorAll<HTMLElement>(
    '[placeholder="Heading 1"],' +
    '[placeholder="Heading 2"],' +
    '[placeholder="Heading 3"]'
  );
  for (const heading of elems) {
    const parentElem = heading.closest('[data-block-id]');
    if (!parentElem) {
      console.error(parentElem);
      throw new Error('parent element is not found');
    }
    headings.push({
      text: heading.textContent || '',
      rank: Number((heading.getAttribute('placeholder') || '').replace(/^Heading /, '')),
      blockId: parentElem.getAttribute('data-block-id') || '',
      offset: heading.offsetTop,
      isFocused: false,
    });
  }
  if (headings.length !== 0 && Math.min.apply(null, headings.map(h => h.rank)) !== 1) {
    headings = headings.map(heading => {
      heading.rank--;
      return heading;
    });
  }
  return headings;
};

// destructive
const setHighlight = (headings: HeadingsType): void => {
  if (headings.length === 0) { return; }

  const container = getScrollableContainer();
  const currentOffset = container.scrollTop + container.offsetTop;

  let current: HeadingType | null = null;
  for (const heading of headings) {
    heading.isFocused = false;
    if (currentOffset < Number(heading.offset))
      continue;
    current = heading;
  }
  (current ??= headings[0]).isFocused = true;
};

// 明らかに分割すべき...
export default () => {
  const [headings, setHeadings] = useState<HeadingsType>([]);
  console.info('# render heading');

  const scrollToHeading = (blockId: string) => {
    const target = document.querySelector<HTMLElement>(`[data-block-id="${blockId}"]`);
    if (!target) { return; }

    getScrollableContainer().scroll({
      top: target.offsetTop,
    });
  };

  const refreshAllHeadings = () => {
    const headings = extractHeadings();
    setHighlight(headings);
    setHeadings(headings);
  };

  useEffect(() => {
    let observer: MutationObserver;
    (async () => {
      // initialize
      refreshAllHeadings();

      // watch headings' change
      const fn = debounce(refreshAllHeadings, 1000);
      observer = new MutationObserver(fn);
      observer.observe(getMainContainer() as Node, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    })();
    return () => {
      if (observer) { observer.disconnect(); }
    };
  }, []);

  // highlight current
  useEffect(() => {
    const fn = debounce(
      () => setHeadings(headings => {
        const cloned = structuredClone(headings);
        setHighlight(cloned);
        return cloned;
      }),
      300,
    );
    const container = getScrollableContainer();
    container.addEventListener('scroll', fn);
    fn();
    return () => container.removeEventListener('scroll', fn);
  }, []);

  // cleanup
  useEffect(() => {
    return () => {
      MAIN_CONTAINER = null;
      SCROLLABLE_CONTAINER = null;
    };
  }, []);

  return <>
    {
      headings.length === 0
        ? (<p>No headings</p>)
        : (
          headings.map(
            heading => (
              <p
                className={`toc-h${heading.rank} toc-heading toc-clickable ${heading.isFocused ? 'toc-focused' : ''}`}
                key={heading.blockId}
                onClick={() => scrollToHeading(heading.blockId)}
              >
                {heading.text}
              </p>
            )
          )
        )
    }
  </>;
};