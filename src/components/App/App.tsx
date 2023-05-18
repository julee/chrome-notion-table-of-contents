import { useAtomValue, useSetAtom } from 'jotai';
import React, { Suspense, useEffect, useLayoutEffect, useState } from 'react';
import { throttle } from 'throttle-debounce';
import {
  handlePageMoveAtom,
  handleResizeAtom,
  wholeFoldedAtom,
} from '../../atoms';
import { THEME, THROTTLE_TIME } from '../../constants';
import { usePageMoveEvent } from '../../hooks';
import type { Theme } from '../../types';
import { waitFor } from '../../utils';
import Header from '../Header/Header';
import Headings from '../Headings/Headings';
import TailFoldButton from '../TailFoldButton/TailFoldButton';

import './common.pcss';
import './customProperties.css';
import './styles.pcss';

const Main = () => {
  const [theme, setTheme] = useState<Theme>(THEME.LIGHT);
  const wholeFolded = useAtomValue(wholeFoldedAtom);

  const handlePageMove = useSetAtom(handlePageMoveAtom);
  const handleResize = useSetAtom(handleResizeAtom);

  useEffect(() => {
    const fn = throttle(() => handleResize(), THROTTLE_TIME);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  useLayoutEffect(() => {
    (async () => {
      const elem = await waitFor('.notion-light-theme,.notion-dark-theme');
      setTheme(elem.matches('.notion-light-theme') ? THEME.LIGHT : THEME.DARK);
    })();
  }, []);

  usePageMoveEvent(() => {
    handlePageMove();
  });

  return (
    <div className={`toc-container toc-theme-${theme}`}>
      <Header />
      {/* TODO: 閉じてる間描画しない仕様にしても良いかもしれない */}
      <div {...(wholeFolded && { className: 'toc-hidden' })}>
        <Headings />
        <TailFoldButton />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Suspense fallback={<div></div>}>
      <Main />
    </Suspense>
  );
}
