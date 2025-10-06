chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'addToModlist') {
    chrome.storage.local.get(['modlist'], (result) => {
      let modlist = result.modlist || [];
      const existingMod = modlist.find(mod => mod.publishedFileId === message.modInfo.publishedFileId);
      
      if (!existingMod) {
        message.modInfo.addedAt = new Date().toISOString();
        modlist.push(message.modInfo);
        chrome.storage.local.set({ modlist: modlist }, () => {
          sendResponse({ success: true, message: 'Mod added to list' });
        });
      } else {
        sendResponse({ success: false, message: 'Mod already in list' });
      }
    });
    return true;
  }
});