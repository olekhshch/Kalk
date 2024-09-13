import React, { useEffect, useMemo } from "react";
import NodeWrapper from "./NodeWrapper";
import { ResultNode as ResultNodeType } from "../../types/nodes";
import Input from "../ports/Input";
import { addEdge, NodeProps, useEdgesState } from "@xyflow/react";
import useContent from "../../state/useContent";

const ResultNode = ({ id, data: { sourceId } }: NodeProps<ResultNodeType>) => {
  const { vars } = useContent();

  const res = vars[sourceId];

  return (
    <>
      <Input />
      <NodeWrapper id={id}>
        <div className="p-2">{res ?? ""}</div>
      </NodeWrapper>
    </>
  );
};

export default React.memo(ResultNode);
