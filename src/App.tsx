import { useEffect } from "react";
import "./index.css";
import BottomPanel from "./layout/BottomPanel/BottomPanel";
import Canvas from "./layout/Canvas/Canvas";
import TopPanel from "./layout/Top panel/TopPanel";
import "@xyflow/react/dist/style.css";
import { ReactFlowProvider } from "@xyflow/react";
import useAppState from "./state/useAppState";
import { useShallow } from "zustand/react/shallow";
import UILayer from "./layout/UI/UILayer";
import { listen } from "@tauri-apps/api/event";
import useContent from "./state/useContent";
import customEvents from "./state/config/customEvents";
import useUI from "./hooks/useUI";

const App = () => {
  const [setMode] = useAppState(useShallow((store) => [store.setMode]));

  const [updateConstants] = useContent(
    useShallow((store) => [store.updateConstants])
  );

  const openNodeOverview = useUI(useShallow((store) => store.openNodeOverview));

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

  useEffect(() => {
    // Listening to events from other windows
    const unlisten = listen("const-picked", (ev) => {
      const { payload } = ev;
      if (payload) {
        setMode("create", { type: "constant", id: payload as string });
      }
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  useEffect(() => {
    const unlisten = listen(customEvents.openNodeOverview, () => {
      openNodeOverview();
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  useEffect(() => {
    const unlisten = listen("const-created", () => {
      updateConstants();
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  });

  return (
    <ReactFlowProvider>
      <div id="layout">
        <TopPanel />
        <Canvas />
        <BottomPanel />
        <UILayer />
      </div>
    </ReactFlowProvider>
  );
};

export default App;
