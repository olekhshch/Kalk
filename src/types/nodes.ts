import { Node } from "@xyflow/react";

// functions on numbers (...nums) => num
export type NumNodeType =
  | "expression"
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

// mtx/vecs functions ( (...nums | Matrices | Vectors) => Matrix | Vector | num
export type MtxVecNodeType =
  | "I-matrix"
  | "mtx-rows"
  | "vec"
  | "norm"
  | "add-mtx"
  | "scalar-mult"
  | "dot-prod"
  | "cross-prod"
  | "sum-all";

export type OrganizationalNodeType = "text-single" | "result";

export type NodeType = OrganizationalNodeType | NumNodeType | MtxVecNodeType;

export type ValueType = "number" | "text" | "matrix" | "vector";

export type Vector = number[];

export type Matrix = Vector[];

export type MathNode = ExpressionNode | NumberFunctionNode;

// Nodes with dinamic number of inputs
export type ConstructorNode = VectorNode | MtxFromRowsNode;

export type MtxNode =
  | IdentityMtxNode
  | VectorNode
  | MtxVecFnNode
  | MtxFromRowsNode;

export type AppNode = TextSingleNode | ResultNode | MathNode | MtxNode;

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

export type ResultNode = Node<{ sourceId: string; value: string }, "result">;

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
    action: (vals: NumberFunctionParams) => number | Matrix;
    trigonometry?: boolean;
    isAngle?: boolean;
  },
  "num-fun"
>;

export type NumberFunctionParams = {
  [k: string]: number;
};
// export type InputLabel = "a" | "b";

export type Input = {
  sourceId: string | null;
  type: ValueType;
  allowedTypes: ValueType[];
};

export type IdentityMtxNode = Node<
  {
    showResult: boolean;
    inputs: {
      n: Input;
    };
    outputs: {
      M: ValueType;
    };
  },
  "i-mtx"
>;

// vector = array of numbers (row of Matrix)
export type VectorNode = Node<
  {
    showResult: boolean;
    isConstructor: true;
    inputTemplate: (n: number) => string;
    numberOfEntries: number;
    inputs: { [k: string]: Input };
    outputs: {
      V: ValueType;
    };
  },
  "vec"
>;

export type MtxFromRowsNode = Node<
  {
    showResult: boolean;
    isConstructor: true;
    inputTemplate: (n: number) => string;
    numberOfEntries: number;
    inputs: { [r: string]: Input };
    outputs: {
      M: ValueType;
    };
  },
  "mtx-rows"
>;

export type MtxVecFnNode = Node<
  {
    label: string;
    tag: NodeType;
    showResult: boolean;
    inputs: {
      [k: string]: Input;
    };
    outputs: {
      [m: string]: ValueType;
    };
    action: MtxVecFnAction;
  },
  "mtx-fn"
>;

export type MtxVecFunctionParams = {
  [k: string]: number | Matrix | Vector;
};

export type MtxVecFnAction = (
  vals: MtxVecFunctionParams
) => number | Matrix | Vector | null;
