import {
  Background,
  BackgroundVariant,
  Controls,
  NodeTypes,
  ReactFlow,
} from "@xyflow/react";
import React from "react";
import "@xyflow/react/dist/style.css";
import { AppNode } from "../../../types/nodes";
import ModelNode, {
  ModelNode as ModelType,
} from "../../../components/nodes/app/ModelNode";
import useInputChange from "../../../hooks/useInputChange";

const nodeTypes: NodeTypes = {
  model: ModelNode,
};

const ConstantCreator = () => {
  const [name, onNameChange] = useInputChange({
    initialValue: "",
    allowOnly: /[a-zA-Z0-9\_\.]*/,
  });

  const [label, onLabelChange] = useInputChange({
    initialValue: "",
  });

  const previewNode: ModelType = {
    id: "000",
    type: "model",
    position: { x: 40, y: 40 },
    data: {
      outputsNum: 1,
      outputValues: ["number"],
    },
  };

  const twLabelClass = "bg-gray grow min-w-[120px] text-right float-left";
  return (
    <div className="p-2 flex">
      <form className="pr-2 flex flex-col gap-2 items-center w-[260px]">
        <div className="w-full">
          <label className={twLabelClass}>Name:</label>
          <span className="block overflow-hidden px-2">
            <input
              value={name}
              onChange={onNameChange}
              className=" border-b-2 border-gray outline-none"
            />
          </span>
        </div>
        <div className="w-full">
          <label className={twLabelClass}>Node label:</label>
          <span className="block overflow-hidden px-2">
            <input
              value={label}
              onChange={onLabelChange}
              className=" border-b-2 border-gray outline-none"
            />
          </span>
        </div>
        <div className="w-full flex">
          <label className={twLabelClass}>Type:</label>
          <select className="grow">
            <option value="number">Number</option>
            <option value="vector">Vector</option>
          </select>
        </div>
      </form>
      <div className="grow">
        <ReactFlow nodes={[previewNode]} nodeTypes={nodeTypes}>
          <Background variant={BackgroundVariant.Cross} color="green" />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default ConstantCreator;
