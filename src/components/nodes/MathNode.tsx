// General number operations node

import { useMemo } from "react";
import NodeWrapper from "./NodeWrapper";
import { NumberFunctionNode } from "../../types/nodes";
import { NodeProps } from "@xyflow/system";
import generateHandleLabel from "../../utils/generateHandleId";
import InputPort from "../ports/Input";
import Output from "../ports/Output";
import ResultOutput from "../ports/ResultOutput";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

const MathNode = ({
  id,
  data: { label, inputs, outputs, showResult },
}: NodeProps<NumberFunctionNode>) => {
  // #TODO: Shallow check for input keys to avoid rerenders?

  const inputsArray = useMemo(() => {
    const entries = Object.entries(inputs);
    const numOfInputs = entries.length;
    const step = 100 / (numOfInputs + 1);

    const array = entries.map(([key, input], idx) => {
      const handleId = generateHandleLabel(key, input.allowedTypes);
      const cssPosition = `${step * (1 + idx)}%`;
      return { handleId, cssPosition, key };
    });

    return array;
  }, [inputs]);

  const outputsArray = useMemo(() => {
    const entries = Object.entries(outputs);
    const numOfOutputs = entries.length;
    const step = 100 / (numOfOutputs + 1);

    return entries.map(([key, output], idx) => {
      const handleId = generateHandleLabel(key, output.allowedTypes);
      const cssPosition = `${step * (1 + idx)}%`;
      return { handleId, cssPosition, key };
    });
  }, []);

  return (
    <NodeWrapper id={id} outputValueType={"number"}>
      <div>
        <ResultOutput nodeId={id} isShown={showResult} />
        {inputsArray.map(({ cssPosition, handleId, key }) => {
          return (
            <InputPort
              key={key}
              id={handleId}
              label={key}
              cssPosition={cssPosition}
              showLabel
            />
          );
        })}
        <div className="p-2 pl-4 italic font-bold">
          <Latex>${label}$</Latex>
        </div>
        {outputsArray.map(({ cssPosition, handleId, key }) => {
          return <Output key={key} id={handleId} cssPosition={cssPosition} />;
        })}
      </div>
    </NodeWrapper>
  );
};

export default MathNode;
