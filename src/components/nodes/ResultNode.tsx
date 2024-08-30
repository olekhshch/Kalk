import React from "react";
import NodeWrapper from "./NodeWrapper";
import { ResultNode as ResultNodeType } from "../../types/nodes";

const ResultNode = ({ id, data: { sourceNodeId } }: ResultNodeType) => {
  return (
    <NodeWrapper id="">
      <div>{id}</div>
    </NodeWrapper>
  );
};

export default ResultNode;
