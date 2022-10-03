import React, { useEffect, useState } from 'react';
import { waitFor } from '../utils';

export default () => {
  const [headings, setHeadings] = useState<{
    blockId: string;
    text: string;
    rank: number;
  }[]>([]);
  console.log('# render heading');

  const handleClick = (blockId: string) => {
    const target = document.querySelector<HTMLElement>(`[data-block-id="${blockId}"]`);
    if (!target) { return; }

    document.querySelector('.notion-frame .notion-scroller')?.scroll({
      top: target.offsetTop,
    });
  };

  useEffect(() => {
    (async () => {
      console.log('# fetch heading');

      let newHeadings = [...headings];
      const pageContent = (await waitFor('.notion-frame .notion-scroller'))[0];
      for (const heading of pageContent.querySelectorAll('[placeholder="Heading 1"],[placeholder="Heading 2"],[placeholder="Heading 3"]')) {
        newHeadings.push({
          text: heading.textContent || '',
          rank: Number((heading.getAttribute('placeholder') || '').replace(/^Heading /, '')),
          blockId: (heading.parentNode?.parentNode as Element).getAttribute('data-block-id') || '',
        });
      }
      if (headings.length !== 0 && Math.min.apply(null, headings.map(h => h.rank)) !== 1) {
        newHeadings = headings.map(heading => {
          heading.rank--;
          return heading;
        });
      }
      setHeadings(newHeadings);
    })();
  }, []);

  return <>
    {
      headings.map(
        heading => (
          <p
            className={`h${heading.rank} heading`}
            key={heading.blockId}
            onClick={() => handleClick(heading.blockId)}
          >
            <span className="clickable">
              {heading.rank}: {heading.text}
            </span>
          </p>
        )
      )
    }
  </>;
};