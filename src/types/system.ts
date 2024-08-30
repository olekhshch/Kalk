import React from "react";
import { AppNode } from "./nodes";
import { XYPosition } from "@xyflow/react";

export type Tab = "All" | "Math" | "Matrices" | "Organize" | "File";

export type Action = {
  title: string;
  icon: string;
  command?: string;
};

export type ContentStore = NodesStore & TextStore & VariablesStore & MathStore;

export interface NodesStore {
  nodes: AppNode[];
  idCounter: number;
  highlightedNodesId: string[]; // list of highlighted (not neccesaraly selected) nodes. Can be multiple
  activeNodeId: string | null; // Currently active (edited) node. Single node can be active at the same time
  doAction: (action: string) => void; // Performs creation action which adds new Node to the state
  setNodes: (nds: AppNode[]) => void;
  higlightById: (ids: string[], only?: boolean) => void; // only = yes => hightlights passed Nodes only, otherway adds passed Nodes to allready hightlighted nodes
  activateNode: (nodeId: string | null) => void;
}

export interface TextStore {
  editTextValue: (nodeId: string, newValue: string) => void;
}

export interface MathStore {
  editExpressionValue: (nodeId: string, newValue: string) => void;
  showResultFor: (nodeId: string) => void;
  hideResultFor: (nodeId: string) => void;
}

export interface VariablesStore {
  vars: { [key: string]: number | null };
}

type NodeActionParams = {
  nodes: AppNode[];
  idCounter: number;
  position?: XYPosition;
  nodeIds?: string[];
};

export type NodeAction = (params: NodeActionParams) => {
  nodes: AppNode[];
  idCounter?: number;
};

export type CreateNodeAction = (params: NodeActionParams) => NodeActionOutput;

export type NodeActionOutput = {
  newNode: AppNode | null;
  nodes: AppNode[];
  idCounter: number;
};
