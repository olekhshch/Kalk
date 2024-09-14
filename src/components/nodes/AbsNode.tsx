import { NodeProps } from "@xyflow/react";
import React, { useMemo } from "react";
import { AbsoluteNode } from "../../types/nodes";
import NodeWrapper from "./NodeWrapper";
import InputPort from "../ports/Input";
import Output from "../ports/Output";
import generateHandleLabel from "../../utils/generateHandleLabel";
import ResultOutput from "../ports/ResultOutput";

const AbsNode = ({ id, data }: NodeProps<AbsoluteNode>) => {
  const { showResult, outputs, inputs } = data;

  const outputLabel = useMemo(() => {
    const entries = Object.entries(outputs)[0];
    return generateHandleLabel(entries[0], entries[1]);
  }, []);

  const inputLabel = useMemo(() => {
    const entries = Object.entries(inputs)[0];
    return generateHandleLabel(entries[0], entries[1].type);
  }, []);

  return (
    <NodeWrapper id={id}>
      <div>
        <ResultOutput isShown={showResult} nodeId={id} />
        <InputPort cssPosition="50%" id={inputLabel} label="a" showLabel />
        <div className="p-2 pl-4">|a|</div>
        <Output id={outputLabel} />
      </div>
    </NodeWrapper>
  );
};

export default AbsNode;
