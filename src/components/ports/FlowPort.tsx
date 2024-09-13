import { Handle, Position } from "@xyflow/react";
import React from "react";

type props = {
  id: string;
  position: Position;
};

const FlowPort = ({ id, position }: props) => {
  return (
    <Handle
      id={id}
      position={position}
      type="source"
      isConnectableEnd
      style={{
        background: "grey",
        transform: "translate(-4px,-12px)",
        width: "8px",
        height: "8px",
      }}
    />
  );
};

export default FlowPort;
