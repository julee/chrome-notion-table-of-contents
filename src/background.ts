const sendToActiveTab = async (req: { type: string }) => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  try {
    await chrome.tabs.sendMessage(tabs[0]?.id ?? 0, req);
  } catch (error) {
    if (error)
      console.error({
        message:
          'tabs.sendMessage failed. Maybe content script is not loaded yet',
        error,
      });
  }
};
chrome.action.onClicked.addListener(() => {
  sendToActiveTab({ type: 'CLICK_ACTION' });
});

chrome.webNavigation.onHistoryStateUpdated.addListener(
  () => {
    sendToActiveTab({ type: 'MOVE_PAGE' });
  },
  { url: [{ hostEquals: 'www.notion.so' }] },
);

chrome.runtime.onMessage.addListener(
  ({ action }: { action: string }, sender: chrome.runtime.MessageSender) => {
    switch (action) {
      case 'mount':
        chrome.scripting
          .executeScript(
            {
              target: { tabId: sender.tab?.id ?? 0 },
              files: ['js/mount.js'],
            },
            // TODO: "permissions": ["activeTab", "scripting"], どっちかでええやろ
          )
          // TODO: これで大丈夫...?
          .catch((e) => console.error(e));
        chrome.scripting
          .insertCSS({
            target: { tabId: sender.tab?.id ?? 0 },
            files: ['css/style.css'],
          })
          .catch((e) => console.error(e));
        break;
      default:
        throw new Error(`unknown action: ${action}`);
    }
  },
);
