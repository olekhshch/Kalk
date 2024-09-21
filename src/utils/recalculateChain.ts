// recalculates results for passed chain and return new values object

import { AppNode } from "../types/nodes";
import { AngleFormat, CalculatedValues } from "../types/system";
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

  // const cb = async (nodeId: string) => {
  //   const targetNode = nodes.find((node) => node.id === nodeId);
  //   if (targetNode) {
  //     const newValues = await calculateNode(targetNode, values, angleFormat);
  //     values[nodeId] = newValues[nodeId];
  //   }
  // };

  // for (let i = 0; i < chain.length; i++) {
  //   console.log({ i });
  //   const nodeId = chain[i];
  //   const targetNode = nodes.find((node) => node.id === nodeId);
  //   if (targetNode) {
  //     calculateNode(targetNode, values, angleFormat).then((newValues) => {
  //       values[nodeId] = newValues[nodeId];
  //       i++;
  //     });
  //   }
  // }

  for (const nodeId of chain) {
    console.log("START FOR " + nodeId);
    const targetNode = nodes.find((node) => node.id === nodeId);
    if (targetNode) {
      const newValues = await calculateNode(targetNode, values, angleFormat);
      values[nodeId] = newValues[nodeId];
    }
    console.log("FINISH FOR " + nodeId);
  }

  return values;
};

export default recalculateChain;
