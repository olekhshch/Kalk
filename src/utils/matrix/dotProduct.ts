// dot product of two Vectors

import { Vector } from "../../types/nodes";

type f = (vec1: Vector, vec2: Vector) => number | null;

const dotProduct: f = (vec1, vec2) => {
  // checking if the same size

  if (vec1.length !== vec2.length) return null;

  return vec1.reduce((acc, num, idx) => {
    acc += num * vec2[idx];
    return acc;
  }, 0);
};

export default dotProduct;
