import { applyNodeChanges, Node } from "@xyflow/react";
import { create } from "zustand";
import { AppNode, ResultNode, TextSingleNode } from "../types/nodes";
import { ContentStore } from "../types/system";
import createTextSingleNode from "./actions/createTextSingleNode";
import editTextValue from "./actions/editTextValue";
import createExpressionNode from "./actions/createExpressionNode";
import editMathValue from "./actions/editMathValue";
import showHideResult from "./actions/showHideResult";

const useContent = create<ContentStore>()((set) => ({
  nodes: [],
  idCounter: 0,
  highlightedNodesId: [],
  activeNodeId: null,
  vars: {},
  doAction: (action) =>
    set((state) => {
      const command = action.toLocaleLowerCase();
      switch (command) {
        case "select-all":
          const selectedNodes = state.nodes.map((node) => {
            const [newNode] = applyNodeChanges(
              [{ id: node.id, type: "select", selected: true }],
              [node]
            );
            return newNode;
          });
          console.log({ selectedNodes });
          return { nodes: selectedNodes };
        case "clear-all":
          return { nodes: [] };
        case "expression": {
          const { nodes, idCounter } = createExpressionNode({
            nodes: state.nodes,
            idCounter: state.idCounter,
          });
          return { nodes, idCounter };
        }
        case "text-single":
          const { nodes, idCounter } = createTextSingleNode({
            nodes: state.nodes,
            idCounter: state.idCounter,
          });
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
      const { nodes } = editTextValue(nodeId, newValue, state.nodes);
      return { nodes };
    }),
  editExpressionValue: (nodeId, newValue) =>
    set((state) => {
      const { nodes } = editMathValue(
        nodeId,
        newValue,
        [...state.nodes],
        "expression"
      );
      return { nodes };
    }),
  showResultFor: (nodeId) =>
    set((state) => {
      const { nodes, idCounter } = showHideResult(
        true,
        nodeId,
        [...state.nodes],
        state.idCounter
      );

      return { nodes, idCounter };
    }),
  hideResultFor: (nodeId) =>
    set((state) => {
      const { nodes } = showHideResult(
        false,
        nodeId,
        [...state.nodes],
        state.idCounter
      );
      return { nodes };
    }),
}));

export default useContent;
