import React from "react";

export const Header: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
      <h1 className="text-xl font-bold">Zomboid Modlist Helper</h1>
      <p className="text-sm opacity-90">Manage your Project Zomboid mods</p>
    </div>
  );
};
