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
  "to-rad": {
    N: { possibleValues: ["number", "vector", "matrix"] },
  },
  "to-deg": {
    N: { possibleValues: ["number", "vector", "matrix"] },
  },
  "add-mtx": {
    M: { possibleValues: ["vector", "matrix"] },
  },
  "scalar-mult": {
    M: { possibleValues: ["vector", "matrix"] },
  },
  constant: {
    CONST: { possibleValues: ["number", "vector", "matrix"] },
  },
  power: {
    N: { possibleValues: ["number", "vector", "matrix"] },
  },
  floor: {
    N: { possibleValues: ["number", "vector", "matrix"] },
  },
  ceil: {
    N: { possibleValues: ["number", "vector", "matrix"] },
  },
  "dot-prod": {
    N: { possibleValues: ["number"] },
  },
  norm: {
    N: { possibleValues: ["number"] },
  },
  "sum-all": {
    N: { possibleValues: ["number"] },
  },
  "mtx-cols": {
    M: { possibleValues: ["matrix"] },
  },
  "entries-vec": {},
  asin: {
    N: { possibleValues: ["number", "vector", "matrix"] },
  },
  acos: {
    N: { possibleValues: ["number", "vector", "matrix"] },
  },
  atg: {
    N: { possibleValues: ["number", "vector", "matrix"] },
  },
  markdown: {},
  plot: {},
  transpose: { M: { possibleValues: ["matrix"] } },
};

export default nodeOutputs;
