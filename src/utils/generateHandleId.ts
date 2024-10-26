import { ConnectAction } from "../types/app";
import { ValueType } from "../types/nodes";

// constructor for node handles labels
type f = (
  nodeId: string,
  outputKey: string,
  allowedTypes: ValueType[],
  action?: ConnectAction // some inputs should perform certain action instead (e.g. create a new input)
) => string;

const generateHandleId: f = (nodeId, outputKey, allowedTypes, action) => {
  return `${nodeId}.${outputKey}-${allowedTypes.join("/")}${
    action ? "-" + action : ""
  }`;
};

type g = (hi: string) => {
  label: string;
  allowedTypes: ValueType[];
  nodeId: string;
  outputLabel: string;
  action?: ConnectAction;
} | null;

// #TODO: Differenciate between output and input handle since output can only have one value
export const deconstructHandleId: g = (handleId) => {
  const [label, allowedString, action] = handleId.split("-");

  if (!label || !allowedString) return null;

  const [nodeId, outputLabel] = label.split(".");

  if (!nodeId || !outputLabel) return null;

  const allowedTypes = allowedString.split("/") as ValueType[];
  return {
    label,
    allowedTypes,
    nodeId,
    outputLabel,
    action: action as ConnectAction | undefined,
  };
};

export default generateHandleId;
