import waitFor from './utils/waitFor';

chrome.runtime.onMessage.addListener((msg, sender: chrome.runtime.MessageSender, sendRes: (res: any) => void) => {
  console.log(JSON.stringify(msg));
});

((async () => {
  const elem = await waitFor('.notion-table_of_contents-block');

  const anotherToc = document.createElement('div');
  anotherToc.id = "another-toc"
  document.body.appendChild(anotherToc);

  const cloned = elem.cloneNode(true) as HTMLElement;
  for (const a of cloned.querySelectorAll('a')) {
    a.addEventListener('click', (event: Event) => {
      let blockId = a.href.replace(/^.+#/, '');
      blockId = `${blockId.slice(0, 8)}-${blockId.slice(8, 12)}-${blockId.slice(12, 16)}-${blockId.slice(16, 20)}-${blockId.slice(20)}`
      const target = document.querySelector<HTMLElement>(`[data-block-id="${blockId}"]`);
      if (!target) { return; }

      document.querySelector('.notion-frame .notion-scroller')?.scroll({
        top: target.offsetTop,
      });

      event.preventDefault();
    });
  }

  anotherToc.appendChild(cloned);

}))();