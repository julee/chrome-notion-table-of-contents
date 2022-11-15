import React, { useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { querySelector, waitFor } from '../utils';
import Headings from './headings';
import Toolbar from './toolbar';

export default function Container() {
  console.info('# render container');

  const [isHidden, setHidden] = useState<boolean>(false);
  const [isFolded, setFolded] = useState<boolean>(false);
  const [renderable, setRenderable] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // build
    (async () => {
      await waitFor('main');
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

  if (!renderable) {
    return null;
  }

  return (
    <Draggable handle=".toc-draggable-handle">
      <div
        className={`toc-container ${
          theme === 'light' ? 'theme-light' : 'theme-dark'
        }`}
        style={isHidden ? { display: 'none' } : {}}
      >
        <div className="toc-draggable-handle"></div>
        <Toolbar
          isFolded={isFolded}
          setFolded={setFolded}
          setHidden={setHidden}
        />
        <Headings isFolded={isFolded} />
      </div>
    </Draggable>
  );
}
