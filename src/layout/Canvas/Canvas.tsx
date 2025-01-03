import React, { useEffect, useRef, useState } from "react";
import { Background, MiniMap, ReactFlow, useReactFlow } from "@xyflow/react";
import useContent from "../../state/useContent";
import useAppState from "../../state/useAppState";
import nodeTypes from "../../state/config/nodeTypes";
import { useShallow } from "zustand/react/shallow";
import { NodeTag } from "../../types/nodes";
// import { PreviewNode } from "../../components/NodePreview";
import useUI from "../../hooks/useUI";
import edgeTypes from "../../state/config/edgeTypes";

const Canvas = () => {
  const { nodes, edges, activateNode, onNodesChange, connectNodes, addNode } =
    useContent();

  const { mode, minimap, setMode } = useAppState(
    useShallow((store) => ({
      mode: store.mode,
      setMode: store.setMode,
      minimap: store.minimap,
    }))
  );

  const [closeScaleMenu, closeContext, openContext] = useUI(
    useShallow((store) => [
      store.closeScale,
      store.closeContext,
      store.openContext,
    ])
  );

  const closeCommentsForAllNodes = useUI(
    useShallow((store) => store.closeAllNodeComments)
  );

  // const [shift, setShift] = useState(false);

  const vpRef = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const [prevPosition, setPrevPosition] = useState({ x: 0, y: 0 });
  const [_, setShowPreview] = useState(true);

  useEffect(() => {
    if (vpRef.current) {
      vpRef.current.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        const { clientX, clientY } = e;
        const { width } = document.body.getBoundingClientRect();

        const x = clientX > width - 220 ? clientX - 220 : clientX;
        openContext("canvas", null, { x, y: clientY });
      });
    }
  }, [vpRef.current]);

  // const nodePreview = useMemo(() => {
  //   const node: PreviewNode = {
  //     id: "preview",
  //     type: "preview",

  //     data: { visible: showPreview },
  //     position: prevPosition,
  //   };

  //   return node;
  // }, [prevPosition, showPreview]);

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
    e.preventDefault();
    // e.stopPropagation();
    console.log("canvas bg click");
    activateNode(null);
    closeScaleMenu();
    closeContext();
    closeCommentsForAllNodes();

    if (mode.current === "create" && mode.data) {
      addNode(mode.data.type as NodeTag, prevPosition, {
        constId: mode.data.id,
      });
    }
    setMode("edit");
  };

  const mouseMoveHandler = (e: React.MouseEvent) => {
    if (mode.current !== "create") return;

    const { clientX, clientY } = e;
    const position = screenToFlowPosition({ x: clientX, y: clientY });
    setPrevPosition(position);
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
        onMouseMove={mouseMoveHandler}
        onMouseEnter={mouseEnterHandler}
        onMouseLeave={mouseLeaveHandler}
        className="overflow-hidden"
      >
        {/* <ValuesPanel /> */}
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

export default Canvas;
