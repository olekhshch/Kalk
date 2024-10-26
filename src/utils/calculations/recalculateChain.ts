// recalculates results for passed chain and return new values object

import { AppNode } from "../../types/nodes";
import { AngleFormat, CalculatedValues, StoreErrors } from "../../types/app";
import calculateNode from "./calculateNode";
import makeValueId from "../makeValueId";

type f = (
  chain: string[],
  nodes: AppNode[],
  initialValues: CalculatedValues,
  // constValues: CalculatedValues,
  angleFormat: AngleFormat
) => Promise<{
  values: CalculatedValues;
  nodesToReplace: AppNode[];
  errors: StoreErrors;
}>;

const recalculateChain: f = async (
  chain,
  nodes,
  initialValues,
  // constValues,
  angleFormat
) => {
  const values = { ...initialValues };
  const nodesToReplace: AppNode[] = [];
  const errors: StoreErrors = {};

  for (const nodeId of chain) {
    const targetNode = nodes.find((node) => node.id === nodeId) as AppNode;
    if (targetNode) {
      console.log({ targetNode });
      const res = await calculateNode(targetNode, values, angleFormat);
      console.log({ res });
      Object.keys(targetNode.data.outputs).forEach((outputLabel) => {
        const valueId = makeValueId(nodeId, outputLabel);
        values[valueId] = res.values[valueId];
        // #TODO: Map set to avoid repetition

        errors[nodeId] = res.errors[nodeId];
      });
      nodesToReplace.push(...res.nodesToReplace);
      console.log({ nodesToReplace });
    }
  }

  return { values, nodesToReplace, errors };
};

export default recalculateChain;
