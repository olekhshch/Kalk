import { AppNode, ResultNode, MathNode } from "../../types/nodes";
import { NodeActionOutput } from "../../types/app";
import { Edge } from "@xyflow/react";
import { Effect } from "@tauri-apps/api/window";
import connectNodes from "../connectNodes";

type f = (
  sourceNodeId: string,
  nodes: AppNode[],
  idCounter: number
) => NodeActionOutput;

const showResultFor: f = (sourceNodeId, nodes, idCounter) => {
  const sourceNode = nodes.find((node) => node.id === sourceNodeId);
  const resNode = nodes.find(
    (node) => node.type === "result" && node.data.sourceId === sourceNodeId
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
        sourceId: sourceNodeId,
        isShown: true,
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
  edges: Edge[]
) => {
  let newEdges = edges.filter((edge) => edge.source !== sourceNodeId);
  console.log({ newEdges, sourceNodeId });
  const newNodes = nodes.map((node) => {
    if (node.type === "result" && node.data.sourceId === sourceNodeId) {
      return { ...node, data: { ...node.data, isShown: false } };
    }
    return node;
  });

  return { newNodes, newEdges };
};

const toggleResultFor = (
  sourceId: string,
  nodes: AppNode[],
  edges: Edge[],
  edgeCounter: number
) => {
  // #TODO: Rewrite better?
  let newEdges = edges;
  let edgeCnt = edgeCounter;
  const newNodes = nodes.map((node) => {
    if (node.type === "result" && node.data.sourceId === sourceId) {
      if (node.data.isShown) {
        newEdges = edges.filter((edge) => edge.target !== node.id);
        return {
          ...node,
          data: { ...node.data, isShown: false },
        } as ResultNode;
      }
      const { newNode } = showResultFor(sourceId, nodes, 0);
      const es = connectNodes(sourceId, node.id, edges, edgeCounter);
      newEdges = es.edges;
      edgeCounter += 1;

      return newNode ?? node;
    }
    return node;
  });

  return { newNodes, newEdges, edgeCounter };
};

export default { showResultFor, hideResultFor, toggleResultFor };
