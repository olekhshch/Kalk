// collection of all node's actions

import { invoke } from "@tauri-apps/api/core";
import {
  ActionResult,
  DeconstructAction,
  NodeAction,
  NodeTag,
} from "../../types/nodes";
import { RustCalculations } from "../../types/app";
import makeVector from "../matrix/makeVector";
import makeMtxFromRows from "../matrix/makeMtxFromRows";
// import Matrices from "../matrix/main/Matrices";
import Vectors from "../matrix/main/Vectors";

type obj = {
  [k in keyof NodeTag as NodeTag]?: NodeAction | DeconstructAction;
};

const nodeActions: obj = {
  expression: async ({}, value) => {
    const res = (await invoke("evaluate_expression", {
      expr: value,
    })) as RustCalculations;
    console.log({ res });
    return res;
  },
  add: async ({ a, b }) => (await invoke("add", { a, b })) as RustCalculations,
  subtract: async ({ a, b }) =>
    (await invoke("subtract", { a, b })) as ActionResult,
  multiply: async ({ a, b }) =>
    (await invoke("multiply", { a, b })) as ActionResult,
  divide: async ({ a, b }) =>
    (await invoke("divide", { a, b })) as ActionResult,
  abs: async ({ a }) => await invoke("abs", { a }),
  "I-matrix": async ({ n }) => await invoke("make_identity_mtx", { n }),
  sin: async ({ a }, _, angleFormat) =>
    await invoke("sin", { a, format: angleFormat }),
  cos: async ({ a }, _, angleFormat) =>
    await invoke("cos", { a, format: angleFormat }),
  tg: async ({ a }, _, angleFormat) =>
    await invoke("tg", { a, format: angleFormat }),
  ctg: async ({ a }, _, angleFormat) =>
    await invoke("ctg", { a, format: angleFormat }),
  vec: (params) => makeVector(params),
  "mtx-rows": (params) => makeMtxFromRows(params),
  "to-deg": async ({ a }) => await invoke("to_deg", { a }),
  "to-rad": async ({ a }) => await invoke("to_rad", { a }),
  "add-mtx": async ({ A, B }) =>
    await invoke("add_vecs_matrices", { a: A, b: B }),
  "scalar-mult": async ({ a, v }) =>
    await invoke("scalar_multiplication", { a, v }),
  power: async ({ a, b }) => await invoke("power", { a, b }),
  floor: async ({ a }) => await invoke("floor", { a }),
  ceil: async ({ a }) => await invoke("ceil", { a }),
  "dot-prod": async ({ v, w }) => await invoke("dot_prod", { v, w }),
  norm: async ({ v }) => await invoke("vec_norm", { v }),
  "sum-all": async ({ M }) => await invoke("sum_all", { a: M }),
  // "mtx-cols": (params) => Matrices.fromColumns(params),
  "entries-vec": (params) => Vectors.deconstructVec(params),
  asin: async ({ a }, _, angleFormat) =>
    await invoke("asin", { a, format: angleFormat }),
  acos: async ({ a }, _, angleFormat) =>
    await invoke("acos", { a, format: angleFormat }),
  atg: async ({ a }, _, angleFormat) =>
    await invoke("atg", { a, format: angleFormat }),
  transpose: async ({ M }) => await invoke("transpose", { m: M }),
  "multiply-mtx": async ({ A, B }) =>
    await invoke("multiply_matrices", { a: A, b: B }),
};

export default nodeActions;
