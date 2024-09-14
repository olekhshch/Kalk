import React, { useCallback, useEffect } from "react";
import useContent from "../../state/useContent";
import FlowPort from "../ports/FlowPort";
import { Position } from "@xyflow/react";

type props = {
  children: JSX.Element;
  title?: string;
  id: string;
};
const NodeWrapper = ({ children, title, id }: props) => {
  const { activeNodeId, activateNode, higlightById, highlightedNodesId } =
    useContent();

  const isHightlighted = activeNodeId === id || highlightedNodesId.includes(id);

  const clickHandler = (e: React.MouseEvent) => {
    higlightById([id], true);
    if (activeNodeId !== id) {
      activateNode(id);
    }
    e.stopPropagation();
  };

  const doubleClickHandler = useCallback(() => {
    if (activeNodeId !== id) {
      activateNode(id);
    }
  }, [activeNodeId]);

  // #TODO: Flowchart handles

  return (
    <>
      <div
        className={`min-h-[1rem] border-2 border-solid bg-white rounded-[4px] w-fit flex flex-col border-sec hover:border-main hover-brd-main`}
        // style={{
        //   borderColor: activeNodeId === id ? "var(--main)" : "var(--sec)",
        // }}
        onDoubleClick={doubleClickHandler}
        onClick={clickHandler}
      >
        {title && (
          <article className="pl-[2px] bg-main text-white  h-5 rounded-t-[3px]">
            {title}
          </article>
        )}
        {children}
        <span className="absolute">{id}</span>
      </div>
    </>
  );
};

export default NodeWrapper;
