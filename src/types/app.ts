import { AppNode, Matrix, NodeType, Vector } from "./nodes";
import { Connection, Edge, NodeChange, XYPosition } from "@xyflow/react";

export type Tab = "All" | "Math" | "Matrices" | "Organize" | "File";

export type Action = {
  title: string;
  hideToolbarTitle?: boolean;
  icon: string | null;
  large?: boolean;
  command: {
    type: "create" | "action";
    data?: NodeType | ActionType;
  };
};

export type ActionType = "select-all" | "clear-all";

export type Mode =
  | "edit" // regular mode
  | "create" // when click on canvas specifies position of new node
  | "calculation"; // blocks changes while recalculating nodes values

export type ContentStore = NodesStore & TextStore & VariablesStore & MathStore;

export interface NodesStore {
  nodes: AppNode[];
  edges: Edge[];
  idCounter: number;
  edgeCounter: number;
  highlightedNodesId: string[]; // list of highlighted (not neccesaraly selected) nodes. Can be multiple
  activeNodeId: string | null; // Currently active (edited) node. Single node can be active at the same time
  onNodesChange: (changes: NodeChange[]) => void;
  addNode: (nodeType: NodeType, position: { x: number; y: number }) => void;
  doAction: (action: string) => void; // Performs creation action which adds new Node to the state
  setNodes: (nds: AppNode[]) => void;
  higlightById: (ids: string[], only?: boolean) => void; // only = yes => hightlights passed Nodes only, otherway adds passed Nodes to allready hightlighted nodes
  activateNode: (nodeId: string | null) => void;
  connectNodes: (connection: Connection) => void;
}

export interface TextStore {
  editTextValue: (nodeId: string, newValue: string) => void;
}

export interface MathStore {
  anglesFormat: AngleFormat;
  setAnglesFormat: (a: AngleFormat) => void;
  editExpressionValue: (nodeId: string, newValue: string) => void;
  showResultFor: (nodeId: string) => void;
  hideResultFor: (nodeId: string) => void;
  setNumOfEntriesFor: (nodeId: string, num: number) => void;
}

export interface VariablesStore {
  values: CalculatedValues;
  setValue: (varKey: string, newValue: number | null) => void;
}

export type CalculatedValues = {
  [id: string]: number | Matrix | Vector | null;
};

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

export type EdgeActionOutput = {
  newEdge: Edge | null;
  edges: Edge[];
  edgeCounter: number;
};

export type RustCalculations = {
  success: boolean;
  res: string;
  msg: string;
};

export enum AngleFormat {
  RAD = "RAD",
  DEG = "DEG",
}

export type ContextMenuTarget = "canvas" | "node";
export type ContextMenuSection =
  | "creator"
  | "node-dupl"
  | "node-delete"
  | "node-help";
