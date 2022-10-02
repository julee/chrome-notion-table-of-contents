import React from "react";
import ReactDOM from "react-dom";
import HeadingsContainer from './components/headings';
import { Headings as HeadingsType } from './types';
import waitFor from './utils/waitFor';

// clicked browserAction
chrome.runtime.onMessage.addListener(() => {
});

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