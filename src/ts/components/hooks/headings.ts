import { useCallback, useRef, useState } from 'react';

export const useHeadings = (
  defaultVal: Headings,
  setHidden: React.Dispatch<React.SetStateAction<boolean>>,
): [
  Headings,
  (valOrFunction: Headings | ((headings: Headings) => Headings)) => void,
  React.MutableRefObject<Headings | null>,
] => {
  const [headings, _setHeadings] = useState<Headings>(defaultVal);
  const headingsRef = useRef<Headings | null>(null);

  const setHeadings = useCallback(
    (valOrFunction: Headings | ((headings: Headings) => Headings)) => {
      if (typeof valOrFunction === 'function') {
        _setHeadings((prevHeadings) => {
          const newHeadings = valOrFunction(prevHeadings);
          headingsRef.current = newHeadings;
          setHidden(newHeadings.length === 0);
          return newHeadings;
        });
      } else {
        headingsRef.current = valOrFunction;
        setHidden(valOrFunction.length === 0);
        _setHeadings(valOrFunction);
      }
    },
    [],
  );
  return [headings, setHeadings, headingsRef];
};
