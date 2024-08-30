import ExpressionNode from "../components/nodes/ExpressionNode";
import TextSingleNode from "../components/nodes/TextSingleNode";
import ResultNode from "../components/nodes/ResultNode";

const nodeTypes = {
  "text-single": TextSingleNode,
  expression: ExpressionNode,
  "result-number": ResultNode,
};

export default nodeTypes;
