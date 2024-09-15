import ExpressionNode from "../components/nodes/ExpressionNode";
import TextSingleNode from "../components/nodes/TextSingleNode";
import ResultNode from "../components/nodes/ResultNode";
import { NodeTypes } from "@xyflow/react";
import AddNode from "../components/nodes/AddNode";
import SubstractNode from "../components/nodes/SubstractNode";
import AbsNode from "../components/nodes/AbsNode";
import MathNode from "../components/nodes/MathNode";

const nodeTypes: NodeTypes = {
  "text-single": TextSingleNode,
  expression: ExpressionNode,
  "result-number": ResultNode,
  add: AddNode,
  substract: SubstractNode,
  abs: AbsNode,
  "num-fun": MathNode,
};

export default nodeTypes;
