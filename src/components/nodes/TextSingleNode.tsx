import React, { useCallback, useEffect, useRef, useState } from "react";
import NodeWrapper from "./wrappers/NodeWrapper";
import { NodeProps, NodeToolbar, Position, useViewport } from "@xyflow/react";
import {
  TextSingleNode as TextSingleNodeType,
  TextSingleStyling,
} from "../../types/nodes";
import useContent from "../../state/useContent";
import useInputChange from "../../hooks/useInputChange";
import { useShallow } from "zustand/react/shallow";
import classNames from "classnames";
import NodeToolbarBtn from "./parts/NodeToolbarBtn";
import ToolbarSeparator from "./parts/ToolbarSeparator";
import ColorPallete from "./parts/ColorPallete";

// type Selector = {
//   isActive: boolean;
//   activateNode: (n: string | null) => void;
//   editTextValue: (newValue: string) => void;
// };

const fontSizes = ["8px", "12px", "16px", "24px", "36px", "48px"];

const TextSingleNode = ({
  data: { value, comment, styling, tag },
  id,
}: NodeProps<TextSingleNodeType>) => {
  const [isActive, activateNode, editTextValue] = useContent(
    useShallow((store) => [
      store.activeNodeId === id,
      store.activateNode,
      store.editTextValue,
    ])
  );

  const setNodeStyling = useContent(useShallow((store) => store.styleTextNode));

  const [currentText, onChange] = useInputChange({ initialValue: value });

  // div refference to calculate width of the input
  const divRef = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState(20);
  const zoom = useViewport().zoom;

  const [openSelection, setOpenSelection] = useState<
    null | "background" | "font-size" | "border" | "font-color"
  >(null);

  useEffect(() => {
    if (!isActive && currentText !== value) {
      editTextValue(id, currentText);
    }

    if (!isActive) {
      setOpenSelection(null);
    }
  }, [isActive]);

  useEffect(() => {
    if (divRef.current) {
      const { width } = divRef.current.getBoundingClientRect();
      setInputWidth(Math.max(4, width / zoom + 16));
    }
  }, [currentText, isActive, styling["font-size"]]);

  const formSubmitHandler = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    activateNode(null);
  }, []);

  const twClassStyling = classNames(
    {
      italic: styling.italic,
      "font-bold": styling.bold,
      underline: styling.underscore,
    },
    "font-textNode flex flex-col leading-3"
  );
  const twClassSpan = classNames(
    twClassStyling,
    "py-2 px-3 font-textNode flex flex-col leading-3"
  );

  const twClassInput = classNames(
    twClassStyling,
    "nodrag text-[16px] w-[1.25rem] h-[1.25rem] outline-none p-0 m-0 text-left leading-normal bg-transparent"
  );

  const onStyleClick = useCallback(
    (newStyling: TextSingleStyling) => {
      const newStyle: TextSingleStyling = { ...styling, ...newStyling };
      setNodeStyling(id, newStyle, tag);
    },
    [styling, setNodeStyling]
  );

  return (
    <>
      <NodeWrapper
        id={id}
        comment={comment ?? null}
        background={styling.background}
        border={styling.border}
      >
        <div className={twClassSpan}>
          <NodeToolbar
            className="p-1 px-2 flex gap-1 bg-white border-sec border-solid border-[1px] rounded-[4px] relative"
            isVisible={isActive}
            position={Position.Top}
          >
            <NodeToolbarBtn className=":hover:bg-white" isActive={false}>
              <div
                className="w-full h-full border-gray border-solid border-[1px]"
                style={{ background: styling.background }}
                onClick={() =>
                  setOpenSelection(
                    openSelection === "background" ? null : "background"
                  )
                }
              />
            </NodeToolbarBtn>
            {openSelection === "background" && (
              <div className="p-1 bg-white absolute top-[-36px] border-sec border-solid border-[1px]">
                <ColorPallete
                  swatches={["var(--white)", "var(--main)", "var(--sec)"]}
                  withTransparent
                  onClick={(color) => onStyleClick({ background: color })}
                />
              </div>
            )}
            <NodeToolbarBtn className=":hover:bg-white" isActive={false}>
              <div
                className="w-full h-full bg-white"
                style={{ border: styling.border }}
                onClick={() =>
                  setOpenSelection(openSelection === "border" ? null : "border")
                }
              />
            </NodeToolbarBtn>
            {openSelection === "border" && (
              <div className="p-1 bg-white absolute top-[-36px] border-sec border-solid border-[1px]">
                <ColorPallete
                  swatches={["var(--white)", "var(--main)", "var(--sec)"]}
                  withTransparent
                  onClick={(color) =>
                    onStyleClick({ border: "2px solid " + color })
                  }
                />
              </div>
            )}
            <ToolbarSeparator />
            <NodeToolbarBtn
              isActive={styling.bold ?? false}
              onClick={() => onStyleClick({ bold: !styling.bold })}
            >
              <span className="font-bold">B</span>
            </NodeToolbarBtn>
            <NodeToolbarBtn
              isActive={styling.italic ?? false}
              onClick={() => onStyleClick({ italic: !styling.italic })}
            >
              <span className="italic">I</span>
            </NodeToolbarBtn>
            <NodeToolbarBtn
              isActive={styling.underscore ?? false}
              onClick={() => onStyleClick({ underscore: !styling.underscore })}
            >
              <span className="underline">U</span>
            </NodeToolbarBtn>
            <ToolbarSeparator />
            <NodeToolbarBtn
              isActive={false}
              className="w-fit px-1"
              onClick={() =>
                setOpenSelection(
                  openSelection === "font-size" ? null : "font-size"
                )
              }
            >
              <span>Font Size</span>
            </NodeToolbarBtn>
            {openSelection === "font-size" && (
              <div className="px-1 bg-white absolute top-[-32px] border-sec border-solid border-[1px]">
                <ol className="flex text-sm">
                  {fontSizes.map((size) => {
                    const isActive = styling["font-size"] === size;

                    const twClass = classNames(
                      {
                        "font-bold": isActive,
                        "text-main": isActive,
                      },
                      "w-[40px] hover:bg-white hover:font-bold transition"
                    );

                    const chooseSize = () => {
                      if (!isActive) {
                        onStyleClick({ "font-size": size });
                      }
                    };
                    return (
                      <li key={size}>
                        <NodeToolbarBtn
                          isActive={false}
                          className={twClass}
                          onClick={chooseSize}
                        >
                          {size}
                        </NodeToolbarBtn>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
          </NodeToolbar>
          {isActive && (
            <form
              className="h-[1.25em]"
              onSubmit={formSubmitHandler}
              style={{ width: inputWidth, fontSize: styling["font-size"] }}
            >
              <input
                value={currentText}
                onChange={onChange}
                className={twClassInput}
                style={{
                  width: inputWidth + "px",
                  fontSize: styling["font-size"],
                  height: "1.25em",
                  // fontStyle: styling.italic ? "italic" : "",
                }}
                spellCheck={false}
                autoFocus
              />
            </form>
          )}
          <span
            style={{
              width: "max-content",
              visibility: isActive ? "hidden" : "unset",
              position: isActive ? "absolute" : "unset",
              fontSize: styling["font-size"],
            }}
            className="p-0 pr-1 m-0 h-[1.25em] align-top leading-normal"
            ref={divRef}
          >
            {currentText}
          </span>
        </div>
      </NodeWrapper>
    </>
  );
};

export default TextSingleNode;
