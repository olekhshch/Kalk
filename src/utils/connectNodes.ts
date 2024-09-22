import { addEdge, Edge } from "@xyflow/react";
import { EdgeActionOutput } from "../types/app";

type f = (
  sourceId: string,
  targetId: string,
  edges: Edge[],
  edgeCounter: number,
  targetHandle?: string
) => EdgeActionOutput;

const connectNodes: f = (
  sourceId,
  targetId,
  edges,
  edgeCounter,
  targetHandle
) => {
  const id = edgeCounter + 1;
  const newEdge: Edge = {
    id: id.toString(),
    source: sourceId,
    target: targetId,
    targetHandle,
  };

  return { newEdge, edges: addEdge(newEdge, edges), edgeCounter: id };
};

export default connectNodes;
