import React, { useEffect, useState } from "react";
import { waitFor } from "../utils";

export default () => {
  const [headings, setHeadings] = useState<{
    blockId: string;
    text: string;
    rank: number;
  }[]>([]);

  const handleClick = (event: React.MouseEvent<HTMLParagraphElement, MouseEvent>, blockId: string) => {
    const target = document.querySelector<HTMLElement>(`[data-block-id="${blockId}"]`);
    if (!target) { return; }

    document.querySelector('.notion-frame .notion-scroller')?.scroll({
      top: target.offsetTop,
    });
    event.preventDefault();
  };

  useEffect(() => {
    (async () => {
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
        newHeadings = headings.map(heading => ({
          ...heading,
          rank: heading.rank - 1,
        }));
      }
      setHeadings(newHeadings);
    })();
  }, []);

  return <>
    {
      headings.map(
        heading => (
          <p
            className={`h${heading.rank}`}
            key={heading.blockId}
            onClick={(event) => handleClick(event, heading.blockId)}
          >
            <a href="#">
              {heading.rank}: {heading.text}
            </a>
          </p>
        )
      )
    }
  </>
};