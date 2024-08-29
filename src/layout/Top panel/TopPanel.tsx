import React, { useEffect } from "react";
import Header from "./Titlebar";
import Tabs from "./Tabs";
import ActionsPanel from "./ActionsPanel";

const TopPanel = () => {
  useEffect(() => {
    console.log("TOP PANEL rerendered");
  });

  return (
    <nav className="bg-main text-white font-sys select-none">
      <Header />
      <Tabs />
      <ActionsPanel />
    </nav>
  );
};

export default TopPanel;
