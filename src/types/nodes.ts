import { Node } from "@xyflow/react";

export type NodeType = "text-single";

export type AppNode = Node<{}>;

export type TextSingleNode = AppNode &
  Node<{
    text: string;
  }> & {
    type: NodeType;
  };
