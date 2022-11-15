import React, { useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { querySelector, waitFor } from '../utils';
import Headings from './headings';
import Toolbar from './toolbar';

export default function Container() {
  console.info('# render container');

  const [isHidden, setHidden] = useState<boolean>(false);
  const [isFolded, setFolded] = useState<boolean>(false);
  const [isMounted, setMounted] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleVisibility = () => {
    // setHidden((isHidden) => !isHidden);
    setHidden((isHidden) => {
      console.log(`prev isHidden: ${isHidden} -> ${!isHidden}`);
      return !isHidden;
    });
  };

  useEffect(() => {
    // build
    (async () => {
      await waitFor('main');
      console.log('# ⭐first rendering');
      setMounted(true);
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
          // setMounted(true);
          setMounted((prev) => {
            console.log(`prev mounted: ${prev} -> true`);
            return true;
          });
          toggleVisibility();
          break;

        case 'MOVE_PAGE':
          setHidden(false);
          setFolded(false);
          setMounted(false);
          break;

        default:
          throw new Error(`unknown type: ${type}`);
      }
    });

    // // TODO: やるにしても commands で
    // document.addEventListener('keydown', (event: globalThis.KeyboardEvent) => {
    //   if (event.ctrlKey && event.code === 'KeyN') toggleVisibility();
    // });
  }, []);

  if (!isMounted) {
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
