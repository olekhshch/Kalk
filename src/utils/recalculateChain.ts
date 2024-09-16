// recalculates results for passed chain and return new values object

import { AppNode } from "../types/nodes";
import { AngleFormat, CalculatedValues } from "../types/system";
import calculateNode from "./calculateNode";

type f = (
  chain: string[],
  nodes: AppNode[],
  initialValues: CalculatedValues,
  angleFormat: AngleFormat
) => CalculatedValues;

const recalculateChain: f = (chain, nodes, initialValues, angleFormat) => {
  let values = { ...initialValues };

  chain.forEach((nodeId) => {
    const targetNode = nodes.find((node) => node.id === nodeId);

    if (targetNode) {
      calculateNode(targetNode, values, angleFormat).then((newValues) => {
        values[nodeId] = newValues[nodeId];
      });
    }
  });

  console.log({ values });

  return values;
};

export default recalculateChain;
