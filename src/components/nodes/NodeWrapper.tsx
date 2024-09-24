import React, { useCallback } from "react";
import useContent from "../../state/useContent";
import { ValueType } from "../../types/nodes";
import classNames from "classnames";

// General container for node's content
type props = {
  children: JSX.Element;
  title?: string;
  id: string;
  outputValueTypes?: ValueType[];
};
const NodeWrapper = ({ children, title, id, outputValueTypes }: props) => {
  const { activeNodeId, activateNode, higlightById } = useContent();

  // const isHightlighted = activeNodeId === id || highlightedNodesId.includes(id);

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
        {/* <span className="absolute">{id}</span> */}
      </div>
      {outputValueTypes && <OutputValues values={outputValueTypes} />}
    </>
  );
};

type pr = { values: ValueType[] };
const OutputValues = ({ values }: pr) => {
  return (
    <>
      <p className="absolute max-h-[1rem] text-xs hover:min-w-max text-ellipsis overflow-hidden">
        {values.map((value, idx) => {
          const twClass = classNames(`text-` + value, "text-mono", "font-bold");
          return (
            <>
              <span className={twClass}>{value}</span>
              {idx < values.length - 1 && " | "}
            </>
          );
        })}
      </p>
    </>
  );
};

export default NodeWrapper;
