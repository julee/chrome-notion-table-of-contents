import React, { useLayoutEffect, useState } from 'react';
import { THEME } from '../../constants';
import { usePageChangeEvent } from '../../hooks';
import { waitFor } from '../../utils';
import { ExpandButton } from '../ExpandButton';
import Header from '../Header';
import Headings from '../Headings';
import { useTailFolded, useWholeFolded } from './hooks';

export default function App() {
  const [theme, setTheme] = useState<Theme>(THEME.LIGHT);
  const [tocUpdatedAt, setTocUpdatedAt] = useState<number>(Date.now());
  const { wholeFolded, setWholeFolded } = useWholeFolded(false);
  const { tailFolded, maxHeight, setTailFolded } = useTailFolded(true);

  // set theme
  useLayoutEffect(() => {
    (async () => {
      const elem = await waitFor('.notion-light-theme,.notion-dark-theme');
      setTheme(elem.matches('.notion-light-theme') ? THEME.LIGHT : THEME.DARK);
    })();
  }, []);

  // ページ遷移したら畳む
  usePageChangeEvent(() => {
    setTailFolded(true);
  });

  return (
    <div className={`toc-container toc-theme-${theme}`}>
      <Header wholeFolded={wholeFolded} setWholeFolded={setWholeFolded} />
      {/* TODO: 閉じてる間描画しない仕様にしても良いかもしれない */}
      <div {...(wholeFolded && { className: 'toc-hidden' })}>
        <Headings maxHeight={maxHeight} setTocUpdatedAt={setTocUpdatedAt} />
        <ExpandButton
          tocUpdatedAt={tocUpdatedAt}
          isWholeFolded={wholeFolded}
          tailFolded={tailFolded}
          setTailFolded={setTailFolded}
        />
      </div>
    </div>
  );
}
