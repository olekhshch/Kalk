import {
  Input,
  MtxVecFnAction,
  MtxVecFnNode,
  MtxVecNodeType,
  NodeType,
  ValueType,
  Vector,
} from "../../types/nodes";
import addVectors from "../matrix/addVectors";
import scalarMultiplication from "../matrix/scalarMultiplication";
import sumOfSquares from "../matrix/sumOfSquares";
import validate from "../validate";

// matrix/vector function nodes

type f = (
  nodeType: MtxVecNodeType,
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

type g = (nodeType: MtxVecNodeType) => string | null;

const getNodeLabel: g = (nodeType) => {
  switch (nodeType) {
    case "norm":
      return "||\\vec{v}||";
    case "add-mtx":
      return "A_{n\\times m}+B_{n\\times m}";
    case "scalar-mult":
      return "a \\vec{v}";
    default: {
      return null;
    }
  }
};

type k = (
  nt: MtxVecNodeType
) => { v?: Input; A?: Input; B?: Input; a?: Input } | null;

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
    case "scalar-mult": {
      return {
        a: {
          sourceId: null,
          allowedTypes: ["number"],
          type: "number",
        },
        v: {
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
  nt: MtxVecNodeType
) => { N?: ValueType; V?: ValueType; M?: ValueType } | null;

const getOutputs: o = (nodeType: NodeType) => {
  switch (nodeType) {
    case "norm":
      return { N: "number" };
    case "add-mtx":
      return { M: "vector" };
    case "scalar-mult":
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
    case "scalar-mult": {
      return ({ a, v }) => {
        const valValue1 = validate(a, "number");
        const valValue2 = validate(v, "vector");

        if (!valValue1.valid || !valValue2.valid) return null;

        return scalarMultiplication(a as number, v as Vector);
      };
    }
    default:
      return null;
  }
};

export default nodeMatrixFnConstructor;
