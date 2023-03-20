import { useAtomValue, useSetAtom } from 'jotai';
import React, {
  ReactNode,
  Suspense,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { throttle } from 'throttle-debounce';
import {
  handlePageMoveAtom,
  handleResizeAtom,
  wholeFoldedAtom,
} from '../../atoms';
import { THEME, THROTTLE_TIME } from '../../constants';
import { usePageChangeEvent as usePageMoveEvent } from '../../hooks';
import { waitFor } from '../../utils';
import Header from '../Header/Header';
import Headings from '../Headings/Headings';
import TailFoldButton from '../TailFoldButton/TailFoldButton';
import './common.pcss';
import './customProperties.css';
import { ThemeContext, useTheme } from './hooks';
import './styles.pcss';

const Main = () => {
  const theme = useTheme();
  const wholeFolded = useAtomValue(wholeFoldedAtom);

  const handlePageMove = useSetAtom(handlePageMoveAtom);
  const handleResize = useSetAtom(handleResizeAtom);

  useEffect(() => {
    const fn = throttle(() => handleResize(), THROTTLE_TIME);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
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

const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(THEME.LIGHT);

  // set theme
  useLayoutEffect(() => {
    (async () => {
      const elem = await waitFor('.notion-light-theme,.notion-dark-theme');
      setTheme(elem.matches('.notion-light-theme') ? THEME.LIGHT : THEME.DARK);
    })();
  }, []);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export default function App() {
  return (
    <ThemeContextProvider>
      <Suspense fallback={<div></div>}>
        <Main />
      </Suspense>
    </ThemeContextProvider>
  );
}
