import { Node } from "@xyflow/react";

export type NodeType =
  | "text-single"
  | "expression"
  | "result-number"
  | "add"
  | "substract"
  | "abs"
  | "multiply"
  | "divide"
  | "sin"
  | "cos"
  | "tg"
  | "ctg"
  | "to-rad"
  | "to-deg"
  | "power"
  | "asin"
  | "acos"
  | "atg";

export type ValueType = "number" | "text";

export type MathNode =
  | ExpressionNode
  // | AdditionNode
  // | SubstractionNode
  // | AbsoluteNode
  // | MultiplyNode
  | NumberFunctionNode;

export type AppNode = TextSingleNode | ResultNode | MathNode;

export type TextSingleNode = Node<{ value: string }, "text-single">;

export type ExpressionNode = Node<
  {
    value: string;
    showResult: boolean;
    inputs: { [x: string]: Input };
    outputs: { N: ValueType };
  },
  "expression"
>;

export type CalculationsData = {
  res: number | null;
};

export type ResultNode = Node<
  { sourceId: string; value: string },
  "result-number"
>;

export type AdditionNode = Node<
  {
    showResult: boolean;
    inputs: {
      a: Input;
      b: Input;
    };
    outputs: {
      N: ValueType;
    };
  },
  "add"
>;

export type SubstractionNode = Node<
  {
    showResult: boolean;
    inputs: {
      a: Input;
      b: Input;
    };
    outputs: {
      N: ValueType;
    };
  },
  "substract"
>;

export type AbsoluteNode = Node<
  {
    showResult: boolean;
    inputs: {
      a: Input;
    };
    outputs: {
      N: ValueType;
    };
  },
  "abs"
>;

export type MultiplyNode = Node<
  {
    showResult: boolean;
    inputs: {
      a: Input;
      b: Input;
    };
    outputs: {
      N: ValueType;
    };
  },
  "multiply"
>;

// general type for nodes with regular functions on numbers (e.g. adding, multiplying etc.)
export type NumberFunctionNode = Node<
  {
    label: string;
    tag: NodeType;
    showResult: boolean;
    inputs: {
      [k: string]: Input;
    };
    outputs: {
      N: ValueType;
    };
    action: (vals: NumberFunctionParams) => number;
    trigonometry?: boolean;
    isAngle?: boolean;
  },
  "num-fun"
>;

export type NumberFunctionParams = {
  [k: string]: number;
};
export type InputLabel = "a" | "b";

export type Input = {
  sourceId: string | null;
  type: ValueType;
};
