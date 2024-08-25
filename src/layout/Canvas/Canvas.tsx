import React, { useState } from "react";
import { Background, BackgroundVariant, ReactFlow } from "@xyflow/react";
import useContent from "../../state/useContent";
import useAppState from "../../state/useAppState";

const Canvas = () => {
  const { nodes } = useContent();
  const { grid_type } = useAppState();

  return (
    <div id="workarea" className="overflow-hidden">
      <ReactFlow nodes={nodes}>
        <Background variant={grid_type} color="#94D2BD" />
      </ReactFlow>
    </div>
  );
};

export default Canvas;
