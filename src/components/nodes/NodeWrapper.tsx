import React, { useCallback } from "react";
import useContent from "../../state/useContent";

type props = {
  children: JSX.Element;
  title?: string;
  id: string;
};
const NodeWrapper = ({ children, title, id }: props) => {
  const { activeNodeId, activateNode } = useContent();

  const borderColorTW = "border-" + (activeNodeId === id ? "main" : "sec");

  const clickHandler = () => activateNode(id);

  const doubleClickHandler = useCallback(() => {
    // if (activeNodeId !== id) {
    //   activateNode(id);
    // }
  }, [activeNodeId]);

  return (
    <div
      className={`border-2 border-solid ${borderColorTW} bg-white rounded-[4px] w-fit flex flex-col`}
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
