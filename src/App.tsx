import { useEffect, useState } from "react";
import "./index.css";
import BottomPanel from "./layout/BottomPanel/BottomPanel";
import Canvas from "./layout/Canvas/Canvas";
import TopPanel from "./layout/Top panel/TopPanel";

import "@xyflow/react/dist/style.css";
import { ReactFlowProvider } from "@xyflow/react";

const App = () => {
  useEffect(() => {
    console.log("APP RERENDERED");
  });

  // #TODO: preventDefault Handler (e.g. for Ctrl+A)
  return (
    <ReactFlowProvider>
      <div id="layout">
        <TopPanel />
        <Canvas />
        <BottomPanel />
      </div>
    </ReactFlowProvider>
  );
};

export default App;
