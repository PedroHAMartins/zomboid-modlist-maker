import React from "react";
import type { ModItem as ModItemType } from "../types";
import { ModItem } from "./ModItem";
import { EmptyState } from "./EmptyState";

interface ModListProps {
  modlist: ModItemType[];
  onRemoveMod: (publishedFileId: string) => void;
}

export const ModList: React.FC<ModListProps> = ({ modlist, onRemoveMod }) => {
  return (
    <>
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-gray-800">
          Your Modlist ({modlist.length})
        </h2>
      </div>

      <div className="max-h-80 overflow-y-auto space-y-2">
        {modlist.length === 0 ? (
          <EmptyState />
        ) : (
          modlist.map((mod) => (
            <ModItem
              key={mod.publishedFileId}
              mod={mod}
              onRemove={onRemoveMod}
            />
          ))
        )}
      </div>
    </>
  );
};
