const sendToActiveTab = async (req: { type: string }) => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  try {
    await chrome.tabs.sendMessage(tabs[0]?.id ?? 0, req);
  } catch (error) {
    if (error)
      console.info({
        message: `tabs.sendMessage(${JSON.stringify(
          req,
        )}) failed. Maybe content script is not loaded yet`,
        error,
      });
  }
};
chrome.webNavigation.onHistoryStateUpdated.addListener(
  () => {
    sendToActiveTab({ type: 'MOVE_PAGE' });
  },
  { url: [{ hostEquals: 'www.notion.so' }] },
);

let mounted = false;
chrome.action.onClicked.addListener(async () => {
  if (mounted) {
    sendToActiveTab({ type: 'CLICK_ACTION' });
    return;
  }
  mounted = true;

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs.length === 0) throw new Error('no active tabs');
  const tabId = tabs[0].id ?? 0;

  chrome.scripting
    .executeScript({
      target: { tabId },
      files: ['./js/vendor.js', './js/mount.js'],
    })
    // TODO: これで大丈夫...?
    .catch((e) => console.error(e));
  chrome.scripting
    .insertCSS({
      target: { tabId },
      files: ['./css/style.css'],
    })
    .catch((e) => console.error(e));
});
