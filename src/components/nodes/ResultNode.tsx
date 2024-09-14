import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import NodeWrapper from "./NodeWrapper";
import { ResultNode as ResultNodeType } from "../../types/nodes";
import Input from "../ports/Input";
import { addEdge, NodeProps, useEdgesState } from "@xyflow/react";
import useContent from "../../state/useContent";
import { getValue, values } from "../../state/values";
import { useShallow } from "zustand/react/shallow";

const ResultNode = ({ id, data: { sourceId } }: NodeProps<ResultNodeType>) => {
  const value = useContent(useShallow((store) => store.values[sourceId]));

  return (
    <>
      <Input />
      <NodeWrapper id={id}>
        <div className="p-2">{value ?? ""}</div>
      </NodeWrapper>
    </>
  );
};

export default React.memo(ResultNode);
