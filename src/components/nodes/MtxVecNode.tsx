import { useMemo } from "react";
import NodeWrapper from "./wrappers/NodeWrapper";
import { NodeProps } from "@xyflow/react";
import { MtxNode } from "../../types/nodes";
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
  data: { inputs, outputs, value, comment },
}: NodeProps<MtxNode>) => {
  // calculated value of an output
  const calculatedValue = useContent(
    useShallow((store) =>
      Object.entries(store.values).find(([label]) => label.includes(id + "."))
    )
  );
  const outputType = getValueType(calculatedValue ? calculatedValue[1] : null);

  const inputsArray = useMemo(() => {
    const entries = Object.entries(inputs);
    const step = 100 / (entries.length + 1);

    return entries.map(([key, input], idx) => {
      const handleId = generateHandleId(id, key, input!.allowedTypes);
      const cssPosition = `${step * (1 + idx)}%`;

      return { key, handleId, cssPosition };
    });
  }, []);

  const outputsEntries = Object.entries(outputs);
  const outputsArray = useMemo(() => {
    const step = 100 / (outputsEntries.length + 1);

    return outputsEntries.map(([key, output], idx) => {
      const handleId = generateHandleId(id, key, output!.possibleValues);
      const cssPosition = `${step * (1 + idx)}%`;

      return { key, handleId, cssPosition };
    });
  }, []);

  return (
    <NodeWrapper
      id={id}
      outputValueTypes={
        outputType ? [outputType] : outputsEntries[0][1]!.possibleValues
      }
      isDefined={outputType !== null}
      comment={comment ?? null}
      theme="mtx"
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
        <Latex>${value}$</Latex>
        {outputsArray.map(({ cssPosition, handleId, key }) => {
          return <Output key={key} id={handleId} cssPosition={cssPosition} />;
        })}
      </div>
    </NodeWrapper>
  );
};

export default MtxVecNode;
