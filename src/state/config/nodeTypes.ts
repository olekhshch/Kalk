import ExpressionNode from "../../components/nodes/ExpressionNode";
import TextSingleNode from "../../components/nodes/TextSingleNode";
import ResultNode from "../../components/nodes/ResultNode";
import { NodeTypes } from "@xyflow/react";
import MathNode from "../../components/nodes/MathNode";
import NodePreview from "../../components/NodePreview";
// import IdentityMatrix from "../../components/nodes/IdentityMatrix";
import MtxVecNode from "../../components/nodes/MtxVecNode";
import { ConstantNode } from "../../components/nodes/ConstantNode";
import ConstructorNode from "../../components/nodes/ConstructorNode";
import DeconstructorNode from "../../components/nodes/DeconstructorNode";
import MarkdownNode from "../../components/nodes/MarkdownNode";
import PlotNode from "../../components/nodes/PlotNode";

// node config obj for ReactFlow
const nodeTypes: NodeTypes = {
  "text-single": TextSingleNode,
  expression: ExpressionNode,
  "math-fn": MathNode,
  result: ResultNode,
  "num-fun": MathNode,
  preview: NodePreview,
  "mtx-fn": MtxVecNode,
  "mtx-constr": ConstructorNode,
  constant: ConstantNode,
  "mtx-deconstr": DeconstructorNode,
  markdown: MarkdownNode,
  plot: PlotNode,
};

export default nodeTypes;
