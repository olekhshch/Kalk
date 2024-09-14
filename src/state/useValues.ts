import { create } from "zustand";

type ValuesStore = {
  values: {
    [id: string]: number | null;
  };
  setValue: (id: string, newValue: number | null) => void;
};

const useValues = create<ValuesStore>((set, get) => ({
  values: {},
  setValue: (id, newValue) => {
    set({ values: { ...get().values, [id]: newValue } });
  },
}));

export default useValues;
