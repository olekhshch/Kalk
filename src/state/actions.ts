import { Action, Tab } from "../types/system";

type Actions = {
  [key in keyof Tab as Tab]?: Action[];
};

const actions: Actions = {
  Math: [
    {
      title: "Number",
      icon: "number",
    },
    {
      title: "Sum/Diffrence",
      icon: "sum",
      command: "sum-dif",
    },
    {
      title: "Multiply",
      icon: "multiply",
    },
    {
      title: "Divide",
      icon: "divide",
    },
  ],
  Matrices: [
    {
      title: "Matrix",
      icon: "",
    },
  ],
  Organize: [
    { title: "Single-line text", icon: "text-single", command: "text-single" },
    { title: "Clear All", icon: "clear-all", command: "clear-all" },
    { title: "Select All", icon: "select", command: "select-all" },
  ],
  File: [
    {
      title: "File overview",
      icon: "",
    },
  ],
};

export default actions;
