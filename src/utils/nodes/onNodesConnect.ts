// util that fires while attempting to connect 2 nodes

import { Connection } from "@xyflow/react";
import { deconstructHandleId } from "../generateHandleId";
import isConnectable from "../edges/isConnectable";
import {
  AppNode,
  NodePurpose,
  PlotEquation,
  PlotNode,
} from "../../types/nodes";
import getById from "../getById";
import addEquation from "../plots/addEquation";
import { CalculatedValues } from "../../types/app";
import connectNodes from "../connectNodes";
import { AppEdge } from "../../types/edges";
import replaceNode from "../replaseNode";
import getChainIdsTo from "../getChainIdsTo";
import makeValueId from "../makeValueId";

type f = (args: {
  connection: Connection;
  nodes: AppNode[];
  values: CalculatedValues;
  edges: AppEdge[];
  edgeCounter: number;
}) => Promise<{
  nodes: AppNode[];
  edges: AppEdge[];
  edgeCounter: number;
  nodeA: AppNode;
  nodeB: AppNode;
  recalculate: boolean;
} | null>;

const onNodesConnect: f = async ({
  connection,
  nodes,
  values,
  edges,
  edgeCounter,
}) => {
  const { source, sourceHandle, target, targetHandle } = connection;
  // checking if handle labels specified
  if (!sourceHandle || !targetHandle) return null;

  // checking if target is not a result node
  if (targetHandle === "R") return null;

  // checking if not connecting to the same node
  if (target === source) return null;

  // checking if possible value of the source = allowed value of the target input
  const sourceHandleObj = deconstructHandleId(sourceHandle);
  const targetHandleObj = deconstructHandleId(targetHandle);

  if (!sourceHandleObj || !targetHandleObj) return null;

  if (
    !isConnectable(sourceHandleObj.allowedTypes, targetHandleObj.allowedTypes)
  )
    return null;

  let edgeCount = edgeCounter;

  const [nodeA, nodeB] = (await Promise.all([
    getById(nodes, source)[0],
    getById(nodes, target)[0],
  ])) as [AppNode, AppNode];

  // checking if action should be performed on connect instead of a regular connection
  const targetActionName = targetHandleObj.action;
  console.log({ targetActionName });

  switch (targetActionName) {
    case "addEq": {
      // target node should be a PlotNode
      if (nodeB.type !== "plot") return null;
      const valId = makeValueId(nodeA.id, sourceHandleObj.outputLabel);

      const passedValue = values[valId];

      const newPlotNodeData = addEquation(nodeB, passedValue, valId);

      if (!newPlotNodeData) return null;

      const eqs: PlotEquation[] = [newPlotNodeData.eq];

      const newPlotNode: PlotNode = {
        id: nodeB.id,
        position: nodeB.position,
        type: nodeB.type,
        data: {
          purpose: NodePurpose.PLOT,
          value: nodeB.data.value,
          inputs: { ...newPlotNodeData.node.data.inputs },
          outputs: { ...newPlotNodeData.node.data.outputs },
          tag: nodeB.data.tag,
          equations: eqs.map((eq) => {
            if (eq.type === "function") {
              return { ...eq, fn: eq.fn };
            }
            return eq;
          }),
        },
      };

      edgeCount += 1;
      const newEdgesData = connectNodes({
        sourceId: source,
        targetId: target,
        edges,
        edgeId: edgeCount.toString(),
        targetHandle: newPlotNodeData.inputId,
        sourceHandle,
      });

      const newNodes = replaceNode(newPlotNode, nodes);

      return {
        nodes: newNodes,
        edges: newEdgesData.edges,
        edgeCounter: edgeCount,
        nodeA,
        nodeB,
        recalculate: false,
      };
    }
    default: {
      // no action => regular connection

      // checking if not connecting into loop
      const chainTo = getChainIdsTo(nodeA, edges);
      if (chainTo.includes(target)) {
        //#TODO: Warning for user
        console.log("Chain includes target LOOP");
        console.log({ chainTo, target });
        return null;
      }

      edgeCount += 1;
      const targetInput = nodeB.data.inputs[targetHandleObj.outputLabel];

      if (!targetInput) {
        console.log(
          "Can't connect: Target " +
            nodeB.id +
            " doesn't have input " +
            targetHandleObj.outputLabel
        );
        return null;
      }

      // checking if input is connected to other node - if true then replases the edge
      const cleanEdges = edges.filter(
        (edge) => edge.targetHandle !== targetHandle
      );
      const newEdges = connectNodes({
        sourceId: nodeA.id,
        targetId: nodeB.id,
        edges: cleanEdges,
        edgeId: edgeCount.toString(),
        sourceHandle,
        targetHandle,
      }).edges;

      // if passed value is app's contant - reference const instead of connected node
      const isSourceConst = nodeA.type === "constant";

      targetInput.valueId = isSourceConst
        ? sourceHandleObj.outputLabel
        : sourceHandleObj.label;

      const newNodes = replaceNode(nodeB, nodes);

      // recalculates chain
      // const chain = getChainIdsFrom(nodeB, newEdges);
      // const calcRes = await recalculateChain(
      //   chain,
      //   newNodes,
      //   values,
      //   angleFormat
      // );

      // if (calcRes.nodesToReplace.length > 0) {
      //   // #TODO: Rewrite util to accept multiple nodes
      //   // let newNodes0: AppNode[] = newNodes;
      //   calcRes.nodesToReplace.forEach(
      //     (node) => (newNodes = replaceNode(node, newNodes))
      //   );
      // }

      return {
        nodes: newNodes,
        edges: newEdges,
        edgeCounter: edgeCount,
        nodeA,
        nodeB,
        recalculate: true,
      };
    }
  }
};

export default onNodesConnect;
