import { useState, useEffect } from "react";
import type { ModItem, ChromeMessage } from "../types";

export const useChromeExtension = () => {
  const [modlist, setModlist] = useState<ModItem[]>([]);
  const [isOnSteamPage, setIsOnSteamPage] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0] as { url?: string };
      if (currentTab?.url?.includes("steamcommunity.com")) {
        setIsOnSteamPage(true);
      }
    });

    chrome.storage.local.get(["modlist"], (result) => {
      const typedResult = result as { modlist?: ModItem[] };
      if (typedResult.modlist) {
        setModlist(typedResult.modlist);
      }
    });

    const messageListener = (
      message: unknown,
      _sender: unknown,
      sendResponse: (response?: unknown) => void
    ) => {
      const typedMessage = message as ChromeMessage;
      if (typedMessage.action === "modAdded" && typedMessage.modInfo) {
        setModlist((prev) => [...prev, typedMessage.modInfo!]);
        sendResponse({ success: true });
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const updateModlist = (newModlist: ModItem[]) => {
    setModlist(newModlist);
    chrome.storage.local.set({ modlist: newModlist });
  };

  return {
    modlist,
    isOnSteamPage,
    updateModlist,
  };
};
