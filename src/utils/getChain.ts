// returns array of nodes connected in the same chain

import { Edge } from "@xyflow/react";
import { AppNode } from "../types/nodes";

type f = (startingNode: AppNode, nodes: AppNode[], edges: Edge[]) => string[];

const getChainIds: f = (startingNode, nodes, edges) => {
  const nodeIds: string[] = [startingNode.id];

  const getTargets = (nodeId: string) => {
    const acc: string[] = [];

    edges.forEach((edge) => {
      if (edge.source === nodeId) {
        console.log({ edge, nodeId });
        if (!acc.includes(edge.target)) {
          acc.push(edge.target);
        }
      }
    });
    nodeIds.push(...acc);
    console.log({ nodeIds, acc });

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

export default getChainIds;
