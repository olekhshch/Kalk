import { NodeProps } from "@xyflow/react";
import React from "react";
import { IdentityMtxNode } from "../../types/nodes";
import NodeWrapper from "./NodeWrapper";
import Latex from "react-latex-next";
import InputPort from "../ports/Input";
import generateHandleLabel from "../../utils/generateHandleLabel";
import ResultOutput from "../ports/ResultOutput";

const IdentityMatrix = ({
  id,
  data: { inputs, showResult },
}: NodeProps<IdentityMtxNode>) => {
  const inputId = generateHandleLabel("n", inputs.n.type);
  return (
    <NodeWrapper id={id}>
      <div className="p-2 pl-4">
        <ResultOutput nodeId={id} isShown={showResult} />
        <InputPort id={inputId} cssPosition="50%" label="n" showLabel />
        <Latex>$I_n$</Latex>
      </div>
    </NodeWrapper>
  );
};

export default IdentityMatrix;
