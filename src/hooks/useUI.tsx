// store to handle windows/menus etc.

import { create } from "zustand";
import { ContextMenuSection, ContextMenuTarget } from "../types/app";

type UIStore = {
  scale: boolean;
  openScale: () => void;
  closeScale: () => void;
  contextMenu: boolean;
  contextMenuContent: {
    components: ContextMenuSection[];
    id: string | null;
    position: { x: number; y: number };
  };
  openContext: (
    target: ContextMenuTarget,
    id: string | null,
    position: { x: number; y: number }
  ) => void;
  closeContext: () => void;
};

const useUI = create<UIStore>((set, get) => ({
  scale: false,
  openScale: () => set({ scale: true }),
  closeScale: () => set({ scale: false }),
  contextMenu: false,
  contextMenuContent: { components: [], id: null, position: { x: 0, y: 0 } },
  closeContext: () =>
    set({
      contextMenu: false,
      contextMenuContent: {
        ...get().contextMenuContent,
        components: [],
        id: null,
      },
    }),
  openContext: (ctxTarget, id, position) => {
    const components: ContextMenuSection[] = [];

    switch (ctxTarget) {
      case "node": {
        if (id || id === "0") {
          components.push("node-dupl", "node-delete", "node-help");
        }
        break;
      }

      default: {
        components.push("creator");
        break;
      }
    }

    set({
      contextMenu: true,
      contextMenuContent: { components, id: !id ? null : id, position },
    });
  },
}));

export default useUI;