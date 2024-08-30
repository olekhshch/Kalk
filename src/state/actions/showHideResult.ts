import { AppNode, ExpressionNode, ResultNode } from "../../types/nodes";
import { NodeActionOutput } from "../../types/system";

type f = (
  show: boolean,
  sourceNodeId: string,
  nodes: AppNode[],
  idCounter: number
) => NodeActionOutput;

const showHideResult: f = (show, sourceNodeId, nodes, idCounter) => {
  const sourceNode = nodes.find((node) => node.id === sourceNodeId);

  if (!sourceNode || sourceNode.category !== "numbers") {
    return { newNode: null, nodes, idCounter };
  }

  const {
    position,
    data: { showResult },
  } = sourceNode as ExpressionNode;

  // SHOW

  if (show && !showResult) {
    const newId = idCounter + 1;

    //#TODO: Add async to create result node and alter nodes array?
    const resultNode: ResultNode = {
      id: newId.toString(),
      position: { x: position.x + 40, y: position.y - 20 },
      type: "result-number",
      data: { sourceNodeId },
    };

    const newNodes = nodes.map((node) => {
      if (node.id === sourceNodeId) {
        return {
          ...node,
          data: { ...node.data, showResult: true },
        } as ExpressionNode;
      }
      return node;
    });

    return {
      newNode: resultNode,
      nodes: [...newNodes, resultNode],
      idCounter: newId,
    };
  }

  // HIDE

  if (!show) {
    let alteredNode: ExpressionNode | null = null;

    const newNodes = nodes
      .filter(
        (node) =>
          node.type !== "result-number" &&
          (node as ResultNode).data.sourceNodeId !== sourceNodeId
      )
      .map((node) => {
        if (node.id === sourceNodeId && node.category === "numbers") {
          const newNode: ExpressionNode = {
            ...(node as ExpressionNode),
            data: { ...(node as ExpressionNode).data, showResult: false },
          };
          alteredNode = newNode;

          return newNode;
        }
        return node;
      });

    return { newNode: alteredNode, nodes: newNodes, idCounter };
  }

  return { newNode: null, nodes, idCounter };
};

export default showHideResult;
