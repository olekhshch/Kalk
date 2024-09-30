import {
  DeconstructAction,
  DeconstructActionResult,
  InputValue,
  NodeOutput,
  NodeOutputs,
  OutputValue,
  Vector,
} from "../../../types/nodes";
import getValueType from "../../getValueType";

// type f = (
//   v: InputValue
// ) => { [k: string]: NodeOutput & { value: OutputValue } } | null;

const deconstructVec: DeconstructAction = (params) => {
  console.log({ params });
  const { v } = params;
  const valType = getValueType(v);

  if (!v || valType !== "vector") return null;

  const outputs = (v as Vector).reduce((acc, num, idx) => {
    const label = `v${idx + 1}`;

    acc[label] = {
      possibleValues: ["number"],
      value: num,
    };

    return acc;
  }, {} as DeconstructActionResult);

  return outputs;
};

export default { deconstructVec };
