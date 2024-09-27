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
import useContent from "../../state/useContent";
import { useShallow } from "zustand/react/shallow";
import getValueType from "../../utils/getValueType";

const MathNode = ({
  id,
  data: { label, inputs, outputs, showResult, comment },
}: NodeProps<NumberFunctionNode>) => {
  // calculated value of an output
  const calculatedValue = useContent(useShallow((store) => store.values[id]));
  const outputType = getValueType(calculatedValue);

  // #TODO: Shallow check for input keys to avoid rerenders?

  const inputsArray = useMemo(() => {
    const entries = Object.entries(inputs);
    const numOfInputs = entries.length;
    const step = 100 / (numOfInputs + 1);

    const array = entries.map(([key, input], idx) => {
      const handleId = generateHandleLabel(id, key, input.allowedTypes);
      const cssPosition = `${step * (1 + idx)}%`;
      return { handleId, cssPosition, key };
    });

    return array;
  }, [inputs]);

  const outputsEntries = Object.entries(outputs);

  const outputsArray = useMemo(() => {
    const numOfOutputs = outputsEntries.length;
    const step = 100 / (numOfOutputs + 1);

    return outputsEntries.map(([key, output], idx) => {
      const handleId = generateHandleLabel(id, key, output.possibleValues);
      const cssPosition = `${step * (1 + idx)}%`;
      return { handleId, cssPosition, key };
    });
  }, []);

  return (
    <NodeWrapper
      id={id}
      outputValueTypes={
        outputType ? [outputType] : outputsEntries[0][1].possibleValues
      }
      comment={comment ?? null}
    >
      <div>
        <ResultOutput nodeId={id} />
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
