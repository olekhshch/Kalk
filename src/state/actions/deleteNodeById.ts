import { NodeAction } from "../../types/app";

const deleteNodeById: NodeAction = ({ nodes, nodeIds }) => {
  if (!nodeIds || nodeIds.length === 0) return { nodes };
  const newNodes = nodes.filter((node) => !nodeIds.includes(node.id));
  return { nodes: newNodes };
};

export default deleteNodeById;
