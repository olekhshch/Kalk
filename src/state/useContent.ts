import { applyNodeChanges } from "@xyflow/react";
import { create } from "zustand";
import {
  AppNode,
  ConstructorNode,
  NodeInput,
  NodePurpose,
} from "../types/nodes";
import { AngleFormat, ContentStore } from "../types/app";
import connectNodes from "../utils/connectNodes";
import editNodeValue from "./actions/editNodeValue";
import calculateNode from "../utils/calculations/calculateNode";
import getById from "../utils/getById";
import replaceNode from "../utils/replaseNode";
import getChain from "../utils/getChainIdsFrom";
import recalculateChain from "../utils/calculations/recalculateChain";
import getChainIdsFrom from "../utils/getChainIdsFrom";
import getChainIdsTo from "../utils/getChainIdsTo";
import generateHandleLabel, {
  deconstructHandleId,
} from "../utils/generateHandleId";
import recalculateAll from "../utils/calculations/recalculateAll";
import isConnectable from "../utils/edges/isConnectable";
import resultNodes from "../utils/nodes/resultNodes";
import deleteNodes from "../utils/nodes/deleteNodes";
import { invoke } from "@tauri-apps/api/core";
import makeResultNode from "../utils/nodes/makeResultNode";
import createNode from "../utils/nodes/createNode";
import { AppEdge } from "../types/edges";

const useContent = create<ContentStore>()((set, get) => ({
  nodes: [],
  edges: [],
  idCounter: 0,
  edgeCounter: 0,
  highlightedNodesId: [],
  activeNodeId: null,
  values: {
    CONST_PI: Math.PI,
    CONST_E: Math.E,
  },
  constants: [
    {
      id: "CONST_PI",
      name: "PI",
      viewLabel: "\\pi",
      valueType: "number",
      value: Math.PI,
    },
    {
      id: "CONST_E",
      name: "e",
      viewLabel: "\\e",
      value: Math.E,
      valueType: "number",
    },
  ],
  // constValues: {
  //   CONST_E: Math.E,
  //   CONST_PI: Math.PI,
  // },
  anglesFormat: AngleFormat.RAD,
  setAnglesFormat: async (newFormat) => {
    if (newFormat !== get().anglesFormat) {
      set({ anglesFormat: newFormat });
      const newValues = await recalculateAll(
        get().nodes,
        get().edges,
        newFormat
      );
      set({ values: newValues.values });
    }
  },
  errors: {},
  onNodesChange: (changes) => {
    const newNodes = applyNodeChanges(changes, get().nodes) as AppNode[];
    set({ nodes: newNodes });
  },
  addNode: (nodeTag, position, data) => {
    let id = get().idCounter + 1;

    const newNode = createNode(nodeTag, id.toString(), position, data?.constId);

    if (!newNode) return;

    set({ nodes: [...get().nodes, newNode], idCounter: id });
  },
  doAction: (action) => {
    switch (action) {
      case "select-all":
        const selectedNodes = get().nodes.map((node) => {
          const [newNode] = applyNodeChanges(
            [{ id: node.id, type: "select", selected: true }],
            [node]
          );
          return newNode;
        });
        set({ nodes: selectedNodes });
        break;
      case "clear-all":
        set({ nodes: [], edges: [], values: {} });
        break;
      case "project-overview": {
        // persisting needed to PO window data
        localStorage.setItem("app-nodes", JSON.stringify(get().nodes));
        localStorage.setItem("app-values", JSON.stringify(get().values));
        invoke("open_project_overview");
        break;
      }
      case "constant": {
        // passing constants to LS for Constants window
        localStorage.setItem("app-const", JSON.stringify(get().constants));
        invoke("open_constants_window");
        break;
      }
      case "hide-res": {
        const { newEdges, newNodes } = resultNodes.hideAllResults(
          get().nodes,
          get().edges
        );
        set({ nodes: newNodes, edges: newEdges });
        break;
      }
      case "show-res": {
        const { newResNodes, newEdges } = get().nodes.reduce(
          (acc, node) => {
            const resNode = makeResultNode(node);
            if (resNode) {
              acc.newResNodes.push(resNode);
              const edgeId = get().edgeCounter + 1;
              const { newEdge } = connectNodes({
                sourceId: node.id,
                targetId: resNode.id,
                edgeId: edgeId.toString(),
                edges: [],
                result: true,
              });
              if (newEdge) {
                set({ edgeCounter: edgeId });

                acc.newEdges.push(newEdge);
              }
            }
            return acc;
          },
          { newEdges: [], newResNodes: [] } as {
            newResNodes: AppNode[];
            newEdges: AppEdge[];
          }
        );

        set({
          nodes: [...get().nodes, ...newResNodes],
          edges: [...get().edges, ...newEdges],
        });

        break;
      }
      default:
        console.log(action + " action doesn't exist in doAction command");
        return {};
    }
  },
  setNodes: (nds) => {
    set({ nodes: nds });
  },
  higlightById: (nodeIds, only) =>
    set((state) => {
      if (only) {
        return { highlightedNodesId: nodeIds };
      }

      return {
        highlightedNodesId: [...state.highlightedNodesId, ...nodeIds],
      };
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
      const calcRes = await calculateNode(
        newNode,
        get().values,
        get().anglesFormat
      );

      // getting chain of next connected nodes to recalculate their values
      const chain = getChain(newNode, get().edges);
      const newValues = await recalculateChain(
        chain,
        nodes,
        calcRes.values,
        get().anglesFormat
      );
      set({
        values: newValues.values,
        errors: { ...get().errors, ...newValues.errors },
      });
    }

    set({ nodes });
  },
  showResultFor: () => {
    // const id = get().idCounter + 1;
    // set({ idCounter: id });
    // const { newNode, nodes, idCounter } = resultNodes.showResultFor(
    //   nodeId,
    //   get().nodes,
    //   get().idCounter
    // );
    // if (newNode && idCounter && nodes.length > get().nodes.length) {
    //   // new Node was created for Result
    //   set({ idCounter: idCounter, nodes });
    //   const { edges, edgeCounter } = connectNodes(
    //     nodeId,
    //     newNode.id,
    //     get().edges,
    //     get().edgeCounter,
    //     "R"
    //   );
    //   set({ edges, edgeCounter, activeNodeId: null });
    // } else {
    //   set({ nodes });
    // }
  },
  hideResultFor: (nodeId) => {
    const { newEdges, newNodes } = resultNodes.hideResultFor(
      nodeId,
      get().nodes,
      get().edges
    );
    set({ nodes: newNodes, edges: newEdges });
  },
  toggleResultFor: (nodeId) => {
    const resNodeId = "r" + nodeId;
    const targetResNode = get().nodes.find((node) => node.id === resNodeId);

    if (!targetResNode) {
      // targetResNode is not shown => create new one
      const sourceNode = get().nodes.find((node) => node.id === nodeId);
      if (!sourceNode) return;

      const resNode = makeResultNode(sourceNode);
      if (!resNode) return;

      const edgeId = get().edgeCounter + 1;
      const { newEdge } = connectNodes({
        sourceId: nodeId,
        targetId: resNode.id,
        edges: get().edges,
        edgeId: edgeId.toString(),
      });
      if (newEdge) {
        set({
          nodes: [...get().nodes, resNode],
          edges: [...get().edges, newEdge],
          edgeCounter: edgeId,
        });
      }
    } else {
      // deleting shown ResultNode and connecting edge
      const newNodes = get().nodes.filter((node) => node.id !== resNodeId);
      const newEdges = get().edges.filter((edge) => edge.target !== resNodeId);

      set({ nodes: newNodes, edges: newEdges });
    }
    // const { newEdges, newNodes, idCounter, edgeCounter } =
    //   resultNodes.toggleResultFor(
    //     nodeId,
    //     get().nodes,
    //     get().edges,
    //     get().edgeCounter,
    //     get().idCounter
    //   );
    // set({ nodes: newNodes, edges: newEdges, idCounter, edgeCounter });
  },
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
    ])) as [AppNode, AppNode];

    // checking if not connecting into loop
    const chainTo = getChainIdsTo(nodeA, get().edges);
    if (chainTo.includes(target)) {
      //#TODO: Warning for user
      console.log("Chain includes target LOOP");
      console.log({ chainTo, target });
      return;
    }

    const id = get().edgeCounter + 1;
    // const newEdge: Edge = {
    //   id: id.toString(),
    //   ...connection,
    // };

    const targetInput = nodeB.data.inputs[targetHandleObj.outputLabel];

    if (!targetInput) {
      console.log(
        "Can't connect: Target " +
          nodeB.id +
          " doesn't have input " +
          targetHandleObj.outputLabel
      );
      return;
    }

    // checking if input is connected to other node - if true then replases the edge
    const cleanEdges = get().edges.filter(
      (edge) => edge.targetHandle !== targetHandle
    );
    const newEdges = connectNodes({
      sourceId: nodeA.id,
      targetId: nodeB.id,
      edges: cleanEdges,
      edgeId: id.toString(),
      sourceHandle,
      targetHandle,
    }).edges;
    // const existingEdge = get().edges.find(
    //   (edge) => edge.target === target && edge.targetHandle === targetHandle
    // );
    // const newEdges = !existingEdge
    //   ? connectNodes({
    //       sourceId: nodeA.id,
    //       targetId: nodeB.id,
    //       edges: get().edges,
    //       edgeId: id.toString(),
    //       sourceHandle: sourceHandleObj.outputLabel,
    //       targetHandle: targetHandleObj.outputLabel,
    //     }).edges
    //   : reconnectEdge(existingEdge, connection, get().edges);

    const isSourceConst = nodeA.type === "constant";

    targetInput.valueId = isSourceConst
      ? sourceHandleObj.outputLabel
      : sourceHandleObj.label;

    const newNodes = replaceNode(nodeB, get().nodes);

    // recalculates chain
    const chain = getChainIdsFrom(nodeB, newEdges);
    const calcRes = await recalculateChain(
      chain,
      newNodes,
      get().values,
      get().anglesFormat
    );

    if (calcRes.nodesToReplace.length > 0) {
      // #TODO: Rewrite util to accept multiple nodes
      let newNodes0: AppNode[] = newNodes;
      calcRes.nodesToReplace.forEach((node) => replaceNode(node, newNodes0));
      set({ nodes: newNodes });
    }

    set({
      edges: newEdges,
      edgeCounter: id,
      values: calcRes.values,
      nodes: newNodes,
    });
  },
  setValue: (valKey, newValue) =>
    set((state) => {
      return { values: { ...state.values, [valKey]: newValue } };
    }),
  setNumOfEntriesFor: (nodeId, newNum) => {
    const targetNode = getById(get().nodes, nodeId)[0] as ConstructorNode;

    // checking if exists and is constructor
    if (!targetNode || targetNode.data.purpose !== NodePurpose.CONSTRUCT)
      return;

    const { allowedVariableTypes, numOfInputVars, inputs, inputLabelTemplate } =
      targetNode.data;
    // checking if new number is not the same
    if (newNum === numOfInputVars) return;

    // const { inputs } = targetNode.data;

    if (newNum > numOfInputVars) {
      // adding new entries
      for (let i = numOfInputVars + 1; i <= newNum; i++) {
        const key = inputLabelTemplate(i);
        targetNode.data.inputs[key] = {
          ...initialInput,
          allowedTypes: [...allowedVariableTypes],
        };
      }
    } else {
      // removing last entries and connected to them edges
      let newEdges = get().edges;

      for (let i = numOfInputVars; i > newNum; i--) {
        const key = inputLabelTemplate(i);
        const inputToRemove = targetNode.data.inputs[key];
        if (inputToRemove) {
          const { valueId, allowedTypes } = inputToRemove;
          if (valueId) {
            const handleId = generateHandleLabel(nodeId, key, allowedTypes);
            const edges = newEdges.filter(({ target, targetHandle }) => {
              return !(targetHandle === handleId && target === targetNode.id);
            });
            newEdges = edges;
          }
        }

        delete inputs[key];
      }

      set({ edges: newEdges });
    }

    targetNode.data.numOfInputVars = newNum;
    const newNodes = replaceNode(targetNode, get().nodes);
    // recalculate node and chainFrom it
    const chainFrom = getChainIdsFrom(targetNode, get().edges);
    recalculateChain(
      chainFrom,
      newNodes,
      get().values,
      get().anglesFormat
    ).then((newVals) => set({ values: newVals.values }));

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
  deleteNodes: (nodeIds) => {
    const { newNodes } = deleteNodes(nodeIds, get().nodes);
    set({ nodes: newNodes });
  },
}));

const initialInput: NodeInput = {
  allowedTypes: ["number"],
  valueId: null,
};

export default useContent;
