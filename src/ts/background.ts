const URL_FILTER = { urlPrefix: 'https://www.notion.so' };

chrome.webNavigation.onHistoryStateUpdated.addListener(
  async (detail) => {
    try {
      await sendMessage(detail.tabId, { type: 'CHANGE_PAGE' });
    } catch (error) {
      // content script がロードされる以前に送信すると当然エラーになり、その場合は無視する
      // executeScript を駆使して content script がロードするかチェックする術もあるが
      // 通信が 1 往復多くなるし、
      // そのためだけに scripting permission を使う理由を審査時に説明するのもだるいし ... 。
      if (!(error + '').match(/Could not establish connection/)) throw error;
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
        `tabs.sendMessage(${JSON.stringify(req)}) failed.\n` +
          (error instanceof Error ? error.message : error),
      );
  }
}
