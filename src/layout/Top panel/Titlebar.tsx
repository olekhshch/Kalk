import React from "react";
import useContent from "../../state/useContent";
import { getCurrentWindow, Window } from "@tauri-apps/api/window";
import { Webview } from "@tauri-apps/api/webview";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { invoke } from "@tauri-apps/api/core";

const Header = () => {
  const { nodes, edges, values } = useContent();
  const window = getCurrentWindow();

  const close = () => {
    window.close();
  };

  const maximize = () => {
    window.maximize();
  };

  const minimize = () => {
    window.minimize();
  };

  const openWindow = () => {
    invoke("open_project_overview")
      .then(() => console.log("NEW WINDOW TS"))
      .catch((err) => console.log(err));
  };

  return (
    <div className="px-2 flex justify-between">
      <div className="flex gap-3">
        <button onClick={() => console.log({ nodes })}>NS</button>
        <button onClick={() => console.log({ edges })}>ES</button>
        <button onClick={() => console.log({ values })}>VAL</button>
        <button onClick={openWindow}>WINDOW</button>
      </div>
      <div
        className="text-base grow text-center"
        draggable
        data-tauri-drag-region
      >
        New file
      </div>
      <div className="flex gap-1">
        <button onClick={minimize}>
          <img alt="hide window" src="src\assets\icons\hide-window.svg" />
        </button>
        <button onClick={maximize}>
          <img alt="maximize window" src="src\assets\icons\maximize.svg" />
        </button>
        <button onClick={close}>
          <img alt="close app" src="src\assets\icons\close.svg" />
        </button>
      </div>
    </div>
  );
};

export default Header;
