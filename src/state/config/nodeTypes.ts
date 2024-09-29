import ExpressionNode from "../../components/nodes/ExpressionNode";
import TextSingleNode from "../../components/nodes/TextSingleNode";
import ResultNode from "../../components/nodes/ResultNode";
import { NodeTypes } from "@xyflow/react";
import MathNode from "../../components/nodes/MathNode";
import NodePreview from "../../components/NodePreview";
import IdentityMatrix from "../../components/nodes/IdentityMatrix";
import VectorNode from "../../components/nodes/VectorNode";
import MtxVecNode from "../../components/nodes/MtxVecNode";
import MtxRowsNode from "../../components/nodes/MtxRowsNode";
import { ConstantNode } from "../../components/nodes/ConstantNode";
import ConstructorNode from "../../components/nodes/ConstructorNode";

// node config obj for ReactFlow
const nodeTypes: NodeTypes = {
  "text-single": TextSingleNode,
  expression: ExpressionNode,
  "math-fn": MathNode,
  result: ResultNode,
  "num-fun": MathNode,
  preview: NodePreview,
  "i-mtx": IdentityMatrix,
  vec: VectorNode,
  "mtx-fn": MtxVecNode,
  "mtx-constr": ConstructorNode,
  "mtx-rows": MtxRowsNode,
  constant: ConstantNode,
};

export default nodeTypes;
