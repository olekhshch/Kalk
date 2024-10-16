import React, { useEffect, useRef, useState } from "react";
import NodeWrapper from "./wrappers/NodeWrapper";
import { ExpressionNode as Expression } from "../../types/nodes";
import ResultOutput from "../ports/ResultOutput";
import useContent from "../../state/useContent";
import useInputChange from "../../hooks/useInputChange";
import { NodeProps, useViewport } from "@xyflow/react";
import Output from "../ports/Output";
import { expressionInputValues } from "../../utils/expressionInputValues";
import { useShallow } from "zustand/react/shallow";
import Latex from "react-latex-next";
import generateHandleId from "../../utils/generateHandleId";
import makeValueId from "../../utils/makeValueId";
import getValueType from "../../utils/getValueType";

const ExpressionNode = ({
  id,
  data: { value, outputs, comment },
}: NodeProps<Expression>) => {
  const [isActive, activateNode, editExpressionValue] = useContent(
    useShallow((store) => [
      store.activeNodeId === id,
      store.activateNode,
      store.editExpressionValue,
    ])
  );

  const outputValue = useContent(
    useShallow((store) => store.values[makeValueId(id, "N")])
  );
  const outputValueType = getValueType(outputValue);

  const [currentValue, onChange] = useInputChange({
    initialValue: value,
    allowOnly: expressionInputValues,
  });

  // span refference to calculate width of the input
  const spanRef = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState(40);
  const { zoom } = useViewport();

  useEffect(() => {
    if (spanRef.current) {
      const { width } = spanRef.current.getBoundingClientRect();
      setInputWidth(Math.max(40, width / zoom + 10));
    }
  }, [currentValue]);

  useEffect(() => {
    if (!isActive && currentValue !== value) {
      editExpressionValue(id, currentValue);
    }
  }, [isActive]);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    activateNode(null);
  };

  const keyDownHandler = (e: React.KeyboardEvent) => {
    if (e.key === "=") {
      activateNode(null);
    }
  };

  const outputHandleId = generateHandleId(id, "N", outputs.N!.possibleValues);

  //#TODO: Fix padding change when active/non active

  return (
    <>
      <div>
        <ResultOutput nodeId={id} />
        <NodeWrapper
          id={id}
          outputValueTypes={["number"]}
          comment={comment ?? null}
          theme="math"
          isDefined={outputValueType !== null}
        >
          <div className="py-2 px-3 min-h-[1rem] flex flex-col latin-math">
            {isActive && (
              <form onSubmit={submitHandler} className="h-[1rem] flex">
                <input
                  value={currentValue}
                  onChange={onChange}
                  onKeyDown={keyDownHandler}
                  style={{ width: inputWidth + "px" }}
                  className="nodrag text-[18px] h-[1em] focus:outline-0 p-0 m-0 bg-transparent"
                  spellCheck={false}
                  autoFocus
                />
              </form>
            )}
            <span
              ref={spanRef}
              className="min-h-[1rem] h-[1rem] min-w-[40px] leading-3"
              style={{
                width: "max-content",
                visibility: isActive ? "hidden" : "unset",
                position: isActive ? "absolute" : "unset",
              }}
            >
              <Latex>
                {currentValue.trim() === ""
                  ? currentValue
                  : `$${currentValue}$`}
              </Latex>
            </span>
          </div>
        </NodeWrapper>
        <Output id={outputHandleId} cssPosition="50%" />
      </div>
    </>
  );
};

export default React.memo(ExpressionNode);
