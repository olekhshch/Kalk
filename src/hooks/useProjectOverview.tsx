// hook to operate Project Overview window

import { create } from "zustand";
import { AppNode } from "../types/nodes";
import { CalculatedValues } from "../types/app";

type POStore = {
  projectTitle: string;
  tabs: string[];
  activeTab: string;
  openTab: (t: string) => void;
  nodes: AppNode[];
  values: CalculatedValues;
  loadStateFromLS: () => void;
};
const useProjectOverview = create<POStore>((set, get) => ({
  projectTitle: "TITLE",
  tabs: ["General", "Nodes"],
  activeTab: "General",
  nodes: [],
  values: {},
  openTab: (tab) => {
    if (get().activeTab !== tab) {
      set({ activeTab: tab });
    }
  },
  loadStateFromLS: () => {
    const nodesJSON = localStorage.getItem("app-nodes");
    const valuesJSON = localStorage.getItem("app-values");

    if (nodesJSON) {
      const nodes = JSON.parse(nodesJSON) as AppNode[];
      set({ nodes });
    }

    if (valuesJSON) {
      const values = JSON.parse(valuesJSON) as CalculatedValues;
      set({ values });
    }
  },
}));

export default useProjectOverview;
