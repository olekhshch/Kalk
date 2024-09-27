// recalculates results for passed chain and return new values object

import { AppNode, MathNode, NumberFunctionNode } from "../../types/nodes";
import { AngleFormat, CalculatedValues } from "../../types/app";
import calculateNode from "./calculateNode";
import makeValueId from "../makeValueId";

type f = (
  chain: string[],
  nodes: AppNode[],
  initialValues: CalculatedValues,
  constValues: CalculatedValues,
  angleFormat: AngleFormat
) => Promise<CalculatedValues>;

const recalculateChain: f = async (
  chain,
  nodes,
  initialValues,
  constValues,
  angleFormat
) => {
  const values = { ...initialValues };
  console.log({ chain });

  for (const nodeId of chain) {
    const targetNode = nodes.find(
      (node) => node.id === nodeId
    ) as NumberFunctionNode;
    if (targetNode) {
      const res = await calculateNode(
        targetNode,
        values,
        constValues,
        angleFormat
      );
      Object.keys(targetNode.data.outputs).forEach((outputLabel) => {
        const valueId = makeValueId(nodeId, outputLabel);
        values[valueId] = res.values[valueId];
      });
    }
  }

  return values;
};

export default recalculateChain;
