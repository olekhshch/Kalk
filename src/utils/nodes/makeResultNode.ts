// created result node for specified node (without an edge)

import {
  AppNode,
  NodePurpose,
  NodeTag,
  NodeType,
  NumberFunctionNode,
  ResultNode,
} from "../../types/nodes";
import makeValueId from "../makeValueId";

const nonresultNodeTypes: NodeType[] = [
  "text-single",
  "result",
  "mtx-deconstr",
];

const makeResultNode = (node: AppNode, resultNodeId: string) => {
  // checking if node should have a result node
  if (nonresultNodeTypes.includes(node.type!)) return null;
  if (!node.data.action) return null;

  // if node has several outputs - ignore
  const outputKeys = Object.keys(node.data.outputs);
  if (outputKeys.length > 1) return null;

  // #TODO: Different valueId if Constant Node
  const valueId = makeValueId(node.id, outputKeys[0]);
  if (!valueId) return null; // result node should always have valueId deffined
  const position = { x: node.position.x + 50, y: node.position.y - 40 };

  const newNode: ResultNode = {
    id: resultNodeId,
    position,
    type: "result",
    data: {
      isShown: false,
      sourceNodeId: node.id,
      tag: "result",
      valueId,
      inputs: {},
      outputs: {},
      value: "",
      purpose: NodePurpose.DECOR,
    },
  };

  return newNode;
};

export default makeResultNode;
