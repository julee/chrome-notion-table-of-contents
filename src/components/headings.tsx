import React, { useEffect, useState } from 'react';
import { debounce, waitFor } from '../utils';

type HeadingType = {
  blockId: string;
  text: string;
  rank: number;
  offset: number;
  isFocused: boolean;
};
type HeadingsType = HeadingType[];

// 関数経由で取得したい（初期化の順番を考えなくて済むので）が
// async になるので
// その関数を呼ぶ箇所全部 async で囲わないといけなくなるのがだるい（ので現状やらない）
// TODO: そもそも main が render されるまでこのコンポーネントを render しなければいいのでは
let MAIN_CONTENT: HTMLElement | null = null;

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
  if (MAIN_CONTENT === null) {
    throw new Error('main element === null');
  }
  const elems = MAIN_CONTENT.querySelectorAll<HTMLElement>(
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


// 明らかに分割すべき...
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

  const refreshAllHeadings = () => {
    const headings = extractHeadings();
    setHighlight(headings);
    setHeadings(headings);
  };

  useEffect(() => {
    let observer: MutationObserver;
    (async () => {
      // initialize
      MAIN_CONTENT = (await waitFor('main'))[0];
      refreshAllHeadings();

      // watch headings' change
      const fn = debounce(refreshAllHeadings, 1000);
      observer = new MutationObserver(fn);
      observer.observe(MAIN_CONTENT as Node, {
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
      MAIN_CONTENT = null;
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
                onClick={() => handleClick(heading.blockId)}
              >
                {heading.text}
              </p>
            )
          )
        )
    }
  </>;
};