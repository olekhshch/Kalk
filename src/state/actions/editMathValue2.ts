import React from "react";
import { AppNode, ExpressionNode, NodeType } from "../../types/nodes";

type f = (
  nodeId: string,
  newValue: string,
  nodes: AppNode[],
  nodeType: NodeType | string
) => { nodes: AppNode[]; newNode: ExpressionNode | null };

const editMathValue: f = (nodeId, newValue, nodes, nodeType) => {
  let alteredNode: AppNode | null = null;

  const newNodes = nodes.map((node) => {
    if (nodeId === node.id && node.type === nodeType) {
      const newNode = { ...node, data: { ...node.data, value: newValue } };
      alteredNode = newNode;
      return newNode;
    }
    return node;
  });

  return { newNode: alteredNode, nodes: newNodes };
};

export default editMathValue;
