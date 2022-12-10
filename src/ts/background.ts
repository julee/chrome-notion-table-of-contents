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
    const mounted = await hasMounted(detail.tabId).catch((e) => {
      console.trace(e);
      throw e;
    });
    if (mounted) sendMessage(detail.tabId, { type: 'CHANGE_PAGE' });
  },
  { url: [URL_FILTER] },
);

// ========================================
// Utils
// ========================================

// TODO ロジック変える
async function hasMounted(tabId: number) {
  // 手動でリンクをクリックしたものでないイベント。初回ロード時など
  // host_permissions があればこの行は要らない
  if (!chrome.scripting) console.log('chrome.scripting is undefined');
  if (!chrome.scripting) return false;

  console.log(tabId);
  const r = (
    await chrome.scripting
      .executeScript({
        target: { tabId },
        func: () => !!document.querySelector('.toc-react-root'),
      })
      .catch((e) => {
        console.warn(e);
        throw e;
      })
  )[0].result;

  return r;
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
