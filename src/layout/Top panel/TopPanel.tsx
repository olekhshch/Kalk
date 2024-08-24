import React from "react";
import Header from "./Header";
import Tabs from "./Tabs";
import ActionsPanel from "./ActionsPanel";

const TopPanel = () => {
  return (
    <nav className="bg-main text-white font-sys">
      <Header />
      <Tabs />
      <ActionsPanel />
    </nav>
  );
};

export default TopPanel;
