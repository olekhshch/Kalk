import { Node } from "@xyflow/react";

export type NodeType = string &
  ("text-single" | "expression" | "result-number");

export type NodeCategory = "numbers" | "text";

export type AppNode = Node<{}> & {
  type: NodeType;
  category?: NodeCategory;
};

export type TextSingleNode = AppNode &
  Node<{
    text: string;
  }> & {
    type: NodeType;
  };

export type ExpressionNode = AppNode &
  Node<{
    value: string;
    showResult: boolean;
    calc: CalculationsData;
  }> & {
    type: "expression";
  };

export type CalculationsData = {
  res: number | null;
};

export type ResultNode = AppNode &
  Node<{
    sourceNodeId: string;
  }>;
