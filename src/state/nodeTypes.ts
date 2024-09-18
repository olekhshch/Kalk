import ExpressionNode from "../components/nodes/ExpressionNode";
import TextSingleNode from "../components/nodes/TextSingleNode";
import ResultNode from "../components/nodes/ResultNode";
import { NodeTypes } from "@xyflow/react";
import AddNode from "../components/nodes/AddNode";
import SubstractNode from "../components/nodes/SubstractNode";
import AbsNode from "../components/nodes/AbsNode";
import MathNode from "../components/nodes/MathNode";
import NodePreview from "../components/NodePreview";
import IdentityMatrix from "../components/nodes/IdentityMatrix";

// node config obj for ReactFlow
const nodeTypes: NodeTypes = {
  "text-single": TextSingleNode,
  expression: ExpressionNode,
  result: ResultNode,
  add: AddNode,
  substract: SubstractNode,
  abs: AbsNode,
  "num-fun": MathNode,
  preview: NodePreview,
  "i-mtx": IdentityMatrix,
};

export default nodeTypes;
