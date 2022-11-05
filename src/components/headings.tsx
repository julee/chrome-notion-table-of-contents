import React, { useEffect, useState } from 'react';
import { debounce, getContainer } from '../utils';
import Heading from './heading';
import { extractHeadings, setHighlight } from './headings/utils';

export default function Headings({ isFolded }: { isFolded: boolean }) {
  const [headings, setHeadings] = useState<HeadingsType>([]);
  console.info('# render heading');

  const refreshAllHeadings = () => {
    const headings = extractHeadings();
    setHighlight(headings);
    setHeadings(headings);
  };

  const container = getContainer();

  useEffect(() => {
    let observer: MutationObserver;
    (async () => {
      // initialize
      refreshAllHeadings();

      // watch headings' change
      const fn = debounce(refreshAllHeadings, 1000);
      observer = new MutationObserver(fn);
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
      () =>
        setHeadings((headings) => {
          const cloned = structuredClone(headings);
          setHighlight(cloned);
          return cloned;
        }),
      200,
    );
    container.addEventListener('scroll', fn);
    fn();
    return () => container.removeEventListener('scroll', fn);
  }, []);

  return (
    <div id="toc-headings" style={isFolded ? { display: 'none' } : {}}>
      {headings.length === 0 ? (
        <p>No headings</p>
      ) : (
        headings.map((heading) => (
          <Heading key={heading.blockId} heading={heading} />
        ))
      )}
    </div>
  );
}
