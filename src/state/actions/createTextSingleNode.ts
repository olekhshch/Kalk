import { AppNode, TextSingleNode } from "../../types/nodes";
import { ContentStore, CreateNodeAction } from "../../types/app";

const createTextSingleNode: CreateNodeAction = (params) => {
  const { nodes, idCounter } = params;

  const id = idCounter + 1;
  const newNode: TextSingleNode = {
    id: id.toString(),
    category: "text",
    position: params.position ?? { x: 0, y: 0 },
    type: "text-single",
    data: { text: "" },
  };

  return {
    newNode,
    nodes: [...nodes, newNode],
    idCounter: id,
  };
};

export default createTextSingleNode;
