// Identity matrix constructor

import { InputValue, Matrix, Vector } from "../../types/nodes";
import getValueType from "../getValueType";

type f = (n: InputValue) => Matrix | null;

const makeIdentityMatrix: f = (n) => {
  const valueType = getValueType(n);
  if (valueType !== "number") return null;

  const size = Math.floor(n as number);

  if (size < 1) return null;

  const matrix: Vector[] = [];
  for (let i = 0; i < size; i++) {
    const row: number[] = [];
    for (let j = 0; j < size; j++) {
      row.push(j === i ? 1 : 0);
    }
    matrix.push(row);
  }

  return matrix;
};

export default makeIdentityMatrix;
