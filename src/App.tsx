import { useEffect, useState } from "react";
import "./index.css";
import BottomPanel from "./layout/BottomPanel/BottomPanel";
import Canvas from "./layout/Canvas/Canvas";
import TopPanel from "./layout/Top panel/TopPanel";

import "@xyflow/react/dist/style.css";

const App = () => {
  useEffect(() => {
    console.log("APP RERENDERED");
  });

  // #TODO: preventDefault Handler (e.g. for Ctrl+A)
  return (
    <>
      <div id="layout">
        <TopPanel />
        <Canvas />
        <BottomPanel />
      </div>
    </>
  );
};

export default App;
