import React, { useEffect, useLayoutEffect, useState } from 'react';
import { querySelector, waitFor } from '../utils';
import Headings from './Headings';
import Toolbar from './Toolbar';

export default function Container() {
  console.info('# render container');

  const [isHidden, setHidden] = useState<boolean>(false);
  const [renderable, setRenderable] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [pageChangedTime, setPageChangedTime] = useState<number>(0);

  useLayoutEffect(() => {
    // build
    (async () => {
      console.info('# first rendering');
      // Heading コンポーネントが依存している要素が描画されるまで待つ
      // このコンポーネントが読まれる時点で sidebar までは描画されているが、main まではまだ確定されていない
      await waitFor('main');

      setRenderable(true);
      setTheme(
        querySelector('.notion-light-theme,.notion-dark-theme').matches(
          '.notion-light-theme',
        )
          ? 'light'
          : 'dark',
      );
    })();
  }, []);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(({ type }: { type: string }) => {
      switch (type) {
        case 'CHANGE_PAGE':
          console.log('# CHANGE PAGE');
          setHidden(false);
          setPageChangedTime(Date.now());
          break;

        default:
          throw new Error(`unknown type: ${type}`);
      }
    });
  }, []);

  if (!renderable) return null;

  return (
    <div
      className={`toc-container ${
        theme === 'light' ? 'theme-light' : 'theme-dark'
      }`}
      style={isHidden ? { display: 'none' } : {}}
    >
      <Toolbar setHidden={setHidden} />
      {/* 描画コストが高いので、useMemo したほうが良さそう
          と思ったけど重い処理は DidMount でしか行われないので大丈夫だった */}
      <Headings pageChangedTime={pageChangedTime} />
    </div>
  );
}
