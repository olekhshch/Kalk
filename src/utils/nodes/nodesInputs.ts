// collection of nodes inputs depending on node tag

import { NodeInput, NodeTag } from "../../types/nodes";

type obj = {
  [k in keyof NodeTag as NodeTag]?: NodeInput[];
};

const nodeInputs: obj = {
  expression: [],
  "text-single": [],
  add: [
    { label: "a", allowedTypes: ["number"], valueId: null },
    { label: "b", allowedTypes: ["number"], valueId: null },
  ],
  subtract: [
    { label: "a", allowedTypes: ["number"], valueId: null },
    { label: "b", allowedTypes: ["number"], valueId: null },
  ],
  multiply: [
    { label: "a", allowedTypes: ["number"], valueId: null },
    { label: "b", allowedTypes: ["number"], valueId: null },
  ],
  divide: [
    { label: "a", allowedTypes: ["number"], valueId: null },
    { label: "b", allowedTypes: ["number"], valueId: null },
  ],
  abs: [
    { label: "a", allowedTypes: ["number", "vector", "matrix"], valueId: null },
  ],
  "I-matrix": [{ label: "n", allowedTypes: ["number"], valueId: null }],
  sin: [
    { label: "a", allowedTypes: ["number", "vector", "matrix"], valueId: null },
  ],
  cos: [
    { label: "a", allowedTypes: ["number", "vector", "matrix"], valueId: null },
  ],
  tg: [
    { label: "a", allowedTypes: ["number", "vector", "matrix"], valueId: null },
  ],
  ctg: [
    { label: "a", allowedTypes: ["number", "vector", "matrix"], valueId: null },
  ],
  vec: [
    {
      label: "d",
      allowedTypes: ["number"],
      valueId: null,
      descr: "default value",
    },
    { label: "v1", allowedTypes: ["number"], valueId: null },
    { label: "v2", allowedTypes: ["number"], valueId: null },
    { label: "v3", allowedTypes: ["number"], valueId: null },
  ],

  "mtx-rows": [
    {
      label: "d",
      allowedTypes: ["vector"],
      valueId: null,
      descr: "default value",
    },
    { label: "v1", allowedTypes: ["vector"], valueId: null },
    { label: "v2", allowedTypes: ["vector"], valueId: null },
    { label: "v3", allowedTypes: ["vector"], valueId: null },
  ],

  "to-deg": [
    { label: "a", allowedTypes: ["number", "vector", "matrix"], valueId: null },
  ],
  "to-rad": [
    { label: "a", allowedTypes: ["number", "vector", "matrix"], valueId: null },
  ],
  "add-mtx": [
    { label: "A", allowedTypes: ["vector", "matrix"], valueId: null },
    { label: "B", allowedTypes: ["vector", "matrix"], valueId: null },
  ],
  "scalar-mult": [
    { label: "a", allowedTypes: ["number"], valueId: null },
    { label: "v", allowedTypes: ["vector", "matrix"], valueId: null },
  ],

  constant: [],
  power: [
    { label: "a", allowedTypes: ["number", "vector", "matrix"], valueId: null },
    { label: "b", allowedTypes: ["number"], valueId: null },
  ],

  floor: [
    { label: "a", allowedTypes: ["number", "vector", "matrix"], valueId: null },
  ],
  ceil: [
    { label: "a", allowedTypes: ["number", "vector", "matrix"], valueId: null },
  ],
  "dot-prod": [
    { label: "v", allowedTypes: ["vector"], valueId: null },
    { label: "w", allowedTypes: ["vector"], valueId: null },
  ],

  norm: [{ label: "v", allowedTypes: ["vector"], valueId: null }],
  "sum-all": [
    { label: "M", allowedTypes: ["vector", "matrix"], valueId: null },
  ],

  "mtx-cols": [
    { label: "d", allowedTypes: ["vector"], valueId: null },
    { label: "v1", allowedTypes: ["vector"], valueId: null },
    { label: "v2", allowedTypes: ["vector"], valueId: null },
    { label: "v3", allowedTypes: ["vector"], valueId: null },
  ],

  "entries-vec": [
    {
      label: "v",
      allowedTypes: ["vector"],
      valueId: null,
    },
  ],

  asin: [
    { label: "a", allowedTypes: ["number", "vector", "matrix"], valueId: null },
  ],
  acos: [
    { label: "a", allowedTypes: ["number", "vector", "matrix"], valueId: null },
  ],
  atg: [
    { label: "a", allowedTypes: ["number", "vector", "matrix"], valueId: null },
  ],
  markdown: [],
  plot: [],
  transpose: [{ label: "M", allowedTypes: ["matrix"], valueId: null }],
  "multiply-mtx": [
    { label: "A", allowedTypes: ["matrix"], valueId: null },
    { label: "B", allowedTypes: ["matrix"], valueId: null },
  ],
};

export default nodeInputs;
