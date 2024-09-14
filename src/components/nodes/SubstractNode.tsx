import { NodeProps } from "@xyflow/react";
import { SubstractionNode } from "../../types/nodes";
import NodeWrapper from "./NodeWrapper";
import InputPort from "../ports/Input";
import ResultOutput from "../ports/ResultOutput";
import Output from "../ports/Output";

const SubstractNode = ({
  id,
  data: { inputs, showResult, outputs },
}: NodeProps<SubstractionNode>) => {
  const inputEntries = Object.entries(inputs);
  const numberOfInputs = inputEntries.length;
  const step = 100 / (numberOfInputs + 1);

  return (
    <NodeWrapper id={id}>
      <div>
        <ResultOutput nodeId={id} isShown={showResult} />
        {inputEntries.map(([key, input], idx) => {
          return (
            <InputPort
              key={key}
              id={`${key}-${input.type}`}
              label={key}
              cssPosition={`${step * (1 + idx)}%`}
              showLabel
            />
          );
        })}
        <div className="p-2 pl-4">a-b</div>
        <Output id={`N-${outputs.N}`} />
      </div>
    </NodeWrapper>
  );
};

export default SubstractNode;
