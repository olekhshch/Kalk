import React, { useEffect } from "react";
import NodeWrapper from "./NodeWrapper";
import { ResultNode as ResultNodeType } from "../../types/nodes";
import Input from "../ports/Input";
import { addEdge, useEdgesState } from "@xyflow/react";
import useContent from "../../state/useContent";

const ResultNode = ({ id, data: { sourceNodeId } }: ResultNodeType) => {
  const { connectNodes } = useContent();

  return (
    <>
      <Input />
      <NodeWrapper id={id}>
        <div>
          {id} / {sourceNodeId}
        </div>
      </NodeWrapper>
    </>
  );
};

export default React.memo(ResultNode);
