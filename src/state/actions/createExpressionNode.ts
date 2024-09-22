import React from "react";
import { CreateNodeAction } from "../../types/app";
import { ExpressionNode, ResultNode } from "../../types/nodes";

const createExpressionNode: CreateNodeAction = ({
  nodes,
  idCounter,
  position,
}) => {
  const id = idCounter + 1;
  const newNode: ExpressionNode = {
    id: id.toString(),
    type: "expression",
    category: "numbers",
    position: position ?? { x: 0, y: 0 },
    data: {
      value: "",
      showResult: false,
      calc: {
        res: null,
      },
    },
  };
  return { newNode, nodes: [...nodes, newNode], idCounter: id };
};

export default createExpressionNode;
