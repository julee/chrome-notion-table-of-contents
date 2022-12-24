import { useCallback, useState } from 'react';

import { waitFor } from '../../utils';

export const useHasScrollBar = (): [boolean, () => Promise<void>] => {
  const [hasScrollbar, _setHasScrollbar] = useState(false);

  const setHasScrollbar = useCallback(async () => {
    const elem = await waitFor('.toc-headings');
    _setHasScrollbar(elem ? elem.scrollHeight > elem.clientHeight : false);
  }, []);

  return [hasScrollbar, setHasScrollbar];
};
