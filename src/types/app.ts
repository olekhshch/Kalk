import {
  AppNode,
  AppNodeBase,
  Matrix,
  NodeTag,
  NodeType,
  OutputValue,
  ValueType,
  Vector,
} from "./nodes";
import { Connection, Edge, NodeChange, XYPosition } from "@xyflow/react";

export type Tab = "All" | "Math" | "Matrices" | "Organize" | "Project";

export type Action = {
  title: string;
  hideToolbarTitle?: boolean;
  icon: string | null;
  iconLatex?: string;
  large?: boolean;
  values?: ValueType[];
  category?: "math" | "matrices";
  command: {
    type: "create" | "action";
    data?: NodeType | ActionType;
  };
};

export type ActionType =
  | "select-all"
  | "clear-all"
  | "show-res"
  | "project-overview"
  | "constant"; // opens constant creation window

export type Mode =
  | "edit" // regular mode
  | "create" // when click on canvas specifies position of new node
  | "calculation"; // blocks changes while recalculating nodes values

export type ContentStore = NodesStore & TextStore & VariablesStore & MathStore;

export interface NodesStore {
  nodes: AppNodeBase[];
  edges: Edge[];
  idCounter: number;
  edgeCounter: number;
  highlightedNodesId: string[]; // list of highlighted (not neccesaraly selected) nodes. Can be multiple
  activeNodeId: string | null; // Currently active (edited) node. Single node can be active at the same time
  onNodesChange: (changes: NodeChange[]) => void;
  addNode: (
    nodeTag: NodeTag,
    position: { x: number; y: number },
    data?: { nodeId?: string; constId?: string }
  ) => void;
  doAction: (action: ActionType) => void; // Performs creation action which adds new Node to the state
  setNodes: (nds: AppNode[]) => void;
  higlightById: (ids: string[], only?: boolean) => void; // only = yes => hightlights passed Nodes only, otherway adds passed Nodes to allready hightlighted nodes
  activateNode: (nodeId: string | null) => void;
  connectNodes: (connection: Connection) => void;
  setCommentFor: (nodeId: string, comm: string) => void;
  showResultFor: (nodeId: string) => void;
  hideResultFor: (nodeId: string) => void;
  toggleResultFor: (nodeId: string) => void;
  deleteNodes: (nodeIds: string[]) => void;
}

export interface TextStore {
  editTextValue: (nodeId: string, newValue: string) => void;
}

export interface MathStore {
  anglesFormat: AngleFormat;
  setAnglesFormat: (a: AngleFormat) => void;
  editExpressionValue: (nodeId: string, newValue: string) => void;
  setNumOfEntriesFor: (nodeId: string, num: number) => void;
}

export interface VariablesStore {
  values: CalculatedValues;
  constants: Constant[];
  constValues: {
    [k: string]: OutputValue;
  };
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
  idCounter?: number;
  newEdge?: Edge;
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
  | "node-help"
  | "node-comment";

// object for storing contant info
export type Constant = {
  id: string;
  name: string;
  viewLabel: string;
  valueType: ValueType;
  value: number | Matrix | Vector;
};

// what filters should table offer for a column
export enum FilterOptions {
  NONE,
  NUMBER,
  TEXT,
  LIST,
}
// items passing to a table
export type TableItem = {
  content: (string | number | null)[];
  onClick?: React.MouseEventHandler;
};
