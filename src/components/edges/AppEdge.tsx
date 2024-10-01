// basic edge which connects inputs and outputs of the nodes

import { BaseEdge, EdgeProps, getSimpleBezierPath } from "@xyflow/react";
import { AppEdge as AppEdgeType } from "../../types/edges";

const AppEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
}: EdgeProps<AppEdgeType>) => {
  const [edgePath] = getSimpleBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  return <BaseEdge id={id} path={edgePath}></BaseEdge>;
};

export default AppEdge;
