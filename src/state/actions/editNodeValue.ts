// util to change string value of text/expression nodes

import { AppNode, NodeType } from "../../types/nodes";
import { NodeActionOutput } from "../../types/app";

const eligibleTypes: NodeType[] = ["expression", "text-single"];

type f = (
  nodeId: string,
  newValue: string,
  nodes: AppNode[],
  idCounter: number
) => NodeActionOutput;

const editNodeValue: f = (nodeId, newValue, nodes, idCounter) => {
  let alteredNode: AppNode | null = null;

  const newNodes = nodes.map((node) => {
    if (node.id === nodeId && eligibleTypes.includes(node.type!)) {
      const editedNode = {
        ...node,
        data: { ...(node.data as { value: string }), value: newValue },
      };
      alteredNode = editedNode as AppNode;
      return editedNode as AppNode;
    }
    return node;
  });

  return { newNode: alteredNode, nodes: newNodes, idCounter };
};

export default editNodeValue;
