import React, { useEffect, useLayoutEffect, useState } from 'react';
import { THEME } from '../../constants';
import { waitFor } from '../../utils';
import { ExpandButton } from '../ExpandButton';
import Header from '../Header';
import Headings from '../Headings';
import { useFolded, useMaxheight } from './hooks';

export default function App() {
  const [theme, setTheme] = useState<Theme>(THEME.LIGHT);
  const [pageLoadedAt, setPageLoadedAt] = useState<number>(Date.now());
  const [tocUpdatedAt, setTocUpdatedAt] = useState<number>(Date.now());
  const { folded, setFolded } = useFolded(false);
  const { maxHeight, toggleMaxHeight, isDefaultMaxHeight } = useMaxheight();

  // set theme
  useLayoutEffect(() => {
    (async () => {
      const elem = await waitFor('.notion-light-theme,.notion-dark-theme');
      setTheme(elem.matches('.notion-light-theme') ? THEME.LIGHT : THEME.DARK);
    })();
  }, []);

  // set paageLoadedAt
  useEffect(() => {
    chrome.runtime.onMessage.addListener(({ type }: { type: string }) => {
      switch (type) {
        case 'CHANGE_PAGE':
          setPageLoadedAt(Date.now());
          break;

        default:
          throw new Error(`unknown type: ${type}`);
      }
    });
  }, []);

  return (
    <div className={`toc-container toc-theme-${theme}`}>
      <Header folded={folded} setFolded={setFolded} />
      {/* display: none という手もあるが、畳みっぱなしにしてる裏で計算が
          走り続けるのはどうかと思うので、今のところは採用しない */}
      {folded || (
        <>
          <Headings
            maxHeight={maxHeight}
            pageLoadedAt={pageLoadedAt}
            setTocUpdatedAt={setTocUpdatedAt}
          />
          <ExpandButton
            toggleMaxHeight={toggleMaxHeight}
            isDefaultMaxHeight={isDefaultMaxHeight}
            tocUpdatedAt={tocUpdatedAt}
          />
        </>
      )}
    </div>
  );
}
