import { useMemo } from "react";
import NodeWrapper from "./NodeWrapper";
import { NodeProps } from "@xyflow/react";
import { MtxVecFnNode } from "../../types/nodes";
import Latex from "react-latex-next";
import generateHandleId from "../../utils/generateHandleId";
import InputPort from "../ports/Input";
import ResultOutput from "../ports/ResultOutput";
import Output from "../ports/Output";
import useContent from "../../state/useContent";
import getValueType from "../../utils/getValueType";
import { useShallow } from "zustand/react/shallow";

const MtxVecNode = ({
  id,
  data: { label, inputs, showResult, outputs, comment },
}: NodeProps<MtxVecFnNode>) => {
  // calculated value of an output
  const calculatedValue = useContent(useShallow((store) => store.values[id]));
  const outputType = getValueType(calculatedValue);

  const inputsArray = useMemo(() => {
    const entries = Object.entries(inputs);
    const step = 100 / (entries.length + 1);

    return entries.map(([key, input], idx) => {
      const handleId = generateHandleId(id, key, input.allowedTypes);
      const cssPosition = `${step * (1 + idx)}%`;

      return { key, handleId, cssPosition };
    });
  }, []);

  const outputsEntries = Object.entries(outputs);
  const outputsArray = useMemo(() => {
    const step = 100 / (outputsEntries.length + 1);

    return outputsEntries.map(([key, output], idx) => {
      const handleId = generateHandleId(id, key, output.possibleValues);
      const cssPosition = `${step * (1 + idx)}%`;

      return { key, handleId, cssPosition };
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
      <div className="p-2 pl-4">
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
        <Latex>${label}$</Latex>
        {outputsArray.map(({ cssPosition, handleId, key }) => {
          return <Output key={key} id={handleId} cssPosition={cssPosition} />;
        })}
      </div>
    </NodeWrapper>
  );
};

export default MtxVecNode;
