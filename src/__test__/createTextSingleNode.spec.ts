import { test, expect } from "vitest";
import createTextSingleNode from "../state/actions/createTextSingleNode";

test("create node in empty state", () => {
  const { idCounter, nodes } = createTextSingleNode({
    nodes: [],
    idCounter: 0,
  });

  expect(idCounter).toBe(1);
  expect(nodes.length).toBe(1);
});

test("create node in empty state where previous nodes were removed", () => {
  const { idCounter, nodes } = createTextSingleNode({
    nodes: [],
    idCounter: 11,
  });

  expect(idCounter).toBe(12);
  expect(nodes.length).toBe(1);
});
