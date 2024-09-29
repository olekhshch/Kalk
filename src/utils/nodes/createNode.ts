import {
  AppNode,
  AppNodeBase,
  ConstructorNode,
  ExpressionNode,
  MathNode,
  MtxNode,
  MtxVecNodeTag,
  NodeAction,
  NodeInputs,
  NodePurpose,
  NodeTag,
  NodeType,
  NumNodeTag,
  TextSingleNode,
  ValueType,
} from "../../types/nodes";
import nodeActions from "./nodeActions";
import nodeOutputs from "./nodeOutputs";
import nodeInputs from "./nodesInputs";

type Factory = (
  tag: NodeTag,
  id: string,
  position: { x: number; y: number }
) => AppNode | null;

const createNode: Factory = (tag, nodeId, position) => {
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
          action,
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
          action,
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
          action,
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
          action,
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
    default: {
      return null;
    }
  }

  // const newNode: AppNode = {
  //   id: nodeId,
  //   position,
  //   type,
  //   data: {
  //     inputs,
  //     outputs,
  //     value,
  //     tag,
  //     action,
  //     purpose,
  //     numOfInputVars,
  //     defaultInputs,
  //     inputLabelTemplate,
  //     allowedVariableTypes,
  //   },
  // };
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
];

const mtxNodeTags: MtxVecNodeTag[] = ["I-matrix"];
const constrNodeTags: NodeTag[] = ["vec", "mtx-rows"];

type f = (tag: NodeTag) => NodeType | null;
const getNodeType: f = (tag) => {
  if (tag === "expression") return "expression";

  if (tag === "text-single") return "text-single";

  if (numFnTags.includes(tag as NumNodeTag)) return "math-fn";

  if (mtxNodeTags.includes(tag as MtxVecNodeTag)) return "mtx-fn";

  if (constrNodeTags.includes(tag)) return "mtx-constr";

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
    default:
      return "";
  }
};

const constructNodes: NodeTag[] = ["vec", "mtx-rows"];

// const getPurpose = (tag: NodeTag) => {
//   if (constructNodes.includes(tag)) return NodePurpose.CONSTRUCT;

//   if (numFnTags.includes(tag as NumNodeTag)) return NodePurpose.FN;

//   return NodePurpose.DECOR;
// };

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

  return {
    defaultInputs: undefined,
    inputLabelTemplate: undefined,
    allowedVariableTypes: undefined,
  };
};

export default createNode;
