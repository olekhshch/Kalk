// hook to operate on Constants window

import { create } from "zustand";
import { Constant } from "../types/app";

type ConstantsStore = {
  constants: Constant[];
  loadFromLS: () => void;
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
}));

export default useConstants;
