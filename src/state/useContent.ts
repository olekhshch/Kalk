import { applyNodeChanges, Edge, Node } from "@xyflow/react";
import { create } from "zustand";
import {
  AppNode,
  ExpressionNode,
  ResultNode,
  TextSingleNode,
} from "../types/nodes";
import { ContentStore, RustCalculations } from "../types/system";
import createTextSingleNode from "./actions/createTextSingleNode";
import editTextValue from "./actions/editTextValue";
import createExpressionNode from "./actions/createExpressionNode";
import editMathValue from "./actions/editMathValue";
import showHideResult from "./actions/showHideResult";
import connectNodes from "./actions/connectNodes";
import { invoke } from "@tauri-apps/api/core";

const useContent = create<ContentStore>()((set) => ({
  nodes: [],
  edges: [],
  idCounter: 0,
  edgeCounter: 0,
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
          const { nodes, idCounter, newNode } = createExpressionNode({
            nodes: state.nodes,
            idCounter: state.idCounter,
          });

          const newVars = newNode
            ? {
                ...state.vars,
                [newNode.id]: (newNode as ExpressionNode).data.calc.res,
              }
            : { ...state.vars };
          return { nodes, idCounter, vars: newVars };
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
      const { nodes, newNode } = editMathValue(
        nodeId,
        newValue,
        [...state.nodes],
        "expression"
      );
      // if (newNode) {
      //   invoke("evaluate_expression", { expr: newValue }).then((res) => {
      //     const calcRes = res as RustCalculations;
      //     console.log(calcRes);
      //   });
      // }
      return { nodes };
    }),
  showResultFor: (nodeId) =>
    set((state) => {
      const { nodes, idCounter, newNode } = showHideResult(
        true,
        nodeId,
        [...state.nodes],
        state.idCounter
      );

      if (newNode) {
        const { edges, edgeCounter } = connectNodes(
          nodeId,
          newNode.id,
          [...state.edges],
          state.edgeCounter
        );
        return { nodes, idCounter, edges, edgeCounter };
      }

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
  connectNodes: (sourceId, targetId) =>
    set((state) => {
      const id = state.edgeCounter + 1;
      const newEdge: Edge = {
        id: id.toString(),
        source: sourceId,
        target: targetId,
      };

      return { edges: [...state.edges, newEdge], edgeCounter: id };
    }),
  setVariable: (varKey, newValue) =>
    set((state) => {
      //#TODO: Fix floats
      return { vars: { ...state.vars, [varKey]: newValue } };
    }),
}));

export default useContent;
