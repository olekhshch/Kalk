import { ValueType } from "../types/nodes";

// constructor for node handles labels
type f = (outputKey: string, valueType: ValueType) => string;

const generateHandleLabel: f = (outputKey, valueType) => {
  return `${outputKey}-${valueType}`;
};

export default generateHandleLabel;
