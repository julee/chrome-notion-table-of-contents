import React from "react";
import { Headings as HeadingsType } from '../types';

export default ({ headings }: { headings: HeadingsType }) => {
  const handleClick = (event: React.MouseEvent<HTMLParagraphElement, MouseEvent>, blockId: string) => {
    const target = document.querySelector<HTMLElement>(`[data-block-id="${blockId}"]`);
    if (!target) { return; }

    document.querySelector('.notion-frame .notion-scroller')?.scroll({
      top: target.offsetTop,
    });
    event.preventDefault();
  };
  return <>
    {
      headings.map(
        heading => (
          <p className={`h${heading.rank}`} key={heading.blockId} onClick={(event) => handleClick(event, heading.blockId)}>
            <a href="#">
              {heading.rank}: {heading.text}
            </a>
          </p>
        )
      )
    }
  </>
};