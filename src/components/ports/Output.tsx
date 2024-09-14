import { Handle, Position } from "@xyflow/react";

type props = {
  id: string;
};

const Output = ({ id }: props) => {
  return (
    <Handle
      id={id}
      position={Position.Right}
      type="source"
      style={{ backgroundColor: "var(--white)", borderColor: "var(--sec)" }}
    />
  );
};

export default Output;
