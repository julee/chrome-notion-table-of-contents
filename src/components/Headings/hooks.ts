import { useSetAtom } from 'jotai';
import { useCallback, useRef, useState } from 'react';
import { throttle } from 'throttle-debounce';
import { handleHeadingsUpdateAtom } from '../../atoms';
import { THROTTLE_TIME } from '../../constants';
import { usePageMoveEvent } from '../../hooks';
import type { Heading } from '../../types';
import { getContainer as getMainContainer, waitFor } from '../../utils';
import { extractHeadings, highlightCurrentFocused } from './utils';

// Very long but can't be splited ...
export const useHeadings = (): Heading[] => {
  const [headings, _setHeadings] = useState<Heading[]>([]);
  const headingsRef = useRef<Heading[] | null>(null);
  const handleHeadingsUpdate = useSetAtom(handleHeadingsUpdateAtom);

  const setHeadings = useCallback(
    (valOrFunction: Heading[] | ((headings: Heading[]) => Heading[])) => {
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
    // use setTimeout() to process after the headings change is reflected in the DOM
    setTimeout(() => handleHeadingsUpdate(), 0);
  }, []);

  // ----------------------------------------
  // First rendering
  // ----------------------------------------

  usePageMoveEvent(() => {
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
  usePageMoveEvent(() => {
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
  usePageMoveEvent(() => {
    const fn = throttle(
      () => setHeadings((headings) => highlightCurrentFocused(headings)),
      THROTTLE_TIME,
    );
    (async () => {
      await waitFor('main');
      getMainContainer().addEventListener('scroll', fn);
      await fn();
    })();
    return () => getMainContainer().removeEventListener('scroll', fn);
  });

  return headings;
};
