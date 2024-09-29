// collection of all node's actions

import { invoke } from "@tauri-apps/api/core";
import { NodeAction, NodeTag } from "../../types/nodes";
import { RustCalculations } from "../../types/app";
import arithmetic from "../number/arithmetic";
import numOperations from "../number/numOperations";
import makeIdentityMatrix from "../matrix/makeIdentityMatrix";
import trigonometry from "../number/trigonometry";
import makeVector from "../matrix/makeVector";
import makeMtxFromRows from "../matrix/makeMtxFromRows";

type obj = {
  [k in keyof NodeTag as NodeTag]?: NodeAction;
};

const nodeActions: obj = {
  expression: async ({}, value) => {
    const res = (await invoke("evaluate_expression", {
      expr: value,
    })) as RustCalculations;
    if (!res.success) return null;
    return parseFloat(res.res);
  },
  add: ({ a, b }) => arithmetic.addTwoNumbers(a, b),
  subtract: ({ a, b }) => arithmetic.subtractTwoNumbers(a, b),
  multiply: ({ a, b }) => arithmetic.multiplyTwoNumbers(a, b),
  divide: ({ a, b }) => arithmetic.divideTwoNumbers(a, b),
  abs: ({ a }) => numOperations.abs(a),
  "I-matrix": ({ n }) => makeIdentityMatrix(n),
  sin: ({ a }, value, angleFormat) => trigonometry.sin(a, angleFormat!),
  cos: ({ a }, value, angleFormat) => trigonometry.cos(a, angleFormat!),
  tg: ({ a }, value, angleFormat) => trigonometry.tg(a, angleFormat!),
  ctg: ({ a }, value, angleFormat) => trigonometry.ctg(a, angleFormat!),
  vec: (params) => makeVector(params),
  "mtx-rows": (params) => makeMtxFromRows(params),
};

export default nodeActions;
