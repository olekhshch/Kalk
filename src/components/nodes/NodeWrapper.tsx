import React, { useCallback, useEffect } from "react";
import useContent from "../../state/useContent";

type props = {
  children: JSX.Element;
  title?: string;
  id: string;
};
const NodeWrapper = ({ children, title, id }: props) => {
  const { activeNodeId, activateNode, higlightById, highlightedNodesId } =
    useContent();

  const isHightlighted = activeNodeId === id || highlightedNodesId.includes(id);

  const borderColorTW = "border-" + (isHightlighted ? "main" : "sec");

  const clickHandler = (e: React.MouseEvent) => {
    console.log("NODE wrapper Click");
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

  return (
    <div
      className={`border-2 border-solid border-sec ${borderColorTW} bg-white rounded-[4px] w-fit flex flex-col hover:border-main`}
      onDoubleClick={doubleClickHandler}
      onClick={clickHandler}
    >
      {title && (
        <article className="pl-[2px] bg-main text-white  h-5 rounded-t-[3px]">
          {title}
        </article>
      )}
      {children}
    </div>
  );
};

export default NodeWrapper;
