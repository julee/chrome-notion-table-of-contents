const UrlFilter = { urlPrefix: 'https://www.notion.so' };

chrome.webNavigation.onHistoryStateUpdated.addListener(
  async (
    detail: chrome.webNavigation.WebNavigationTransitionCallbackDetails,
  ) => {
    const mounted = await hasMounted(detail.tabId);
    if (mounted) sendMessage(detail.tabId, { type: 'MOVE_PAGE' });
  },
  { url: [UrlFilter] },
);

chrome.action.onClicked.addListener(async (tab: chrome.tabs.Tab) => {
  if (tab.id === undefined)
    throw new Error(`tab.id is undefined. tab: ${JSON.stringify(tab)}`);

  if (await hasMounted(tab.id)) {
    sendMessage(tab.id, { type: 'CLICK_ACTION' });
    return;
  }

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs.length === 0) throw new Error('no active tabs');
  const tabId = tabs[0].id ?? 0;

  await Promise.all([
    chrome.scripting.executeScript({
      target: { tabId },
      files: ['./js/vendor.js', './js/mount.js'],
    }),
    chrome.scripting.insertCSS({
      target: { tabId },
      files: ['./css/style.css'],
    }),
  ]);
});

chrome.runtime.onInstalled.addListener(async () => {
  chrome.action.disable();
  // Promise is not supported
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: UrlFilter,
            css: ['main'],
          }),
        ],
        actions: [new chrome.declarativeContent.ShowAction()],
      },
    ]);
  });
});

// ========================================
// Utils
// ========================================

async function hasMounted(tabId: number) {
  return (
    await chrome.scripting.executeScript({
      target: { tabId },
      func: () => !!document.querySelector('.toc-has-mounted'),
    })
  )[0].result;
}

async function sendMessage(tabId: number, req: { type: string }) {
  console.info('# ' + req.type);
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
