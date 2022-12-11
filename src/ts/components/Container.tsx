import React, { useEffect, useLayoutEffect, useState } from 'react';
import { LOCALE } from '../constants';
import { waitFor } from '../utils';
import Header from './Header';
import Headings from './Headings';
import { useFolded } from './hooks/container';

export default function Container() {
  console.info('# render container');

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [pageChangedTime, setPageChangedTime] = useState<number>(0);
  const [folded, setFolded] = useFolded(true);
  const [locale, setLocale] = useState<Locale>(LOCALE.EN);

  useLayoutEffect(() => {
    (async () => {
      const elem = await waitFor('.notion-light-theme,.notion-dark-theme');
      setTheme(elem.matches('.notion-light-theme') ? 'light' : 'dark');
    })();
    (async () => {
      await waitFor('#notion-app');

      const locale = document
        .querySelector('#messages') // TODO: waitFor に timeout 実装したら waitFor に寄せたい
        ?.getAttribute('data-locale');

      if (locale && (Object.values(LOCALE) as string[]).includes(locale))
        setLocale(locale as Locale);
    })();
  }, []);

  useEffect(() => {
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
    <div
      className={`toc-container ${
        theme === 'light' ? 'theme-light' : 'theme-dark'
      }`}
    >
      <Header locale={locale} folded={folded} setFolded={setFolded} />
      {folded || (
        <>
          <Headings pageChangedTime={pageChangedTime} />
        </>
      )}
    </div>
  );
}
