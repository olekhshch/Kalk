// recalculates results for passed chain and return new values object

import { AppNode } from "../../types/nodes";
import { AngleFormat, CalculatedValues } from "../../types/app";
import calculateNode from "./calculateNode";

type f = (
  chain: string[],
  nodes: AppNode[],
  initialValues: CalculatedValues,
  angleFormat: AngleFormat
) => Promise<CalculatedValues>;

const recalculateChain: f = async (
  chain,
  nodes,
  initialValues,
  angleFormat
) => {
  const values = { ...initialValues };

  for (const nodeId of chain) {
    const targetNode = nodes.find((node) => node.id === nodeId);
    if (targetNode) {
      const res = await calculateNode(targetNode, values, angleFormat);
      values[nodeId] = res.values[nodeId];
    }
  }

  return values;
};

export default recalculateChain;
