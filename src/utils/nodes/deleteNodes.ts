import { AppNode, ResultNode } from "../../types/nodes";

// Util for deletion  of nodes by id. Checks if deleted node is a result => doesn't delete it, only hides, unless source node is deleted as well
type f = (nodeIds: string[], nodes: AppNode[]) => { newNodes: AppNode[] };

const deleteNodes: f = (nodeIds, nodes) => {
  // Result Nodes always appear after it's source node => collection ResultNodes sourceIds for removal
  const resultsToDelete: string[] = []; // sourceIds of Result Nodes

  const newNodes = nodes.reduce((acc, node) => {
    if (nodeIds.includes(node.id)) {
      if (node.type === "result") {
        if (!resultsToDelete.includes(node.data.sourceId)) {
          const resNode: ResultNode = {
            ...node,
            data: { ...node.data, isShown: false },
          };
          acc.push(resNode);
          return acc;
        }
      } else {
        resultsToDelete.push(node.id);
      }
    } else {
      acc.push(node);
    }
    return acc;
  }, [] as AppNode[]);

  return { newNodes };
};

export default deleteNodes;
