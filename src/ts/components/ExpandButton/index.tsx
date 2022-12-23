import React, { useEffect, useState } from 'react';
import { throttle } from 'throttle-debounce';
import { THROTTLE_TIME } from '../../constants';
import { waitFor } from '../../utils';
import { FoldIcon } from '../FoldIcon';

const defaultMaxHeight = '30vh';

export const ExpandButton = ({
  maxHeight,
  setMaxHeight,
  pageChangedTime,
}: {
  maxHeight: string;
  setMaxHeight: React.Dispatch<React.SetStateAction<string>>;
  pageChangedTime: number;
}) => {
  const [hasScrollbar, setHasScrollbar] = useState(false);

  console.log('# render ExpandButton');
  // set hasScrollbar
  useEffect(() => {
    const fn = throttle(async () => {
      const elem = await waitFor('.toc-headings');
      // ページを移動する際、以前のページのやつを掴んでしまう。どうするか？
      setHasScrollbar(elem ? elem.scrollHeight > elem.clientHeight : false);
    }, THROTTLE_TIME);

    (async () => {
      console.log('# in async');
      window.addEventListener('resize', fn);
      fn();
    })();

    return () => window.removeEventListener('scroll', fn);
  }, [pageChangedTime]);

  const handleClick = () => {
    setMaxHeight((prevHeight) => {
      if (prevHeight === defaultMaxHeight) {
        return 'calc(100vh - 213px)';
      } else {
        return defaultMaxHeight;
      }
    });
  };
  return hasScrollbar ? (
    <div className="toc-expand-button" onClick={() => handleClick()}>
      <FoldIcon direction={maxHeight === defaultMaxHeight ? 'down' : 'up'} />
    </div>
  ) : null;
};
