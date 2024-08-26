import { create } from "zustand";
import { Mode, Tab } from "../types/system";
import { BackgroundVariant } from "@xyflow/react";

interface AppState {
  active_tab: Tab;
  scale: number;
  show_scale_menu: boolean;
  mode: Mode;
  grid_type: BackgroundVariant;
}

interface AppActions {
  setActiveTab: (t: Tab) => void;
  openScaleMenu: () => void;
  hideScaleMenu: () => void;
  setMode: (m: Mode) => void;
  setGridType: (g: BackgroundVariant) => void;
}

const useAppState = create<AppState & AppActions>()((set) => ({
  active_tab: "Math",
  scale: 1,
  show_scale_menu: false,
  mode: "edit",
  grid_type: BackgroundVariant.Cross,
  setActiveTab: (tab) => set(() => ({ active_tab: tab })),
  openScaleMenu: () => set(() => ({ show_scale_menu: true })),
  hideScaleMenu: () => set(() => ({ show_scale_menu: false })),
  setMode: (mode) => set(() => ({ mode })),
  setGridType: (new_gt) =>
    set(() => {
      return { grid_type: new_gt };
    }),
}));

export default useAppState;
