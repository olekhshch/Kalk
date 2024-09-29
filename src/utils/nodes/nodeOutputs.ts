// collection of node outputs based on node's tag

import { NodeOutputs as Outputs, NodeTag } from "../../types/nodes";

type obj = {
  [k in keyof NodeTag as NodeTag]?: Outputs;
};

const nodeOutputs: obj = {
  expression: {
    N: { possibleValues: ["number"] },
  },
  "text-single": {},
  add: {
    N: { possibleValues: ["number"] },
  },
  subtract: {
    N: { possibleValues: ["number"] },
  },
  multiply: {
    N: { possibleValues: ["number"] },
  },
  divide: {
    N: { possibleValues: ["number"] },
  },
  abs: {
    N: { possibleValues: ["number", "vector", "matrix"] },
  },
  "I-matrix": {
    M: { possibleValues: ["matrix"] },
  },
  sin: {
    N: { possibleValues: ["number", "vector", "matrix"] },
  },
  cos: {
    N: { possibleValues: ["number", "vector", "matrix"] },
  },
  tg: {
    N: { possibleValues: ["number", "vector", "matrix"] },
  },
  ctg: {
    N: { possibleValues: ["number", "vector", "matrix"] },
  },
  vec: {
    V: { possibleValues: ["vector"] },
  },
  "mtx-rows": {
    M: { possibleValues: ["matrix"] },
  },
};

export default nodeOutputs;
