import React, { ReactNode, useLayoutEffect, useReducer, useState } from 'react';
import { ACTION, THEME } from '../../constants';
import { usePageChangeEvent } from '../../hooks';
import { waitFor } from '../../utils';
import { ExpandTailButton } from '../ExpandTailButton/ExpandTailButton';
import Header from '../Header/Header';
import Headings from '../Headings/Headings';
import './common.pcss';
import './customProperties.css';
import { ThemeContext, useTheme } from './hooks';
import { reducer } from './reducer';
import './styles.pcss';

const Consumer = () => {
  const theme = useTheme();

  const [
    { tailFolded, wholeFolded, showsExpandTailButton, maxHeight },
    dispatch,
  ] = useReducer(reducer, {
    tailFolded: true,
    wholeFolded: false,
    showsExpandTailButton: false,
    maxHeight: '26vh',
  });

  usePageChangeEvent(() => {
    dispatch({ type: ACTION.PAGE_CHANGED });
  });

  return (
    <div className={`toc-container toc-theme-${theme}`}>
      <Header wholeFolded={wholeFolded} dispatch={dispatch} />
      {/* TODO: 閉じてる間描画しない仕様にしても良いかもしれない */}
      <div {...(wholeFolded && { className: 'toc-hidden' })}>
        <Headings maxHeight={maxHeight} dispatch={dispatch} />
        <ExpandTailButton
          tailFolded={tailFolded}
          showsExpandTailButton={showsExpandTailButton}
          dispatch={dispatch}
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
