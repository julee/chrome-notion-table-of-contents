import { useCallback, useRef, useState } from 'react';
import { throttle } from 'throttle-debounce';
import { THROTTLE_TIME } from '../../constants';
import { usePageChangeEvent } from '../../hooks';
import { getContainer as getMainContainer, waitFor } from '../../utils';
import { extractHeadings, highlightCurrentFocused } from './utils';

// Very long but can't be splited ...
export const useHeadings = ({
  setTocUpdatedAt,
}: {
  setTocUpdatedAt: React.Dispatch<React.SetStateAction<number>>;
}): Headings => {
  const [headings, _setHeadings] = useState<Headings>([]);
  const headingsRef = useRef<Headings | null>(null);

  const setHeadings = useCallback(
    (valOrFunction: Headings | ((headings: Headings) => Headings)) => {
      if (typeof valOrFunction === 'function') {
        _setHeadings((prevHeadings) => {
          const newHeadings = valOrFunction(prevHeadings);
          headingsRef.current = newHeadings;
          return newHeadings;
        });
      } else {
        _setHeadings(valOrFunction);
        headingsRef.current = valOrFunction;
      }
    },
    [],
  );

  const refreshAllHeadings = useCallback(() => {
    const headings = extractHeadings();
    setHeadings(highlightCurrentFocused(headings));
    setTocUpdatedAt(Date.now());
  }, []);

  // ----------------------------------------
  // First rendering
  // ----------------------------------------

  usePageChangeEvent(() => {
    // カクつき防止に、前回描画した内容を暫定的に出しておく
    if (headingsRef.current) setHeadings(headingsRef.current);

    (async () => {
      // Heading コンポーネントが依存している要素が描画されるまで待つ
      // このコンポーネントが読まれる時点で sidebar までは描画されているが、main まではまだ確定されていない
      // NOTE: もう少し深い要素まで見たほうがいいかもしれない
      // たまに 1 個の見出ししか描画されないことがある原因これかも
      await waitFor('main');
      refreshAllHeadings();
    })();
  });

  // ----------------------------------------
  // Watch content and re-rendering
  // ----------------------------------------

  // watch edit of headings and follow the change
  usePageChangeEvent(() => {
    let observer: MutationObserver;
    (async () => {
      await waitFor('main');

      observer = new MutationObserver(
        throttle(refreshAllHeadings, THROTTLE_TIME),
      );
      observer.observe(getMainContainer() as Node, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    })();
    return () => {
      if (observer) observer.disconnect();
    };
  });

  // highlight current focused
  usePageChangeEvent(() => {
    const fn = throttle(
      () => setHeadings((headings) => highlightCurrentFocused(headings)),
      THROTTLE_TIME,
    );
    (async () => {
      await waitFor('main');
      getMainContainer().addEventListener('scroll', fn);
      fn();
    })();
    return () => getMainContainer().removeEventListener('scroll', fn);
  });

  return headings;
};
