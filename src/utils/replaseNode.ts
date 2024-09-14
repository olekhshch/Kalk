import { AppNode } from "../types/nodes";

const replaceNode = (newNode: AppNode, nodes: AppNode[]) => {
  return nodes.map((node) => {
    if (node.id === newNode.id) {
      return newNode;
    }
    return node;
  });
};

export default replaceNode;
