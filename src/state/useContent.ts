import { addEdge, applyNodeChanges, Edge, reconnectEdge } from "@xyflow/react";
import { create } from "zustand";
import {
  AppNode,
  AppNodeBase,
  ConstantNode,
  ConstructorNode,
  ExpressionNode,
  IdentityMtxNode,
  Input,
  MathNode,
  MtxFromRowsNode,
  MtxVecFnNode,
  NodePurpose,
  NumberFunctionNode,
  NumNodeType,
  ResultNode,
  TextSingleNode,
  VectorNode,
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
import nodeFunctionContructor from "../utils/constructors/nodeNumFnConstructor";
import generateHandleLabel, {
  deconstructHandleId,
} from "../utils/generateHandleId";
import nodeMatrixFnConstructor from "../utils/constructors/nodeMatrixFnConstructor";
import recalculateAll from "../utils/calculations/recalculateAll";
import isConnectable from "../utils/edges/isConnectable";
import resultNodes from "../utils/nodes/resultNodes";
import deleteNodes from "../utils/nodes/deleteNodes";
import { invoke } from "@tauri-apps/api/core";
import makeValueId from "../utils/makeValueId";
import makeResultNode from "../utils/nodes/makeResultNode";
import createNode from "../utils/nodes/createNode";

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
  constValues: {
    CONST_E: Math.E,
    CONST_PI: Math.PI,
  },
  anglesFormat: AngleFormat.RAD,
  setAnglesFormat: async (newFormat) => {
    if (newFormat !== get().anglesFormat) {
      set({ anglesFormat: newFormat });
      const newValues = await recalculateAll(
        get().nodes,
        get().edges,
        get().constValues,
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
  addNode: (nodeTag, position, data) => {
    let id = get().idCounter + 1;

    const newNode = createNode(nodeTag, id.toString(), position, data?.constId);

    if (!newNode) return;

    set({ nodes: [...get().nodes, newNode], idCounter: id });

    id += 1;

    const resNode = makeResultNode(newNode, id.toString());

    if (!resNode) return;

    const newEdges = connectNodes(
      newNode.id,
      resNode.id,
      get().edges,
      get().edgeCounter
    );

    set({
      nodes: [...get().nodes, resNode],
      idCounter: id,
      edges: newEdges.edges,
      edgeCounter: get().edgeCounter + 1,
    });

    // let id = get().idCounter + 1;
    // set({ idCounter: id });
    // const nodeId = id.toString();
    // const newValues = { ...get().values };
    // switch (nodeType) {
    //   case "expression": {
    //     const newNode: ExpressionNode = {
    //       id: nodeId,
    //       type: "expression",
    //       position,
    //       data: {
    //         tag: "expression",
    //         value: "",
    //         showResult: false,
    //         inputs: {},
    //         outputs: { N: "number" },
    //       },
    //     };
    //     const valueId = makeValueId(nodeId, "N");
    //     newValues[valueId] = null;
    //     id += 1;
    //     set({ idCounter: id });
    //     const resNode: ResultNode = {
    //       id: id.toString(),
    //       type: "result",
    //       position: { x: position.x + 60, y: position.y - 60 },
    //       data: {
    //         tag: "result",
    //         sourceId: nodeId,
    //         valueId,
    //         isShown: false,
    //       },
    //     };
    //     const newEdgesRes = connectNodes(
    //       nodeId,
    //       id.toString(),
    //       get().edges,
    //       get().edgeCounter,
    //       "R"
    //     );
    //     set({
    //       nodes: [...get().nodes, newNode, resNode],
    //       edges: newEdgesRes.edges,
    //       edgeCounter: newEdgesRes.edgeCounter,
    //     });
    //     break;
    //   }
    //   case "text-single": {
    //     const newNode: TextSingleNode = {
    //       id: nodeId,
    //       type: "text-single",
    //       data: { value: "", tag: "text" },
    //       position,
    //     };
    //     set({
    //       nodes: [...get().nodes, newNode],
    //     });
    //     break;
    //   }
    //   case "constant": {
    //     if (!data || !data.constId) break;
    //     const newNode: ConstantNode = {
    //       id: nodeId,
    //       position,
    //       type: "constant",
    //       data: {
    //         constId: data.constId,
    //       },
    //     };
    //     id += 1;
    //     set({ idCounter: id });
    //     const resNode: ResultNode = {
    //       id: id.toString(),
    //       position,
    //       type: "result",
    //       data: {
    //         isShown: false,
    //         sourceId: nodeId,
    //         valueId: data.constId,
    //         tag: "result",
    //         comment: "",
    //         isConst: true,
    //       },
    //     };
    //     set({ nodes: [...get().nodes, newNode, resNode] });
    //     break;
    //   }
    //   case "I-matrix": {
    //     const newNode: IdentityMtxNode = {
    //       id: nodeId,
    //       position,
    //       type: "i-mtx",
    //       data: {
    //         showResult: false,
    //         inputs: {
    //           n: {
    //             sourceId: null,
    //             allowedTypes: ["number"],
    //             type: "number",
    //           },
    //         },
    //         outputs: {
    //           M: { possibleValues: ["matrix"] },
    //         },
    //       },
    //     };
    //     const valueId = makeValueId(nodeId, "M");
    //     newValues[valueId] = null;
    //     id += 1;
    //     set({ idCounter: id });
    //     const resNode: ResultNode = {
    //       id: id.toString(),
    //       type: "result",
    //       position: { x: position.x + 60, y: position.y - 60 },
    //       data: {
    //         tag: "result",
    //         sourceId: nodeId,
    //         valueId,
    //         isShown: false,
    //       },
    //     };
    //     const newEdgesRes = connectNodes(
    //       nodeId,
    //       id.toString(),
    //       get().edges,
    //       get().edgeCounter,
    //       "R"
    //     );
    //     set({
    //       nodes: [...get().nodes, newNode, resNode],
    //       edges: newEdgesRes.edges,
    //       edgeCounter: newEdgesRes.edgeCounter,
    //     });
    //     break;
    //   }
    //   case "vec": {
    //     const newNode: VectorNode = {
    //       id: nodeId,
    //       position,
    //       type: "vec",
    //       data: {
    //         isConstructor: true,
    //         inputTemplate: (n) => `v${n}`,
    //         showResult: false,
    //         numberOfEntries: 3,
    //         allowedInputTypes: ["number"],
    //         inputs: {
    //           v1: { ...initialInput },
    //           v2: { ...initialInput },
    //           v3: { ...initialInput },
    //         },
    //         outputs: {
    //           V: { possibleValues: ["vector"] },
    //         },
    //       },
    //     };
    //     const valueId = makeValueId(nodeId, "V");
    //     newValues[valueId] = null;
    //     id += 1;
    //     set({ idCounter: id });
    //     const resNode: ResultNode = {
    //       id: id.toString(),
    //       type: "result",
    //       position: { x: position.x + 60, y: position.y - 60 },
    //       data: {
    //         tag: "result",
    //         sourceId: nodeId,
    //         isShown: false,
    //         valueId,
    //       },
    //     };
    //     const newEdgesRes = connectNodes(
    //       nodeId,
    //       id.toString(),
    //       get().edges,
    //       get().edgeCounter,
    //       "R"
    //     );
    //     set({
    //       nodes: [...get().nodes, newNode, resNode],
    //       edges: newEdgesRes.edges,
    //       edgeCounter: newEdgesRes.edgeCounter,
    //     });
    //     break;
    //   }
    //   case "mtx-rows": {
    //     const newNode: MtxFromRowsNode = {
    //       id: nodeId,
    //       position,
    //       type: "mtx-rows",
    //       data: {
    //         showResult: false,
    //         isConstructor: true,
    //         numberOfEntries: 3,
    //         allowedInputTypes: ["vector"],
    //         outputs: {
    //           M: { possibleValues: ["matrix"] },
    //         },
    //         inputs: {
    //           v1: {
    //             sourceId: null,
    //             allowedTypes: ["vector"],
    //             type: "vector",
    //           },
    //           v2: {
    //             sourceId: null,
    //             allowedTypes: ["vector"],
    //             type: "vector",
    //           },
    //           v3: {
    //             sourceId: null,
    //             allowedTypes: ["vector"],
    //             type: "vector",
    //           },
    //         },
    //         inputTemplate: (n) => `v${n}`,
    //       },
    //     };
    //     const valueId = makeValueId(nodeId, "M");
    //     newValues[valueId] = null;
    //     id += 1;
    //     set({ idCounter: id });
    //     const resNode: ResultNode = {
    //       id: id.toString(),
    //       type: "result",
    //       position: { x: position.x + 60, y: position.y - 60 },
    //       data: {
    //         tag: "result",
    //         sourceId: nodeId,
    //         isShown: false,
    //         valueId,
    //       },
    //     };
    //     const newEdgesRes = connectNodes(
    //       nodeId,
    //       id.toString(),
    //       get().edges,
    //       get().edgeCounter,
    //       "R"
    //     );
    //     set({
    //       nodes: [...get().nodes, newNode, resNode],
    //       edges: newEdgesRes.edges,
    //       edgeCounter: newEdgesRes.edgeCounter,
    //     });
    //     break;
    //   }
    //   case "cross-prod":
    //   case "norm":
    //   case "dot-prod":
    //   case "add-mtx":
    //   case "sum-all":
    //   case "scalar-mult": {
    //     const newNode = nodeMatrixFnConstructor(nodeType, position, nodeId);
    //     if (newNode) {
    //       id += 1;
    //       set({ idCounter: id });
    //       // #TODO: Fix valueId
    //       Object.keys(newNode.data.outputs).forEach((outputKey) => {
    //         newValues[nodeId + "." + outputKey] = null;
    //       });
    //       const resNode: ResultNode = {
    //         id: id.toString(),
    //         type: "result",
    //         position: { x: position.x + 60, y: position.y - 60 },
    //         data: {
    //           tag: "result",
    //           sourceId: nodeId,
    //           valueId: "",
    //           isShown: false,
    //         },
    //       };
    //       const newEdgesRes = connectNodes(
    //         nodeId,
    //         id.toString(),
    //         get().edges,
    //         get().edgeCounter,
    //         "R"
    //       );
    //       set({
    //         nodes: [...get().nodes, newNode, resNode],
    //         edges: newEdgesRes.edges,
    //         edgeCounter: newEdgesRes.edgeCounter,
    //       });
    //     }
    //     break;
    //   }
    //   default: {
    //     const newNode = nodeFunctionContructor(
    //       nodeType as NumNodeType,
    //       position,
    //       nodeId
    //     );
    //     if (newNode) {
    //       set({ nodes: [...get().nodes, newNode] });
    //       Object.keys(newNode.data.outputs).forEach((outputKey) => {
    //         newValues[nodeId + "." + outputKey] = null;
    //       });
    //       id += 1;
    //       set({ idCounter: id });
    //       const resultNode = makeResultNode(newNode, id.toString());
    //       if (resultNode) {
    //         const newEdgesRes = connectNodes(
    //           nodeId,
    //           resultNode.id,
    //           get().edges,
    //           get().edgeCounter,
    //           "R"
    //         );
    //         set({
    //           nodes: [...get().nodes, resultNode],
    //           edges: newEdgesRes.edges,
    //           edgeCounter: newEdgesRes.edgeCounter,
    //         });
    //       }
    //     }
    //   }
    // }
    // // sets null values for any created node
    // set({ values: newValues });
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
        get().constValues,
        get().anglesFormat
      );
      set({ values: calcRes.values });
    }

    set({ nodes });
  },
  showResultFor: (nodeId) => {
    // const id = get().idCounter + 1;
    // set({ idCounter: id });
    const { newNode, nodes, idCounter } = resultNodes.showResultFor(
      nodeId,
      get().nodes,
      get().idCounter
    );

    if (newNode && idCounter && nodes.length > get().nodes.length) {
      // new Node was created for Result
      set({ idCounter: idCounter, nodes });

      const { edges, edgeCounter } = connectNodes(
        nodeId,
        newNode.id,
        get().edges,
        get().edgeCounter,
        "R"
      );
      set({ edges, edgeCounter, activeNodeId: null });
    } else {
      set({ nodes });
    }
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
    const { newEdges, newNodes, idCounter, edgeCounter } =
      resultNodes.toggleResultFor(
        nodeId,
        get().nodes,
        get().edges,
        get().edgeCounter,
        get().idCounter
      );
    set({ nodes: newNodes, edges: newEdges, idCounter, edgeCounter });
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
    const newEdge: Edge = {
      id: id.toString(),
      ...connection,
    };

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
    const existingEdge = get().edges.find(
      (edge) => edge.target === target && edge.targetHandle === targetHandle
    );
    const newEdges = !existingEdge
      ? addEdge(newEdge, get().edges)
      : reconnectEdge(existingEdge, connection, get().edges);

    const isSourceConst = nodeA.type === "constant";
    console.log({ targetHandleObj, sourceHandleObj });
    targetInput.valueId = isSourceConst
      ? sourceHandleObj.outputLabel
      : sourceHandleObj.label;
    console.log({ targetInput, newEdges });

    const newNodes = replaceNode(nodeB, get().nodes);

    // recalculates chain
    const chain = getChainIdsFrom(nodeB, newEdges);
    const calcRes = await recalculateChain(
      chain,
      newNodes,
      get().values,
      get().constValues,
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

    const { allowedVariableTypes, numOfInputVars } = targetNode.data;
    // checking if new number is not the same
    if (newNum === numOfInputVars) return;

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
          const handleId = generateHandleLabel(nodeId, key, types);

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
      get().constValues,
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
  deleteNodes: (nodeIds) => {
    const { newNodes } = deleteNodes(nodeIds, get().nodes);
    set({ nodes: newNodes });
  },
}));

const initialInput: Input = {
  allowedTypes: ["number"],
  sourceId: null,
  type: "number",
};

export default useContent;
