import { NodeAction } from "../../types/system";

const deleteSelected: NodeAction = ({ nodes }) => {
  return { nodes: nodes.filter((node) => !node.selected) };
};

export default deleteSelected;
