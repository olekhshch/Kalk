import { Handle, Position, XYPosition } from "@xyflow/react";
import React from "react";
import useContent from "../../state/useContent";

type props = {
  nodeId: string;
  isShown: boolean;
};

const ResultOutput = ({ nodeId, isShown }: props) => {
  const { showResultFor, hideResultFor } = useContent();
  console.log({ isShown });

  const clickHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    isShown ? hideResultFor(nodeId) : showResultFor(nodeId);
  };

  return (
    <Handle
      id="res"
      type="source"
      position={Position.Right}
      className="hover-main"
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

export default ResultOutput;
