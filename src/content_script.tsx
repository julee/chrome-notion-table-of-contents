import React from 'react';
import { createRoot } from 'react-dom/client';
import Container from './components/container';
import { waitFor } from './utils';

let IS_MOUNTED = false;
const EVENT = new CustomEvent('toggleVisibility');

const toggleVisibility = async () => {
  if (!IS_MOUNTED) {
    const root = document.createElement('div');
    document.body.appendChild(root);

    createRoot(root).render(<Container />);
    IS_MOUNTED = true;
    return;
  }
  const eventReceiver = (await waitFor('#toc-event-receiver'))[0];
  eventReceiver.dispatchEvent(EVENT);
};

// browserAction is clicked
chrome.runtime.onMessage.addListener(toggleVisibility);

// Ctrl + n
document.addEventListener('keydown', (event: globalThis.KeyboardEvent) => {
  if (event.ctrlKey && event.code === 'KeyN')
    toggleVisibility();
});