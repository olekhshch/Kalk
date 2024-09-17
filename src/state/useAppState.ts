import { create } from "zustand";
import { ActionType, Mode, Tab } from "../types/system";
import { BackgroundVariant } from "@xyflow/react";
import { NodeType } from "../types/nodes";

interface AppState {
  active_tab: Tab;
  scale: number;
  show_scale_menu: boolean;
  mode: { current: Mode; data?: NodeType | ActionType };
  grid_type: BackgroundVariant;
  minimap: boolean;
}

interface AppActions {
  setActiveTab: (t: Tab) => void;
  openScaleMenu: () => void;
  hideScaleMenu: () => void;
  setMode: (mode: Mode, data?: NodeType | ActionType) => void;
  setGridType: (g: BackgroundVariant) => void;
  showHideMinimap: (m: boolean) => void;
}

const useAppState = create<AppState & AppActions>()((set) => ({
  active_tab: "Math",
  scale: 1,
  show_scale_menu: false,
  mode: { current: "edit" },
  minimap: true,
  grid_type: BackgroundVariant.Cross,
  setActiveTab: (tab) => set(() => ({ active_tab: tab })),
  openScaleMenu: () => set(() => ({ show_scale_menu: true })),
  hideScaleMenu: () => set(() => ({ show_scale_menu: false })),
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
