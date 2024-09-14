import { Node } from "@xyflow/react";

export type NodeType = string &
  ("text-single" | "expression" | "result-number");

export type NodeCategory = "numbers" | "text";

export type AppNode = TextSingleNode | ExpressionNode | ResultNode;

export type TextSingleNode = Node<{ value: string }, "text-single">;

export type ExpressionNode = Node<
  { value: string; showResult: boolean },
  "expression"
>;

export type CalculationsData = {
  res: number | null;
};

export type ResultNode = Node<
  { sourceId: string; value: string },
  "result-number"
>;
