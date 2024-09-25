import { AngleFormat } from "../../types/app";
import {
  Input,
  NodeOutputs,
  NodeType,
  NumberFunctionNode,
  NumberFunctionParams,
  NumNodeType,
  OutputValue,
} from "../../types/nodes";
import convertToDEG from "../convertToDEG";
import convertToRAD from "../convertToRAD";
import arithmetic from "../number/arithmetic";
import numOperations from "../number/numOperations";
import trigonometry from "../number/trigonometry";

// const trigonometryFns: NodeType[] = ["sin", "cos", "tg", "ctg"];
// const aTrigonometryFns: NodeType[] = ["asin", "acos"];

type f = (
  nodeType: NumNodeType,
  position: { x: number; y: number },
  nodeId: string
) => NumberFunctionNode | null;

// constructor for numerical function nodes (...numbers) => number

const nodeFunctionContructor: f = (nodeType, position, nodeId) => {
  // #TODO: async
  const label = getNodeLabel(nodeType);
  const inputs = getFunctionInputs(nodeType);
  const action = getNodeFunction(nodeType);
  // const allowedTypes = getAllowedOutputTypes(nodeType);
  const outputs = getOutputsFor(nodeType);

  if (!label) return null;

  const newNode: NumberFunctionNode = {
    id: nodeId,
    position,
    type: "num-fun",
    data: {
      tag: nodeType,
      showResult: false,
      label,
      inputs,
      outputs,
      action,
    },
  };

  return newNode;
};

function getNodeLabel(nodeType: NumNodeType) {
  switch (nodeType) {
    case "abs":
      return "|a|";
    case "add":
      return "a+b";
    case "cos":
      return "\\cos(a)";
    case "divide":
      return "a/b";
    case "multiply":
      return "a \\cdot b";
    case "sin":
      return "\\sin(a)";
    case "subtract":
      return "a-b";
    case "to-deg":
      return "RAD \\implies DEG";
    case "to-rad":
      return "DEG \\implies RAD";
    case "tg":
      return "\\tan(a)";
    case "ctg":
      return "\\cot(a)";
    case "power":
      return "a^b";
    case "asin":
      return "\\arcsin(a)";
    case "acos":
      return "\\arccos(a)";
    case "floor":
      return "\\text{floor}(a)";

    case "ceil":
      return "\\text{ceil}(a)";
    default: {
      console.log("No label for " + nodeType);
      return null;
    }
  }
}

const initialInput: Input = {
  sourceId: null,
  type: "number",
  allowedTypes: ["number"],
};

type OutputsFabric = (nt: NumNodeType) => NodeOutputs;

const getOutputsFor: OutputsFabric = (nodeType: NumNodeType) => {
  switch (nodeType) {
    case "abs":
    case "acos":
    case "asin":
    case "atg":
    case "ceil":
    case "cos":
    case "ctg":
    case "floor":
    case "power":
    case "sin":
    case "tg":
    case "to-deg":
    case "to-rad": {
      return {
        N: { possibleValues: ["number", "matrix", "vector"] },
      };
    }
    default: {
      // #TODO: Rename to possibleTypes for all outputs?
      return { N: { possibleValues: ["number"] } };
    }
  }
};

type fun = (nt: NumNodeType) => { a?: Input; b?: Input };

const getFunctionInputs: fun = (nodeType: NodeType) => {
  switch (nodeType) {
    case "cos":
    case "sin":
    case "tg":
    case "ctg":
    case "to-deg":
    case "to-rad":
    case "asin":
    case "acos":
    case "floor":
    case "ceil":
    case "abs": {
      return {
        a: {
          sourceId: null,
          allowedTypes: ["number", "vector", "matrix"],
          type: "number",
        },
      };
    }
    case "power": {
      return {
        a: {
          sourceId: null,
          allowedTypes: ["number", "vector", "matrix"],
          type: "number",
        },
        b: { ...initialInput },
      };
    }
    case "add":
    case "multiply":
    case "subtract":
    case "divide": {
      return { a: { ...initialInput }, b: { ...initialInput } };
    }
    default: {
      return {};
    }
  }
};

type NodeActionFactory = (
  nodeType: NumNodeType
) => (
  params: NumberFunctionParams,
  angleFormat?: AngleFormat
) => Promise<OutputValue> | OutputValue;

const getNodeFunction: NodeActionFactory = (nodeType) => {
  switch (nodeType) {
    case "abs": {
      return ({ a }) => numOperations.abs(a);
    }
    case "add": {
      return ({ a, b }) => arithmetic.addTwoNumbers(a, b);
    }
    case "divide": {
      return ({ a, b }) => arithmetic.divideTwoNumbers(a, b);
    }
    case "multiply": {
      return ({ a, b }) => arithmetic.multiplyTwoNumbers(a, b);
    }
    case "subtract": {
      return ({ a, b }) => arithmetic.subtractTwoNumbers(a, b);
    }
    case "sin": {
      return ({ a }, angleFormat) => trigonometry.sin(a, angleFormat!);
    }
    case "cos": {
      return ({ a }, angleFormat) => trigonometry.cos(a, angleFormat!);
    }
    case "tg": {
      return ({ a }, angleFormat) => trigonometry.tg(a, angleFormat!);
    }
    case "ctg": {
      return ({ a }, angleFormat) => trigonometry.ctg(a, angleFormat!);
    }
    case "to-deg": {
      return ({ a }) => convertToDEG(a);
    }
    case "to-rad": {
      return ({ a }) => convertToRAD(a);
    }
    case "power": {
      return ({ a, b }) => numOperations.power(a, b);
    }
    case "asin": {
      return ({ a }, angleFormat) => trigonometry.asin(a, angleFormat!);
    }
    case "acos": {
      return ({ a }, angleFormat) => trigonometry.acos(a, angleFormat!);
    }
    case "floor": {
      return ({ a }) => numOperations.floor(a);
    }
    case "ceil": {
      return ({ a }) => numOperations.ceil(a);
    }
    default: {
      console.log("No action for " + nodeType + " specified");
      return ({}) => 1000000000000000;
    }
  }
};

export default nodeFunctionContructor;
