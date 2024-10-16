import { NodeProps } from "@xyflow/react";
import React from "react";
import { DeConstructorNode, NodeTag } from "../../types/nodes";
import NodeWrapper from "./wrappers/NodeWrapper";
import LateXformula from "../LateXformula";
import generateHandleId from "../../utils/generateHandleId";
import InputPort from "../ports/Input";
import Output from "../ports/Output";

const DeconstructorNode = ({
  id,
  data: { inputs, comment, tag, outputs },
}: NodeProps<DeConstructorNode>) => {
  const inputEntries = Object.entries(inputs);
  const stepI = 100 / (inputEntries.length + 1);

  const inputHandles = inputEntries.map(([label, input], idx) => {
    const handleId = generateHandleId(id, label, input!.allowedTypes);
    const cssPosition = `${stepI * (1 + idx)}%`;

    return { key: label, handleId, cssPosition };
  });

  const outputEntries = Object.entries(outputs);
  const stepO = 100 / (outputEntries.length + 1);

  const outputHandles = outputEntries.map(([label, output], idx) => {
    const handleId = generateHandleId(id, label, output!.possibleValues);
    const cssPosition = `${stepO * (1 + idx)}%`;

    return { key: label, handleId, cssPosition };
  });

  return (
    <NodeWrapper id={id} comment={comment ?? null} theme="red">
      <div className="p-2 pl-4">
        {inputHandles.map(({ cssPosition, handleId, key }) => (
          <InputPort
            id={handleId}
            key={key}
            cssPosition={cssPosition}
            label={key}
            showLabel
          />
        ))}
        <Label tag={tag} numOfOutputs={outputHandles.length} />
        {outputHandles.map(({ handleId, key, cssPosition }) => (
          <Output key={key} id={handleId} cssPosition={cssPosition} />
        ))}
      </div>
    </NodeWrapper>
  );
};

type p = {
  tag: NodeTag;
  numOfOutputs: number;
};
const Label = ({ tag, numOfOutputs }: p) => {
  let str = "";

  switch (tag) {
    case "entries-vec": {
      str += "\\vec{v} \\to";
      if (numOfOutputs < 1) {
        str += "\\dots";
      } else {
        str += "\\begin{matrix}";
        for (let i = 1; i <= numOfOutputs; i++) {
          str += `v_${i}`;
          if (i < numOfOutputs) {
            str += "\\\\";
          }
        }
        str += "\\end{matrix}";
      }
    }
  }

  return <LateXformula value={str} />;
};

export default DeconstructorNode;
