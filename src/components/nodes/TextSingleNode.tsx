import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import NodeWrapper from "./NodeWrapper";
import {
  applyNodeChanges,
  NodeProps,
  useStore,
  useStoreApi,
  useViewport,
} from "@xyflow/react";
import { AppNode, TextSingleNode as TextSingle } from "../../types/nodes";
import useContent from "../../state/useContent";
import useInputChange from "../../hooks/useInputChange";

const TextSingleNode = ({
  data: { text },
  id,
}: NodeProps<TextSingle & AppNode>) => {
  const { activeNodeId, activateNode, editTextValue } = useContent();
  const [currentText, onChange] = useInputChange({ initialValue: text });
  const isActive = useMemo(() => activeNodeId === id, [activeNodeId]);

  // div refference to calculate width of the input
  const divRef = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState(20);
  const { zoom } = useViewport();

  useEffect(() => {
    if (!isActive && currentText !== text) {
      editTextValue(id, currentText);
    }
  }, [isActive]);

  useEffect(() => {
    if (divRef.current) {
      const { width } = divRef.current.getBoundingClientRect();
      console.log(zoom);
      setInputWidth(Math.max(4, width / zoom + 10));
    }
  }, [currentText]);

  const formSubmitHandler = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    activateNode(null);
  }, []);

  return (
    <NodeWrapper id={id}>
      <div className="py-2 px-3 font-textNode flex flex-col leading-3">
        {isActive && (
          <form
            className="h-[1rem]"
            onSubmit={formSubmitHandler}
            style={{ width: inputWidth }}
          >
            <input
              value={currentText}
              onChange={onChange}
              className="nodrag text-[16px] h-[1em] focus:outline-0 p-0 m-0 bg-transparent"
              style={{ width: inputWidth + "px" }}
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
          }}
          className=" min-h-[1rem] h-[1rem] leading-3"
          ref={divRef}
        >
          {currentText}
        </span>
      </div>
    </NodeWrapper>
  );
};

export default TextSingleNode;
