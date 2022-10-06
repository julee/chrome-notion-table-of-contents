chrome.action.onClicked.addListener(async () => {
  const tabs = await chrome.tabs.query({active: true, currentWindow: true});
  try {
    await chrome.tabs.sendMessage(tabs[0]?.id ?? 0, {});
  } catch (error) {
    if (error)
      console.error({
        message: 'tabs.sendMessage failed. Maybe content script is not loaded yet',
        error,
      });
  }
});

// ページ内遷移では発火しない
// let origin: string|null;
let HAS_UPDATED_ONCE = false;
chrome.webNavigation.onHistoryStateUpdated.addListener((details: chrome.webNavigation.WebNavigationTransitionCallbackDetails)=> {
  console.log(details.url);

  if (!HAS_UPDATED_ONCE) { // 1 回目はここで蹴られる
    console.log('1');
    HAS_UPDATED_ONCE = true;
    return;
  }
  console.log('3');

  // console.log(details);
}, {url: [{hostEquals: 'www.notion.so'}]});
