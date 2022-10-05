import React from 'react';
import { createRoot } from 'react-dom/client';
import HeadingsContainer from './components/headingsContainer';
import { waitFor } from './utils';

let isMounted = false;
const customEvent = new CustomEvent('toggleVisibility');
const toggleVisibility = async () => {
  if (!isMounted) {
    const root = document.createElement('div');
    document.body.appendChild(root);

    createRoot(root).render(<HeadingsContainer />);
    isMounted = true;
    return;
  }
  const eventReceiver = (await waitFor('#toc-event-receiver'))[0];
  eventReceiver.dispatchEvent(customEvent);
};

// browserAction is clicked
chrome.runtime.onMessage.addListener(toggleVisibility);

// Ctrl + n
document.addEventListener('keydown', (event: globalThis.KeyboardEvent) => {
  if (event.ctrlKey && event.code === 'KeyN')
    toggleVisibility();
});