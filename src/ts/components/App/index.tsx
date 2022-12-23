import React, { useEffect, useLayoutEffect, useState } from 'react';
import { throttle } from 'throttle-debounce';
import { THEME, THROTTLE_TIME } from '../../constants';
import { waitFor } from '../../utils';
import { FoldIcon } from '../FoldIcon';
import Header from '../Header';
import Headings from '../Headings';
import { useFolded } from './hooks';

const defaultMaxHeight = '30vh';

// expand -> max-height を画面限界まで (setMaxHeight)
// fold -> fold する                 (setFolded)
//    maxHeight も default に戻す

// re-e

const ExpandButton = ({
  maxHeight,
  setFolded,
  setMaxHeight,
}: {
  maxHeight: string;
  setFolded: ReturnType<typeof useFolded>[1];
  setMaxHeight: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleClick = () => {
    setMaxHeight((prevHeight) => {
      if (prevHeight === defaultMaxHeight) {
        // fold -> expand
        return 'calc(100vh - 213px)'; // TODO: 後で調整
      } else {
        setFolded(true);
        return defaultMaxHeight;
      }
    });
  };
  return (
    <div className="toc-expand-button" onClick={() => handleClick()}>
      <FoldIcon direction={maxHeight === defaultMaxHeight ? 'down' : 'up'} />
    </div>
  );
};

export default function App() {
  console.info('# render container');

  const [theme, setTheme] = useState<Theme>(THEME.LIGHT);
  const [pageChangedTime, setPageChangedTime] = useState<number>(0);
  const [folded, setFolded] = useFolded(false);
  const [maxHeight, setMaxHeight] = useState(defaultMaxHeight);
  const [hasScrollbar, setHasScrollbar] = useState(false);

  // set theme
  useLayoutEffect(() => {
    (async () => {
      const elem = await waitFor('.notion-light-theme,.notion-dark-theme');
      setTheme(elem.matches('.notion-light-theme') ? THEME.LIGHT : THEME.DARK);
    })();
  }, []);

  // set hasScrollbar
  useEffect(() => {
    const fn = throttle(() => {
      const elem = document.querySelector('.toc-headings');
      setHasScrollbar(elem ? elem.scrollHeight > elem.clientHeight : false);
    }, THROTTLE_TIME);
    (async () => {
      await waitFor('main');
      window.addEventListener('resize', fn);
      fn();
    })();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    // 現状 Headings でしか使っていないが、将来的に
    // 他のコンポーネントが使う message を受け取る可能性もあるので、ここに置く
    chrome.runtime.onMessage.addListener(({ type }: { type: string }) => {
      switch (type) {
        case 'CHANGE_PAGE':
          setPageChangedTime(Date.now());
          break;

        default:
          throw new Error(`unknown type: ${type}`);
      }
    });
  }, []);

  return (
    <div className={`toc-container toc-theme-${theme}`}>
      <Header folded={folded} setFolded={setFolded} />
      {folded || (
        <>
          <Headings maxHeight={maxHeight} pageChangedTime={pageChangedTime} />
          {hasScrollbar && (
            <ExpandButton
              maxHeight={maxHeight}
              setFolded={setFolded}
              setMaxHeight={setMaxHeight}
            />
          )}
        </>
      )}
    </div>
  );
}
