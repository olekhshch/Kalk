import { useEffect } from "react";
import Header from "./Titlebar";
import Tabs from "./Tabs";
import Toolbar from "./Toolbar";

const TopPanel = () => {
  useEffect(() => {
    console.log("TOP PANEL rerendered");
  });

  // #TODO: Overflow handle, fix height
  return (
    <nav className="gradient-bg text-white font-sys select-none">
      <Header />
      <Tabs />
      <Toolbar />
    </nav>
  );
};

export default TopPanel;
