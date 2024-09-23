import { InputValue, Matrix, OutputValue, Vector } from "../../types/nodes";
import validate from "../validate";

type f = (a: InputValue, b: InputValue) => Promise<OutputValue>;

//================== Power =======================

const power: f = async (a, b) => {
  if (!validate(a, "defined").valid || !validate(b, "defined").valid)
    return null;

  // b can only be a Number
  if (!validate(b, "number").valid) return null;

  // base a is Number
  if (!Array.isArray(a)) {
    return powerNumBase(a as number, b as number);
  }

  // base is Vector
  if (!Array.isArray(a[0])) {
    const vec = await powerVecBase(a as Vector, b as number);
    return vec;
  }

  // base if Matrix
  const mtx: Matrix = await Promise.all(
    (a as Matrix).map(async (vec) => powerVecBase(vec, b as number))
  );
  return mtx;
};

const powerNumBase = (a: number, b: number) => Math.pow(a, b);

const powerVecBase = async (a: Vector, b: number) => {
  const vec: Vector = await Promise.all(a.map(async (n) => powerNumBase(n, b)));
  return vec;
};

type g = (a: InputValue) => Promise<number | Vector | Matrix | null>;

// =================== Abs ========================
const abs: g = async (a) => {
  if (!a && a !== 0) return null;

  if (!Array.isArray(a)) return Math.abs(a);

  // a is Vector
  if (!Array.isArray(a[0])) {
    return absoluteForVector(a as Vector);
  }

  // a is Matrix
  const newMtx = await Promise.all(
    (a as Matrix).map((vec) => absoluteForVector(vec))
  );
  return newMtx;
};

const absoluteForVector = async (vec: Vector) => {
  const res = await Promise.all(vec.map(async (num) => Math.abs(num)));
  return res;
};

// ==================== Floor ===================

const floor: g = async (a) => {
  if (!validate(a, "defined").valid) return null;

  // Number
  if (!Array.isArray(a)) {
    const res = floorNum(a!);
    return res;
  }

  // Vector
  if (!Array.isArray(a[0])) {
    const vec: Vector = await floorVec(a as Vector);
    return vec;
  }

  // Matrix
  const mtx: Matrix = await Promise.all(
    (a as Matrix).map(async (vec) => floorVec(vec))
  );
  return mtx;
};

const floorNum = (n: number) => Math.floor(n);

const floorVec = async (v: Vector) => {
  const vec: Vector = await Promise.all(v.map(async (num) => floorNum(num)));
  return vec;
};
// ==================== Ceil ===================

const ceil: g = async (a) => {
  if (!validate(a, "defined").valid) return null;

  // Number
  if (!Array.isArray(a)) {
    const res = ceilNum(a!);
    return res;
  }

  // Vector
  if (!Array.isArray(a[0])) {
    const vec: Vector = await ceilVec(a as Vector);
    return vec;
  }

  // Matrix
  const mtx: Matrix = await Promise.all(
    (a as Matrix).map(async (vec) => ceilVec(vec))
  );
  return mtx;
};

const ceilNum = (n: number) => Math.ceil(n);

const ceilVec = async (v: Vector) => {
  const vec: Vector = await Promise.all(v.map(async (num) => floorNum(num)));
  return vec;
};

export default { power, abs, floor, ceil };
