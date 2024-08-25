import { create } from "zustand";
import { Tab } from "../types/system";

interface AppState {
  active_tab: Tab;
  scale: number;
  show_scale_menu: boolean;
}

interface AppActions {
  set_active_tab: (t: Tab) => void;
  openScaleMenu: () => void;
  hideScaleMenu: () => void;
}

const useAppState = create<AppState & AppActions>()((set) => ({
  active_tab: "Math",
  scale: 1,
  show_scale_menu: false,
  set_active_tab: (tab) => set(() => ({ active_tab: tab })),
  openScaleMenu: () => set(() => ({ show_scale_menu: true })),
  hideScaleMenu: () => set(() => ({ show_scale_menu: false })),
}));

export default useAppState;
