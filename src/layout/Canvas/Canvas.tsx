import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  applyNodeChanges,
  Background,
  BackgroundVariant,
  MiniMap,
  NodeChange,
  ReactFlow,
  useNodesData,
  useNodesState,
  useViewport,
} from "@xyflow/react";
import useContent from "../../state/useContent";
import useAppState from "../../state/useAppState";
import { NodeBase } from "@xyflow/system";
import nodeTypes from "../../state/nodeTypes";

const Canvas = () => {
  const {
    nodes,
    edges,
    setNodes,
    activeNodeId,
    activateNode,
    highlightedNodesId,
  } = useContent();

  const nodesChangeHandler = useCallback(
    (changes: NodeChange[]) => {
      const newNodes = applyNodeChanges(changes, nodes);
      setNodes(newNodes);
    },
    [nodes]
  );

  const clickHandler = () => {
    console.log("canvas bg click");
    activateNode(null);
  };

  useEffect(() => {
    console.log("CANVAS RERENDERED" + nodes.length);
    console.log({ activeNodeId, highlightedNodesId });
  });

  return (
    <div id="workarea" className="overflow-hidden" onClick={clickHandler}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={nodesChangeHandler}
        nodeTypes={nodeTypes}
      >
        <BackgroundWrapper />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

// bg-wrapper to avoid whole canvas rerenders
const BackgroundWrapper = () => {
  const { grid_type } = useAppState();

  return <Background variant={grid_type} color="#94D2BD" bgColor="#F0F4F8" />;
};

export default Canvas;
