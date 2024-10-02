import React, { useCallback } from "react";
import useContent from "../../state/useContent";
import { NodeOutputs, ValueType } from "../../types/nodes";
import classNames from "classnames";
import useUI from "../../hooks/useUI";
import { useShallow } from "zustand/react/shallow";
import CommentField from "./parts/CommentField";
import CommentBtn from "./parts/CommentBtn";
import generateHandleId from "../../utils/generateHandleId";
import Output from "../ports/Output";
import { NodeTheme } from "../../types/app";

// General container for node's content
type props = {
  children: JSX.Element;
  title?: string;
  id: string;
  outputValueTypes?: ValueType[];
  theme?: NodeTheme;
  comment: string | null;
};
const NodeWrapper = ({
  children,
  title,
  id,
  outputValueTypes,
  comment,
  theme,
}: props) => {
  const { activeNodeId, activateNode, higlightById } = useContent();

  const commentFieldOpened = useUI(
    useShallow((store) => store.nodeCommentFieldFor.includes(id))
  );

  const [openContext] = useUI(useShallow((store) => [store.openContext]));

  // const isHightlighted = activeNodeId === id || highlightedNodesId.includes(id);

  const clickHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    higlightById([id], true);
    if (activeNodeId !== id) {
      activateNode(id);
    }
    console.log("NODE CLICK");

    if (e.button === 2) {
      e.stopPropagation();
      openContext("node", id, { x: 200, y: 120 });
    }
  };

  const doubleClickHandler = useCallback(() => {
    if (activeNodeId !== id) {
      activateNode(id);
    }
  }, [activeNodeId]);

  const onContextMenuHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    openContext(
      "node",
      id,
      { x: e.clientX, y: e.clientY },
      comment ? true : false
    );
  };

  // const outputsEntries = Object.entries(outputs);
  // const step = 100 / (outputsEntries.length + 1);

  // const outputsHandleObjs = outputsEntries.map(([label, output], idx) => {
  //   const handleId = generateHandleId(id, label, output!.possibleValues);
  //   const cssPosition = `${step * (1 + idx)}%`;
  //   return { handleId, key: label, cssPosition };
  // });

  const twClass = classNames(
    "min-h-[1rem] transition border-2 border-solid bg-white rounded-[4px] w-fit flex flex-col relative",
    {
      "hover:border-main": theme === "math" || !theme,
      "border-sec": !theme || theme === "math",
      "hover:border-matrix": theme === "mtx",
      "border-sec-mtx": theme === "mtx",
      "hover:border-red": theme === "red",
      "border-red-sec": theme === "red",
    }
  );

  return (
    <>
      <div
        className={twClass}
        onDoubleClick={doubleClickHandler}
        onClick={clickHandler}
        onContextMenu={onContextMenuHandler}
      >
        {comment && <CommentBtn nodeId={id} />}
        {commentFieldOpened && (
          <CommentField nodeId={id} text={comment ?? ""} />
        )}
        {title && (
          <article className="pl-[2px] bg-main text-white  h-5 rounded-t-[3px]">
            {title}
          </article>
        )}
        {/* {outputsHandleObjs.map(({ handleId, cssPosition, key }) => (
          <Output key={key} cssPosition={cssPosition} id={handleId} />
        ))} */}
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
            <span key={value}>
              <span className={twClass}>{value}</span>
              {idx < values.length - 1 && " | "}
            </span>
          );
        })}
      </p>
    </>
  );
};

export default NodeWrapper;

const mainColor = (theme?: NodeTheme) => {
  switch (theme) {
    case "math":
      return "main";
    case "mtx":
      return "vector";
    case "const":
      return "orange";
    default: {
      return "main";
    }
  }
};

const secondaryColor = (theme?: NodeTheme) => {
  switch (theme) {
    case "math":
      return "sec";
    case "mtx":
      return "mtx-sec";
    default:
      return "sec";
  }
};
