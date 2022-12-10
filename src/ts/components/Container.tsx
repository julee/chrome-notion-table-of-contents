import React, { useEffect, useLayoutEffect, useState } from 'react';
import { querySelector, waitFor } from '../utils';
import Headings from './Headings';
import Toolbar from './Toolbar';

export default function Container() {
  console.info('# render container');

  const [isHidden, setHidden] = useState<boolean>(false);
  const [isFolded, setFolded] = useState<boolean>(false);
  const [renderable, setRenderable] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useLayoutEffect(() => {
    // build
    (async () => {
      await waitFor('main'); // Heading コンポーネントが依存している要素が描画されるまで待つ
      console.info('# first rendering');
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
        case 'CLICK_ACTION':
          setRenderable((prevRenderable) => {
            setHidden((isHidden) => (prevRenderable ? !isHidden : false));
            return true;
          });
          break;

        case 'MOVE_PAGE':
          setHidden(false);
          setFolded(false);
          setRenderable(false);
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
      <Toolbar
        isFolded={isFolded}
        setFolded={setFolded}
        setHidden={setHidden}
      />
      <Headings isFolded={isFolded} />
    </div>
  );
}
