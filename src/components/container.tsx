import React, { useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { waitFor } from '../utils';
import Headings from './headings';
import Toolbar from './toolbar';

export default () => {
  console.info('# render container');

  const [isHidden, setHidden] = useState(false);
  const [isFolded, setFolded] = useState(false);
  const [isMounted, setMounted] = useState(false);

  const buildComponent = async () => {
    await waitFor('main');
    setMounted(true);
  };
  const toggleVisibility = () => {
    (async () => {
      setMounted((isMounted) => {
        if (!isMounted) {
          buildComponent();
          return false;
        }
        setHidden(isHidden => !isHidden);
        return true;
      });
    })();
  };

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
      if (event.ctrlKey && event.code === 'KeyN')
        toggleVisibility();
    });
  }, []);

  if (!isMounted) { return null; }

  return (
    <Draggable handle="#toc-draggable-handle" >
      <div id="toc-container" style={isHidden ? { display: 'none' } : {}}>
        <div id="toc-draggable-handle"></div>
        <Toolbar isFolded={isFolded} setFolded={setFolded} setHidden={setHidden} />
        <div id="toc-headings" style={isFolded ? { display: 'none' } : {}}>
          <Headings />
        </div>
      </div>
    </Draggable>
  );
};