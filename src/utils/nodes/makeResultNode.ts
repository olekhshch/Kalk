// created result node for specified node (without an edge)

import { AppNode, NodePurpose, NodeType, ResultNode } from "../../types/nodes";
import makeValueId from "../makeValueId";

const nonresultNodeTypes: NodeType[] = [
  "text-single",
  "result",
  "mtx-deconstr",
];

const makeResultNode = (node: AppNode) => {
  // checking if node should have a result node
  if (nonresultNodeTypes.includes(node.type!)) return null;
  if (!node.data.action) return null;

  // if node has several outputs - ignore
  const outputKeys = Object.keys(node.data.outputs);
  if (outputKeys.length > 1) return null;

  // #TODO: Different valueId if Constant Node
  const valueId = makeValueId(node.id, outputKeys[0]);
  if (!valueId) return null; // result node should always have valueId deffined

  let dX = 50;
  let dY = -40;
  const { measured } = node;
  console.log({ measured });
  if (measured) {
    dX += measured.width ?? 0;
    // dY += (measured.width ?? 0);
  }
  const position = { x: node.position.x + dX, y: node.position.y + dY };

  const newNode: ResultNode = {
    id: "r" + node.id,
    position,
    type: "result",
    data: {
      isShown: false,
      sourceNodeId: node.id,
      tag: "result",
      valueId,
      inputs: [],
      outputs: {},
      value: "",
      purpose: NodePurpose.DECOR,
    },
  };

  return newNode;
};

export default makeResultNode;
