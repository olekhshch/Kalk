import { useMemo } from "react";
import NodeWrapper from "./NodeWrapper";
import { NodeProps } from "@xyflow/react";
import { MtxVecFnNode } from "../../types/nodes";
import Latex from "react-latex-next";
import generateHandleId from "../../utils/generateHandleId";
import InputPort from "../ports/Input";
import ResultOutput from "../ports/ResultOutput";
import Output from "../ports/Output";

const MtxVecNode = ({
  id,
  data: { label, inputs, showResult, outputs },
}: NodeProps<MtxVecFnNode>) => {
  const inputsArray = useMemo(() => {
    const entries = Object.entries(inputs);
    const step = 100 / (entries.length + 1);

    return entries.map(([key, input], idx) => {
      const handleId = generateHandleId(key, input.allowedTypes);
      const cssPosition = `${step * (1 + idx)}%`;

      return { key, handleId, cssPosition };
    });
  }, []);

  const outputsArray = useMemo(() => {
    const entries = Object.entries(outputs);
    const step = 100 / (entries.length + 1);

    return entries.map(([key, output], idx) => {
      const handleId = generateHandleId(key, [output]);
      const cssPosition = `${step * (1 + idx)}%`;

      return { key, handleId, cssPosition };
    });
  }, []);

  return (
    <NodeWrapper id={id} outputValueType={"vector"}>
      <div className="p-2 pl-4">
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
        <Latex>${label}$</Latex>
        {outputsArray.map(({ cssPosition, handleId, key }) => {
          return <Output key={key} id={handleId} cssPosition={cssPosition} />;
        })}
      </div>
    </NodeWrapper>
  );
};

export default MtxVecNode;
