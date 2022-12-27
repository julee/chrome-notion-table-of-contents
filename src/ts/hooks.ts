import { useEffect } from 'react';

// useEffect の第一引数関数は確実に実行されるけど
// こちらはコンポーネントの破棄までに必ずしも実行されるとは限らない
// なので useEffect と同じインターフェイズは適切でない
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
