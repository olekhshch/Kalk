import {
  BaseEdge,
  EdgeProps,
  getBezierPath,
  getSimpleBezierPath,
  useInternalNode,
} from "@xyflow/react";
import React from "react";

// Flow Chart connection

// type props = {
//   id: string;
//   source: string;
//   target: string;
// };

const FlowChartEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
}: EdgeProps) => {
  // const sourceNode = useInternalNode(source);
  // const targetNode = useInternalNode(target);

  // if (!sourceNode || !targetNode) return null;

  const [path] = getSimpleBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge id={id} path={path} />
    </>
  );
};

export default FlowChartEdge;
