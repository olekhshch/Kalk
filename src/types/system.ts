import React from "react";
import { AppNode } from "./nodes";

export type Tab = "All" | "Math" | "Matrices" | "Organize" | "File";

export type Action = {
  title: string;
  icon: string;
  command?: string;
};

export type Mode = "edit" | "panning";

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

export type ContentStore = NodesStore & TextStore;

export type CreateNodeAction = (
  state: ContentStore,
  position: { x: number; y: number }
) => {
  newNode: AppNode;
  nodes: AppNode[];
  activeNodeId: string | null;
  idCounter: number;
};
