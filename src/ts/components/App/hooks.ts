import { useCallback, useEffect, useState } from 'react';

const KEY = 'FOLDED';

// TODO: test
export const useWholeFolded = (_default: boolean) => {
  const [wholeFolded, setWholeFolded] = useState<boolean>(_default);

  useEffect(() => {
    (async () => {
      const val = (await chrome.storage.local.get(KEY))[KEY];
      if (val !== undefined) setWholeFolded(val);
    })();
  }, []);

  return {
    wholeFolded,
    setWholeFolded: useCallback(
      (valOrCb: ((val: boolean) => boolean) | boolean) => {
        if (typeof valOrCb === 'function') {
          setWholeFolded((prevVal: boolean) => {
            const val = valOrCb(prevVal);
            chrome.storage.local.set({ [KEY]: val });
            return val;
          });
        } else {
          chrome.storage.local.set({ [KEY]: valOrCb });
          setWholeFolded(valOrCb);
        }
      },
      [],
    ),
  };
};

const FOLDED_MAX_HEIGHT = '26vh';

const EXPANDED_OFFSET = 75; // height of header and expand button
const EXPANDED_MAX_HEIGHT = () => {
  // TODO: use ref
  const container = document.querySelector<HTMLElement>('.toc-container');
  if (!container) throw new Error('.toc-container is not found');
  return window.innerHeight - container.offsetTop - EXPANDED_OFFSET + 'px';
};

export const useTailFolded = (_default: boolean) => {
  const [tailFolded, setTailFolded] = useState(_default);

  return {
    tailFolded,
    maxHeight: tailFolded ? FOLDED_MAX_HEIGHT : EXPANDED_MAX_HEIGHT(),
    setTailFolded,
  };
};
