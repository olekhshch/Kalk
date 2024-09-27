import { ValueType } from "../types/nodes";

// constructor for node handles labels
type f = (
  nodeId: string,
  outputKey: string,
  allowedTypes: ValueType[]
) => string;

const generateHandleId: f = (nodeId, outputKey, allowedTypes) => {
  return `${nodeId}.${outputKey}-${allowedTypes.join("/")}`;
};

type g = (hi: string) => {
  label: string;
  allowedTypes: ValueType[];
  nodeId: string;
  outputLabel: string;
} | null;

// #TODO: Differenciate between output and input handle since output can only have one value
export const deconstructHandleId: g = (handleId) => {
  const [label, allowedString] = handleId.split("-");

  if (!label || !allowedString) return null;

  const [nodeId, outputLabel] = label.split(".");

  if (!nodeId || !outputLabel) return null;

  const allowedTypes = allowedString.split("/") as ValueType[];
  return { label, allowedTypes, nodeId, outputLabel };
};

export default generateHandleId;
