import React, { ReactNode, useLayoutEffect, useReducer, useState } from 'react';
import { ACTION, THEME } from '../../constants';
import { usePageChangeEvent } from '../../hooks';
import { waitFor } from '../../utils';
import { ExpandButton } from '../ExpandButton';
import Header from '../Header';
import Headings from '../Headings';
import './common.pcss';
import './customProperties.css';
import { ThemeContext, useTheme } from './hooks';
import { Reducer } from './reducer';
import './styles.pcss';

const Consumer = () => {
  const [tocUpdatedAt, setTocUpdatedAt] = useState<number>(Date.now());
  const theme = useTheme();

  const [{ tailFolded, wholeFolded, showsExpandButton, maxHeight }, dispatch] =
    useReducer(Reducer, {
      tailFolded: true,
      wholeFolded: false,
      showsExpandButton: false,
      maxHeight: '26vh',
    });

  // ページ遷移したら畳む
  usePageChangeEvent(() => {
    dispatch({ type: ACTION.PAGE_CHANGED });
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
      <Consumer />
    </ThemeContextProvider>
  );
}
