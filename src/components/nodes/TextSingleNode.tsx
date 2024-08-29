import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import NodeWrapper from "./NodeWrapper";
import { applyNodeChanges, NodeProps } from "@xyflow/react";
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

  useEffect(() => {
    if (!isActive && currentText !== text) {
      editTextValue(id, currentText);
    }
  }, [isActive]);

  useEffect(() => {
    if (divRef.current) {
      const { width } = divRef.current.getBoundingClientRect();
      setInputWidth(width + 2);
    }
  }, [currentText]);

  const formSubmitHandler = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    activateNode(null);
  }, []);

  return (
    <NodeWrapper id={id}>
      <div className="py-2 px-3 font-textNode flex flex-col">
        {isActive && (
          <form
            className="basis-[1rem] shrink-0"
            onSubmit={formSubmitHandler}
            style={{ width: inputWidth }}
          >
            <input
              value={currentText}
              onChange={onChange}
              className="nodrag text-[16px] h-min-[1rem] focus:outline-0 p-0 m-0 bg-transparent"
              style={{ width: inputWidth + "px" }}
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
          className="basis-[1rem]"
          ref={divRef}
        >
          {currentText}
        </span>
      </div>
    </NodeWrapper>
  );
};

export default TextSingleNode;
