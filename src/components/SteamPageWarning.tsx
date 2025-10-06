import React from "react";

interface SteamPageWarningProps {
  isOnSteamPage: boolean;
}

export const SteamPageWarning: React.FC<SteamPageWarningProps> = ({
  isOnSteamPage,
}) => {
  if (isOnSteamPage) {
    return null;
  }

  return (
    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p className="text-sm text-yellow-800">
        📍 Navigate to a Steam Workshop page to add mods to your list
      </p>
    </div>
  );
};
