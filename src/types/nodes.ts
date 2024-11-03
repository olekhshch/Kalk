import { Node } from "@xyflow/react";
import { AngleFormat } from "./app";

export enum NodePurpose {
  FN, // function with static number of inputs/outputs
  CONSTRUCT, // constructs new values based on dinamic number of inputs
  DECONSTRUCT, // de-constructs values into new values
  DECOR, // no action (e.g. text nodes, constants)
  PLOT,
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
  | "mtx-cols"
  | "entries-vec"
  | "vec"
  | "norm"
  | "add-mtx"
  | "multiply-mtx"
  | "scalar-mult"
  | "dot-prod"
  | "cross-prod"
  | "sum-all"
  | "transpose"
  | "det";

export type PlotNodeTag = "plot";

export type OrganizationalNodeTag = "text-single" | "result" | "markdown";
export type NodeTag =
  | OrganizationalNodeTag
  | NumNodeTag
  | MtxVecNodeTag
  | PlotNodeTag;

// export type NodeType = OrganizationalNodeType | NumNodeType | MtxVecNodeType;
export type NodeType =
  | "expression"
  | "math-fn"
  | "text-single"
  | "result"
  | "mtx-fn"
  | "mtx-constr"
  | "constant"
  | "mtx-deconstr"
  | "markdown"
  | "plot";

export type ValueType = "number" | "text" | "matrix" | "vector" | "interval";

export type Vector = number[];

export type Matrix = Vector[];

// !!!!!
// export type AppNode = TextSingleNode | ResultNode | MathNode | MtxNode;
export type AppNode =
  | ResultNode
  | MathNode
  | MtxNode
  | ConstructorNode
  | DeConstructorNode
  | TextSingleNode
  | MarkdownNode
  | ConstantNode
  | PlotNode;

export type MathNode = ExpressionNode | FnNode;

export type MtxNode = AppNodeBase<"mtx-fn">;

export type FnNode = AppNodeBase<"math-fn">;

export type AppNodeBase<NT extends NodeType> = Node<
  {
    comment?: string;
    inputs: NodeInput[];
    outputs: NodeOutputs;
    tag: NodeTag;
    value: string;
    action?: NodeAction | DeconstructAction;
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

export type TextSingleNode = AppNodeBase<"text-single"> & {
  data: {
    styling: TextSingleStyling;
  };
};

export type TextSingleStyling = {
  bold?: boolean;
  italic?: boolean;
  underscore?: boolean;
  background?: string;
  "font-size"?: string;
  border?: string;
};

export type MarkdownNode = AppNodeBase<"markdown"> & {
  data: { styling: MarkdownStyling };
};

export type MarkdownStyling = {
  background: string;
  width: string;
  height: string;
};

export type ResultNode = AppNodeBase<"result"> & {
  data: {
    sourceNodeId: string;
    valueId: string;
    isShown: boolean;
  };
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

export type DeConstructorNode = AppNodeBase<"mtx-deconstr"> & {
  data: {
    purpose: NodePurpose.DECONSTRUCT;
    action: DeconstructAction;
  };
};

export type ConstantNode = AppNodeBase<"constant"> & {
  data: {
    constId: string;
  };
};

// labels of node's handles
export type handleLabel = "a" | "b" | "n" | "v" | "N" | "M" | "d" | string;

// export type NodeInput = {
//   valueId: string | null;
//   allowedTypes: ValueType[];
//   defValue?: InputValue;
// };
export type NodeInput = {
  label: string;
  valueId: string | null;
  allowedTypes: ValueType[];
  defValue?: InputValue;
  descr?: string;
};

// export type NodeInputs = {
//   [k in keyof handleLabel as handleLabel]?: NodeInput;
// };

export type OutputValue = number | Vector | Matrix | null;

export type ActionResult = {
  res: OutputValue;
  errors: string[];
};

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
export type InputValue = number | Vector | Matrix | Interval | null | undefined;

export type NumberFunctionParams = {
  [k: string]: InputValue;
};
// export type InputLabel = "a" | "b";

export type Input = {
  sourceId: string | null;
  type: ValueType;
  allowedTypes: ValueType[];
};

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

// export type MtxVecFnNode = Node<
//   {
//     label: string;
//     tag: NodeType;
//     showResult: boolean;
//     inputs: {
//       [k: string]: Input;
//     };
//     outputs: NodeOutputs;
//     action: MtxVecFnAction;
//     comment?: string | null;
//   },
//   "mtx-fn"
// >;

export type MtxVecFunctionParams = {
  [k: string]: InputValue;
};

export type MtxVecFnAction = (
  vals: MtxVecFunctionParams
) => OutputValue | Promise<OutputValue>;

export type NodeAction = (
  params: {
    [k: string]: InputValue;
  },
  value?: string,
  angleFormat?: AngleFormat
) => ActionResult | Promise<ActionResult>;

export type DeconstructAction = (
  params: {
    [k: string]: InputValue;
  },
  value?: string,
  angleFormat?: AngleFormat
) => DeconstructActionResult | null;

export type DeconstructActionResult = {
  outputs: {
    [k: string]: { possibleValues: ValueType[]; value: OutputValue };
  };
  errors: string[];
};

// ============= Plot types =================

export type PlotNode = AppNodeBase<"plot"> & {
  data: {
    equations: PlotEquation[];
    purpose: NodePurpose.PLOT;
    minSize: number;
  };
};

export type PlotEquation = VectorOnPlot | FunctionOnPlot | PointsOnPlot;

export type EquationType = "function" | "vec" | "points";

export type EquationBase<T extends EquationType> = {
  type: T;
  of: "x" | "y";
  color: string;
  id: number;
};

export type VectorOnPlot = EquationBase<"vec"> & {
  tip: [number, number];
};

export type FunctionOnPlot = EquationBase<"function"> & {
  fn: (arg?: number) => number;
};

export type PointsOnPlot = EquationBase<"points"> & {
  points: [number, number][];
};

export type PlotValue<T extends "interval" | "function"> = {
  type: T;
};

export type Interval = PlotValue<"interval"> & {
  value: [number, number][];
};
