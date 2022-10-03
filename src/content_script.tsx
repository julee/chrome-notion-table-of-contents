import React from 'react';
import { createRoot } from 'react-dom/client';
import HeadingsContainer from './components/headingsContainer';
import { waitFor } from './utils';

((async () => {
  let isMounted = false;

  // browserAction is clicked
  chrome.runtime.onMessage.addListener(async (arg) => {
    if (!isMounted) {
      const root = document.createElement('div');
      document.body.appendChild(root);

      createRoot(root).render(<HeadingsContainer />);
      isMounted = true;
      return;
    }
    const eventReceiver = (await waitFor('#toc-event-receiver'))[0];
    // toggle viisbility
    const event = new CustomEvent('actionClicked');
    eventReceiver.dispatchEvent(event);
  });
}))();