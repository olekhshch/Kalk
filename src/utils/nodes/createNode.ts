import {
  AppNode,
  ConstantNode,
  ConstructorNode,
  DeconstructAction,
  DeConstructorNode,
  ExpressionNode,
  MarkdownNode,
  MathNode,
  MtxNode,
  MtxVecNodeTag,
  NodeAction,
  NodeInputs,
  NodePurpose,
  NodeTag,
  NodeType,
  NumNodeTag,
  PlotNode,
  TextSingleNode,
  ValueType,
} from "../../types/nodes";
import nodeActions from "./nodeActions";
import nodeOutputs from "./nodeOutputs";
import nodeInputs from "./nodesInputs";

type Factory = (
  tag: NodeTag,
  id: string,
  position: { x: number; y: number },
  constId?: string
) => AppNode | null;

const createNode: Factory = (tag, nodeId, position, constId) => {
  // separate util for Result Nodes
  if (tag === "result") return null;

  const inputs = structuredClone(nodeInputs[tag]);
  const outputs = structuredClone(nodeOutputs[tag]);
  const type = getNodeType(tag);
  const action = nodeActions[tag];
  const value = getNodeValue(tag);
  // const purpose = getPurpose(tag);
  const numOfInputVars = getNmOfInputs(tag);
  const { defaultInputs, inputLabelTemplate, allowedVariableTypes } =
    getConstructorData(tag);

  if (!inputs || !outputs || !type) return null;

  const base = {
    id: nodeId,
    position,
    type,
  };

  switch (type) {
    case "expression": {
      if (!action) {
        console.log("No action for " + type);
        return null;
      }
      const newNode: ExpressionNode = {
        ...base,
        type,
        data: {
          action: action as NodeAction,
          tag,
          value,
          inputs,
          outputs,
          purpose: NodePurpose.FN,
        },
      };
      return newNode;
    }
    case "text-single": {
      const newNode: TextSingleNode = {
        ...base,
        type,
        data: {
          purpose: NodePurpose.DECOR,
          tag,
          value,
          inputs,
          outputs,
          styling: {
            italic: true,
            bold: true,
            underscore: false,
            border: "2px solid var(--main)",
            background: "var(--sec)",
            "font-size": "16px",
          },
        },
      };
      return newNode;
    }
    case "math-fn": {
      const newNode: MathNode = {
        ...base,
        type,
        data: {
          purpose: NodePurpose.FN,
          tag,
          value,
          action: action as NodeAction,
          inputs,
          outputs,
        },
      };
      return newNode;
    }
    case "mtx-fn": {
      const newNode: MtxNode = {
        ...base,
        type,
        data: {
          purpose: NodePurpose.FN,
          tag,
          value,
          action: action as NodeAction,
          inputs,
          outputs,
        },
      };
      return newNode;
    }
    case "mtx-constr": {
      if (
        !allowedVariableTypes ||
        !numOfInputVars ||
        !inputLabelTemplate ||
        !defaultInputs
      ) {
        console.log("Not enough to create CONSTR " + type);
        return null;
      }
      const newNode: ConstructorNode = {
        ...base,
        type,
        data: {
          purpose: NodePurpose.CONSTRUCT,
          tag,
          value,
          action: action as NodeAction,
          allowedVariableTypes,
          // defaultInputs: { ...defaultInputs },
          inputLabelTemplate,
          numOfInputVars,
          inputs,
          outputs,
        },
      };
      return newNode;
    }
    case "constant": {
      if (!constId) return null;

      const newNode: ConstantNode = {
        id: nodeId,
        position,
        type: "constant",
        data: {
          purpose: NodePurpose.DECOR,
          inputs,
          outputs: {
            [constId]: { possibleValues: ["matrix", "number", "vector"] },
          },
          tag: "constant",
          value,
          constId,
        },
      };
      return newNode;
    }
    case "mtx-deconstr": {
      if (!action) {
        console.log("No action for " + type);
        return null;
      }
      const newNode: DeConstructorNode = {
        id: nodeId,
        position,
        type: "mtx-deconstr",
        data: {
          action: action as DeconstructAction,
          tag,
          inputs,
          outputs,
          purpose: NodePurpose.DECONSTRUCT,
          value,
        },
      };
      return newNode;
    }
    case "markdown": {
      const newNode: MarkdownNode = {
        id: nodeId,
        position,
        type: "markdown",
        measured: {
          width: 100,
          height: 80,
        },
        data: {
          inputs,
          outputs,
          purpose: NodePurpose.DECOR,
          tag,
          value,
          styling: { background: "var(--sec)", width: "120px", height: "80px" },
          // width: 200,
          // height: 80,
        },
      };

      return newNode;
    }
    case "plot": {
      const newNode: PlotNode = {
        id: nodeId,
        position,
        type: "plot",
        data: {
          inputs,
          outputs,
          purpose: NodePurpose.PLOT,
          tag,
          value,
          equations: [],
          minSize: 600,
          // defaultInputs: {
          //   fn: { allowedTypes: ["number"], valueId: null },
          // },
        },
      };

      return newNode;
    }
    default: {
      return null;
    }
  }
};

const numFnTags: NumNodeTag[] = [
  "add",
  "subtract",
  "multiply",
  "divide",
  "abs",
  "sin",
  "cos",
  "tg",
  "ctg",
  "to-deg",
  "to-rad",
  "power",
  "floor",
  "ceil",
  "asin",
  "acos",
  "atg",
];

const mtxNodeTags: MtxVecNodeTag[] = [
  "I-matrix",
  "add-mtx",
  "scalar-mult",
  "dot-prod",
  "norm",
  "sum-all",
  "transpose",
  "multiply-mtx",
];
const constrNodeTags: NodeTag[] = ["vec", "mtx-rows", "mtx-cols"];
const deconstrNodeTags: NodeTag[] = ["entries-vec"];

type f = (tag: NodeTag) => NodeType | null;
const getNodeType: f = (tag) => {
  if (tag === "expression") return "expression";

  if (tag === "text-single") return "text-single";

  if (tag === "constant") return "constant";

  if (tag === "markdown") return "markdown";

  if (numFnTags.includes(tag as NumNodeTag)) return "math-fn";

  if (mtxNodeTags.includes(tag as MtxVecNodeTag)) return "mtx-fn";

  if (constrNodeTags.includes(tag)) return "mtx-constr";

  if (deconstrNodeTags.includes(tag)) return "mtx-deconstr";

  if (["plot"].includes(tag)) return "plot";

  return null;
};

const getNodeValue = (tag: NodeTag) => {
  switch (tag) {
    case "add":
      return "a+b";
    case "subtract":
      return "a-b";
    case "multiply":
      return "a\\cdot b";
    case "divide":
      return "a/b";
    case "abs":
      return "\\lVert a \\rVert";
    case "I-matrix":
      return "I_n";
    case "sin":
      return "\\sin(a)";
    case "cos":
      return "\\cos(a)";
    case "tg":
      return "\\tan(a)";
    case "ctg":
      return "\\cot(a)";
    case "to-deg":
      return "\\text{rad} \\to \\text{deg}\\degree";
    case "to-rad":
      return "\\text{deg}\\degree \\to \\text{rad}";
    case "add-mtx":
      return "A_{n \\times m} + B_{n \\times m}";
    case "scalar-mult":
      return "\\alpha\\vec{v}";
    case "power":
      return "a^b";
    case "floor":
      return "\\text{floor}(a)";
    case "ceil":
      return "\\text{ceil}(a)";
    case "dot-prod":
      return "\\vec{v}\\cdot\\vec{w}";
    case "norm":
      return "\\lVert \\vec{v} \\rVert";
    case "sum-all":
      return "\\sum{m_i}";
    case "asin":
      return "\\arcsin(a)";
    case "acos":
      return "\\arccos(a)";
    case "atg":
      return "\\arctan(a)";
    case "transpose":
      return "M^T";
    case "multiply-mtx":
      return "A B";
    default:
      return "";
  }
};

const constructNodes: NodeTag[] = ["vec", "mtx-rows", "mtx-cols"];

const getNmOfInputs = (tag: NodeTag) => {
  if (constructNodes.includes(tag)) return 3;
};

type g = (tag: NodeTag) => {
  defaultInputs: NodeInputs | undefined;
  inputLabelTemplate: ((...params: (number | string)[]) => string) | undefined;
  allowedVariableTypes: ValueType[] | undefined;
};

const getConstructorData: g = (tag) => {
  if (tag === "vec") {
    return {
      defaultInputs: {
        d: { allowedTypes: ["number"], valueId: null, defValue: 0 },
      },
      inputLabelTemplate: (n) => `v${n}`,
      allowedVariableTypes: ["number"],
    };
  }

  if (tag === "mtx-rows") {
    return {
      defaultInputs: {
        d: { allowedTypes: ["vector"], valueId: null },
      },
      allowedVariableTypes: ["vector"],
      inputLabelTemplate: (n) => `v${n}`,
    };
  }

  if (tag === "mtx-cols") {
    return {
      defaultInputs: {
        d: { allowedTypes: ["vector"], valueId: null },
      },
      allowedVariableTypes: ["vector"],
      inputLabelTemplate: (n) => `v${n}`,
    };
  }

  return {
    defaultInputs: undefined,
    inputLabelTemplate: undefined,
    allowedVariableTypes: undefined,
  };
};

export default createNode;
