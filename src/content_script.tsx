import React from "react";
import { createRoot } from 'react-dom/client';
import HeadingsContainer from './components/headings';

((async () => {
  let isMounted = false;

  // browserAction is clicked
  chrome.runtime.onMessage.addListener(() => {
    if (!isMounted) {

      const container = document.createElement('div');
      container.id = "toc-container"
      document.body.appendChild(container);

      const root = createRoot(container);
      root.render(<HeadingsContainer />,);
      isMounted = true;
      return;
    }
    // toggle viisbility
    console.log('twice');
  });

}))();