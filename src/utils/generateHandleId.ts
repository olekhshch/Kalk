import { ValueType } from "../types/nodes";

// constructor for node handles labels
type f = (outputKey: string, allowedTypes: ValueType[]) => string;

const generateHandleId: f = (outputKey, allowedTypes) => {
  return `${outputKey}-${allowedTypes.join("/")}`;
};

type g = (hi: string) => { label: string; allowedTypes: ValueType[] } | null;

// #TODO: Differenciate between output and input handle since output can only have one value
export const deconstructHandleId: g = (handleId) => {
  const [label, allowedString] = handleId.split("-");

  if (!label || !allowedString) return null;

  const allowedTypes = allowedString.split("/") as ValueType[];
  return { label, allowedTypes };
};

export default generateHandleId;
