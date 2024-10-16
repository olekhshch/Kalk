import { NodeProps, NodeResizer } from "@xyflow/react";
import {
  MarkdownNode as MarkdownNodeType,
  MarkdownStyling,
} from "../../types/nodes";
import ResizeFrame from "./wrappers/ResizeFrame";
import useContent from "../../state/useContent";
import { useShallow } from "zustand/react/shallow";
import useInputChange from "../../hooks/useInputChange";
import Markdown from "react-markdown";
import remarkMath from "remark-math";
import { useEffect } from "react";

const MarkdownNode = ({
  id,
  data: { value, styling },
  width,
  height,
}: NodeProps<MarkdownNodeType>) => {
  const isActive = useContent(useShallow((store) => store.activeNodeId === id));
  const activateNode = useContent(useShallow((store) => store.activateNode));
  const [content, onContentChange] = useInputChange({ initialValue: value });

  useEffect(() => {
    // on init activates itself and autofocus on textarea
    activateNode(id);
  }, []);
  return (
    <div className="flex gap-2" style={{ width: "120px" }}>
      <ResizeFrame nodeId={id} className="flex">
        {isActive ? (
          <form className="w-full h-full">
            <textarea
              className="nodrag w-full h-full resize-none overflow-hidden"
              //   style={{ height: "" }}
              value={content}
              onChange={onContentChange}
              autoFocus
            />
          </form>
        ) : (
          <MarkdownView content={content} styling={styling} />
        )}
      </ResizeFrame>
      {isActive && (
        <div
          className="absolute"
          style={{
            left: (width ?? 0) + 10 + "px",
            width: width + "px",
            height: height + "px",
          }}
        >
          <MarkdownView
            w={width}
            h={height}
            content={content}
            styling={styling}
          />
        </div>
      )}
    </div>
  );
};

export default MarkdownNode;

type p = {
  w?: number;
  h?: number;
  content: string;
  styling: MarkdownStyling;
};

const MarkdownView = ({ w, h, content, styling }: p) => {
  return (
    <div
      style={{
        ...styling,
      }}
      className="w-full h-full"
    >
      <Markdown remarkPlugins={[remarkMath]}>{content}</Markdown>
    </div>
  );
};
