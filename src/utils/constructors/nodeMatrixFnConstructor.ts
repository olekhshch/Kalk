import {
  Input,
  MtxVecFnAction,
  MtxVecFnNode,
  MtxVecNodeType,
  ValueType,
  Vector,
} from "../../types/nodes";
import addVectors from "../matrix/addVectors";
import dotProduct from "../matrix/dotProduct";
import scalarMultiplication from "../matrix/scalarMultiplication";
import sumOfSquares from "../matrix/sumOfSquares";
import validate from "../validate";

// matrix/vector function nodes

type f = (
  nodeType: MtxVecNodeType,
  position: { x: number; y: number },
  nodeId: string
) => MtxVecFnNode | null;

const nodeMatrixFnConstructor: f = (nodeType, position, nodeId) => {
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
    id: nodeId,
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
    case "cross-prod":
      return "\\vec{v} \\times \\vec{w}";
    case "dot-prod":
      return "\\vec{v} \\cdot \\vec{w}";
    default: {
      return null;
    }
  }
};

type k = (
  nt: MtxVecNodeType
) => { v?: Input; A?: Input; B?: Input; a?: Input; w?: Input } | null;

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
    case "cross-prod": {
      return {
        v: {
          sourceId: null,
          allowedTypes: ["vector"],
          type: "vector",
        },
      };
    }
    case "dot-prod": {
      return {
        v: {
          sourceId: null,
          allowedTypes: ["vector"],
          type: "vector",
        },
        w: {
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

const getOutputs: o = (nodeType) => {
  switch (nodeType) {
    case "norm":
      return { N: "number" };
    case "add-mtx":
      return { M: "vector" };
    case "scalar-mult":
      return { M: "vector" };
    case "dot-prod": {
      return { N: "number" };
    }
    case "cross-prod":
      return { N: "number" };
    default:
      return null;
  }
};

type a = (nt: MtxVecNodeType) => MtxVecFnAction | null;

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
    case "dot-prod": {
      return ({ v, w }) => {
        const valValue1 = validate(v, "vector");
        const valValue2 = validate(w, "vector");

        if (!valValue1.valid || !valValue2.valid) return null;

        return dotProduct(v as Vector, w as Vector);
      };
    }
    default:
      return null;
  }
};

export default nodeMatrixFnConstructor;
