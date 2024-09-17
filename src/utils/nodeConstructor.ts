import nodeTypes from "../state/nodeTypes";
import {
  Input,
  NodeType,
  NumberFunctionNode,
  NumberFunctionParams,
} from "../types/nodes";
import convertToDEG from "./convertToDEG";
import convertToRAD from "./convertToRAD";

const trigonometryFns: NodeType[] = ["sin", "cos", "tg", "ctg"];

type f = (
  nodeType: NodeType,
  position: { x: number; y: number },
  idCounter: number
) => NumberFunctionNode | null;

const nodeFunctionContructor: f = (nodeType, position, idCounter) => {
  const id = idCounter + 1;

  const label = getNodeLabel(nodeType);
  const inputs = getFunctionInputs(nodeType);
  const action = getNodeFunction(nodeType);
  const trigonometry = trigonometryFns.includes(nodeType);

  if (!label) return null;

  console.log({ inputs });

  const newNode: NumberFunctionNode = {
    id: id.toString(),
    position,
    type: "num-fun",
    data: {
      showResult: false,
      label,
      inputs,
      outputs: {
        N: "number",
      },
      action,
      trigonometry,
    },
  };

  console.log({ newNode });

  return newNode;
};

function getNodeLabel(nodeType: NodeType) {
  switch (nodeType) {
    case "abs":
      return "|a|";
    case "add":
      return "a+b";
    case "cos":
      return "cos(a)";
    case "divide":
      return "a/b";
    case "multiply":
      return "a*b";
    case "sin":
      return "sin(a)";
    case "substract":
      return "a-b";
    case "to-deg":
      return "RAD \\implies DEG";
    case "to-rad":
      return "DEG \\implies RAD";
    case "tg":
      return "tan(a)";
    case "ctg":
      return "ctan(a)";
    case "power":
      return "a^b";
    default: {
      console.log("No label for " + nodeType);
      return null;
    }
  }
}

const initialInput: Input = {
  sourceId: null,
  type: "number",
};

type fun = (nt: NodeType) => { a?: Input; b?: Input };

const getFunctionInputs: fun = (nodeType: NodeType) => {
  switch (nodeType) {
    case "abs":
    case "to-deg":
    case "to-rad":
    case "cos":
    case "sin":
    case "tg":
    case "ctg": {
      return { a: { ...initialInput } };
    }
    case "add":
    case "multiply":
    case "substract":
    case "power":
    case "divide": {
      return { a: { ...initialInput }, b: { ...initialInput } };
    }
    default: {
      return {};
    }
  }
};

type NodeActionFactory = (
  nodeType: NodeType
) => (params: NumberFunctionParams) => number;

const getNodeFunction: NodeActionFactory = (nodeType) => {
  switch (nodeType) {
    case "abs": {
      return ({ a }) => Math.abs(a);
    }
    case "add": {
      return ({ a, b }) => a + b;
    }
    case "divide": {
      return ({ a, b }) => a / b;
    }
    case "multiply": {
      return ({ a, b }) => a * b;
    }
    case "substract": {
      return ({ a, b }) => a - b;
    }
    case "sin": {
      return ({ a }) => Math.sin(a);
    }
    case "cos": {
      return ({ a }) => Math.cos(a);
    }
    case "tg": {
      return ({ a }) => Math.tan(a);
    }
    case "ctg": {
      return ({ a }) => 1 / Math.tan(a);
    }
    case "to-deg": {
      return ({ a }) => convertToDEG(a);
    }
    case "to-rad": {
      return ({ a }) => convertToRAD(a);
    }
    case "power": {
      return ({ a, b }) => Math.pow(a, b);
    }
    default: {
      console.log("No action for " + nodeType + " specified");
      return ({}) => 1000000000000000;
    }
  }
};

export default nodeFunctionContructor;
