// constructs matrix from row vectors

import { NodeProps } from "@xyflow/react";
import { MtxFromRowsNode } from "../../types/nodes";
import NodeWrapper from "./NodeWrapper";
import { useEffect } from "react";
import ResultOutput from "../ports/ResultOutput";
import Latex from "react-latex-next";
import useInputChange from "../../hooks/useInputChange";
import useContent from "../../state/useContent";
import { useShallow } from "zustand/react/shallow";
import generateHandleId from "../../utils/generateHandleId";
import Output from "../ports/Output";
import InputPort from "../ports/Input";

const MtxRowsNode = ({
  id,
  data: { inputs, numberOfEntries, showResult, outputs },
}: NodeProps<MtxFromRowsNode>) => {
  const [setNumOfEntriesFor] = useContent(
    useShallow((store) => [store.setNumOfEntriesFor])
  );

  useEffect(() => console.log({ numberOfEntries }), [numberOfEntries]);

  const outputHandleId = generateHandleId("M", [outputs.M]);

  const entries = Object.entries(inputs);
  const step = 100 / (entries.length + 1);

  const entriesLabels = entries.map(([key]) => key).join("\\\\");

  const [entriesNum, onChange] = useInputChange({
    initialValue: numberOfEntries,
    allowOnly: /[0-9]/,
  });

  const inputLabels = entries.map(([key, input], idx) => {
    return {
      key,
      handleId: generateHandleId(key, input.allowedTypes),
      cssPosition: `${step * (1 + idx)}%`,
    };
  });

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    const newNumOfEntries = parseInt(entriesNum);

    if (Number.isInteger(newNumOfEntries)) {
      setNumOfEntriesFor(id, newNumOfEntries);
    }
  };

  useEffect(() => console.log("MTX ROWS rerender"));

  return (
    <NodeWrapper id={id}>
      <div className="p-2 pl-6 flex flex-col gap-1">
        <ResultOutput nodeId={id} isShown={showResult} />
        {inputLabels.map(({ cssPosition, handleId, key }) => {
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
        <form className="flex gap-1 text-xs" onSubmit={submitHandler}>
          <Latex>$n=$</Latex>
          <input
            className="nodrag w-[40px]"
            value={entriesNum}
            onChange={onChange}
          />
        </form>
        <Latex>${`M=\\begin{bmatrix}${entriesLabels} \\end{bmatrix}`}$</Latex>
        <Output id={outputHandleId} cssPosition="50%" />
      </div>
    </NodeWrapper>
  );
};

export default MtxRowsNode;
