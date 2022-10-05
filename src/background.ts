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