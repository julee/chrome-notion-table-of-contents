chrome.action.onClicked.addListener(() => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs: chrome.tabs.Tab[]) => {
    chrome.tabs.sendMessage(tabs[0]?.id ?? 0, {});
  });
});