import { Handle, Position } from "@xyflow/react";
import React from "react";
import useContent from "../../state/useContent";

type props = {
  nodeId: string;
  isShown: boolean;
};

const ResultOutput = ({ nodeId, isShown }: props) => {
  const { showResultFor, hideResultFor } = useContent();

  const clickHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("result click");
    isShown ? hideResultFor(nodeId) : showResultFor(nodeId);
  };

  return (
    <Handle
      id="res"
      type="source"
      position={Position.Right}
      className="hover-main absolute z-10"
      title="Show result"
      style={{
        background: "var(--white)",
        top: 0,
        width: "12px",
        height: "12px",
        borderColor: "var(--sec)",
        cursor: "pointer",
        lineHeight: 0.8,
        fontSize: "10px",
        color: "var(--sec)",
        textAlign: "center",
        fontWeight: "bolder",
        // verticalAlign: "center",
      }}
      onClick={clickHandler}
    >
      =
    </Handle>
  );
};

export default React.memo(ResultOutput);
