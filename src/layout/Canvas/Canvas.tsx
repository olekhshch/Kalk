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
} from "@xyflow/react";
import useContent from "../../state/useContent";
import useAppState from "../../state/useAppState";
import { NodeBase } from "@xyflow/system";
import nodeTypes from "../../state/nodeTypes";

const Canvas = () => {
  const { nodes, setNodes, activeNodeId } = useContent();

  // const [allNodes, setAllNodes] = useState(nodes);

  // const nodesChangeHandler = useCallback((changes: NodeChange[]) => {
  //   const newNodes = applyNodeChanges(changes, nodes);
  //   setAllNodes(newNodes);
  // }, []);

  // useEffect(() => {
  //   setNodes(nodes);
  // }, [nodes.length]);

  const nodesChangeHandler = useCallback(
    (changes: NodeChange[]) => {
      const newNodes = applyNodeChanges(changes, nodes);
      setNodes(newNodes);
    },
    [nodes]
  );

  const clickHandler = (e: React.MouseEvent) => {
    // setEditedNodeId(null);
    // e.stopPropagation();
  };

  useEffect(() => {
    console.log("CANVAS RERENDERED" + nodes.length);
    console.log({ activeNodeId });
  });

  return (
    <div id="workarea" className="overflow-hidden" onClick={clickHandler}>
      <ReactFlow
        nodes={nodes}
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
