import { AppNode, ExpressionNode, ResultNode, MathNode } from "../types/nodes";
import { NodeActionOutput } from "../types/system";

type f = (
  show: boolean,
  sourceNodeId: string,
  nodes: AppNode[],
  id: number
) => NodeActionOutput;

const showHideResult: f = (show, sourceNodeId, nodes, id) => {
  const sourceNode = nodes.find((node) => node.id === sourceNodeId);

  if (!sourceNode) {
    return { newNode: null, nodes, idCounter: id };
  }

  const {
    position,
    data: { showResult },
    measured,
  } = sourceNode as MathNode;
  // SHOW

  if (show && !showResult) {
    const nodeId = id.toString();
    const distanceX = !measured
      ? 60
      : measured.width
      ? measured.width + 40
      : 60;

    //#TODO: Add async to create result node and alter nodes array?
    const resultNode: ResultNode = {
      id: nodeId,
      position: { x: position.x + distanceX, y: position.y - 40 },
      type: "result",
      data: { sourceId: sourceNodeId, value: "" },
    };

    const newNodes = nodes.map((node) => {
      if (node.id === sourceNodeId) {
        return {
          ...node,
          data: { ...node.data, showResult: true },
        } as MathNode;
      }
      return node;
    });

    return {
      newNode: resultNode,
      nodes: [...newNodes, resultNode],
      idCounter: id,
    };
  }

  // HIDE

  if (!show) {
    let alteredNode: MathNode | null = null;

    const newNodes = nodes.reduce((acc, node) => {
      if (node.type === "result" && node.data.sourceId === sourceNodeId) {
        return acc;
      }

      if (node.id === sourceNodeId) {
        const targetNode = node as ExpressionNode;
        const newNode: ExpressionNode = {
          ...targetNode,
          data: { ...targetNode.data, showResult: false },
        };
        alteredNode = newNode;
        acc.push(newNode);
        return acc;
      }

      acc.push(node);

      return acc;
    }, [] as AppNode[]);

    return { newNode: alteredNode, nodes: newNodes, idCounter: id };
  }

  return { newNode: null, nodes, idCounter: id };
};

export default showHideResult;
