import { useCallback, useEffect, useState } from 'react';

const KEY = 'FOLDED';

export const useWholeFolded = (defaultVal: boolean) => {
  const [wholeFolded, setWholeFolded] = useState<boolean>(defaultVal);

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

const DEFAULT_MAX_HEIGHT = '26vh';
const EXPANDED_MAX_HEIGHT = 'calc(100vh - 213px)';

export const useMaxheight = () => {
  const [maxHeight, setMaxHeight] = useState(DEFAULT_MAX_HEIGHT);

  return {
    maxHeight,
    setMaxHeight: useCallback(
      (
        fn: ({
          defaultVal,
          expanded,
        }: {
          defaultVal: string;
          expanded: string;
        }) => string,
      ) =>
        setMaxHeight(() =>
          fn({
            defaultVal: DEFAULT_MAX_HEIGHT,
            expanded: EXPANDED_MAX_HEIGHT,
          }),
        ),
      [],
    ),
  };
};
