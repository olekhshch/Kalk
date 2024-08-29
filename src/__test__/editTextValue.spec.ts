import { expect, test } from "vitest";
import editTextValue from "../state/actions/editTextValue";
import { AppNode, TextSingleNode } from "../types/nodes";

const initialNodes: AppNode[] = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    type: "text-single",
    data: { text: "text value" },
  } as TextSingleNode,
  {
    id: "3",
    position: { x: 10, y: 20 },
    type: "text-single",
    data: { text: "text value" },
  },
];

test("Edit value, node exist in state", () => {
  const newValue = "edited value";
  const { newNode, nodes } = editTextValue("1", "edited value", initialNodes);

  expect(newNode !== null).toBe(true);
  expect(nodes.length).toBe(initialNodes.length);
  expect(newNode?.data.text).toBe(newValue);
});

test("Node with this ID doesn't exist in the state", () => {
  const { newNode, nodes } = editTextValue("211", "edited", initialNodes);

  expect(newNode).toBe(null);
  expect(nodes.length).toBe(initialNodes.length);
});

test("Passed id doesn't belong to a text-node => no changes", () => {
  const additionalNode = {
    id: "7",
    position: { x: 110, y: 201 },
    data: { text: "not a text node" },
  };
  const { newNode, nodes } = editTextValue("7", "text node", [
    ...initialNodes,
    additionalNode,
  ]);

  const targetNode = nodes.find((node) => node.id === "7") as TextSingleNode;

  expect(newNode).toBe(null);
  expect(targetNode).toBeDefined();
  expect(additionalNode.data.text).toBe(targetNode.data.text);
});
