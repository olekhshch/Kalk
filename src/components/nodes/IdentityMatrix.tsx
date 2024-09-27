import { NodeProps } from "@xyflow/react";
import { IdentityMtxNode } from "../../types/nodes";
import NodeWrapper from "./NodeWrapper";
import Latex from "react-latex-next";
import InputPort from "../ports/Input";
import generateHandleLabel from "../../utils/generateHandleId";
import ResultOutput from "../ports/ResultOutput";
import Output from "../ports/Output";

const IdentityMatrix = ({
  id,
  data: { inputs, comment },
}: NodeProps<IdentityMtxNode>) => {
  const inputId = generateHandleLabel(id, "n", inputs.n.allowedTypes);
  const outputId = generateHandleLabel(id, "M", ["matrix"]);
  return (
    <NodeWrapper
      id={id}
      outputValueTypes={["matrix"]}
      comment={comment ?? null}
    >
      <div className="p-2 pl-4">
        <ResultOutput nodeId={id} />
        <InputPort id={inputId} cssPosition="50%" label="n" showLabel />
        <Latex>$I_n$</Latex>
        <Output id={outputId} cssPosition="50%" />
      </div>
    </NodeWrapper>
  );
};

export default IdentityMatrix;
