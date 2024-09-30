import { InputValue, Vector } from "../../types/nodes";
import getValueType from "../getValueType";

type f = (v: InputValue) => number | null;

const vectorNorm: f = (v) => {
  const valType = getValueType(v);

  if (valType !== "vector") return null;

  const sumOfSquares = (v as Vector).reduce((acc, n) => {
    acc += n * n;
    return acc;
  }, 0);

  return Math.sqrt(sumOfSquares);
};

export default vectorNorm;
