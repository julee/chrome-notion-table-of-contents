chrome.action.onClicked.addListener(() => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs: chrome.tabs.Tab[]) => {
    // TODO: error handleing (when content script is not loaded)
    chrome.tabs.sendMessage(tabs[0]?.id ?? 0, {});
  });
});