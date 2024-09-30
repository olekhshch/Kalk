// dot product of two Vectors

import { InputValue, Vector } from "../../types/nodes";
import getValueType from "../getValueType";

type f = (vec1: InputValue, vec2: InputValue) => number | null;

const dotProduct: f = (vec1, vec2) => {
  const valTypeV = getValueType(vec1);
  const valTypeW = getValueType(vec2);

  if (valTypeV !== "vector" || valTypeW !== "vector") return null;
  // checking if the same size

  if ((vec1 as Vector).length !== (vec2 as Vector).length) return null;

  return (vec1 as Vector).reduce((acc, num, idx) => {
    acc += num * (vec2 as Vector)[idx];
    return acc;
  }, 0);
};

export default dotProduct;
