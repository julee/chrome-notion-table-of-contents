console.log(chrome.scripting);
chrome.runtime.sendMessage({ action: 'mount' }).catch((e) => console.error(e));
