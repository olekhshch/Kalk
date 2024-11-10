import { AppNode, ResultNode, MathNode, NodePurpose } from "../../types/nodes";
import { NodeActionOutput } from "../../types/app";
import { AppEdge } from "../../types/edges";
import makeValueId from "../makeValueId";

type f = (
  sourceNodeId: string,
  nodes: AppNode[],
  idCounter: number
) => NodeActionOutput;

const showResultFor: f = (sourceNodeId, nodes, idCounter) => {
  const sourceNode = nodes.find((node) => node.id === sourceNodeId);
  const resNode = nodes.find(
    (node) => node.type === "result" && node.data.sourceNodeId === sourceNodeId
  ) as ResultNode;

  if (!sourceNode) return { newNode: null, nodes };

  const { position, measured } = sourceNode as MathNode;

  // Recalculating Result Node position to appear near the source node
  const x = position.x + (measured ? measured!.width! + 60 : 60);
  const y = position.y - 60;

  // if noRes node in state - create new one
  if (!resNode) {
    const resId = idCounter + 1;
    const newNode: ResultNode = {
      id: resId.toString(),
      type: "result",
      position: { x, y },
      data: {
        inputs: [],
        outputs: {},
        isShown: true,
        purpose: NodePurpose.DECOR,
        sourceNodeId,
        tag: "result",
        value: "",
        valueId: makeValueId(sourceNodeId, "c"),
      },
    };

    return { newNode, nodes: [...nodes, newNode], idCounter: resId };
  }

  // if res Node is already created - changing it
  const newNode: ResultNode = {
    ...resNode,
    position: { x, y },
    data: {
      ...resNode.data,
      isShown: true,
    },
  };

  const newNodes = nodes.map((node) => {
    if (node.id === resNode.id) return newNode;

    return node;
  });

  return { newNode, nodes: newNodes };
};

const hideResultFor = (
  sourceNodeId: string,
  nodes: AppNode[],
  edges: AppEdge[]
) => {
  // let newEdges = edges.filter((edge) => edge.source !== sourceNodeId);
  // console.log({ newEdges, sourceNodeId });
  // const newNodes = nodes.map((node) => {
  //   if (node.type === "result" && node.data.sourceId === sourceNodeId) {
  //     return { ...node, data: { ...node.data, isShown: false } };
  //   }
  //   return node;
  // });
  const resNodeId = "r" + sourceNodeId;
  const newEdges = edges.filter((edge) => edge.target !== resNodeId);

  const newNodes = nodes.filter((node) => node.id !== resNodeId);

  return { newNodes, newEdges };
};

// const toggleResultFor = (params: {
//   sourceNode: AppNode;
//   nodes: AppNode[];
//   edges: Edge[];
//   edgeCounter: number;
// }) => {
//   // // #TODO: Rewrite better?
//   const { nodes, edges, sourceNode, edgeCounter } = params;
//   let wasShown = false;

//   const resNodeId = "r" + sourceNode.id;

//   const newNodes = nodes.filter((node) => {
//     if (node.id === resNodeId) {
//       wasShown = true;
//     }
//     return node.id !== resNodeId;
//   });

//   if (wasShown) {
//     // if resNode was shown - delete edge
//     return { newNodes, newEdges: edges };
//   }

//   if (!wasShown) {
//     // if wasn't shown - new node and connection should be created
//     const resNode = makeResultNode(sourceNode);

//     if (resNode) {
//     }
//   }
//   // let newEdges = edges;
//   // let idCnt = idCounter;
//   // let edgeCnt = edgeCounter;
//   // const newNodes = nodes.map((node) => {
//   //   if (node.type === "result" && node.data.sourceId === sourceId) {
//   //     if (node.data.isShown) {
//   //       newEdges = edges.filter((edge) => edge.target !== node.id);
//   //       return {
//   //         ...node,
//   //         data: { ...node.data, isShown: false },
//   //       } as ResultNode;
//   //     }
//   //     const { newNode, idCounter } = showResultFor(sourceId, nodes, idCnt);
//   //     const es = connectNodes(sourceId, node.id, edges, edgeCounter);
//   //     newEdges = es.edges;
//   //     edgeCounter += 1;

//   //     return newNode ?? node;
//   //   }
//   //   return node;
//   // });

//   return { newNodes, newEdges, edgeCounter, idCounter };
// };

// const showAllResults = (nodes: AppNode[], idCounter: number) => {
//   const createdNodes: ResultNode[] = [];
//   const newNodes = nodes.map((node) => {
//     if (["num-fun", "mtx-fn"].includes(node.type!)) {
//     }
//   });
// };

const hideAllResults = (nodes: AppNode[], edges: AppEdge[]) => {
  const newEdges = edges.filter((edge) => !edge.target.includes("r"));

  const newNodes = nodes.filter((node) => !node.id.includes("r"));

  return { newNodes, newEdges };
};

export default {
  showResultFor,
  hideResultFor,
  // toggleResultFor,
  hideAllResults,
};
