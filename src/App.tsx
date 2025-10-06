import { useState, useEffect } from "react";
import "./App.css";

interface ModItem {
  publishedFileId: string;
  modName: string;
  url: string;
  modIds: string[];
  mapFolders: string[];
  addedAt: string;
}

function App() {
  const [modlist, setModlist] = useState<ModItem[]>([]);
  const [isOnSteamPage, setIsOnSteamPage] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab?.url?.includes("steamcommunity.com")) {
        setIsOnSteamPage(true);
      }
    });

    chrome.storage.local.get(["modlist"], (result) => {
      if (result.modlist) {
        setModlist(result.modlist);
      }
    });

    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.action === "modAdded") {
        setModlist((prev) => [...prev, message.modInfo]);
        sendResponse({ success: true });
      }
    });
  }, []);

  const exportModlist = () => {
    const allModIds = new Set<string>();
    const allWorkshopItems = new Set<string>();
    const allMapFolders = new Set<string>();

    modlist.forEach((mod) => {
      allWorkshopItems.add(mod.publishedFileId);

      mod.modIds.forEach((modId) => allModIds.add(modId));

      mod.mapFolders.forEach((mapFolder) => allMapFolders.add(mapFolder));
    });

    const modlistText = `Mods=${Array.from(allModIds).join(
      ";"
    )};\n\nWorkshopItems=${Array.from(allWorkshopItems).join(
      ";"
    )};\n\nMap=${Array.from(allMapFolders).join(";")};\n`;

    const blob = new Blob([modlistText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    chrome.downloads.download({
      url: url,
      filename: `zomboid-modlist-${new Date().toISOString().split("T")[0]}.txt`,
    });
  };

  const clearModlist = () => {
    if (confirm("Are you sure you want to clear your modlist?")) {
      setModlist([]);
      chrome.storage.local.set({ modlist: [] });
    }
  };

  const removeMod = (publishedFileId: string) => {
    const updatedModlist = modlist.filter(
      (mod) => mod.publishedFileId !== publishedFileId
    );
    setModlist(updatedModlist);
    chrome.storage.local.set({ modlist: updatedModlist });
  };

  return (
    <div className="w-96 min-h-96 bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <h1 className="text-xl font-bold">Zomboid Modlist Helper</h1>
        <p className="text-sm opacity-90">Manage your Project Zomboid mods</p>
      </div>

      <div className="p-4">
        {!isOnSteamPage && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              📍 Navigate to a Steam Workshop page to add mods to your list
            </p>
          </div>
        )}

        <div className="flex gap-2 mb-4">
          <button
            onClick={exportModlist}
            disabled={modlist.length === 0}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
          >
            📥 Export List
          </button>
          <button
            onClick={clearModlist}
            disabled={modlist.length === 0}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
          >
            🗑️ Clear All
          </button>
        </div>

        <div className="mb-2">
          <h2 className="text-lg font-semibold text-gray-800">
            Your Modlist ({modlist.length})
          </h2>
        </div>

        <div className="max-h-80 overflow-y-auto space-y-2">
          {modlist.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📋</div>
              <p>No mods added yet</p>
              <p className="text-sm">Visit Steam Workshop pages to add mods</p>
            </div>
          ) : (
            modlist.map((mod) => (
              <div
                key={mod.publishedFileId}
                className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 text-sm leading-tight">
                    {mod.modName || `ID: ${mod.publishedFileId}`}
                  </h3>
                  <button
                    onClick={() => removeMod(mod.publishedFileId)}
                    className="text-red-500 hover:text-red-700 text-xs ml-2"
                    title="Remove from list"
                  >
                    ✕
                  </button>
                </div>

                {mod.modIds.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-600 mb-1">Mod IDs:</p>
                    <div className="flex flex-wrap gap-1">
                      {mod.modIds.map((modId, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                        >
                          {modId}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {mod.mapFolders.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-600 mb-1">Map Folders:</p>
                    <div className="flex flex-wrap gap-1">
                      {mod.mapFolders.map((mapFolder, index) => (
                        <span
                          key={index}
                          className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded"
                        >
                          {mapFolder}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <a
                    href={mod.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-xs"
                  >
                    View on Steam →
                  </a>
                  <span className="text-xs text-gray-500">
                    {new Date(mod.addedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
