import React, { useEffect, useState } from 'react';
import { debounce, waitFor } from '../utils';

let PAGE_CONTENT: HTMLElement;

type HeadingType = {
  blockId: string;
  text: string;
  rank: number;
  offset: number;
  isFocused: boolean;
};
type HeadingsType = HeadingType[];

let _scrollableContainer: HTMLElement | null = null;
const getScrollableContainer = (): HTMLElement => {
  _scrollableContainer ??= document.querySelector('.notion-frame .notion-scroller');
  if (!_scrollableContainer) {
    throw new Error('".notion-frame .notion-scroller" is not found');
  }
  return _scrollableContainer;
};

const extractHeadings = (): HeadingsType => {
  console.info('# fetch heading');

  // TODO: 流石にどこかに切り出したい気がするが、どういう粒度で、どういうディレクトリに切り出すのが適切なのだろう...
  //       あとテスト書きたい
  let headings: HeadingsType = [];
  const elems = PAGE_CONTENT.querySelectorAll<HTMLElement>(
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


// TODO: 明らかに分割すべき...
export default () => {
  const [headings, setHeadings] = useState<HeadingsType>([]);
  console.info('# render heading');

  const handleClick = (blockId: string) => {
    const target = document.querySelector<HTMLElement>(`[data-block-id="${blockId}"]`);
    if (!target) { return; }

    getScrollableContainer().scroll({
      top: target.offsetTop,
    });
  };

  const refreshAllHeadings = () => {
    const newHeadings = extractHeadings();
    setHeadings(newHeadings);
  };

  // watch headings' change
  useEffect(() => {
    let observer: MutationObserver;
    (async () => {
      PAGE_CONTENT = (await waitFor('.notion-page-content'))[0];
      await refreshAllHeadings();

      const fn = debounce(() => refreshAllHeadings(), 1000);
      observer = new MutationObserver(fn);
      observer.observe(PAGE_CONTENT as Node, {
        childList: true,
        characterData: true,
      });
    })();
    return () => { observer.disconnect(); };
  }, []);

  // highlight current
  useEffect(() => {
    const container = getScrollableContainer();
    const fn = debounce(() => {
      setHeadings(headings => {
        const currentOffset = container.scrollTop + container.offsetTop;
        const newHeadings: HeadingsType = structuredClone(
          headings.map(heading => {
            heading.isFocused = false;
            return heading;
          }),
        );

        let current: HeadingType | null = null;
        for (const heading of newHeadings) {
          if (currentOffset < Number(heading.offset))
            break;
          current = heading;
        }
        (current ??= newHeadings[0]).isFocused = true;

        return newHeadings;
      });
    }, 300);
    container.addEventListener('scroll', fn);
  }, []);

  return <>
    {
      headings.map(
        heading => (
          <p
            className={`toc-h${heading.rank} toc-heading toc-clickable ${heading.isFocused ? 'toc-focused' : ''}`}
            key={heading.blockId}
            onClick={() => handleClick(heading.blockId)}
          >
            {heading.text}
          </p>
        )
      )
    }
  </>;
};