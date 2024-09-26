// actions for MtxFnNodes

import { InputValue, Matrix, OutputValue, Vector } from "../../../types/nodes";
import getValueType from "../../getValueType";
import MatrixProp from "../MatrixProp";
import mtxOperations from "../mtxOperations";
import vectorsOperarions from "../vectorsOperarions";

type f = (v: InputValue, w: InputValue) => OutputValue | Promise<OutputValue>;

const addVecOrMtx: f = async (v, w) => {
  const typeV = getValueType(v);
  const typeW = getValueType(w);
  console.log({ typeV, typeW });

  if (!typeV || !typeW) return null;

  if (
    !["matrix", "vector"].includes(typeV) ||
    !["matrix", "vector"].includes(typeW)
  )
    return null;

  if (typeV !== typeW) return null;

  if (typeV === "vector") {
    const res = await vectorsOperarions.addTwoVectors(v as Vector, w as Vector);
    return res;
  }

  if (typeV === "matrix") {
    console.log("typeV - matrix");
    const mtx = await mtxOperations.addTwoMatrices(v as Matrix, w as Matrix);
    return mtx;
  }
  return null;
};

type f2 = (M: InputValue) => number | null | Promise<number | null>;

const sumAllEntries: f2 = async (M) => {
  const valueType = getValueType(M);

  if (!valueType || !["matrix", "vector"].includes(valueType)) return null;

  if (valueType === "vector") {
    return sumAllVec(M as Vector);
  }

  if (valueType === "matrix") {
    const res = await Promise.all((M as Matrix).map(async (n) => sumAllVec(n)));
    return sumAllVec(res);
  }

  return null;
};

const sumAllVec = (vec: Vector) => vec.reduce((acc, num) => acc + num, 0);

// ============= det(M) ===============================

const det: f2 = (M: InputValue) => {
  const type = getValueType(M);

  if (type !== "matrix") return null;

  const mtx = M as Matrix;

  if (!MatrixProp.isSquare(mtx)) return null;

  return null;
};

export default { addVecOrMtx, sumAllEntries, det };
