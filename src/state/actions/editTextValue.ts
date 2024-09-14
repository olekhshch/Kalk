import { AppNode, TextSingleNode } from "../../types/nodes";
import { ContentStore } from "../../types/system";

type f = (
  nodeId: string,
  newValue: string,
  nodes: AppNode[]
) => { nodes: AppNode[]; newNode: TextSingleNode | null };

const editTextValue: f = (nodeId, newValue, nodes) => {
  let newNode: TextSingleNode | null = null;
  const newNodes = nodes.map((node) => {
    if (node.type === "text-single" && node.id === nodeId) {
      const editedNode = {
        ...node,
        data: { value: newValue },
      } as TextSingleNode;
      newNode = { ...editedNode };
      return editedNode;
    }
    return node;
  });

  return { nodes: newNodes, newNode };
};

export default editTextValue;
