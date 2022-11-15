chrome.webNavigation.onHistoryStateUpdated.addListener(
  async (
    detail: chrome.webNavigation.WebNavigationTransitionCallbackDetails,
  ) => {
    const mounted = await hasMounted(detail.tabId);
    console.log(mounted);
    if (mounted) sendMessage(detail.tabId, { type: 'MOVE_PAGE' });
  },
  { url: [{ hostEquals: 'www.notion.so' }] },
);

chrome.action.onClicked.addListener(async (tab: chrome.tabs.Tab) => {
  /*
    タブに対し mount が一位でなければならない。
    しかし hash で持つとメモリリーク ... 。
    そもそも hash に持つのが駄目
    ページが変わっても tab id は一緒だから(document idがある)
    -> ドキュメントに何か
  */
  if (tab.id === undefined)
    throw new Error(`tab.id is undefined. tab: ${JSON.stringify(tab)}`);

  if (await hasMounted(tab.id)) {
    sendMessage(tab.id, { type: 'CLICK_ACTION' });
    return;
  }

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs.length === 0) throw new Error('no active tabs');
  const tabId = tabs[0].id ?? 0;

  chrome.scripting
    .executeScript({
      target: { tabId },
      files: ['./js/vendor.js', './js/mount.js'],
    })
    .catch((e) => console.error(e));
  chrome.scripting
    .insertCSS({
      target: { tabId },
      files: ['./css/style.css'],
    })
    .catch((e) => console.error(e));
});

async function hasMounted(tabId: number) {
  return (
    await chrome.scripting.executeScript({
      target: { tabId },
      func: () => !!document.querySelector('.toc-has-mounted'),
    })
  )[0].result;
}

async function sendMessage(tabId: number, req: { type: string }) {
  console.log('# ' + req.type);
  try {
    await chrome.tabs.sendMessage(tabId ?? 0, req);
  } catch (error) {
    if (error)
      throw new Error(
        `tabs.sendMessage(${JSON.stringify(
          req,
        )}) failed. \norig error: ${error}`,
      );
  }
}
