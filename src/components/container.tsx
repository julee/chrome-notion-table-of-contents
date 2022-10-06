import React, { useEffect, useState } from 'react';
import Headings from './headings';
import Toolbar from './toolbar';

export default () => {
  console.info('# render container');

  const [isHidden, setHidden] = useState(false);  // TODO: destroy のとき false にする
  const [isFolded, setFolded] = useState(false);  // TODO: destroy のとき false にする
  const [isMounted, setMounted] = useState(false);

  const toggleVisibility = () => {
    setMounted(isMounted => {
      if (!isMounted) {
        return true;
      }
      setHidden(isHidden => !isHidden);
      return true;
    });
  };

  useEffect(() => {
    // browserAction is clicked
    chrome.runtime.onMessage.addListener(toggleVisibility);

    // Ctrl + n
    document.addEventListener('keydown', (event: globalThis.KeyboardEvent) => {
      if (event.ctrlKey && event.code === 'KeyN')
        toggleVisibility();
    });
  }, []);

  if (!isMounted) { return null; }

  return (
    <div id="toc-container" style={isHidden ? { display: 'none' } : {}}>
      <Toolbar isFolded={isFolded} setFolded={setFolded} setHidden={setHidden} />
      <div style={isFolded ? { display: 'none' } : {}}>
        <Headings />
      </div>
    </div>
  );
};