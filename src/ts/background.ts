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

chrome.webNavigation.onHistoryStateUpdated.addListener(
  async (detail) => {
    if (
      // このために host_permissions が必要
      // これが呼ばれるより前にユーザー操作(click action など)があれば activeTab で賄える
      // (が、そのような操作は現状ではしない)
      (
        await chrome.scripting.executeScript({
          target: { tabId: detail.tabId },
          func: () => !!document.querySelector('.toc-can-receive-messages'),
        })
      )[0].result
    ) {
      sendMessage(detail.tabId, { type: 'CHANGE_PAGE' });
    }
  },
  { url: [URL_FILTER] },
);

// ========================================
// Utils
// ========================================
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
