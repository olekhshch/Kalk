import { Position } from "@xyflow/react";
import { AppNode } from "../types/nodes";
import getNodeCenter from "./getNodeCenter";

// functions to update coordinates of floatchart edges depending on it's nodes positions
const getEdgeParams = () => {};

function getParams(nodeA: AppNode, nodeB: AppNode) {
  const centerA = getNodeCenter(nodeA);
  const centerB = getNodeCenter(nodeB);

  const horizontalDiff = Math.abs(centerA.x - centerB.x);
  const verticalDiff = Math.abs(centerA.y - centerB.y);

  let position = Position.Bottom;

  // when the horizontal difference between the nodes is bigger, we use Position.Left or Position.Right for the handle
  if (horizontalDiff > verticalDiff) {
    position = centerA.x > centerB.x ? Position.Left : Position.Right;
  } else {
    // here the vertical difference between the nodes is bigger, so we use Position.Top or Position.Bottom for the handle
    position = centerA.y > centerB.y ? Position.Top : Position.Bottom;
  }
}

function getHandleCoordsByPosition(node: AppNode, handlePosition: Position) {}

export default getEdgeParams;
