import { useEffect, useState } from "react";
import "./index.css";
import BottomPanel from "./layout/BottomPanel/BottomPanel";
import Canvas from "./layout/Canvas/Canvas";
import TopPanel from "./layout/Top panel/TopPanel";

import "@xyflow/react/dist/style.css";
import { ReactFlowProvider } from "@xyflow/react";
import useAppState from "./state/useAppState";
import { useShallow } from "zustand/react/shallow";

const App = () => {
  const { setMode } = useAppState(
    useShallow((store) => ({
      setMode: store.setMode,
    }))
  );

  useEffect(() => {
    console.log("APP RERENDERED");
  });

  // #TODO: preventDefault Handler (e.g. for Ctrl+A)

  const keyDownHandler = (e: KeyboardEvent) => {
    switch (e.key) {
      case "Escape": {
        setMode("edit");
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler);

    return () => document.removeEventListener("keydown", keyDownHandler);
  });

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
