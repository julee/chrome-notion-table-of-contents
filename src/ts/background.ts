const URL_FILTER = { urlPrefix: 'https://www.notion.so' };

chrome.runtime.onInstalled.addListener(async () => {
  chrome.action.disable();
  // Promise is not supported
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: URL_FILTER,
          }),
        ],
        actions: [new chrome.declarativeContent.ShowAction()],
      },
    ]);
  });
});

// この hasMounted (内部で executeScript() ) のために host_permissions が必要
// action の click はユーザー操作起点なので activeTab で賄えるが
// これはユーザー操作で **ない** ので賄えない
chrome.webNavigation.onHistoryStateUpdated.addListener(
  async (detail) => {
    if (await hasMounted(detail.tabId))
      sendMessage(detail.tabId, { type: 'CHANGE_PAGE' });
  },
  { url: [URL_FILTER] },
);

// ========================================
// Utils
// ========================================

async function hasMounted(tabId: number) {
  return (
    await chrome.scripting.executeScript({
      target: { tabId },
      func: () => !!document.querySelector('.toc-react-root'),
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
