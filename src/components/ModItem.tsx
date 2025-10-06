import React from "react";
import type { ModItem as ModItemType } from "../types";

interface ModItemProps {
  mod: ModItemType;
  onRemove: (publishedFileId: string) => void;
}

export const ModItem: React.FC<ModItemProps> = ({ mod, onRemove }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900 text-sm leading-tight">
          {mod.modName || `ID: ${mod.publishedFileId}`}
        </h3>
        <button
          onClick={() => onRemove(mod.publishedFileId)}
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
  );
};
