// checks if possible value of output is allowed for the input while connecting two nodes

import { ValueType } from "../../types/nodes";

const isConnectable = (
  sourceValues: ValueType[],
  targetValues: ValueType[]
) => {
  for (let i = 0; i < sourceValues.length; i++) {
    if (targetValues.includes(sourceValues[i])) {
      return true;
    }
  }

  return false;
};

export default isConnectable;
