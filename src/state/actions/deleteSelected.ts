import { NodeAction } from "../../types/app";

const deleteSelected: NodeAction = ({ nodes }) => {
  return { nodes: nodes.filter((node) => !node.selected) };
};

export default deleteSelected;
