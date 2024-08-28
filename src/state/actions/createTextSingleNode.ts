import { TextSingleNode } from "../../types/nodes";
import { ContentStore, CreateNodeAction } from "../../types/system";

const createTextSingleNode: CreateNodeAction = (
  state: ContentStore,
  position: { x: number; y: number }
) => {
  const id = state.idCounter + 1;
  const newNode: TextSingleNode = {
    id: id.toString(),
    position,
    type: "text-single",
    data: { text: "..." },
  };

  return {
    newNode,
    nodes: [...state.nodes, newNode],
    activeNodeId: id.toString(),
    idCounter: id,
  };
};

export default createTextSingleNode;
