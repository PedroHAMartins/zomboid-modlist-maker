import React from "react";

export const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-8 text-gray-500">
      <div className="text-4xl mb-2">📋</div>
      <p>No mods added yet</p>
      <p className="text-sm">Visit Steam Workshop pages to add mods</p>
    </div>
  );
};
