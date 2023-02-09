import { useCallback, useState } from 'react';

import { waitFor } from '../../utils';

export const useHasScrollBar = () => {
  const [hasScrollbar, setHasScrollbar] = useState(false);

  return {
    hasScrollbar,
    calcHasScrollbar: useCallback(async () => {
      const elem = await waitFor('.toc-headings,.toc-no-headings');
      setHasScrollbar(elem ? elem.scrollHeight > elem.clientHeight : false);
    }, []),
  };
};
