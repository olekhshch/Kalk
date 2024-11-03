import { ConstructorNode, NodeInput } from "../../types/nodes";
import { AppEdge } from "../../types/edges";
import generateHandleId from "../generateHandleId";

// changes number of entries for constructor nodes (e.g. number of row vectors in matrix constructor)
type f = (
  node: ConstructorNode,
  newNum: number,
  edges: AppEdge[]
) => { newNode: ConstructorNode; newEdges: AppEdge[] };

const setNumOfEntries: f = (node, n, edges) => {
  const { allowedVariableTypes, numOfInputVars, inputLabelTemplate, inputs } =
    node.data;

  if (n === numOfInputVars) return { newNode: node, newEdges: edges };

  const newNode = { ...node };
  newNode.data.numOfInputVars = n;
  // === ADDING NEW INPUTS ====
  if (n > numOfInputVars) {
    for (let i = numOfInputVars + 1; i <= n; i++) {
      const label = inputLabelTemplate(i);
      const newInput: NodeInput = {
        label,
        allowedTypes: allowedVariableTypes,
        valueId: null,
      };
      newNode.data.inputs.push(newInput);
    }
    return { newNode: node, newEdges: edges };
  }

  // === REMOVING EXISTING ENTRIES AND INPUTS ====

  if (n < numOfInputVars) {
    let newEdges = [...edges];
    let newInputs: NodeInput[] = [...inputs];

    for (let i = numOfInputVars; i > n; i--) {
      const labelToRemove = inputLabelTemplate(i);
      newInputs = newInputs.filter(({ label, allowedTypes }) => {
        if (label === labelToRemove) {
          const handleId = generateHandleId(node.id, label, allowedTypes);
          newEdges = newEdges.filter(
            ({ target, targetHandle }) =>
              !(targetHandle === handleId && target === node.id)
          );
        }
        return label !== labelToRemove;
      });
    }

    const newNode = { ...node };
    newNode.data.inputs = newInputs;
    // newNode.data.numOfInputVars = n;

    return { newNode, newEdges };
  }

  return { newNode: node, newEdges: edges };
};

export default setNumOfEntries;
