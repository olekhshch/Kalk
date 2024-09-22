// returns array of nodes connected in the same chain (from outputs to inputs)

import { Edge } from "@xyflow/react";
import { AppNode } from "../types/nodes";

type f = (
  startingNode: AppNode,
  edges: Edge[],
  includeResultNodes?: boolean
) => string[];

const getChainIdsFrom: f = (startingNode, edges, includeResultNodes) => {
  const nodeIds: string[] = [startingNode.id];

  const getTargets = (nodeId: string) => {
    const acc: string[] = [];

    // #TODO: Rewrite to avoid if-else hell
    edges.forEach((edge) => {
      if (edge.source === nodeId) {
        if (!acc.includes(edge.target)) {
          if (!includeResultNodes) {
            if (edge.targetHandle !== "R") {
              acc.push(edge.target);
            }
          } else {
            acc.push(edge.target);
          }
        }
      }
    });
    nodeIds.push(...acc);

    if (acc.length > 0) {
      acc.forEach((id) => getTargets(id));
    }
  };
  getTargets(startingNode.id);

  // in case nodeIds are repeating - leaving only those that appear last to avoid redundand recalculations
  const seen = new Set<string>();
  const uniqueNodeIds: string[] = [];

  for (let i = nodeIds.length - 1; i >= 0; i--) {
    const value = nodeIds[i];

    if (!seen.has(value)) {
      seen.add(value);
      uniqueNodeIds.push(value);
    }
  }
  return uniqueNodeIds.reverse();
};

export default getChainIdsFrom;
