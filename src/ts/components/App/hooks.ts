import { useCallback, useEffect, useState } from 'react';

const KEY = 'FOLDED';

export const useFolded = (
  defaultVal: boolean,
): [boolean, (valOrCb: ((val: boolean) => boolean) | boolean) => void] => {
  const [folded, _setFolded] = useState<boolean>(defaultVal);

  useEffect(() => {
    (async () => {
      const val = (await chrome.storage.local.get(KEY))[KEY];
      if (val !== undefined) _setFolded(val);
    })();
  }, []);

  const setFolded = useCallback(
    (valOrCb: ((val: boolean) => boolean) | boolean) => {
      if (typeof valOrCb === 'function') {
        _setFolded((prevVal: boolean) => {
          const val = valOrCb(prevVal);
          chrome.storage.local.set({ [KEY]: val });
          return val;
        });
      } else {
        chrome.storage.local.set({ [KEY]: valOrCb });
        _setFolded(valOrCb);
      }
    },
    [],
  );

  return [folded, setFolded];
};
