// Node to use outside of the editor (e.g. in the settings)

import { Node, NodeProps } from "@xyflow/react";
import { ValueType } from "../../../types/nodes";
import NodeWrapper from "../NodeWrapper";
import LateXformula from "../../LateXformula";
import ResultOutput from "../../ports/ResultOutput";

export type ModelNode = Node<
  {
    outputsNum: number;
    outputValues: ValueType[];
    value: string | number;
    res_output?: boolean;
  },
  "model"
>;

const ModelNode = ({
  id,
  data: { value, res_output },
}: NodeProps<ModelNode>) => {
  return (
    <NodeWrapper id={id} comment={null}>
      <div className="p-1">
        {res_output && <ResultOutput nodeId={id} />}
        <LateXformula value={value} />
      </div>
    </NodeWrapper>
  );
};

export default ModelNode;
