import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Connection,
  MiniMap,
  NodeChange,
  ReactFlow,
  useNodesData,
  useNodesState,
  useReactFlow,
  useViewport,
} from "@xyflow/react";
import useContent from "../../state/useContent";
import useAppState from "../../state/useAppState";
import nodeTypes from "../../state/nodeTypes";
import edgeTypes from "../../state/edgeTypes";
import { useShallow } from "zustand/react/shallow";
import { NodeType } from "../../types/nodes";

const Canvas = () => {
  const {
    nodes,
    edges,
    setNodes,
    activeNodeId,
    activateNode,
    highlightedNodesId,
    onNodesChange,
    connectNodes,
    addNode,
  } = useContent(useShallow((store) => store));

  const { mode, setMode } = useAppState(
    useShallow((store) => ({ mode: store.mode, setMode: store.setMode }))
  );

  const vpRef = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const clickHandler = (e: React.MouseEvent) => {
    console.log("canvas bg click");
    activateNode(null);
    if (mode.current === "create" && mode.data) {
      const { clientX, clientY } = e;
      const position = screenToFlowPosition({ x: clientX, y: clientY });
      addNode(mode.data as NodeType, position);
      setMode("edit");
    }
  };

  return (
    <div id="workarea" className="overflow-hidden" onClick={clickHandler}>
      <ReactFlow
        ref={vpRef}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onConnect={connectNodes}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
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
