// store to handle windows/menus etc.

import { create } from "zustand";

type UIStore = {
  scale: boolean;
  openScale: () => void;
  closeScale: () => void;
};

const useUI = create<UIStore>((set) => ({
  scale: false,
  openScale: () => set({ scale: true }),
  closeScale: () => set({ scale: false }),
}));

export default useUI;
