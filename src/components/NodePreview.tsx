import { Node, NodeProps } from "@xyflow/react";
import Output from "./ports/Output";

// Node placeholder to show the location of the node that is about to be created
export type PreviewNode = Node<{ visible: boolean }, "preview">;

const NodePreview = ({ data: { visible } }: NodeProps<PreviewNode>) => {
  if (!visible) return null;

  return (
    <div className="w-[60px] h-[40px] bg-sec rounded-[6px] opacity-40">
      <Output cssPosition="50%" id="prev" />
    </div>
  );
};

export default NodePreview;
