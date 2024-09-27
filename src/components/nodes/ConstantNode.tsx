// Node which refer to one of the constants in the project

import { NodeProps } from "@xyflow/react";
import React from "react";
import { ConstantNode as ConstantNodeType } from "../../types/nodes";
import NodeWrapper from "./NodeWrapper";
import useContent from "../../state/useContent";
import { useShallow } from "zustand/react/shallow";
import LateXformula from "../LateXformula";
import Output from "../ports/Output";
import generateHandleId from "../../utils/generateHandleId";
import ResultOutput from "../ports/ResultOutput";

export const ConstantNode = ({
  id,
  data: { comment, constId },
}: NodeProps<ConstantNodeType>) => {
  const constObj = useContent(
    useShallow((store) =>
      store.constants.find((constant) => constant.id === constId)
    )
  );

  const outputParams = {
    cssPosition: "50%",
    key: "N",
    id: generateHandleId(
      id,
      "CONST",
      constObj?.valueType ? [constObj.valueType] : ["number"]
    ),
  };

  return (
    <NodeWrapper id={id} comment={comment ?? null}>
      <div className="px-2">
        <ResultOutput nodeId={id} />
        {constObj ? (
          <LateXformula value={constObj.viewLabel} />
        ) : (
          <p>Not found</p>
        )}
        <Output cssPosition={outputParams.cssPosition} id={outputParams.id} />
      </div>
    </NodeWrapper>
  );
};
