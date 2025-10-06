import "./App.css";
import { useChromeExtension } from "./hooks/useChromeExtension";
import { useModlistOperations } from "./hooks/useModlistOperations";
import { Header, SteamPageWarning, ActionButtons, ModList } from "./components";

function App() {
  const { modlist, isOnSteamPage, updateModlist } = useChromeExtension();
  const { exportModlist, clearModlist, removeMod } = useModlistOperations();

  const handleExport = () => {
    exportModlist(modlist);
  };

  const handleClear = () => {
    clearModlist(() => {
      updateModlist([]);
    });
  };

  const handleRemoveMod = (publishedFileId: string) => {
    const updatedModlist = removeMod(modlist, publishedFileId);
    updateModlist(updatedModlist);
  };

  return (
    <div className="w-96 min-h-96 bg-gray-50">
      <Header />

      <div className="p-4">
        <SteamPageWarning isOnSteamPage={isOnSteamPage} />

        <ActionButtons
          modlist={modlist}
          onExport={handleExport}
          onClear={handleClear}
        />

        <ModList modlist={modlist} onRemoveMod={handleRemoveMod} />
      </div>
    </div>
  );
}

export default App;
