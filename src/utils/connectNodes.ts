import { addEdge } from "@xyflow/react";
import { EdgeActionOutput } from "../types/app";
import { AppEdge } from "../types/edges";

type f = (params: {
  sourceId: string;
  targetId: string;
  edges: AppEdge[];
  edgeId: string;
  sourceHandle?: string;
  targetHandle?: string;
  result?: boolean;
}) => EdgeActionOutput;

const connectNodes: f = ({
  sourceId,
  targetId,
  edges,
  edgeId,
  targetHandle,
  sourceHandle,
  result,
}) => {
  // const id = edgeCounter + 1;
  const newEdge: AppEdge = {
    id: edgeId,
    source: sourceId,
    target: targetId,
    targetHandle: result ? "R" : targetHandle,
    // type: "app-edge",
    sourceHandle: result ? "res" : sourceHandle,
  };

  return { newEdge, edges: addEdge(newEdge, edges) };
};

export default connectNodes;
