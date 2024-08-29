import { AppNode, TextSingleNode } from "../../types/nodes";
import { ContentStore } from "../../types/system";

type f = (
  nodeId: string,
  newValue: string,
  state: ContentStore
) => { nodes: AppNode[] };

const editTextValue: f = (nodeId, newValue, state) => {
  const nodes = state.nodes.map((node) => {
    if (node.type === "text-single" && node.id === nodeId) {
      return { ...node, data: { text: newValue } } as TextSingleNode;
    }
    return node;
  });

  return { nodes };
};

export default editTextValue;
