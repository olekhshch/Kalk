// collection of all node's actions

import { invoke } from "@tauri-apps/api/core";
import {
  ActionResult,
  DeconstructAction,
  NodeAction,
  NodeTag,
} from "../../types/nodes";
import { RustCalculations } from "../../types/app";
import numOperations from "../number/numOperations";
import makeIdentityMatrix from "../matrix/makeIdentityMatrix";
import trigonometry from "../number/trigonometry";
import makeVector from "../matrix/makeVector";
import makeMtxFromRows from "../matrix/makeMtxFromRows";
import convertToDEG from "../convertToDEG";
import convertToRAD from "../convertToRAD";
import mtxOperations from "../matrix/mtxOperations";
import Matrices from "../matrix/main/Matrices";
import scalarMultiplication from "../matrix/scalarMultiplication";
import dotProduct from "../matrix/dotProduct";
import vectorNorm from "../matrix/vectorNorm";
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
  sin: async ({ a }, value, angleFormat) =>
    await invoke("sin", { a, format: angleFormat }),
  cos: async ({ a }, value, angleFormat) =>
    await invoke("cos", { a, format: angleFormat }),
  tg: async ({ a }, value, angleFormat) =>
    await invoke("tg", { a, format: angleFormat }),
  ctg: async ({ a }, value, angleFormat) =>
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
  "dot-prod": ({ v, w }) => dotProduct(v, w),
  norm: ({ v }) => vectorNorm(v),
  "sum-all": async ({ M }) => await invoke("sum_all", { a: M }),
  "mtx-cols": (params) => Matrices.fromColumns(params),
  "entries-vec": (params) => Vectors.deconstructVec(params),
  asin: ({ a }, value, angleFormat) => trigonometry.asin(a, angleFormat!),
  acos: ({ a }, value, angleFormat) => trigonometry.acos(a, angleFormat!),
  atg: ({ a }, value, angleFormat) => trigonometry.atg(a, angleFormat!),
};

export default nodeActions;
