import { useCallback, useRef, useState } from 'react';

export const useHeadings = (
  defaultVal: Headings,
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
          return newHeadings;
        });
      } else {
        _setHeadings(valOrFunction);
        headingsRef.current = valOrFunction;
      }
    },
    [],
  );
  return [headings, setHeadings, headingsRef];
};
