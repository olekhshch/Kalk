// collection of all node's actions

import { invoke } from "@tauri-apps/api/core";
import {
  ActionResult,
  DeconstructAction,
  NodeAction,
  NodeTag,
  OutputValue,
} from "../../types/nodes";
import { RustCalculations } from "../../types/app";
import arithmetic from "../number/arithmetic";
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
  abs: ({ a }) => numOperations.abs(a),
  "I-matrix": ({ n }) => makeIdentityMatrix(n),
  sin: ({ a }, value, angleFormat) => trigonometry.sin(a, angleFormat!),
  cos: ({ a }, value, angleFormat) => trigonometry.cos(a, angleFormat!),
  tg: ({ a }, value, angleFormat) => trigonometry.tg(a, angleFormat!),
  ctg: ({ a }, value, angleFormat) => trigonometry.ctg(a, angleFormat!),
  vec: (params) => makeVector(params),
  "mtx-rows": (params) => makeMtxFromRows(params),
  "to-deg": ({ a }) => convertToDEG(a),
  "to-rad": ({ a }) => convertToRAD(a),
  "add-mtx": ({ A, B }) => Matrices.addVecOrMtx(A, B),
  "scalar-mult": ({ a, V }) => scalarMultiplication(a, V),
  power: ({ a, b }) => numOperations.power(a, b),
  floor: ({ a }) => numOperations.floor(a),
  ceil: ({ a }) => numOperations.ceil(a),
  "dot-prod": ({ v, w }) => dotProduct(v, w),
  norm: ({ v }) => vectorNorm(v),
  "sum-all": ({ M }) => Matrices.sumAllEntries(M),
  "mtx-cols": (params) => Matrices.fromColumns(params),
  "entries-vec": (params) => Vectors.deconstructVec(params),
  asin: ({ a }, value, angleFormat) => trigonometry.asin(a, angleFormat!),
  acos: ({ a }, value, angleFormat) => trigonometry.acos(a, angleFormat!),
  atg: ({ a }, value, angleFormat) => trigonometry.atg(a, angleFormat!),
};

export default nodeActions;
