// converts radians to degrees

import { InputValue, Matrix, OutputValue, Vector } from "../types/nodes";
import validate from "./validate";

type f = (a: InputValue) => Promise<OutputValue>;

const convertToRAD: f = async (radValue) => {
  if (!validate(radValue, "defined").valid) return null;

  // number
  if (!Array.isArray(radValue)) return convertNum(radValue as number);

  // Vector
  if (!Array.isArray(radValue[0])) {
    const vec: Vector = await convertVec(radValue as Vector);
    return vec;
  }

  // Matrix
  const mtx: Matrix = await Promise.all(
    (radValue as Matrix).map(async (vec) => convertVec(vec))
  );
  return mtx;
};

const convertNum = (n: number) => (n * Math.PI) / 180;

const convertVec = async (vec: Vector) => {
  const res = await Promise.all(vec.map(async (num) => convertNum(num)));
  return res;
};

export default convertToRAD;
