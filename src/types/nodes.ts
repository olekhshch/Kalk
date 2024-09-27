import { Node } from "@xyflow/react";
import { AngleFormat } from "./app";

// functions on numbers (...nums) => num
export type NumNodeType =
  | "expression"
  | "add"
  | "subtract"
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
  | "atg"
  | "floor"
  | "ceil"
  | "constant";

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
  | "sum-all"
  | "det";

export type OrganizationalNodeType = "text-single" | "result";

export type NodeType = OrganizationalNodeType | NumNodeType | MtxVecNodeType;

export type ValueType = "number" | "text" | "matrix" | "vector";

export type Vector = number[];

export type Matrix = Vector[];

export type MathNode = ExpressionNode | NumberFunctionNode | ConstantNode;

// Nodes with dinamic number of inputs
export type ConstructorNode = VectorNode | MtxFromRowsNode;

export type MtxNode =
  | IdentityMtxNode
  | VectorNode
  | MtxVecFnNode
  | MtxFromRowsNode;

export type AppNode = TextSingleNode | ResultNode | MathNode | MtxNode;

export type TextSingleNode = Node<
  { value: string; comment?: string | null; tag: "text" },
  "text-single"
>;

export type ExpressionNode = Node<
  {
    value: string;
    showResult: boolean;
    inputs: { [x: string]: Input };
    outputs: { N: ValueType };
    comment?: string | null;
    tag: "expression";
  },
  "expression"
>;

export type OutputValue = number | Vector | Matrix | null;

export type ResultNode = Node<
  {
    sourceId: string;
    valueId: string;
    isShown: boolean;
    comment?: string | null;
    tag: "result";
    isConst?: boolean;
  },
  "result"
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
      N?: NodeOutput;
      V?: NodeOutput;
      M?: NodeOutput;
    };
    action: (
      vals: NumberFunctionParams,
      angleFormat?: AngleFormat
    ) => OutputValue | Promise<OutputValue>;
    comment?: string | null;
  },
  "num-fun"
>;

export type NodeOutput = { possibleValues: ValueType[] };
export type NodeOutputs = {
  N?: NodeOutput;
  V?: NodeOutput;
  M?: NodeOutput;
};

// value that can be get from the Values Store
export type InputValue = number | Vector | Matrix | null | undefined;

export type NumberFunctionParams = {
  [k: string]: InputValue;
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
      M?: NodeOutput;
    };
    comment?: string | null;
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
    allowedInputTypes: ValueType[];
    inputs: { [k: string]: Input };
    outputs: NodeOutputs;
    comment?: string | null;
  },
  "vec"
>;

export type MtxFromRowsNode = Node<
  {
    showResult: boolean;
    isConstructor: true;
    inputTemplate: (n: number) => string;
    numberOfEntries: number;
    allowedInputTypes: ValueType[];
    inputs: { [r: string]: Input };
    outputs: NodeOutputs;
    comment?: string | null;
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
    outputs: NodeOutputs;
    action: MtxVecFnAction;
    comment?: string | null;
  },
  "mtx-fn"
>;

export type MtxVecFunctionParams = {
  [k: string]: InputValue;
};

export type MtxVecFnAction = (
  vals: MtxVecFunctionParams
) => OutputValue | Promise<OutputValue>;

export type ConstantNode = Node<
  {
    constId: string;
    comment?: string;
  },
  "constant"
>;
