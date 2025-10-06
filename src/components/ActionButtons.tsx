import React from "react";
import type { ModItem } from "../types";

interface ActionButtonsProps {
  modlist: ModItem[];
  onExport: () => void;
  onClear: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  modlist,
  onExport,
  onClear,
}) => {
  const isDisabled = modlist.length === 0;

  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={onExport}
        disabled={isDisabled}
        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
      >
        📥 Export List
      </button>
      <button
        onClick={onClear}
        disabled={isDisabled}
        className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
      >
        🗑️ Clear All
      </button>
    </div>
  );
};
