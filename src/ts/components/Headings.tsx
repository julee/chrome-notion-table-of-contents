import React, { useEffect, useState } from 'react';
import { debounce, getContainer } from '../utils';
import Heading from './Heading';
import { extractHeadings, setHighlight } from './utils/headings';

// TODO: テスタビリティのために、DOM 依存の処理は分離した方が良いのでは？
// MEMO: 描画コストが高いので、useMemo したほうが良さそう ... に一見思われるが
//       重い処理は useEffect でしか行われないので問題ない
export default function Headings({
  pageChangedTime,
}: {
  pageChangedTime: number;
}) {
  const [headings, setHeadings] = useState<HeadingsType>([]);
  console.info('# render heading');

  const refreshAllHeadings = () => {
    const headings = extractHeadings();
    setHeadings(setHighlight(headings));
  };

  const container = getContainer();

  useEffect(() => {
    let observer: MutationObserver;
    (async () => {
      // initialize
      refreshAllHeadings();

      // watch headings' change
      const handleChange = debounce(refreshAllHeadings, 150);
      observer = new MutationObserver(handleChange);
      observer.observe(container as Node, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    })();
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [pageChangedTime]);

  // highlight current
  useEffect(() => {
    const fn = debounce(
      () => setHeadings((headings) => setHighlight(headings)),
      200,
    );
    container.addEventListener('scroll', fn);
    fn();
    return () => container.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className="toc-headings">
      {headings.length >= 1 &&
        headings.map((heading) => (
          <Heading key={heading.blockId} {...heading} />
        ))}
    </div>
  );
}
