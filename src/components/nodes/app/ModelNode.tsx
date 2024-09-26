// Node to use outside of the editor (e.g. in the settings)

import { Node, NodeProps } from "@xyflow/react";
import { ValueType } from "../../../types/nodes";
import NodeWrapper from "../NodeWrapper";

export type ModelNode = Node<
  {
    outputsNum: number;
    outputValues: ValueType[];
  },
  "model"
>;

const ModelNode = ({ id }: NodeProps<ModelNode>) => {
  return (
    <NodeWrapper id={id} comment={null}>
      <div>node</div>
    </NodeWrapper>
  );
};

export default ModelNode;
