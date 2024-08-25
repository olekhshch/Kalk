import { Node } from "@xyflow/react";
import { create } from "zustand";

interface ContentState {
  nodes: Node[];
}

const useContent = create<ContentState>()((set) => ({
  nodes: [],
}));

export default useContent;
