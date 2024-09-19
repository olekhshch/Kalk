import { addEdge, applyNodeChanges, Edge, reconnectEdge } from "@xyflow/react";
import { create } from "zustand";
import {
  AppNode,
  ConstructorNode,
  ExpressionNode,
  IdentityMtxNode,
  Input,
  MathNode,
  TextSingleNode,
  VectorNode,
} from "../types/nodes";
import { AngleFormat, ContentStore } from "../types/system";
import createTextSingleNode from "./actions/createTextSingleNode";
import showHideResult from "../utils/showHideResult";
import connectNodes from "../utils/connectNodes";
import editNodeValue from "./actions/editNodeValue";
import calculateNode from "../utils/calculateNode";
import getById from "../utils/getById";
import replaceNode from "../utils/replaseNode";
import getChain from "../utils/getChainIdsFrom";
import recalculateChain from "../utils/recalculateChain";
import getChainIdsFrom from "../utils/getChainIdsFrom";
import getChainIdsTo from "../utils/getChainIdsTo";
import nodeFunctionContructor from "../utils/constructors/nodeNumFnConstructor";
import generateHandleLabel, {
  deconstructHandleId,
} from "../utils/generateHandleId";

const useContent = create<ContentStore>()((set, get) => ({
  nodes: [],
  edges: [],
  idCounter: 0,
  edgeCounter: 0,
  highlightedNodesId: [],
  activeNodeId: null,
  values: {},
  anglesFormat: AngleFormat.RAD,
  setAnglesFormat: (newFormat) => {
    if (newFormat !== get().anglesFormat) {
      set({ anglesFormat: newFormat });
      // #TODO Recalculations after change
    }
  },
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
          data: {
            value: "",
            showResult: false,
            inputs: {},
            outputs: { N: "number" },
          },
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
      case "I-matrix": {
        const newNode: IdentityMtxNode = {
          id: id.toString(),
          position,
          type: "i-mtx",
          data: {
            showResult: false,
            inputs: {
              n: { sourceId: null, allowedTypes: ["number"], type: "number" },
            },
            outputs: {
              M: "matrix",
            },
          },
        };
        set({ nodes: [...get().nodes, newNode], idCounter: id });
        break;
      }
      case "vec": {
        const newNode: VectorNode = {
          id: id.toString(),
          position,
          type: "vec",
          data: {
            isConstructor: true,
            inputTemplate: (n) => `v${n}`,
            showResult: false,
            numberOfEntries: 3,
            inputs: {
              v1: { ...initialInput },
              v2: { ...initialInput },
              v3: { ...initialInput },
            },
            outputs: {
              V: "vector",
            },
          },
        };
        set({ nodes: [...get().nodes, newNode], idCounter: id });
        break;
      }
      default: {
        const newNode = nodeFunctionContructor(
          nodeType,
          position,
          get().idCounter
        );

        if (newNode) {
          console.log({ newNode });
          set({ nodes: [...get().nodes, newNode], idCounter: id });
        }
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
      const newVals = await calculateNode(
        newNode,
        get().values,
        get().anglesFormat
      );

      // getting chain of next connected nodes to recalculate their values
      const chain = getChain(newNode, get().edges);
      const newValues = recalculateChain(
        chain,
        nodes,
        newVals,
        get().anglesFormat
      );

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
  connectNodes: async (connection) => {
    const { source, sourceHandle, target, targetHandle } = connection;
    // checking if handle labels specified
    if (!sourceHandle || !targetHandle) return;

    // checking if target is not a result node
    if (targetHandle === "R") return;

    // checking if not connecting to the same node
    if (target === source) return;

    // checking if value of the source = allowed value of the target input
    const sourceHandleObj = deconstructHandleId(sourceHandle);
    const targetHandleObj = deconstructHandleId(targetHandle);

    if (!sourceHandleObj || !targetHandleObj) return;

    if (!targetHandleObj.allowedTypes.includes(sourceHandleObj.allowedTypes[0]))
      return;

    const [nodeA, nodeB] = (await Promise.all([
      getById(get().nodes, source)[0],
      getById(get().nodes, target)[0],
    ])) as [MathNode, MathNode];

    // checking if not connecting into loop
    const chainTo = getChainIdsTo(nodeA, get().edges);
    if (chainTo.includes(target)) {
      //#TODO: Warning for user
      console.log("Chain includes target LOOP");
      console.log({ chainTo, target });
      return;
    }

    const id = get().edgeCounter + 1;
    const newEdge: Edge = {
      id: id.toString(),
      ...connection,
    };

    // checking if input is connected to other node - if true then replases the edge
    const existingEdge = get().edges.find(
      (edge) => edge.target === target && edge.targetHandle === targetHandle
    );
    const newEdges = !existingEdge
      ? addEdge(newEdge, get().edges)
      : reconnectEdge(existingEdge, connection, get().edges);

    nodeB.data.inputs[targetHandleObj.label].sourceId = source;

    const newNodes = replaceNode(nodeB, get().nodes);

    // recalculates chain
    const chain = getChainIdsFrom(nodeB, newEdges);
    const newValues = recalculateChain(
      chain,
      newNodes,
      get().values,
      get().anglesFormat
    );

    set({
      edges: newEdges,
      edgeCounter: id,
      values: newValues,
      nodes: newNodes,
    });
  },
  setValue: (valKey, newValue) =>
    set((state) => {
      //#TODO: Fix floats
      return { values: { ...state.values, [valKey]: newValue } };
    }),
  setNumOfEntriesFor: (nodeId, newNum) => {
    const targetNode = getById(get().nodes, nodeId)[0] as ConstructorNode;

    // checking if exists and is constructor
    if (!targetNode || !targetNode.data.isConstructor) return;

    const { numberOfEntries, inputTemplate } = targetNode.data;
    // checking if new number is not the same
    if (newNum === numberOfEntries) return;

    const { inputs } = targetNode.data;

    if (newNum > numberOfEntries) {
      // adding new entries
      for (let i = numberOfEntries + 1; i <= newNum; i++) {
        const key = inputTemplate(i);
        console.log({ key });
        targetNode.data.inputs[key] = { ...initialInput };
      }
    } else {
      // removing last entries and connected to them edges
      let newEdges = get().edges;

      for (let i = numberOfEntries; i > newNum; i--) {
        const key = inputTemplate(i);
        const sourceId = targetNode.data.inputs[key].sourceId;
        if (sourceId) {
          const types = targetNode.data.inputs[key].allowedTypes;
          const handleId = generateHandleLabel(key, types);

          const edges = newEdges.filter(({ target, targetHandle }) => {
            return !(targetHandle === handleId && target === targetNode.id);
          });
          newEdges = edges;
        }
        delete inputs[key];
      }

      set({ edges: newEdges });
    }
    targetNode.data.numberOfEntries = newNum;
    const newNodes = replaceNode(targetNode, get().nodes);
    set({ nodes: newNodes });
  },
}));

const initialInput: Input = {
  allowedTypes: ["number"],
  sourceId: null,
  type: "number",
};

export default useContent;
