import {
  ActionResult,
  InputValue,
  Matrix,
  OutputValue,
  Vector,
} from "../../types/nodes";
import getValueType from "../getValueType";
import validate from "../validate";

type f = (a: InputValue, b: InputValue) => Promise<OutputValue>;

//================== Power =======================

const power: f = async (a, b) => {
  const typeA = getValueType(a);
  const typeB = getValueType(b);

  if (!typeA || !typeB) return null;

  // b can only be a number
  if (typeB !== "number") return null;

  // base a is Number
  if (typeA === "number") {
    return powerNumBase(a as number, b as number);
  }

  // base is Vector
  if (typeA === "vector") {
    const vec = await powerVecBase(a as Vector, b as number);
    return vec;
  }

  // base if Matrix
  let allVecsDefined = true;
  const mtx: Matrix = await Promise.all(
    (a as Matrix).map(async (vec) => {
      const vecPwr = await powerVecBase(vec, b as number);
      if (!vecPwr) {
        allVecsDefined = false;
        return vec;
      }
      return vecPwr;
    })
  );
  return mtx;
};

const powerNumBase = (a: number, b: number) => {
  if (a < 0) return null;
  return Math.pow(a, b);
};

const powerVecBase = async (a: Vector, b: number) => {
  let allEntriesDefined = true;
  const vec: Vector = await Promise.all(
    a.map(async (n) => {
      const res = powerNumBase(n, b);
      if (getValueType(res) !== "number") {
        allEntriesDefined = false;
        return 0;
      }
      return res!;
    })
  );
  if (!allEntriesDefined) return null;
  return vec;
};

type g = (a: InputValue) => Promise<ActionResult>;

// =================== Abs ========================

const abs: g = async (a) => {
  if (!a && a !== 0) return { res: null, errors: [] };

  if (!Array.isArray(a)) return { res: Math.abs(a), errors: [] };

  // a is Vector
  if (!Array.isArray(a[0])) {
    const res = await absoluteForVector(a as Vector);
    return { res, errors: [] };
  }

  // a is Matrix
  const newMtx = await Promise.all(
    (a as Matrix).map((vec) => absoluteForVector(vec))
  );
  return { res: newMtx, errors: [] };
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
