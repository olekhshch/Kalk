import { addEdge, applyNodeChanges, Edge, Node } from "@xyflow/react";
import { create } from "zustand";
import {
  AppNode,
  ExpressionNode,
  ResultNode,
  TextSingleNode,
} from "../types/nodes";
import { ContentStore } from "../types/system";
import createTextSingleNode from "./actions/createTextSingleNode";
import editTextValue from "./actions/editTextValue";
import createExpressionNode from "./actions/createExpressionNode";
import editMathValue from "./actions/editMathValue";
import showHideResult from "./actions/showHideResult";
import connectNodes from "./actions/connectNodes";
import editNodeValue from "./actions/editNodeValue";
import calculateNode from "../utils/calculateNode";

const useContent = create<ContentStore>()((set, get) => ({
  nodes: [],
  edges: [],
  idCounter: 0,
  edgeCounter: 0,
  highlightedNodesId: [],
  activeNodeId: null,
  values: {},
  onNodesChange: (changes) => {
    const newNodes = applyNodeChanges(changes, get().nodes) as AppNode[];
    set({ nodes: newNodes });
  },
  addNode: (nodeType, position) => {
    const id = get().idCounter + 1;
    switch (nodeType) {
      case "expression": {
        const newNode: ExpressionNode = {
          id: id.toString(),
          type: "expression",
          position,
          data: { value: "", showResult: false },
        };
        set({
          nodes: [...get().nodes, newNode],
          idCounter: id,
        });
        break;
      }
      case "text-single": {
        const newNode: TextSingleNode = {
          id: id.toString(),
          type: "text-single",
          data: { value: "" },
          position,
        };
        set({
          nodes: [...get().nodes, newNode],
          idCounter: id,
        });
        break;
      }
    }
  },
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
          return { nodes: selectedNodes };
        case "clear-all":
          return { nodes: [] };
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
    set({ nodes: nds });
  },
  higlightById: (nodeIds, only) =>
    set((state) => {
      if (only) {
        return { highlightedNodesId: nodeIds };
      }

      return { highlightedNodesId: [...state.highlightedNodesId, ...nodeIds] };
    }),
  activateNode: (nodeId) => {
    set({ activeNodeId: nodeId });
  },
  // set((state) => {
  //   const newNodes = state.nodes.map((node) => {
  //     if (node.id === nodeId) {
  //       return { ...node, data: { ...node.data, active: true } };
  //     }
  //     if (state.activeNodeId === node.id) {
  //       return { ...node, data: { ...node.data, active: false } };
  //     }
  //     return node;
  //   });
  //   return { nodes: newNodes, activeNodeId: nodeId };
  // }),
  editTextValue: (nodeId, newValue) => {
    const { nodes } = editNodeValue(
      nodeId,
      newValue,
      get().nodes,
      get().idCounter
    );
    return { nodes };
  },
  editExpressionValue: async (nodeId, newValue) => {
    const { newNode, nodes } = editNodeValue(
      nodeId,
      newValue,
      get().nodes,
      get().idCounter
    );

    if (newNode) {
      const newValues = await calculateNode(newNode, get().values);
      set({ values: newValues });
    }

    set({ nodes });
  },
  showResultFor: (nodeId) => {
    const { nodes, idCounter, newNode } = showHideResult(
      true,
      nodeId,
      get().nodes,
      get().idCounter
    );

    if (newNode) {
      const { edges, edgeCounter } = connectNodes(
        nodeId,
        newNode.id,
        get().edges,
        get().edgeCounter
      );

      set({ nodes, idCounter, edges, edgeCounter, activeNodeId: null });
    }
  },
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
  connectNodes: (connection) => {
    const id = get().edgeCounter + 1;
    const newEdge: Edge = {
      id: id.toString(),
      ...connection,
    };
    const newEdges = addEdge(newEdge, get().edges);
    set({ edges: newEdges, edgeCounter: id });
  },
  setValue: (valKey, newValue) =>
    set((state) => {
      //#TODO: Fix floats
      return { values: { ...state.values, [valKey]: newValue } };
    }),
}));

export default useContent;
