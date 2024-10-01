// Trigonometry operations on numbers and entries of Vector/Matrix

import { AngleFormat } from "../../types/app";
import { InputValue, Matrix, OutputValue, Vector } from "../../types/nodes";
import convertToRAD from "../convertToRAD";
import getValueType from "../getValueType";
import validate from "../validate";

type f = (a: InputValue, angleFormat: AngleFormat) => Promise<OutputValue>;

const sin: f = async (a, angleFormat) => {
  if (!validate(a, "defined").valid) return null;

  // number
  if (!Array.isArray(a)) {
    const res = await sinOfNum(a as number, angleFormat);
    return res;
  }

  // Vector
  if (!Array.isArray(a[0])) {
    const vec: Vector = await sinOfVec(a as Vector, angleFormat);
    return vec;
  }

  // Matrix
  const mtx: Matrix = await Promise.all(
    (a as Matrix).map(async (vec) => sinOfVec(vec, angleFormat))
  );
  return mtx;
};

const sinOfNum = async (a: number, angleFormat: AngleFormat) => {
  const angle = (
    angleFormat === AngleFormat.DEG ? await convertToRAD(a) : a
  ) as number;
  return Math.sin(angle);
};

const sinOfVec = async (vec: Vector, angleFormat: AngleFormat) => {
  const vector: Vector = await Promise.all(
    vec.map(async (num) => sinOfNum(num, angleFormat))
  );
  return vector;
};

const cos: f = async (a, angleFormat) => {
  if (!validate(a, "defined").valid) return null;

  // number
  if (!Array.isArray(a)) {
    const res = await cosOfNum(a as number, angleFormat);
    return res;
  }

  // Vector
  if (!Array.isArray(a[0])) {
    const vec: Vector = await cosOfVec(a as Vector, angleFormat);
    return vec;
  }

  // Matrix
  const mtx: Matrix = await Promise.all(
    (a as Matrix).map(async (vec) => cosOfVec(vec, angleFormat))
  );
  return mtx;
};

const cosOfNum = async (a: number, angleFormat: AngleFormat) => {
  const angle = (
    angleFormat === AngleFormat.DEG ? await convertToRAD(a) : a
  ) as number;
  return Math.cos(angle);
};

const cosOfVec = async (vec: Vector, angleFormat: AngleFormat) => {
  const vector: Vector = await Promise.all(
    vec.map(async (num) => cosOfNum(num, angleFormat))
  );
  return vector;
};

const tg: f = async (a, angleFormat) => {
  if (!validate(a, "defined").valid) return null;

  // number
  if (!Array.isArray(a)) {
    const res = await tgOfNum(a as number, angleFormat);
    return res;
  }

  // Vector
  if (!Array.isArray(a[0])) {
    const vec: Vector = await tgOfVec(a as Vector, angleFormat);
    return vec;
  }

  // Matrix
  const mtx: Matrix = await Promise.all(
    (a as Matrix).map(async (vec) => tgOfVec(vec, angleFormat))
  );
  return mtx;
};

const tgOfNum = async (a: number, angleFormat: AngleFormat) => {
  const angle = (
    angleFormat === AngleFormat.DEG ? await convertToRAD(a) : a
  ) as number;
  return Math.tan(angle);
};

const tgOfVec = async (vec: Vector, angleFormat: AngleFormat) => {
  const vector: Vector = await Promise.all(
    vec.map(async (num) => tgOfNum(num, angleFormat))
  );
  return vector;
};

const ctg: f = async (a, angleFormat) => {
  if (!validate(a, "defined").valid) return null;

  // number
  if (!Array.isArray(a)) {
    const res = await ctgOfNum(a as number, angleFormat);
    return res;
  }

  // Vector
  if (!Array.isArray(a[0])) {
    const vec: Vector = await ctgOfVec(a as Vector, angleFormat);
    return vec;
  }

  // Matrix
  const mtx: Matrix = await Promise.all(
    (a as Matrix).map(async (vec) => ctgOfVec(vec, angleFormat))
  );
  return mtx;
};

const ctgOfNum = async (a: number, angleFormat: AngleFormat) => {
  const angle = (
    angleFormat === AngleFormat.DEG ? await convertToRAD(a) : a
  ) as number;
  const res = 1 / Math.tan(angle);
  return Number.isFinite(res) ? res : null;
};

const ctgOfVec = async (vec: Vector, angleFormat: AngleFormat) => {
  const vector: Vector = await Promise.all(
    vec.map(async (num) => tgOfNum(num, angleFormat))
  );
  return vector;
};

const asin: f = async (a, angleFormat) => {
  const aType = getValueType(a);

  // number
  if (aType === "number") {
    const res = await asinOfNum(a as number, angleFormat);
    return res;
  }

  // Vector
  if (aType === "vector") {
    const vec: Vector = await asinOfVec(a as Vector, angleFormat);
    return vec;
  }

  // Matrix
  if (aType === "matrix") {
    const mtx: Matrix = await Promise.all(
      (a as Matrix).map(async (vec) => asinOfVec(vec, angleFormat))
    );
    return mtx;
  }

  return null;
};

const asinOfNum = async (a: number, angleFormat: AngleFormat) => {
  const coeff = angleFormat === AngleFormat.DEG ? 180 / Math.PI : 1;
  return Math.asin(a) * coeff;
};

const asinOfVec = async (vec: Vector, angleFormat: AngleFormat) => {
  const res = await Promise.all(
    vec.map(async (num) => asinOfNum(num, angleFormat))
  );
  return res;
};

// #TODO: asin, acos when a > 1 || a < 1
const acos: f = async (a, angleFormat) => {
  const aType = getValueType(a);

  if (!aType) return null;

  // number
  if (aType === "number") {
    const res = await acosOfNum(a as number, angleFormat);
    return res;
  }

  // Vector
  if (aType === "vector") {
    const vec: Vector = await acosOfVec(a as Vector, angleFormat);
    return vec;
  }

  // Matrix
  if (aType === "matrix") {
    const mtx: Matrix = await Promise.all(
      (a as Matrix).map(async (vec) => acosOfVec(vec, angleFormat))
    );
    return mtx;
  }

  return null;
};

const acosOfNum = async (a: number, angleFormat: AngleFormat) => {
  const coeff = angleFormat === AngleFormat.DEG ? 180 / Math.PI : 1;
  return Math.acos(a) * coeff;
};

const acosOfVec = async (vec: Vector, angleFormat: AngleFormat) => {
  const res = await Promise.all(
    vec.map(async (num) => acosOfNum(num, angleFormat))
  );
  return res;
};

const atg: f = async (a, angleFormat) => {
  const aType = getValueType(a);

  switch (aType) {
    case "number": {
      const res = await atgOfNum(a as number, angleFormat);
      return res;
    }
    case "vector": {
      const res = await atgOfVec(a as Vector, angleFormat);
      return res;
    }
    case "matrix": {
      const mtx: Matrix = await Promise.all(
        (a as Matrix).map(async (vec) => atgOfVec(vec, angleFormat))
      );
      return mtx;
    }
    default: {
      return null;
    }
  }
};

const atgOfNum = async (a: number, angleFormat: AngleFormat) => {
  const coeff = angleFormat === AngleFormat.DEG ? 180 / Math.PI : 1;
  return Math.atan(a) * coeff;
};

const atgOfVec = async (vec: Vector, angleFormat: AngleFormat) => {
  const res = await Promise.all(
    vec.map(async (num) => atgOfNum(num, angleFormat))
  );
  return res;
};

export default { sin, cos, tg, ctg, asin, acos, atg };
