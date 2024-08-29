import { Node } from "@xyflow/react";
import { create } from "zustand";
import { AppNode, TextSingleNode } from "../types/nodes";
import { ContentStore } from "../types/system";
import createTextSingleNode from "./actions/createTextSingleNode";
import editTextValue from "./actions/editTextValue";

const useContent = create<ContentStore>()((set) => ({
  nodes: [],
  idCounter: 0,
  highlightedNodesId: [],
  activeNodeId: null,
  doAction: (action) =>
    set((state) => {
      const command = action.toLocaleLowerCase();
      switch (command) {
        case "clear-all":
          return { nodes: [] };
        case "text-single":
          const { nodes, activeNodeId, idCounter } = createTextSingleNode(
            state,
            { x: 0, y: 0 }
          );
          return { nodes, idCounter };
        default:
          console.log(action + " action doesn't exist in doAction command");
          return {};
      }
    }),
  setNodes: (nds) => {
    set(() => ({ nodes: nds }));
  },
  higlightById: (nodeIds, only) =>
    set((state) => {
      if (only) {
        return { highlightedNodesId: nodeIds };
      }

      return { highlightedNodesId: [...state.highlightedNodesId, ...nodeIds] };
    }),
  activateNode: (nodeId) =>
    set((state) => {
      const newNodes = state.nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, active: true } };
        }
        if (state.activeNodeId === node.id) {
          return { ...node, data: { ...node.data, active: false } };
        }
        return node;
      });
      return { nodes: newNodes, activeNodeId: nodeId };
    }),
  editTextValue: (nodeId, newValue) =>
    set((state) => {
      const { nodes } = editTextValue(nodeId, newValue, state);
      return { nodes };
    }),
}));

export default useContent;
