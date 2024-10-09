import {
  ActionResult,
  InputValue,
  NodeAction,
  Vector,
} from "../../types/nodes";
import getValueType from "../getValueType";

const makeVector: NodeAction = (params: { [k: string]: InputValue }) => {
  const calc: ActionResult = { res: null, errors: [] };

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
    const valType = getValueType(value);
    if (!valType && !(!defValue && defValue !== 0)) {
      vec.push(defValue as number);
    } else if (!valType && !defValue) {
      return calc;
    } else if (valType !== "number") {
      calc.errors.push("101");
      return calc;
    } else {
      vec.push(value as number);
    }
  }

  calc.res = vec;

  return calc;
};

export default makeVector;
