import { Handle, Node, NodeProps, Position, useViewport } from "@xyflow/react";
import { useState } from "react";
import Output from "./ports/Output";

// Node placeholder to show the location of the node that is about to be created
export type PreviewNode = Node<{}, "preview">;

const NodePreview = () => {
  return (
    <div className="w-[60px] h-[40px] bg-sec rounded-[6px] opacity-40">
      <Output cssPosition="50%" id="prev" />
    </div>
  );
};

export default NodePreview;
