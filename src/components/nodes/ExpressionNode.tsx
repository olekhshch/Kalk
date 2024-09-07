import React, { useEffect, useMemo, useRef, useState } from "react";
import NodeWrapper from "./NodeWrapper";
import { AppNode, ExpressionNode as Expression } from "../../types/nodes";
import { NodeProps } from "postcss";
import ResultOutput from "../ports/ResultOutput";
import useContent from "../../state/useContent";
import useInputChange from "../../hooks/useInputChange";
import { useViewport } from "@xyflow/react";
import { invoke } from "@tauri-apps/api/core";
import { RustCalculations } from "../../types/system";
import Output from "../ports/Output";
import { expressionInputValues } from "../../utils/expressionInputValues";

const ExpressionNode = ({ id, data: { value, showResult } }: Expression) => {
  const { activeNodeId, activateNode, editExpressionValue, setVariable } =
    useContent();
  const isActive = useMemo(() => activeNodeId === id, [activeNodeId]);

  const [currentValue, onChange] = useInputChange({
    initialValue: value,
    allowOnly: expressionInputValues,
  });

  // span refference to calculate width of the input
  const spanRef = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState(20);
  const { zoom } = useViewport();

  useEffect(() => {
    if (spanRef.current) {
      const { width } = spanRef.current.getBoundingClientRect();
      setInputWidth(Math.max(4, width / zoom + 10));
    }
  }, [currentValue]);

  useEffect(() => {
    if (!isActive && currentValue !== value) {
      editExpressionValue(id, currentValue);
    }
  }, [isActive]);

  useEffect(() => {
    // if value was changed in the store then it's passed to backend for evaluation
    invoke("evaluate_expression", { expr: value }).then((res) => {
      const calRes = res as RustCalculations;
      if (calRes.success) {
        setVariable(id, parseFloat(calRes.res));
        console.log("VARIABLE " + id + " was changed to " + calRes.res);
      } else {
        setVariable(id, null);
      }
    });
  }, [value]);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    activateNode(null);
  };

  const keyDownHandler = (e: React.KeyboardEvent) => {
    if (e.key === "=") {
      activateNode(null);
    }
  };

  return (
    <>
      <div>
        <ResultOutput nodeId={id} isShown={showResult} />
        <NodeWrapper id={id}>
          <div className="py-2 px-3 min-h-[1rem] flex flex-col">
            {isActive && (
              <form onSubmit={submitHandler} className="h-[1rem] flex">
                <input
                  value={currentValue}
                  onChange={onChange}
                  onKeyDown={keyDownHandler}
                  style={{ width: inputWidth + "px" }}
                  className="nodrag text-[16px] h-[1em] focus:outline-0 p-0 m-0 bg-transparent"
                  spellCheck={false}
                  autoFocus
                />
              </form>
            )}
            <span
              ref={spanRef}
              className="min-h-[1rem] h-[1rem] min-w-1 leading-3"
              style={{
                width: "max-content",
                visibility: isActive ? "hidden" : "unset",
                position: isActive ? "absolute" : "unset",
              }}
            >
              {currentValue}
            </span>
          </div>
        </NodeWrapper>
        <Output id="a" />
      </div>
    </>
  );
};

export default React.memo(ExpressionNode);
