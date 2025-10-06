import type { ModItem } from "../types";

export const useModlistOperations = () => {
  const exportModlist = (modlist: ModItem[]) => {
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

  const clearModlist = (onConfirm: () => void) => {
    if (confirm("Are you sure you want to clear your modlist?")) {
      onConfirm();
    }
  };

  const removeMod = (modlist: ModItem[], publishedFileId: string) => {
    return modlist.filter((mod) => mod.publishedFileId !== publishedFileId);
  };

  return {
    exportModlist,
    clearModlist,
    removeMod,
  };
};
