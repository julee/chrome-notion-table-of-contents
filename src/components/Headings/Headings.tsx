import React, { memo } from 'react';
import Heading from '../Heading/Heading';
import { useHeadings } from './hooks';
import './styles.pcss';

// MEMO: 描画コストが高いので、useMemo したほうが良さそう ... に一見思われるが
//       重い処理は useEffect でしか行われないので問題ない
export default memo(function Headings({
  maxHeight,
  dispatch,
}: {
  maxHeight: string;
  dispatch: React.Dispatch<{ type: string }>;
}) {
  const headings = useHeadings({ dispatch });

  return headings.length > 0 ? (
    <div className="toc-headings" style={{ maxHeight }}>
      {headings.map((heading) => (
        <Heading key={heading.blockId} {...heading} />
      ))}
    </div>
  ) : (
    <p className="toc-no-headings">{chrome.i18n.getMessage('NO_HEADINGS')}</p>
  );
});
