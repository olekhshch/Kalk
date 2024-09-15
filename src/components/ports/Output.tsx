import { Handle, Position } from "@xyflow/react";

type props = {
  id: string;
  cssPosition: string;
};

const Output = ({ id, cssPosition }: props) => {
  return (
    <Handle
      id={id}
      position={Position.Right}
      type="source"
      style={{
        backgroundColor: "var(--white)",
        borderColor: "var(--sec)",
        top: cssPosition,
      }}
    />
  );
};

export default Output;
