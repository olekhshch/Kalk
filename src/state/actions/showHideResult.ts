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

  if (!sourceNode) {
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
      data: { sourceId: sourceNodeId, value: "" },
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

    const newNodes = nodes.reduce((acc, node) => {
      if (
        node.type === "result-number" &&
        node.data.sourceId === sourceNodeId
      ) {
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

    return { newNode: alteredNode, nodes: newNodes, idCounter };
  }

  return { newNode: null, nodes, idCounter };
};

export default showHideResult;
