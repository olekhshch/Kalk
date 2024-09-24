import { InputValue, ValueType } from "../types/nodes";

type f = (val: InputValue) => ValueType | null;
const getValueType: f = (val) => {
  if (!val && val !== 0) return null;

  if (!Array.isArray(val)) return "number";

  if (!Array.isArray(val[0])) return "vector";

  if (Array.isArray(val[0])) return "matrix";

  return null;
};

export default getValueType;
