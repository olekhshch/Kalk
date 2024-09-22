// constructor node for vectors

import { NodeProps } from "@xyflow/react";
import { VectorNode as VectorNodeType } from "../../types/nodes";
import NodeWrapper from "./NodeWrapper";
import React, { useEffect, useMemo } from "react";
import Latex from "react-latex-next";
import Output from "../ports/Output";
import generateHandleLabel from "../../utils/generateHandleId";
import InputPort from "../ports/Input";
import useContent from "../../state/useContent";
import { useShallow } from "zustand/react/shallow";
import useInputChange from "../../hooks/useInputChange";
import ResultOutput from "../ports/ResultOutput";

const VectorNode = ({
  id,
  data: { inputs, numberOfEntries, outputs, showResult },
}: NodeProps<VectorNodeType>) => {
  const [setNumOfEntriesFor] = useContent(
    useShallow((store) => [store.setNumOfEntriesFor])
  );

  const [entriesNum, changeHandler] = useInputChange({
    initialValue: numberOfEntries,
    allowOnly: /[0-9]/,
  });

  const entries = Object.entries(inputs);

  const entriesLabels = useMemo(() => {
    return entries.map(([key]) => key).join("\\\\");
  }, [numberOfEntries]);

  const outputLabel = generateHandleLabel("V", [outputs.V]);

  const inputLabels = useMemo(() => {
    const step = 100 / (entries.length + 1);

    return entries.map(([key, input], idx) => ({
      idLabel: generateHandleLabel(key, input.allowedTypes),
      key,
      css: `${step * (idx + 1)}%`,
    }));
  }, [numberOfEntries]);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    const newNum = parseInt(entriesNum);
    if (Number.isInteger(newNum)) {
      setNumOfEntriesFor(id, newNum);
    }
  };

  useEffect(() => console.log("VECTOR rerender"));

  return (
    <NodeWrapper id={id}>
      <div className="p-2 pl-6 flex flex-col gap-1">
        <ResultOutput nodeId={id} isShown={showResult} />
        {inputLabels.map((il) => {
          return (
            <InputPort
              key={il.key}
              id={il.idLabel}
              label={il.key}
              cssPosition={il.css}
              showLabel
            />
          );
        })}
        <form className="flex gap-1 text-xs" onSubmit={submitHandler}>
          <Latex>$n=$</Latex>
          <input
            value={entriesNum}
            onChange={changeHandler}
            className="border-b-2 w-[40px] nodrag"
          />
        </form>
        <Latex>
          $
          {`\\vec{v}_{1\\times n}=\\begin{pmatrix}${entriesLabels}\\end{pmatrix}`}
          $
        </Latex>
        <Output id={outputLabel} cssPosition="50%" />
      </div>
    </NodeWrapper>
  );
};

export default VectorNode;
