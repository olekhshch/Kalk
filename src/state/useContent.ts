import { addEdge, applyNodeChanges, Edge, reconnectEdge } from "@xyflow/react";
import { create } from "zustand";
import {
  AppNode,
  ConstructorNode,
  ExpressionNode,
  IdentityMtxNode,
  Input,
  MathNode,
  MtxFromRowsNode,
  NumNodeType,
  TextSingleNode,
  VectorNode,
} from "../types/nodes";
import { AngleFormat, ContentStore } from "../types/app";
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
import nodeMatrixFnConstructor from "../utils/constructors/nodeMatrixFnConstructor";
import recalculateAll from "../utils/recalculateAll";
import isConnectable from "../utils/edges/isConnectable";

const useContent = create<ContentStore>()((set, get) => ({
  nodes: [],
  edges: [],
  idCounter: 0,
  edgeCounter: 0,
  highlightedNodesId: [],
  activeNodeId: null,
  values: {},
  anglesFormat: AngleFormat.RAD,
  setAnglesFormat: async (newFormat) => {
    if (newFormat !== get().anglesFormat) {
      set({ anglesFormat: newFormat });
      const newValues = await recalculateAll(
        get().nodes,
        get().edges,
        newFormat
      );
      console.log({ newValues });
      set({ values: newValues });
    }
  },
  onNodesChange: (changes) => {
    const newNodes = applyNodeChanges(changes, get().nodes) as AppNode[];
    set({ nodes: newNodes });
  },
  addNode: (nodeType, position) => {
    const id = get().idCounter + 1;
    set({ idCounter: id });
    const nodeId = id.toString();

    switch (nodeType) {
      case "expression": {
        const newNode: ExpressionNode = {
          id: nodeId,
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
        });
        break;
      }
      case "text-single": {
        const newNode: TextSingleNode = {
          id: nodeId,
          type: "text-single",
          data: { value: "" },
          position,
        };
        set({
          nodes: [...get().nodes, newNode],
        });
        break;
      }
      case "I-matrix": {
        const newNode: IdentityMtxNode = {
          id: nodeId,
          position,
          type: "i-mtx",
          data: {
            showResult: false,
            inputs: {
              n: { sourceId: null, allowedTypes: ["number"], type: "number" },
            },
            outputs: {
              M: { possibleValues: ["matrix"] },
            },
          },
        };
        set({ nodes: [...get().nodes, newNode] });
        break;
      }
      case "vec": {
        const newNode: VectorNode = {
          id: nodeId,
          position,
          type: "vec",
          data: {
            isConstructor: true,
            inputTemplate: (n) => `v${n}`,
            showResult: false,
            numberOfEntries: 3,
            allowedInputTypes: ["number"],
            inputs: {
              v1: { ...initialInput },
              v2: { ...initialInput },
              v3: { ...initialInput },
            },
            outputs: {
              V: { possibleValues: ["vector"] },
            },
          },
        };
        set({ nodes: [...get().nodes, newNode] });
        break;
      }
      case "mtx-rows": {
        const newNode: MtxFromRowsNode = {
          id: nodeId,
          position,
          type: "mtx-rows",
          data: {
            showResult: false,
            isConstructor: true,
            numberOfEntries: 3,
            allowedInputTypes: ["vector"],
            outputs: {
              M: { possibleValues: ["matrix"] },
            },
            inputs: {
              v1: {
                sourceId: null,
                allowedTypes: ["vector"],
                type: "vector",
              },
              v2: {
                sourceId: null,
                allowedTypes: ["vector"],
                type: "vector",
              },
              v3: {
                sourceId: null,
                allowedTypes: ["vector"],
                type: "vector",
              },
            },
            inputTemplate: (n) => `v${n}`,
          },
        };
        set({ nodes: [...get().nodes, newNode] });
        break;
      }
      case "cross-prod":
      case "norm":
      case "dot-prod":
      case "add-mtx":
      case "sum-all":
      case "scalar-mult": {
        const newNode = nodeMatrixFnConstructor(nodeType, position, nodeId);

        if (newNode) {
          set({ nodes: [...get().nodes, newNode] });
        }
        break;
      }
      default: {
        const newNode = nodeFunctionContructor(
          nodeType as NumNodeType,
          position,
          nodeId
        );

        if (newNode) {
          set({
            nodes: [...get().nodes, newNode],
          });
        }
      }
    }
    // sets null values for any created node
    set({ values: { ...get().values, [nodeId]: null } });
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
      const newValues = await recalculateChain(
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
    const id = get().idCounter + 1;
    set({ idCounter: id });
    const { nodes, newNode } = showHideResult(true, nodeId, get().nodes, id);

    if (newNode) {
      const { edges, edgeCounter } = connectNodes(
        nodeId,
        newNode.id,
        get().edges,
        get().edgeCounter,
        "R"
      );

      set({ nodes, edges, edgeCounter, activeNodeId: null });
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

    // checking if possible value of the source = allowed value of the target input
    const sourceHandleObj = deconstructHandleId(sourceHandle);
    const targetHandleObj = deconstructHandleId(targetHandle);

    if (!sourceHandleObj || !targetHandleObj) return false;

    if (
      !isConnectable(sourceHandleObj.allowedTypes, targetHandleObj.allowedTypes)
    )
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
    const newValues = await recalculateChain(
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

    const { numberOfEntries, inputTemplate, allowedInputTypes } =
      targetNode.data;
    // checking if new number is not the same
    if (newNum === numberOfEntries) return;

    const { inputs } = targetNode.data;

    if (newNum > numberOfEntries) {
      // adding new entries
      for (let i = numberOfEntries + 1; i <= newNum; i++) {
        const key = inputTemplate(i);
        targetNode.data.inputs[key] = {
          ...initialInput,
          allowedTypes: [...allowedInputTypes],
        };
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
    // recalculate node and chainFrom it
    const chainFrom = getChainIdsFrom(targetNode, get().edges);
    recalculateChain(
      chainFrom,
      newNodes,
      get().values,
      get().anglesFormat
    ).then((newVals) => set({ values: newVals }));

    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) return { ...targetNode };
        return node;
      }),
    });
  },
  setCommentFor: (nodeId, comm) => {
    const comment = comm.trim() === "" ? null : comm;

    const newNodes = get().nodes.map((node) => {
      if (node.id === nodeId) {
        return { ...node, data: { ...node.data, comment } };
      }
      return node;
    }) as AppNode[];

    set({ nodes: newNodes });
  },
}));

const initialInput: Input = {
  allowedTypes: ["number"],
  sourceId: null,
  type: "number",
};

export default useContent;
