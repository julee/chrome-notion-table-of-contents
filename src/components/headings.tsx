import React, { useEffect, useState } from 'react';
import { waitFor } from '../utils';

const pageContentSelector = '.notion-frame .notion-scroller';

// TODO: 明らかに分割すべき...
export default () => {
  const [headings, setHeadings] = useState<{
    blockId: string;
    text: string;
    rank: number;
  }[]>([]);
  console.debug('# render heading');

  const handleClick = (blockId: string) => {
    const target = document.querySelector<HTMLElement>(`[data-block-id="${blockId}"]`);
    if (!target) { return; }

    document.querySelector(pageContentSelector)?.scroll({
      top: target.offsetTop,
    });
  };

  let pageContent: HTMLElement;
  const refreshAllHeadings = async () => {
    console.debug('# fetch heading');

    // TODO: 流石にどこかに切り出したい気がするが、どういう粒度で、どういうディレクトリに切り出すのが適切なのだろう...
    //       あとテスト書きたい
    if (!pageContent) {
      const elem = document.querySelector(pageContentSelector);
      if (!elem) {
        throw new Error(`element '${pageContentSelector}' is not found`);
      }
      pageContent = elem as HTMLElement;

    }
    let newHeadings = [...headings];
    const elems = pageContent.querySelectorAll(
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
      newHeadings.push({
        text: heading.textContent || '',
        rank: Number((heading.getAttribute('placeholder') || '').replace(/^Heading /, '')),
        blockId: parentElem.getAttribute('data-block-id') || '',
      });
    }
    if (headings.length !== 0 && Math.min.apply(null, headings.map(h => h.rank)) !== 1) {
      newHeadings = headings.map(heading => {
        heading.rank--;
        return heading;
      });
    }
    setHeadings(newHeadings);
  };

  useEffect(() => {
    let observer: MutationObserver;
    (async () => {
      pageContent = (await waitFor(pageContentSelector))[0];
      await refreshAllHeadings();

      const toc = document.querySelector('.notion-table_of_contents-block');
      if (toc === null) {
        console.debug('ToC is not found. cannot observe.');
        return;
      }
      observer = new MutationObserver((mutationList: MutationRecord[]) => {
        // 部分更新は行わない
        // - 親の a まで遡って 、URL を blockId 化して ... とやることは多い
        //   - 該当の blockId を state の配列を 1 つずつ探索するので、計算量もそこまで変わらない
        //     - 多くてたかだが O(10) である
        // - 致命的なことに、新規追加ノードの場合は挿入位置を特定できないので、その際はどのみち全探索になる
        refreshAllHeadings();
      });
      observer.observe(toc as Node, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    })();
    return () => { observer.disconnect(); };
  }, []);

  return <>
    {
      headings.map(
        heading => (
          <p
            className={`h${heading.rank} heading clickable`}
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