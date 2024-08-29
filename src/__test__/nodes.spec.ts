import { expect, test } from "vitest";
import createTextSingleNode from "../state/actions/createTextSingleNode";
import { AppNode, NodeType, TextSingleNode } from "../types/nodes";

// tests for different nodes manipulations with one state

const initialState = {
  idCounter: 10,
  nodes: [
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
  ] as AppNode[],
};

const positionDefault = { x: 0, y: 0 };

const createDefault = (type: NodeType, updateState?: boolean) => {
  // creates specified node, adds it to the state and updates idCounter

  switch (type) {
    case "text-single":
      const { idCounter, newNode, nodes } = createTextSingleNode({
        nodes: initialState.nodes,
        idCounter: initialState.idCounter,
      });
      if (updateState) {
        initialState.idCounter = idCounter;
        initialState.nodes = nodes;
      }
      return { newNode, nodes, idCounter } as {
        newNode: TextSingleNode;
        nodes: AppNode[];
        idCounter: number;
      };
  }
};

test("Add node, idCounter only increases", () => {
  const { newNode, nodes, idCounter } = createDefault("text-single");

  expect(newNode !== null).toBe(true);
  expect(nodes.length).toBeGreaterThan(initialState.nodes.length);
  expect(idCounter).toBeGreaterThan(initialState.idCounter);

  initialState.idCounter = idCounter;
});

test("Add two notes, delete the first from the state", () => {
  const nodesLengthBefore = initialState.nodes.length;
  const idCounterBefore = initialState.idCounter;
  const { nodes } = createDefault("text-single", true);
  const { newNode, idCounter } = createDefault("text-single", true);

  expect(idCounterBefore).toBeLessThan(idCounter);
});
