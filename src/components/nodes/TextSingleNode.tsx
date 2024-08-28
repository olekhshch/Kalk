import React, { useCallback, useEffect, useState } from "react";
import NodeWrapper from "./NodeWrapper";
import { applyNodeChanges, NodeProps } from "@xyflow/react";
import { AppNode, TextSingleNode as TextSingle } from "../../types/nodes";
import useContent from "../../state/useContent";
import useInputChange from "../../hooks/useInputChange";

const TextSingleNode = ({
  data: { text },
  id,
}: NodeProps<TextSingle & AppNode>) => {
  const { activateNode, nodes } = useContent();
  console.log({ text, nodes });
  const [currentText, onChange] = useInputChange({ initialValue: text });

  const formSubmitHandler = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log(currentText);
  }, []);

  return (
    <NodeWrapper id={id}>
      <div className="py-2 px-3">
        <span>{text}</span>
      </div>
    </NodeWrapper>
  );
};

export default TextSingleNode;
