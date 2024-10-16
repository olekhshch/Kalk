import { AppEdge } from "./edges";
import {
  ActionResult,
  AppNode,
  Matrix,
  NodeTag,
  TextSingleStyling,
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
    data?: NodeTag | ActionType;
  };
};

// specifies how action should appear on the Toolbar
export type ActionToolbar = {
  title: string;
  large?: boolean;
  iconType: "url" | "latex";
  icon: string;
  hideTitle?: boolean;
  hideIcon?: boolean;
  command: {
    type: "create" | "action";
    data?: NodeTag | ActionType;
  };
};

export type ActionType =
  | "select-all"
  | "clear-all"
  | "show-res"
  | "hide-res"
  | "project-overview"
  | "constant"; // opens constant creation window

export type Mode =
  | "edit" // regular mode
  | "create" // when click on canvas specifies position of new node
  | "calculation"; // blocks changes while recalculating nodes values

export type ContentStore = NodesStore & TextStore & VariablesStore & MathStore;

export interface NodesStore {
  nodes: AppNode[];
  edges: AppEdge[];
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
  styleTextNode: (
    nodeId: string,
    styling: TextSingleStyling,
    tag: NodeTag
  ) => void;
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
  errors: StoreErrors;
  // constValues: {
  //   [k: string]: OutputValue;
  // };
  setValue: (varKey: string, newValue: number | null) => void;
  updateConstants: () => void;
}

export type StoreErrors = { [k: string]: string[] };
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
  newEdge: AppEdge | null;
  edges: AppEdge[];
  // edgeCounter: number;
};

export type RustCalculations = ActionResult;

export type AngleFormat = "RAD" | "DEG";

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

export type NodeTheme = "math" | "mtx" | "const" | "red";
