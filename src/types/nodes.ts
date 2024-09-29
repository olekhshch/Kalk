import { Node } from "@xyflow/react";
import { AngleFormat } from "./app";

export enum NodePurpose {
  FN, // function with static number of inputs/outputs
  CONSTRUCT, // constructs new values based on dinamic number of inputs
  DECONSTRUCT, // de-constructs values into new values
  DECOR, // no action (e.g. text nodes)
}

// _ functions on numbers (...nums) => num
export type NumNodeTag =
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

// _ mtx/vecs functions ( (...nums | Matrices | Vectors) => Matrix | Vector | num
export type MtxVecNodeTag =
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

export type OrganizationalNodeTag = "text-single" | "result";
export type NodeTag = OrganizationalNodeTag | NumNodeTag | MtxVecNodeTag;

// export type NodeType = OrganizationalNodeType | NumNodeType | MtxVecNodeType;
export type NodeType =
  | "expression"
  | "math-fn"
  | "text-single"
  | "result"
  | "mtx-fn"
  | "mtx-constr";

export type ValueType = "number" | "text" | "matrix" | "vector";

export type Vector = number[];

export type Matrix = Vector[];

// !!!!!
// export type AppNode = TextSingleNode | ResultNode | MathNode | MtxNode;
export type AppNode =
  | ResultNode
  | MathNode
  | MtxNode
  | ConstructorNode
  | TextSingleNode;

export type MathNode = ExpressionNode | FnNode;

export type MtxNode = AppNodeBase<"mtx-fn">;

export type FnNode = AppNodeBase<"math-fn">;

export type AppNodeBase<NT extends NodeType> = Node<
  {
    comment?: string;
    inputs: NodeInputs;
    outputs: NodeOutputs;
    tag: NodeTag;
    value: string;
    action?: NodeAction;
    purpose: NodePurpose;
    // constructor nodes
    // numOfInputVars?: number; // number of inputs (e.g. number of entries to construct a vector)
    // defaultInputs?: NodeInputs;
    // inputLabelTemplate?: (...params: (number | string)[]) => string; // how additional inputs should be named
    // allowedVariableTypes?: ValueType[];
  },
  NT
>;

export type ExpressionNode = AppNodeBase<"expression"> & {
  data: {
    action: NodeAction;
  };
};

export type TextSingleNode = AppNodeBase<"text-single">;

export type ResultNode = AppNodeBase<"result"> & {
  sourceNodeId: string;
  valueId: string;
  isShown: boolean;
};

// Nodes with dinamic number of inputs
export type ConstructorNode = AppNodeBase<"mtx-constr"> & {
  data: {
    purpose: NodePurpose.CONSTRUCT;
    numOfInputVars: number;
    // defaultInputs: NodeInputs;
    inputLabelTemplate: (...params: (string | number)[]) => string;
    allowedVariableTypes: ValueType[];
  };
};

// labels of node's handles
export type handleLabel = "a" | "b" | "n" | "v" | "N" | "M" | "d" | string;

export type NodeInput = {
  valueId: string | null;
  allowedTypes: ValueType[];
  defValue?: InputValue;
};

export type NodeInputs = {
  [k in keyof handleLabel as handleLabel]?: NodeInput;
};

export type OutputValue = number | Vector | Matrix | null;

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
  [k in keyof handleLabel as handleLabel]?: NodeOutput;
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

export type NodeAction = (
  params: {
    [k: string]: InputValue;
  },
  value?: string,
  angleFormat?: AngleFormat
) => OutputValue | Promise<OutputValue>;
