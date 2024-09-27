// recalculation of all nodes

import { Edge } from "@xyflow/react";
import { AppNode, NumberFunctionNode } from "../../types/nodes";
import { AngleFormat, CalculatedValues } from "../../types/app";
import getChainIdsFrom from "../getChainIdsFrom";
import recalculateChain from "./recalculateChain";

type f = (
  nodes: AppNode[],
  edges: Edge[],
  constValues: CalculatedValues,
  angleFormat: AngleFormat
) => Promise<CalculatedValues>;

const recalculateAll: f = async (nodes, edges, constValues, angleFormat) => {
  // looking for nodes that doesn't have any inputs to start from
  const startingNodes = nodes.filter(
    (node) =>
      !["text-single", "result", "constant"].includes(node.type!) &&
      Object.keys((node as NumberFunctionNode).data.inputs).length === 0
  );

  const chainsFrom = startingNodes.map((node) => getChainIdsFrom(node, edges));

  const pairedObj = separateByPairs(chainsFrom);

  const mergedChain = await mergeAllChains(pairedObj, 0);

  const newValues = recalculateChain(
    mergedChain,
    nodes,
    {},
    constValues,
    angleFormat
  );

  return newValues;
};

const mergeTwoChains = async (arr1: string[], arr2: string[]) => {
  const res: string[] = [];
  let lastIdxInArr2 = -1;

  for (let i = 0; i < arr1.length; ) {
    const val = arr1[i];

    const idxInArr2 = arr2.indexOf(val);

    if (idxInArr2 >= 0) {
      // arr2 includes this nodeId as well => slice part of it before this value
      const slice = arr2.slice(lastIdxInArr2 + 1, idxInArr2);
      res.push(...slice);
      lastIdxInArr2 = idxInArr2;
    }
    res.push(val);
    i++;
  }
  const remainingSlice = arr2.slice(lastIdxInArr2 + 1);
  res.push(...remainingSlice);

  return res;
};

type separatorFn<T> = (arr: T[][]) => { pairs: [T[], T[]][]; remaining: T[] };

const separateByPairs: separatorFn<string> = (array) => {
  const arrLength = array.length;

  const pairs: [string[], string[]][] = [];

  if (arrLength === 1) {
    return { pairs, remaining: array[0] };
  }

  let i = 0;
  const limit = arrLength % 2 === 0 ? arrLength : arrLength - 1;

  for (i; i < limit; ) {
    const pair = array.slice(i, i + 2) as [string[], string[]];
    pairs.push(pair);
    i += 2;
  }

  const remaining = array.slice(i)[0] ?? [];

  return { pairs, remaining };
};

type mergerFn = (
  params: {
    pairs: [string[], string[]][];
    remaining: string[];
  },
  i: number
) => Promise<string[]>;

const mergeAllChains: mergerFn = async ({ pairs, remaining }, i) => {
  console.log("MERGER " + i);

  console.log({ pairs, remaining });
  if (pairs.length === 0 || i > 10) {
    return remaining;
  }
  const mergedPairs = await Promise.all(
    pairs.map(([arr1, arr2]) => mergeTwoChains(arr1, arr2))
  );

  const newPairsObj = separateByPairs(
    remaining.length > 0 ? [...mergedPairs, remaining] : mergedPairs
  );

  return mergeAllChains(newPairsObj, i + 1);
};

export default recalculateAll;
