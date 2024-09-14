import { Edge } from "@xyflow/react";
import { AppNode } from "../../types/nodes";

// recursive recalculation of values of nodes in the same branch/chain

type f = (
  startNode: AppNode,
  nodes: AppNode[],
  edges: Edge[]
) => { nodes: AppNode[] };

const recalculateBranch = (
  startNode: AppNode,
  nodes: AppNode[],
  edges: Edge[]
) => {};
