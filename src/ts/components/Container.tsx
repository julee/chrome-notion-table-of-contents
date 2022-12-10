import React, { useEffect, useLayoutEffect, useState } from 'react';
import { querySelector, waitFor } from '../utils';
import Header from './Header';
import Headings from './Headings';
import { useFolded } from './hooks/container';

export default function Container() {
  console.info('# render container');

  const [renderable, setRenderable] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [pageChangedTime, setPageChangedTime] = useState<number>(0);
  const [folded, setFolded] = useFolded(true);

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
          setPageChangedTime(Date.now());
          break;

        default:
          throw new Error(`unknown type: ${type}`);
      }
    });
  }, []);

  return (
    <div
      className={`toc-container ${
        theme === 'light' ? 'theme-light' : 'theme-dark'
      }`}
    >
      <Header folded={folded} setFolded={setFolded} />
      {renderable && !folded && (
        <>
          <Headings pageChangedTime={pageChangedTime} />
        </>
      )}
    </div>
  );
}
