import { InputValue, Vector } from "../../types/nodes";
import getValueType from "../getValueType";

const makeVector = (params: { [k: string]: InputValue }) => {
  const { n, d, ...entries } = params;

  // default value - should be number
  let defValue = d;
  const defValType = getValueType(defValue);
  if (!defValType || defValType !== "number") {
    defValue = null;
  }

  const vecEntries = Object.values(entries);

  const vec: Vector = [];

  // all entries should be Numbers and defined. If not defined then default Value should be provided
  for (const value of vecEntries) {
    console.log({ value });

    const valType = getValueType(value);
    if (!valType && defValue) {
      vec.push(defValue as number);
    } else if (!valType && !defValue) {
      return null;
    } else if (valType !== "number") {
      return null;
    } else {
      vec.push(value as number);
    }
  }

  return vec;
};

export default makeVector;
