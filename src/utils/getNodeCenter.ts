import { AppNode } from "../types/nodes";

const getNodeCenter = (node: AppNode) => {
  return {
    x: node.position.x + node.measured!.width!,
    y: node.position.y + node.measured!.height!,
  };
};

export default getNodeCenter;
