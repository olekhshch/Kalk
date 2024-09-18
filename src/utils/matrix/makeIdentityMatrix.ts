// Identity matrix constructor

import { Matrix } from "../../types/nodes";

type f = (n: number) => Matrix;

const makeIdentityMatrix: f = (size: number) => {
  const matrix: number[][] = [];
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
