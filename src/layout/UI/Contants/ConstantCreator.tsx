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

const nodeTypes: NodeTypes = {
  model: ModelNode,
};

const ConstantCreator = () => {
  const previewNode: ModelType = {
    id: "000",
    type: "model",
    position: { x: 40, y: 40 },
    data: {
      outputsNum: 1,
      outputValues: ["number"],
    },
  };
  return (
    <div className="p-2 flex">
      <form className="flex flex-col">
        <label>
          Name:
          <input />
        </label>
        <label>
          Node label:
          <input />
        </label>
        <label>
          Type:
          <select>
            <option>Number</option>
            <option>Vector</option>
            <option>Matrix</option>
          </select>
        </label>
        <label>
          Value:
          <input />
        </label>
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
