import { Handle, Position } from "@xyflow/react";
import React from "react";

const Input = () => {
  return (
    <Handle
      position={Position.Left}
      type="target"
      isConnectableStart={false}
      style={{ backgroundColor: "var(--white)", borderColor: "var(--sec)" }}
    />
  );
};

export default Input;
