import { Handle, Position } from "@xyflow/react";

type props = {
  label: string;
  id: string;
  style: {
    background?: string;
    border?: string;
    top?: string;
    bottom?: string;
  };
};

const PlotInput = ({ style, label, id }: props) => {
  return (
    <Handle
      position={Position.Left}
      id={id}
      type="target"
      style={{
        width: "8px",
        height: "8px",
        position: "relative",
        ...style,
        background: style.background ?? "var(--white)",
      }}
    >
      <span className="absolute left-[12px] top-[-10px]">{label}</span>
    </Handle>
  );
};

export default PlotInput;
