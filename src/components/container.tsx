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

  const buildComponent = async () => {
    await waitFor('main');
    setMounted(true);
  };
  const toggleVisibility = () => {
    (async () => {
      setMounted((isMounted) => {
        if (!isMounted) {
          (async () => {
            await buildComponent();
            setTheme(
              querySelector('.notion-light-theme,.notion-dark-theme').matches(
                '.notion-light-theme',
              )
                ? 'light'
                : 'dark',
            );
          })();
          return false;
        }
        setHidden((isHidden) => !isHidden);
        return true;
      });
    })();
  };

  // receive events
  useEffect(() => {
    chrome.runtime.onMessage.addListener(({ type }: { type: string }) => {
      switch (type) {
        case 'CLICK_ACTION':
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

    // Ctrl + n
    document.addEventListener('keydown', (event: globalThis.KeyboardEvent) => {
      if (event.ctrlKey && event.code === 'KeyN') toggleVisibility();
    });
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
