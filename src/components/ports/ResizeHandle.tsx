import { Handle, Position } from "@xyflow/react";

type props = {
  position: Position;
};
const ResizeHandle = ({ position }: props) => {
  return (
    <Handle
      position={position}
      type="source"
      isConnectable={false}
      style={{
        background: "var(--white)",
        borderRadius: 0,
        border: "1px solid var(--sec)",
        cursor: "col-resize",
      }}
    />
  );
};

export default ResizeHandle;
