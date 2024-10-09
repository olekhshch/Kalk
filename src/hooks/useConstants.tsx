// hook to operate on Constants window

import { create } from "zustand";
import { Constant } from "../types/app";
import { invoke } from "@tauri-apps/api/core";

type ConstantsStore = {
  constants: Constant[];
  loadFromLS: () => void;
  createConstant: (newConst: Constant) => void;
};

const useConstants = create<ConstantsStore>((set, get) => ({
  constants: [],
  loadFromLS: () => {
    const constantsJSON = localStorage.getItem("app-const");
    if (constantsJSON) {
      const constants = JSON.parse(constantsJSON) as Constant[];
      set({ constants });
    }
  },
  createConstant: (newConstant) => {
    localStorage.setItem("new-constant", JSON.stringify(newConstant));
    localStorage.setItem(
      "app-const",
      JSON.stringify([...get().constants, newConstant])
    );

    invoke("emit_const_created_event");
    invoke("close_window", { windowLabel: "new-constant" });
  },
}));

export default useConstants;
