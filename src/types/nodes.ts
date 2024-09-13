import { Node } from "@xyflow/react";

export type NodeType = string &
  ("text-single" | "expression" | "result-number");

export type NodeCategory = "numbers" | "text";

export type AppNode = TextSingleNode | ExpressionNode;

export type TextSingleNode = Node<{ text: string }, "text-single">;

export type ExpressionNode = Node<
  { value: string; showResult: boolean },
  "expression"
>;

export type CalculationsData = {
  res: number | null;
};

export type ResultNode = Node<{ sourceId: string }, "result">;
