// created result node for specified node (without an edge)

import { AppNode, NumberFunctionNode, ResultNode } from "../../types/nodes";
import makeValueId from "../makeValueId";

const nonresultNodeTypes = ["text-single", "result"];

const makeResultNode = (node: AppNode, resultNodeId: string) => {
  // checking if node should have a result node
  if (nonresultNodeTypes.includes(node.type!)) return null;

  // if node has several outputs - ignore
  const outputKeys = Object.keys((node as NumberFunctionNode).data.outputs);
  if (outputKeys.length > 1) return null;

  const valueId = makeValueId(node.id, outputKeys[0]);
  const position = { x: node.position.x + 50, y: node.position.y - 40 };

  const newNode: ResultNode = {
    id: resultNodeId,
    position,
    type: "result",
    data: {
      isShown: false,
      sourceId: node.id,
      tag: "result",
      valueId,
    },
  };

  return newNode;
};

export default makeResultNode;
