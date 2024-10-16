// Node with dinamic number of inputs to construct a new value from it

import React from "react";
import {
  ConstructorNode as ConstructorNodeType,
  NodeTag,
} from "../../types/nodes";
import { NodeProps } from "@xyflow/system";
import NodeWrapper from "./wrappers/NodeWrapper";
import LateXformula from "../LateXformula";
import generateHandleId from "../../utils/generateHandleId";
import Output from "../ports/Output";
import InputPort from "../ports/Input";
import useInputChange from "../../hooks/useInputChange";
import useContent from "../../state/useContent";
import { useShallow } from "zustand/react/shallow";
import ResultOutput from "../ports/ResultOutput";
import getValueType from "../../utils/getValueType";

const ConstructorNode = ({
  id,
  data: { tag, comment, numOfInputVars, inputs, outputs },
}: NodeProps<ConstructorNodeType>) => {
  const [setNumOfEntriesFor] = useContent(
    useShallow((store) => [store.setNumOfEntriesFor])
  );

  const [varNum, onVarChange] = useInputChange({
    initialValue: numOfInputVars,
    allowOnly: /[0-9]/,
  });

  const outputValue = useContent(
    useShallow((store) =>
      Object.entries(store.values).find(([label]) => label.includes(id + "."))
    )
  );
  const outputValueType = getValueType(outputValue ? outputValue[1] : null);

  const outputsEntries = Object.entries(outputs);
  const stepO = 100 / (outputsEntries.length + 1);
  const outputsHandleObjs = outputsEntries.map(([label, output], idx) => {
    const handleId = generateHandleId(id, label, output!.possibleValues);
    const cssPosition = `${stepO * (1 + idx)}%`;
    return { handleId, key: label, cssPosition };
  });

  const inputEntries = Object.entries(inputs);

  const stepI = 100 / (inputEntries.length + 1);
  const inputsHandleObjs = inputEntries.map(([label, input], idx) => {
    const handleId = generateHandleId(id, label, input!.allowedTypes);
    const cssPosition = `${stepI * (1 + idx)}%`;
    return { handleId, key: label, cssPosition };
  });

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    const newNum = parseInt(varNum);
    if (Number.isInteger(newNum) && newNum > 0) {
      setNumOfEntriesFor(id, newNum);
    }
  };

  console.log(outputValue);

  return (
    <NodeWrapper
      id={id}
      comment={comment ?? null}
      theme="mtx"
      outputValueTypes={outputsEntries[0][1]?.possibleValues}
      isDefined={outputValueType !== null}
    >
      <div className="p-1 px-2 pl-6 flex flex-col gap-1">
        <ResultOutput nodeId={id} />
        <form className="text-sm" onSubmit={submitHandler}>
          <label>
            <LateXformula value={"n="} />
          </label>
          <input
            value={varNum}
            onChange={onVarChange}
            className="px-1 w-[40px] bg-transparent border-b-gray border-b-solid border-b-[1px] nodrag"
          />
        </form>
        {inputsHandleObjs.map(({ handleId, cssPosition, key }) => (
          <InputPort
            key={key}
            id={handleId}
            cssPosition={cssPosition}
            label={key}
            showLabel
          />
        ))}
        {outputsHandleObjs.map(({ handleId, cssPosition, key }) => (
          <Output key={key} cssPosition={cssPosition} id={handleId} />
        ))}
        <ConstrNodeLabel tag={tag} numOfVars={numOfInputVars} />
      </div>
    </NodeWrapper>
  );
};

type pr = {
  tag: NodeTag;
  numOfVars: number;
};
const ConstrNodeLabel = ({ tag, numOfVars }: pr) => {
  let str = "";

  switch (tag) {
    case "vec": {
      str += "\\vec{v}=\\begin{pmatrix}";
      for (let i = 1; i <= numOfVars; i++) {
        str += "v_";
        str += i;
        if (i < numOfVars) {
          str += "\\\\";
        }
      }
      str += "\\end{pmatrix}";
      break;
    }
    case "mtx-rows": {
      str += "M=\\begin{bmatrix}";
      for (let i = 1; i <= numOfVars; i++) {
        str += `\\vec{v_${i}}`;
        if (i < numOfVars) {
          str += "\\\\";
        }
      }
      str += "\\end{bmatrix}";
      break;
    }
    case "mtx-cols": {
      str += "M=\\begin{bmatrix}";
      for (let i = 1; i <= numOfVars; i++) {
        str += `\\vec{v_${i}} `;
        if (i < numOfVars) {
          str += "\\ ";
        }
      }
      str += "\\end{bmatrix}";
    }
  }
  return <LateXformula value={str} />;
};

export default ConstructorNode;
