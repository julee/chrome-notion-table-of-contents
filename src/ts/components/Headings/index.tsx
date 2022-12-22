import React, { useEffect } from 'react';
import {
  debounce,
  getContainer as getMainContainer,
  waitFor,
} from '../../utils';
import Heading from '../Heading';
import { useHeadings } from './hooks';
import { extractHeadings, setHighlight } from './utils';

const DEBOUNCE_TIME = 150;

// TODO: テスタビリティのために、DOM 依存の処理は分離した方が良いのでは？
// MEMO: 描画コストが高いので、useMemo したほうが良さそう ... に一見思われるが
//       重い処理は useEffect でしか行われないので問題ない
export default function Headings({
  pageChangedTime,
}: {
  pageChangedTime: number;
}) {
  const [headings, setHeadings, headingsRef] = useHeadings([]);

  console.info('# render heading');

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

      const handleChange = debounce(refreshAllHeadings, DEBOUNCE_TIME);
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

  // highlight current
  useEffect(() => {
    const fn = debounce(
      () => setHeadings((headings) => setHighlight(headings)),
      DEBOUNCE_TIME,
    );
    (async () => {
      await waitFor('main');
      getMainContainer().addEventListener('scroll', fn);
      fn();
    })();
    return () => getMainContainer().removeEventListener('scroll', fn);
  }, [pageChangedTime]);

  return headings.length > 0 ? (
    <div className="toc-headings">
      {headings.map((heading) => (
        <Heading key={heading.blockId} {...heading} />
      ))}
    </div>
  ) : (
    <p className="toc-no-headings">{chrome.i18n.getMessage('NO_HEADINGS')}</p>
  );
}
