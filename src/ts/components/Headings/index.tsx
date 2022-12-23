import React, { useEffect } from 'react';
import { debounce, throttle } from 'throttle-debounce';
import { THROTTLE_TIME } from '../../constants';
import { getContainer as getMainContainer, waitFor } from '../../utils';
import Heading from '../Heading';
import { useHeadings } from './hooks';
import { extractHeadings, setHighlight } from './utils';

// MEMO: 描画コストが高いので、useMemo したほうが良さそう ... に一見思われるが
//       重い処理は useEffect でしか行われないので問題ない
export default function Headings({
  pageChangedTime,
  maxHeight,
}: {
  pageChangedTime: number;
  maxHeight: string;
}) {
  const [headings, setHeadings, headingsRef] = useHeadings([]);

  const refreshAllHeadings = () => {
    const headings = extractHeadings();
    setHeadings(setHighlight(headings));
  };

  useEffect(() => {
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
  }, [pageChangedTime]);

  // watch headings' change
  useEffect(() => {
    let observer: MutationObserver;
    (async () => {
      await waitFor('main');

      const handleChange = debounce(refreshAllHeadings, THROTTLE_TIME);
      observer = new MutationObserver(handleChange);
      observer.observe(getMainContainer() as Node, {
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

  // highlight current focused
  useEffect(() => {
    const fn = throttle(
      () => setHeadings((headings) => setHighlight(headings)),
      THROTTLE_TIME,
    );
    (async () => {
      await waitFor('main');
      getMainContainer().addEventListener('scroll', fn);
      fn();
    })();
    return () => getMainContainer().removeEventListener('scroll', fn);
  }, [pageChangedTime]);

  return headings.length > 0 ? (
    <div className="toc-headings" style={{ maxHeight }}>
      {headings.map((heading) => (
        <Heading key={heading.blockId} {...heading} />
      ))}
    </div>
  ) : (
    <p className="toc-no-headings">{chrome.i18n.getMessage('NO_HEADINGS')}</p>
  );
}
