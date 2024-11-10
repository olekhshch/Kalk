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
    comment?: boolean;
  };
  openContext: (
    target: ContextMenuTarget,
    id: string | null,
    position: { x: number; y: number },
    comment?: boolean // if node has any comment
  ) => void;
  closeContext: () => void;

  nodeCommentFieldFor: string[]; // Id of the node with an opened comment field
  openNodeCommentField: (n: string) => void;
  closeAllNodeComments: () => void;
  closeCommentFielFor: (nodeId: string) => void;

  nodesOverview: boolean;
  closeNodeOverview: () => void;
  openNodeOverview: () => void;
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
  openContext: (ctxTarget, id, position, comment) => {
    const components: ContextMenuSection[] = [];

    switch (ctxTarget) {
      case "node": {
        if (id || id === "0") {
          components.push(
            "node-comment",
            "node-dupl",
            "node-delete",
            "node-help"
          );
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
      contextMenuContent: {
        components,
        id: !id ? null : id,
        position,
        comment,
      },
    });
  },
  nodeCommentFieldFor: [],
  openNodeCommentField: (nodeId) =>
    set({ nodeCommentFieldFor: [...get().nodeCommentFieldFor, nodeId] }),
  closeAllNodeComments: () => set({ nodeCommentFieldFor: [] }),
  closeCommentFielFor: (nodeId) => {
    const comments = get().nodeCommentFieldFor.filter((id) => id !== nodeId);
    set({ nodeCommentFieldFor: comments });
  },

  nodesOverview: false,
  closeNodeOverview: () => set({ nodesOverview: false }),
  openNodeOverview: () => set({ nodesOverview: true }),
}));

export default useUI;
