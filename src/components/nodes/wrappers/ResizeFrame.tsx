import { NodeResizer } from "@xyflow/react";
import useContent from "../../../state/useContent";
import { useShallow } from "zustand/react/shallow";
import classNames from "classnames";

type props = {
  nodeId: string;
  children: React.ReactNode;
  minW?: number;
  minH?: number;
  w?: number;
  isActive?: boolean;
  className?: string;
};
const ResizeFrame = ({
  nodeId,
  children,
  minW,
  minH,
  isActive,
  className,
}: props) => {
  const setActive = useContent(useShallow((store) => store.activateNode));

  const minWidth = minW ?? 100;
  const minHeight = minH ?? 60;

  const clickHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActive(nodeId);
  };

  const twClass = classNames(className, "w-full h-full transition");
  return (
    <>
      <NodeResizer
        // minWidth={minWidth}
        // minHeight={minHeight}
        color={isActive ? "var(--main)" : "var(--sec)"}
      />
      <div onClick={clickHandler} className={twClass}>
        {children}
      </div>
    </>
  );
};

export default ResizeFrame;
