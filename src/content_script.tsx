import React, { useState } from "react";
import ReactDOM from "react-dom";
import waitFor from './utils/waitFor';

// clicked browserAction
chrome.runtime.onMessage.addListener((msg, sender: chrome.runtime.MessageSender, sendRes: (res: any) => void) => {
  console.log(JSON.stringify(msg));
});

type HeadingsType = { rank: number; text: string, blockId: string }[];

const extractHeadings = (parent: HTMLElement): HeadingsType => {
  let headings = [];
  for (const heading of parent.querySelectorAll('[placeholder="Heading 1"],[placeholder="Heading 2"],[placeholder="Heading 3"]')) {
    headings.push({
      text: heading.textContent || '',
      rank: Number((heading.getAttribute('placeholder') || '').replace(/^Heading /, '')),
      blockId: (heading.parentNode?.parentNode as Element).getAttribute('data-block-id') || '',
    });
  }
  if (headings.length !== 0 && Math.min.apply(null, headings.map(h => h.rank)) !== 1) {
    headings = headings.map(heading => ({
      ...heading,
      rank: heading.rank - 1,
    }));
  }
  return headings;
};

const Headings = ({ headings }: { headings: HeadingsType }) => {
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

const HeadingsContainer = ({ headings }: { headings: HeadingsType }) => {
  const [visible, setVisible] = useState(true);
  const [isFolding, setFolding] = useState(false);
  const handleClose = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    setVisible(false);
    return event.preventDefault();
  };
  const toggleFolding = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    setFolding(prev => !prev);
    return event.preventDefault();
  };

  if (!visible) {
    return null
  }

  if (isFolding) {
    return (
      <p><a href="#" onClick={toggleFolding}>[Expand]</a></p>

    );
  }

  // TODO: p はもう少しまともなマークアップにした方が ...
  return (
    <>
      <p>
        <a href="#" onClick={toggleFolding}>[Fold]</a>
        <a href="#" onClick={handleClose}>[Close]</a>
      </p>
      <Headings headings={headings} />
    </>
  );
};

((async () => {
  // const pageContent = await waitFor('.notion-table_of_contents-block');
  const pageContent = (await waitFor('.notion-frame .notion-scroller'))[0];

  const container = document.createElement('div');
  container.id = "toc-container"
  document.body.appendChild(container);

  const headings = extractHeadings(pageContent);

  ReactDOM.render(
    <HeadingsContainer headings={headings} />,
    container,
  );
}))();