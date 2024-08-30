import { Edge } from "@xyflow/react";
import { EdgeActionOutput } from "../../types/system";

type f = (
  sourceId: string,
  targetId: string,
  edges: Edge[],
  edgeCounter: number
) => EdgeActionOutput;

const connectNodes: f = (sourceId, targetId, edges, edgeCounter) => {
  const id = edgeCounter + 1;
  const newEdge: Edge = {
    id: id.toString(),
    source: sourceId,
    target: targetId,
  };

  return { newEdge, edges: [...edges, newEdge], edgeCounter: id };
};

export default connectNodes;
