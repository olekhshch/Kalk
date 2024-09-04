import React, { useEffect, useMemo } from "react";
import NodeWrapper from "./NodeWrapper";
import { ResultNode as ResultNodeType } from "../../types/nodes";
import Input from "../ports/Input";
import { addEdge, useEdgesState } from "@xyflow/react";
import useContent from "../../state/useContent";

const ResultNode = ({ id, data: { sourceNodeId } }: ResultNodeType) => {
  const { vars } = useContent();

  const res = vars[sourceNodeId];

  return (
    <>
      <Input />
      <NodeWrapper id={id}>
        <div>
          {sourceNodeId}: {res ? res : "N/A"}
        </div>
      </NodeWrapper>
    </>
  );
};

export default React.memo(ResultNode);
