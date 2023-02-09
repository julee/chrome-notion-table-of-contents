import { useEffect } from 'react';

export const usePageChangeEvent = (handler: () => void | (() => void)) => {
  useEffect(() => {
    const cleanup = handler();
    const fn = ({ type }: { type: string }) => {
      if (type === 'CHANGE_PAGE') {
        if (cleanup) cleanup();
        handler();
      }
    };
    chrome.runtime.onMessage.addListener(fn);

    return () => chrome.runtime.onMessage.removeListener(fn);
  }, []);
};
