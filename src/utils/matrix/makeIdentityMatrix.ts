// Identity matrix constructor

import { Matrix, Vector } from "../../types/nodes";

type f = (n: number) => Matrix | null;

const makeIdentityMatrix: f = (n: number) => {
  const size = Math.floor(n);

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
