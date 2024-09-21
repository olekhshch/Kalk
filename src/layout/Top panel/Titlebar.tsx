import React from "react";
import useContent from "../../state/useContent";
import { getCurrentWindow } from "@tauri-apps/api/window";

const Header = () => {
  const { nodes, edges } = useContent();
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

  return (
    <div className="px-2 flex justify-between">
      <div className="flex gap-3">
        <button onClick={() => console.log({ nodes })}>NS</button>
        <button onClick={() => console.log({ edges })}>ES</button>
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
