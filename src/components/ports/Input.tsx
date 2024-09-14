import { Handle, Position } from "@xyflow/react";

type props = {
  id: string;
  label: string;
  showLabel?: boolean;
  cssPosition: string;
};
const InputPort = ({ id, label, cssPosition, showLabel }: props) => {
  return (
    <Handle
      id={id}
      position={Position.Left}
      type="target"
      style={{
        backgroundColor: "var(--white)",
        borderColor: "var(--sec)",
        top: cssPosition,
      }}
    >
      {showLabel && (
        <span className="text-xs relative top-[-14px] left-[8px]">{label}</span>
      )}
    </Handle>
  );
};

export default InputPort;
