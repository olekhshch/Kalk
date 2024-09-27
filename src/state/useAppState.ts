import { create } from "zustand";
import { ActionType, Mode, Tab } from "../types/app";
import { BackgroundVariant } from "@xyflow/react";
import { NodeType } from "../types/nodes";

export type modeData = {
  type?: NodeType | ActionType;
  id?: string;
};
interface AppState {
  active_tab: Tab;
  scale: number;
  mode: { current: Mode; data?: modeData };
  grid_type: BackgroundVariant;
  minimap: boolean;
}

interface AppActions {
  setActiveTab: (t: Tab) => void;
  setMode: (mode: Mode, data?: modeData) => void;
  setGridType: (g: BackgroundVariant) => void;
  showHideMinimap: (m: boolean) => void;
}

const useAppState = create<AppState & AppActions>()((set) => ({
  active_tab: "Math",
  scale: 1,
  mode: { current: "edit" },
  minimap: true,
  grid_type: BackgroundVariant.Cross,
  setActiveTab: (tab) => set(() => ({ active_tab: tab })),
  setMode: (mode, data) => {
    if (mode === "edit" || !data) {
      return set({ mode: { current: mode, data: undefined } });
    }
    set({ mode: { current: mode, data } });
  },
  setGridType: (new_gt) =>
    set(() => {
      return { grid_type: new_gt };
    }),
  showHideMinimap: (m) => set({ minimap: m }),
}));

export default useAppState;
