// linear addition of two vectors

import { Vector } from "../../types/nodes";

type f = (vec1: Vector, vec2: Vector) => Vector | null;

const addVectors: f = (vec1, vec2) => {
  // checking if the same size
  if (vec1.length !== vec2.length) return null;

  return vec1.reduce((acc, num, idx) => {
    acc[idx] = num + vec2[idx];
    return acc;
  }, [] as Vector);
};

export default addVectors;
