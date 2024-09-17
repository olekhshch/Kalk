import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Background,
  MiniMap,
  Panel,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";
import useContent from "../../state/useContent";
import useAppState from "../../state/useAppState";
import nodeTypes from "../../state/nodeTypes";
import edgeTypes from "../../state/edgeTypes";
import { useShallow } from "zustand/react/shallow";
import { NodeType } from "../../types/nodes";
import { PreviewNode } from "../../components/NodePreview";

const Canvas = () => {
  const { nodes, edges, activateNode, onNodesChange, connectNodes, addNode } =
    useContent(useShallow((store) => store));

  const { mode, setMode, minimap } = useAppState(
    useShallow((store) => ({
      mode: store.mode,
      setMode: store.setMode,
      minimap: store.minimap,
    }))
  );

  const [shift, setShift] = useState(false);

  const vpRef = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const [prevPosition, setPrevPosition] = useState({ x: 0, y: 0 });

  const nodePreview = useMemo(() => {
    const node: PreviewNode = {
      id: "preview",
      type: "preview",

      data: {},
      position: prevPosition,
    };

    return node;
  }, [prevPosition]);

  const [showPreview, setShowPreview] = useState(true);

  const mouseEnterHandler = () => {
    // checks if preview should be visible
    setShowPreview(mode.current === "create");
  };

  const mouseLeaveHandler = () => {
    // hides preview when mouse leaves canvas
    setShowPreview(false);
  };

  useEffect(() => {
    if (mode.current !== "create") {
      setShowPreview(false);
    }
  }, [mode.current]);

  const clickHandler = (e: React.MouseEvent) => {
    console.log("canvas bg click");
    activateNode(null);

    if (mode.current === "create" && mode.data) {
      const { clientX, clientY } = e;
      const position = screenToFlowPosition({ x: clientX, y: clientY });
      addNode(mode.data as NodeType, position);
      console.log({ shift });
      if (!shift) {
        setMode("edit");
      }
    }
  };

  const mouseMoveHandler = (e: React.MouseEvent) => {
    if (mode.current !== "create") return;

    const { clientX, clientY } = e;
    const position = screenToFlowPosition({ x: clientX, y: clientY });

    setPrevPosition(position);
  };

  const allNodes = showPreview ? [...nodes, nodePreview] : nodes;

  return (
    <div id="workarea" className="overflow-hidden" onClick={clickHandler}>
      <ReactFlow
        ref={vpRef}
        nodes={allNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onConnect={connectNodes}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onMouseMove={mouseMoveHandler}
        onMouseEnter={mouseEnterHandler}
        onMouseLeave={mouseLeaveHandler}
      >
        <ValuesPanel />
        <BackgroundWrapper />
        {minimap && <MiniMap />}
      </ReactFlow>
    </div>
  );
};

// bg-wrapper to avoid whole canvas rerenders
const BackgroundWrapper = () => {
  const { grid_type } = useAppState();

  return <Background variant={grid_type} color="#94D2BD" bgColor="#F0F4F8" />;
};

const ValuesPanel = () => {
  const valEntries = useContent(
    useShallow((store) => Object.entries(store.values))
  );

  return (
    <Panel position="top-right">
      <h2>Values</h2>
      <ol>
        {valEntries.map(([id, value]) => (
          <li key={id}>
            {id}. {value}
          </li>
        ))}
      </ol>
    </Panel>
  );
};
export default Canvas;
