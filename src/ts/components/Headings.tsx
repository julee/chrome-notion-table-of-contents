import React, { useEffect, useState } from 'react';
import { debounce, getContainer } from '../utils';
import Heading from './Heading';
import { extractHeadings, setHighlight } from './utils/headings';

// TODO: テスタビリティのために、DOM 依存の処理は分離した方が良いのでは？
export default function Headings() {
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
      const handleChange = debounce(refreshAllHeadings, 1000);
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
  }, []);

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
      {headings.length === 0 ? (
        <p>No headings</p>
      ) : (
        headings.map((heading) => (
          <Heading key={heading.blockId} {...heading} />
        ))
      )}
    </div>
  );
}
