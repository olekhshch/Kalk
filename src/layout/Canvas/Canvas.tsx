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
  const { nodes, setNodes } = useContent();

  const [allNodes, setAllNodes] = useState(nodes);

  // const nodesChangeHandler = useCallback((changes: NodeChange[]) => {
  //   const newNodes = applyNodeChanges(changes, nodes);
  //   setAllNodes(newNodes);
  // }, []);

  useEffect(() => {
    console.log(nodes);
    setNodes(nodes);
  }, [nodes.length]);

  const nodesChangeHandler = useCallback(
    (changes: NodeChange[]) => {
      const newNodes = applyNodeChanges(changes, nodes);
      setNodes(newNodes);
    },
    [nodes]
  );

  useEffect(() => console.log("CANVAS RERENDERED" + nodes.length));

  return (
    <div id="workarea" className="overflow-hidden">
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

  return <Background variant={grid_type} color="#94D2BD" />;
};

export default Canvas;
