import { Node } from "@xyflow/react";
import { create } from "zustand";

interface NodesStore {
  nodes: Node[];
  idCounter: number;
  doAction: (action: string) => void;
  setNodes: (nds: Node[]) => void;
}

const useContent = create<NodesStore>()((set) => ({
  nodes: [],
  idCounter: 0,
  doAction: (action) =>
    set((state) => {
      const command = action.toLocaleLowerCase();
      switch (command) {
        case "text-single":
          const id = state.idCounter + 1;
          const newNode: Node = {
            id: id.toString(),
            position: { x: 0, y: 0 },
            data: { label: "Node text" },
            type: command,
          };
          return { nodes: [...state.nodes, newNode], idCounter: id };
        default:
          console.log(action + " action doesn't exist in doAction command");
          return {};
      }
    }),
  setNodes: (nds) => {
    set(() => ({ nodes: nds }));
  },
}));

export default useContent;
