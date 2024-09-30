// collection of nodes inputs depending on node tag

import { NodeInputs as Inputs, NodeTag } from "../../types/nodes";

type obj = {
  [k in keyof NodeTag as NodeTag]?: Inputs;
};

const nodeInputs: obj = {
  expression: {},
  "text-single": {},
  add: {
    a: { allowedTypes: ["number"], valueId: null },
    b: { allowedTypes: ["number"], valueId: null },
  },
  subtract: {
    a: { allowedTypes: ["number"], valueId: null },
    b: { allowedTypes: ["number"], valueId: null },
  },
  multiply: {
    a: { allowedTypes: ["number"], valueId: null },
    b: { allowedTypes: ["number"], valueId: null },
  },
  divide: {
    a: { allowedTypes: ["number"], valueId: null },
    b: { allowedTypes: ["number"], valueId: null },
  },
  abs: {
    a: { allowedTypes: ["number", "matrix", "vector"], valueId: null },
  },
  "I-matrix": {
    n: { allowedTypes: ["number"], valueId: null },
  },
  sin: {
    a: { allowedTypes: ["number", "matrix", "vector"], valueId: null },
  },
  cos: {
    a: { allowedTypes: ["number", "matrix", "vector"], valueId: null },
  },
  tg: {
    a: { allowedTypes: ["number", "matrix", "vector"], valueId: null },
  },
  ctg: {
    a: { allowedTypes: ["number", "matrix", "vector"], valueId: null },
  },
  vec: {
    d: { allowedTypes: ["number"], valueId: null },
    v1: { allowedTypes: ["number"], valueId: null },
    v2: { allowedTypes: ["number"], valueId: null },
    v3: { allowedTypes: ["number"], valueId: null },
  },
  "mtx-rows": {
    d: { allowedTypes: ["vector"], valueId: null },
    v1: { allowedTypes: ["vector"], valueId: null },
    v2: { allowedTypes: ["vector"], valueId: null },
    v3: { allowedTypes: ["vector"], valueId: null },
  },
  "to-deg": {
    a: { allowedTypes: ["number", "matrix", "vector"], valueId: null },
  },
  "to-rad": {
    a: { allowedTypes: ["number", "matrix", "vector"], valueId: null },
  },
  "add-mtx": {
    A: { allowedTypes: ["vector", "matrix"], valueId: null },
    B: { allowedTypes: ["vector", "matrix"], valueId: null },
  },
  "scalar-mult": {
    a: { allowedTypes: ["number"], valueId: null },
    V: { allowedTypes: ["vector", "matrix"], valueId: null },
  },
  constant: {},
  power: {
    a: { allowedTypes: ["number", "vector", "matrix"], valueId: null },
    b: { allowedTypes: ["number"], valueId: null },
  },
  floor: {
    a: { allowedTypes: ["number", "vector", "matrix"], valueId: null },
  },
  ceil: {
    a: { allowedTypes: ["number", "vector", "matrix"], valueId: null },
  },
  "dot-prod": {
    v: { allowedTypes: ["vector"], valueId: null },
    w: { allowedTypes: ["vector"], valueId: null },
  },
  norm: {
    v: { allowedTypes: ["vector"], valueId: null },
  },
  "sum-all": {
    M: { allowedTypes: ["vector", "matrix"], valueId: null },
  },
  "mtx-cols": {
    d: { allowedTypes: ["vector"], valueId: null },
    v1: { allowedTypes: ["vector"], valueId: null },
    v2: { allowedTypes: ["vector"], valueId: null },
    v3: { allowedTypes: ["vector"], valueId: null },
  },
  "entries-vec": {
    v: {
      allowedTypes: ["vector"],
      valueId: null,
    },
  },
};

export default nodeInputs;
