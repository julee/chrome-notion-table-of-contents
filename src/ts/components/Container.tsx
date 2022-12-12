import React, { useEffect, useLayoutEffect, useState } from 'react';
import { LOCALE, THEME } from '../constants';
import { waitFor } from '../utils';
import Header from './Header';
import Headings from './Headings';
import { useFolded } from './hooks/container';

export default function Container() {
  console.info('# render container');

  const [theme, setTheme] = useState<Theme>(THEME.LIGHT);
  const [pageChangedTime, setPageChangedTime] = useState<number>(0);
  const [folded, setFolded] = useFolded(false);
  const [locale, setLocale] = useState<Locale>(LOCALE.EN);
  const [hidden, setHidden] = useState<boolean>(true);

  useLayoutEffect(() => {
    (async () => {
      const elem = await waitFor('.notion-light-theme,.notion-dark-theme');
      setTheme(elem.matches('.notion-light-theme') ? THEME.LIGHT : THEME.DARK);
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

  // NOTE: 本来なら hidden: true の場合はコンポーネントごと描画しない方がスマートだが
  // そうするためには headings の抽出処理を Headings.tsx からこのコンポーネントにリフトアップする必要があり
  // (コンポーネントごと表示しない場合、Headings.tsx の useEffect が呼ばれない
  //  == pageChangedTime が変わっても再描画できない)
  // それはいささか大手術(だし、headings の生成をこのコンポーネントでやるのも、責務分担的にどうなのよ...)
  // なので、いったんは display: none で凌ぐ
  return (
    <div
      className={['toc-container', `toc-theme-${theme}`].join(' ')}
      {...(hidden && { style: { display: 'none' } })}
    >
      <Header locale={locale} folded={folded} setFolded={setFolded} />
      {folded || (
        <>
          <Headings
            locale={locale}
            pageChangedTime={pageChangedTime}
            setHidden={setHidden}
          />
        </>
      )}
    </div>
  );
}
