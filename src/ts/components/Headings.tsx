import React, { useCallback, useEffect, useRef, useState } from 'react';
import { debounce, getContainer, getI18nMessage, waitFor } from '../utils';
import Heading from './Heading';
import { extractHeadings, setHighlight } from './utils/headings';

const DEBOUNCE_TIME = 150;

// TODO: テスタビリティのために、DOM 依存の処理は分離した方が良いのでは？
// MEMO: 描画コストが高いので、useMemo したほうが良さそう ... に一見思われるが
//       重い処理は useEffect でしか行われないので問題ない
export default function Headings({
  locale,
  pageChangedTime,
}: {
  locale: Locale;
  pageChangedTime: number;
}) {
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

  console.info('# render heading');

  const refreshAllHeadings = () => {
    const headings = extractHeadings();
    setHeadings(setHighlight(headings));
  };

  const container = getContainer();

  useEffect(() => {
    // カクつき防止に、前回描画した内容を暫定的に出しておく
    if (headingsRef.current) setHeadings(headingsRef.current);

    (async () => {
      // Heading コンポーネントが依存している要素が描画されるまで待つ
      // このコンポーネントが読まれる時点で sidebar までは描画されているが、main まではまだ確定されていない
      await waitFor('main');
      refreshAllHeadings();
    })();
  }, [pageChangedTime]);

  // watch headings' change
  useEffect(() => {
    let observer: MutationObserver;
    (async () => {
      await waitFor('main');

      const handleChange = debounce(refreshAllHeadings, DEBOUNCE_TIME);
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
      DEBOUNCE_TIME,
    );
    container.addEventListener('scroll', fn);
    fn();
    return () => container.removeEventListener('scroll', fn);
  }, []);

  return headings.length > 0 ? (
    <div className="toc-headings">
      {headings.map((heading) => (
        <Heading key={heading.blockId} {...heading} />
      ))}
    </div>
  ) : (
    <p className="toc-no-headings">{getI18nMessage(locale, 'NO_HEADINGS')}</p>
  );
}
