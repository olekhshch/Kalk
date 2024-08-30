import { expect, test } from "vitest";
import createTextSingleNode from "../state/actions/createTextSingleNode";
import {
  AppNode,
  ExpressionNode,
  NodeType,
  ResultNode,
  TextSingleNode,
} from "../types/nodes";
import deleteNodeById from "../state/actions/deleteNodeById";
import createExpressionNode from "../state/actions/createExpressionNode";
import showHideResult from "../state/actions/showHideResult";

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
    case "text-single": {
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
    case "expression": {
      const { idCounter, newNode, nodes } = createExpressionNode({
        nodes: initialState.nodes,
        idCounter: initialState.idCounter,
      });
      if (updateState) {
        initialState.idCounter = idCounter;
        initialState.nodes = nodes;
      }
      return { newNode, nodes, idCounter } as {
        newNode: ExpressionNode;
        nodes: AppNode[];
        idCounter: number;
      };
    }
  }
};

test("Add node, idCounter only increases", () => {
  if (!createDefault) return;

  const { newNode, nodes, idCounter } = createDefault("text-single")!;

  expect(newNode !== null).toBe(true);
  expect(nodes.length).toBeGreaterThan(initialState.nodes.length);
  expect(idCounter).toBeGreaterThan(initialState.idCounter);

  initialState.idCounter = idCounter;
});

test("Add two notes, delete the last one from the state", () => {
  const idCounterBefore = initialState.idCounter;
  createDefault("text-single", true)!;
  const secondNodesObj = createDefault("text-single", true)!;

  expect(idCounterBefore).toBeLessThan(secondNodesObj.idCounter);
  expect(secondNodesObj.newNode.id).toBe((idCounterBefore + 2).toString());

  const deletedNodes = deleteNodeById({
    idCounter: initialState.idCounter,
    nodes: initialState.nodes,
    nodeIds: [secondNodesObj.newNode.id],
  });

  expect(deletedNodes.nodes.length).eq(initialState.nodes.length - 1);
  initialState.nodes = deletedNodes.nodes;
  expect(secondNodesObj.idCounter).eq(initialState.idCounter);
});

test("Clear state, add expression node, show and unhide it's result", () => {
  initialState.nodes = [];
  const idCounterBefore = initialState.idCounter;

  // Node creation
  const { newNode } = createDefault("expression", true)!;
  expect(newNode.id).eq((idCounterBefore + 1).toString());

  // Show result for added node
  const resultNodeObj = showHideResult(
    true,
    newNode.id,
    initialState.nodes,
    initialState.idCounter
  );

  expect(resultNodeObj.newNode !== null).toBe(true);
  expect(resultNodeObj.newNode!.type).toBe("result-number");

  const resNode = resultNodeObj.newNode as ResultNode;

  expect(resNode.data.sourceNodeId).toBe(newNode.id);
  expect(resultNodeObj.idCounter).toBe(initialState.idCounter + 1);

  const nodeWithShownResult = resultNodeObj.nodes.find(
    (node) => node.id === newNode.id
  );

  expect(nodeWithShownResult).toBeDefined();
  initialState.nodes = resultNodeObj.nodes;
  initialState.idCounter = resultNodeObj.idCounter;

  // hiding node's result

  const hideNodeObj = showHideResult(
    false,
    newNode.id,
    initialState.nodes,
    initialState.idCounter
  );

  expect(hideNodeObj.newNode !== null).toBe(true);
  expect(hideNodeObj.idCounter).eq(initialState.idCounter);
  expect(hideNodeObj.nodes.length).toBe(1);
  expect((hideNodeObj.newNode as ExpressionNode).data.showResult).toBe(false);

  initialState.idCounter = hideNodeObj.idCounter;
  initialState.nodes = hideNodeObj.nodes;
});

test("Add another expression node, show results for both, hide result for last one", () => {
  const idCounterBefore = initialState.idCounter;
  createDefault("expression", true);

  expect(initialState.nodes.length).eq(2);

  const [firstNode, secondNode] = initialState.nodes;

  const firstShowObj = showHideResult(
    true,
    firstNode.id,
    initialState.nodes,
    initialState.idCounter
  );
  const secondShowObj = showHideResult(
    true,
    secondNode.id,
    firstShowObj.nodes,
    firstShowObj.idCounter
  );

  expect(secondShowObj.nodes.length).toBe(4);

  initialState.nodes = secondShowObj.nodes;
  initialState.idCounter = secondShowObj.idCounter;

  // hiding result for the last one
  const { newNode, nodes, idCounter } = showHideResult(
    false,
    secondNode.id,
    initialState.nodes,
    initialState.idCounter
  );

  expect(idCounterBefore).lessThan(idCounter);
  expect(nodes.length).toBe(3);
  expect((newNode as ExpressionNode).data.showResult).toBe(false);
});
