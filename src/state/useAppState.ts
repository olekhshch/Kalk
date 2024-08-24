import { create } from "zustand";
import { Tab } from "../types/system";

interface AppState {
  active_tab: Tab;
  scale: number;
}

interface AppActions {
  set_active_tab: (t: Tab) => void;
}

const useAppState = create<AppState & AppActions>()((set) => ({
  active_tab: "Math",
  scale: 1,
  set_active_tab: (tab) => set(() => ({ active_tab: tab })),
}));

export default useAppState;
