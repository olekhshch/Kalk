// General number operations node

import { useMemo } from "react";
import NodeWrapper from "./NodeWrapper";
import { NumberFunctionNode } from "../../types/nodes";
import { NodeProps } from "@xyflow/system";
import generateHandleLabel from "../../utils/generateHandleLabel";
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
      const handleLabel = generateHandleLabel(key, input.type);
      const cssPosition = `${step * (1 + idx)}%`;
      return { handleLabel, cssPosition, key };
    });

    return array;
  }, [inputs]);

  const outputsArray = useMemo(() => {
    const entries = Object.entries(outputs);
    const numOfOutputs = entries.length;
    const step = 100 / (numOfOutputs + 1);

    return entries.map(([key, outputType], idx) => {
      const handleLabel = generateHandleLabel(key, outputType);
      const cssPosition = `${step * (1 + idx)}%`;
      return { handleLabel, cssPosition, key };
    });
  }, []);

  return (
    <NodeWrapper id={id}>
      <div>
        <ResultOutput nodeId={id} isShown={showResult} />
        {inputsArray.map(({ cssPosition, handleLabel, key }) => {
          return (
            <InputPort
              key={key}
              id={handleLabel}
              label={key}
              cssPosition={cssPosition}
              showLabel
            />
          );
        })}
        <div className="p-2 pl-4 italic font-bold">
          <Latex>${label}$</Latex>
        </div>
        {outputsArray.map(({ cssPosition, handleLabel, key }) => {
          return (
            <Output key={key} id={handleLabel} cssPosition={cssPosition} />
          );
        })}
      </div>
    </NodeWrapper>
  );
};

export default MathNode;
