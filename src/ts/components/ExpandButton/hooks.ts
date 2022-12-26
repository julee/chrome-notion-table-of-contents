import { useCallback, useState } from 'react';

import { waitFor } from '../../utils';

export const useHasScrollBar = () => {
  const [hasScrollbar, _setHasScrollbar] = useState(false);

  return {
    hasScrollbar,
    setHasScrollbar: useCallback(async () => {
      const elem = await waitFor('.toc-headings,.toc-no-headings');
      _setHasScrollbar(elem ? elem.scrollHeight > elem.clientHeight : false);
    }, []),
  };
};
