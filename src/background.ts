const sendToActiveTab = async (req: { type: string }) => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  try {
    await chrome.tabs.sendMessage(tabs[0]?.id ?? 0, req);
  } catch (error) {
    if (error)
      console.error({
        message: 'tabs.sendMessage failed. Maybe content script is not loaded yet',
        error,
      });
  }
};
chrome.action.onClicked.addListener(() => {
  sendToActiveTab({ type: 'CLICK_ACTION' });
});

chrome.webNavigation.onHistoryStateUpdated.addListener(
  () => { sendToActiveTab({ type: 'MOVE_PAGE' }); },
  { url: [{ hostEquals: 'www.notion.so' }] },
);
