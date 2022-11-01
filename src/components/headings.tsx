import React, { useEffect, useState } from 'react';
import { debounce } from '../utils';
import { extractHeadings, setHighlight } from './headings/utils';

const Headings = () => {
  const [headings, setHeadings] = useState<HeadingsType>([]);
  console.info('# render heading');

  const container = document.querySelector('.notion-frame .notion-scroller');
  if (!container) {
    throw new Error('".notion-frame .notion-scroller" is not found');
  }
  const scrollToHeading = (blockId: string) => {
    const target = document.querySelector<HTMLElement>(
      `[data-block-id="${blockId}"]`,
    );
    if (!target) {
      return;
    }

    container.scroll({
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
      300,
    );
    container.addEventListener('scroll', fn);
    fn();
    return () => container.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      {headings.length === 0 ? (
        <p>No headings</p>
      ) : (
        headings.map((heading) => (
          <p
            className={`toc-h${heading.rank} toc-heading toc-clickable ${
              heading.isFocused ? 'toc-focused' : ''
            }`}
            key={heading.blockId}
            onClick={() => scrollToHeading(heading.blockId)}
          >
            {heading.text}
          </p>
        ))
      )}
    </>
  );
};

export default Headings;
