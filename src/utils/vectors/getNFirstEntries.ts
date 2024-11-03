import { InputValue, Vector } from "../../types/nodes";
import getValueType from "../getValueType";

type f = (input_vec: InputValue, n: number) => Vector | null;

const getFirstNEntries: f = (input, n) => {
  const valType = getValueType(input);

  if (valType !== "vector") return null;

  const vec = input as Vector;
  const vecLen = vec.length;

  if (n <= vecLen) {
    return vec.slice(0, n);
  }

  return null;
};

export default getFirstNEntries;
