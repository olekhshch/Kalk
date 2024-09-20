import {
  Input,
  MtxVecFnAction,
  MtxVecFnNode,
  NodeType,
  ValueType,
  Vector,
} from "../../types/nodes";
import addVectors from "../matrix/addVectors";
import sumOfSquares from "../matrix/sumOfSquares";
import validate from "../validate";

// matrix/vector function nodes

type f = (
  nodeType: NodeType,
  position: { x: number; y: number },
  idCounter: number
) => MtxVecFnNode | null;

const nodeMatrixFnConstructor: f = (nodeType, position, idCounter) => {
  const id = idCounter + 1;

  const label = getNodeLabel(nodeType);
  const inputs = getInputsFor(nodeType);
  const outputs = getOutputs(nodeType);
  const action = getActionFor(nodeType);

  if (!label || !inputs || !outputs || !action) {
    console.log("No data to construct " + nodeType);
    console.log({ label, inputs, outputs, action });
    return null;
  }

  const newNode: MtxVecFnNode = {
    id: id.toString(),
    position,
    type: "mtx-fn",
    data: {
      label,
      showResult: false,
      tag: nodeType,
      inputs,
      outputs,
      action,
    },
  };

  return newNode;
};

type g = (nodeType: NodeType) => string | null;

const getNodeLabel: g = (nodeType) => {
  switch (nodeType) {
    case "norm":
      return "||\\vec{v}||";
    case "add-mtx":
      return "A_{n\\times m}+B_{n\\times m}";
    default: {
      return null;
    }
  }
};

type k = (nt: NodeType) => { v?: Input; A?: Input; B?: Input } | null;

const getInputsFor: k = (nodeType) => {
  switch (nodeType) {
    case "norm": {
      return {
        v: {
          sourceId: null,
          allowedTypes: ["vector"],
          type: "vector",
        },
      };
    }
    case "add-mtx": {
      // #TODO: add matrix addition
      return {
        A: {
          sourceId: null,
          allowedTypes: ["vector"],
          type: "vector",
        },
        B: {
          sourceId: null,
          allowedTypes: ["vector"],
          type: "vector",
        },
      };
    }
    default: {
      return null;
    }
  }
};

type o = (
  nt: NodeType
) => { N?: ValueType; V?: ValueType; M?: ValueType } | null;

const getOutputs: o = (nodeType: NodeType) => {
  switch (nodeType) {
    case "norm":
      return { N: "number" };
    case "add-mtx":
      return { M: "vector" };
    default:
      return null;
  }
};

type a = (nt: NodeType) => MtxVecFnAction | null;

const getActionFor: a = (nodeType) => {
  switch (nodeType) {
    case "norm": {
      return ({ v }) => {
        // checking if Vector
        const { valid, value } = validate(v, "vector");
        if (!valid) return null;

        return Math.sqrt(sumOfSquares(value as Vector));
      };
    }
    case "add-mtx": {
      return ({ A, B }) => {
        // checking if Vectors
        const valValue1 = validate(A, "vector");
        const valValue2 = validate(B, "vector");

        if (!valValue1.valid || !valValue2.valid) return null;

        return addVectors(A as Vector, B as Vector);
      };
    }
    default:
      return null;
  }
};

export default nodeMatrixFnConstructor;
